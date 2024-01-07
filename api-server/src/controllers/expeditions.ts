import {
  ACTIVE_ENCOUNTER,
  getRandomND6,
  type ExpeditionUpdate,
  type EncounterOutcome
} from '@solarpunk-drifters/common'
import * as expeditionMoves from '../gameLogicLayer/expeditionMoves'
import {
  type DrifterAndConsequenceCardGameEvents,
  getDrifterAndConsequenceCards,
  postProcessGameEvents
} from '../gameLogicLayer/postProcessGameEvents'
import type { GameEventsOrError } from '../gameLogicLayer/gameEvents'
import runPersistence from '../gamePersistenceLayer'
import persistGameEventEffects from '../gamePersistenceLayer/utils/persistGameEventEffects'
import type {
  GameEventPersistor,
  GameStore
} from '../gamePersistenceLayer/types'
import { generateClientEvents } from '../gameTransportLayer'
import { consequenceCardDeck } from '../queries/consequenceCards'
import { drifterCardDeck, getDrifterCard } from '../queries/drifterCards'
import { encounterCardDeck, getEncounterCard } from '../queries/encounterCards'
import { getUserGameStore } from '../queries/gameState'

const outcomeToCardGameEventsFn = async (
  outcome: EncounterOutcome
): Promise<DrifterAndConsequenceCardGameEvents> => {
  return await getDrifterAndConsequenceCards({
    consequenceCardDeck,
    drifterCardDeck,
    outcome
  })
}

/**
 * This is the "imperative shell" of "functional core, imperative shell."
 */
// TODO: Needs test coverage, maybe TDD the error handling when implemented
export async function processOutcome(
  store: GameStore,
  gameEventsOrError: GameEventsOrError
): Promise<ExpeditionUpdate> {
  if (Array.isArray(gameEventsOrError)) {
    const gameEvents = await postProcessGameEvents({
      preGameEvents: gameEventsOrError,
      outcomeToCardGameEventsFn
    })

    // Run persistence layer effects
    const persistor: GameEventPersistor = async (gameEvent) =>
      await persistGameEventEffects(store, gameEvent)
    const persistenceResult = await runPersistence(
      gameEvents,
      persistor,
      store.getGameState
    )

    if (Array.isArray(persistenceResult)) {
      const gameStatePatch = persistenceResult
      const clientEvents = generateClientEvents(gameEvents)

      // TODO: toggle this logging with a flag, and use a better log than console.log
      console.log(`GAME EVENTS:\n${JSON.stringify(gameEvents, null, 4)}`)
      console.log(
        `GAME STATE PATCH:\n${JSON.stringify(gameStatePatch, null, 4)}`
      )

      return { update: gameStatePatch, clientEvents }
    } else {
      throw new Error(
        `NOT IMPLEMENTED -- runPersistence returned PersistenceError: ${JSON.stringify(
          persistenceResult
        )}`
      )
    }
  } else {
    throw new Error(
      `NOT IMPLEMENTED -- processOutcome got GameErrorEvent:  ${JSON.stringify(
        gameEventsOrError
      )}`
    )
  }
}

export async function beginExpeditionController(
  uid: string
): Promise<ExpeditionUpdate> {
  const store = await getUserGameStore(uid)
  const gameState = await store.getGameState()
  const { gameMode } = gameState
  const gameEventsOrError = await expeditionMoves.beginExpedition(
    gameMode,
    encounterCardDeck
  )

  return await processOutcome(store, gameEventsOrError)
}

export async function nextEncounterController(
  uid: string
): Promise<ExpeditionUpdate> {
  const store = await getUserGameStore(uid)
  const gameState = await store.getGameState()
  const { gameMode } = gameState
  const gameEventsOrError = await expeditionMoves.nextEncounter(
    gameMode,
    encounterCardDeck
  )

  return await processOutcome(store, gameEventsOrError)
}

export async function turnBackController(
  uid: string
): Promise<ExpeditionUpdate> {
  const store = await getUserGameStore(uid)
  const gameState = await store.getGameState()
  const { gameMode } = gameState
  const gameEventsOrError = await expeditionMoves.turnBack(gameMode)

  return await processOutcome(store, gameEventsOrError)
}

export async function encounterCardChoiceController(args: {
  uid: string
  choiceIndex: number
}): Promise<ExpeditionUpdate> {
  const { uid, choiceIndex } = args
  const store = await getUserGameStore(uid)
  const gameState = await store.getGameState()
  const { gameMode } = gameState
  if (gameMode === ACTIVE_ENCOUNTER) {
    const { activeEncounterCardId } = gameState

    const encounterCard = await getEncounterCard(activeEncounterCardId)

    if (encounterCard === null) {
      // TODO use custom error type. This is an error in the gameState,
      // it's invalid for the gameState to have an activeEncounterCardId
      // that doesn't reference a known Encounter Card
      throw new Error(
        `activeEncounterCardId ${activeEncounterCardId} has no Encounter Card`
      )
    }

    const gameEventsOrError = await expeditionMoves.encounterCardChoice({
      gameMode,
      characterStats: gameState.characterStats,
      choice: encounterCard.choices[choiceIndex],
      dice: getRandomND6,
      inventory: gameState.inventory
    })

    return await processOutcome(store, gameEventsOrError)
  } else {
    throw new Error(
      `NOT IMPLEMENTED: cannot get activeEncounterCardId when gameMode is ${gameState.gameMode}`
    )
  }
}

export async function playDrifterCardController(args: {
  uid: string
  drifterCardId: string
}): Promise<ExpeditionUpdate | null> {
  const { uid, drifterCardId } = args
  const store = await getUserGameStore(uid)
  const gameState = await store.getGameState()
  const { gameMode } = gameState
  const drifterCard = await getDrifterCard(drifterCardId)

  if (drifterCard === null) {
    throw new Error('NOT IMPLEMENTED: user specified invalid Drifter Card id')
  }

  const gameEventsOrError = await expeditionMoves.playDrifterCard({
    gameMode,
    drifterCard
  })

  return await processOutcome(store, gameEventsOrError)
}
