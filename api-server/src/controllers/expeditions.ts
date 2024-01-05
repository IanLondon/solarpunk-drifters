import { getUserGameStore } from '../queries/gameState'
import * as expeditionMoves from '../gameLogicLayer/expeditionMoves'
import runPersistence from '../gamePersistenceLayer'
import type { GameMoveOutcome } from '../gameLogicLayer/gameEvents'
import type {
  GameEventPersistor,
  GameStore
} from '../gamePersistenceLayer/types'
import { encounterCardDeck, getEncounterCard } from '../queries/encounterCards'
import { getDrifterCard } from '../queries/drifterCards'
import {
  ACTIVE_ENCOUNTER,
  getRandomND6,
  type ExpeditionUpdate
} from '@solarpunk-drifters/common'
import persistGameEventEffects from '../gamePersistenceLayer/utils/persistGameEventEffects'
import { generateClientEvents } from '../gameTransportLayer'

/**
 * This is the "imperative shell" of "functional core, imperative shell."
 */
// TODO: Needs test coverage, maybe TDD the error handling when implemented
export async function processOutcome(
  store: GameStore,
  gameOutcome: GameMoveOutcome
): Promise<ExpeditionUpdate> {
  if (Array.isArray(gameOutcome)) {
    const gameEvents = gameOutcome

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
        gameOutcome
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
  const gameOutcome = await expeditionMoves.beginExpedition(
    gameMode,
    encounterCardDeck
  )

  return await processOutcome(store, gameOutcome)
}

export async function nextEncounterController(
  uid: string
): Promise<ExpeditionUpdate> {
  const store = await getUserGameStore(uid)
  const gameState = await store.getGameState()
  const { gameMode } = gameState
  const gameOutcome = await expeditionMoves.nextEncounter(
    gameMode,
    encounterCardDeck
  )

  return await processOutcome(store, gameOutcome)
}

export async function turnBackController(
  uid: string
): Promise<ExpeditionUpdate> {
  const store = await getUserGameStore(uid)
  const gameState = await store.getGameState()
  const { gameMode } = gameState
  const gameOutcome = await expeditionMoves.turnBack(gameMode)

  return await processOutcome(store, gameOutcome)
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

    const gameOutcome = await expeditionMoves.encounterCardChoice({
      gameMode,
      characterStats: gameState.characterStats,
      choice: encounterCard.choices[choiceIndex],
      dice: getRandomND6,
      inventory: gameState.inventory
    })

    return await processOutcome(store, gameOutcome)
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

  const gameOutcome = await expeditionMoves.playDrifterCard({
    gameMode,
    drifterCard
  })

  return await processOutcome(store, gameOutcome)
}
