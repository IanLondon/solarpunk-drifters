import { getUserGameStore } from '../queries/gameState'
import * as expeditionMoves from '../gameLogicLayer/expeditionMoves'
import runPersistence from '../gamePersistenceLayer'
import type { GameMoveOutcome } from '../gameLogicLayer/events'
import type { GameStore, PersistenceError } from '../gamePersistenceLayer/types'
import { ACTIVE_ENCOUNTER } from './gameState'
import { encounterCardDeck, getEncounterCard } from '../queries/encounterCards'
import { getDrifterCard } from '../queries/drifterCards'
import {
  type ClientEvent,
  type PatchRequest,
  type ExpeditionUpdate,
  getRandomND6
} from '@solarpunk-drifters/common'

/**
 * This is the "imperative shell" of "functional core, imperative shell."
 */
// TODO: break up into smaller parts:
// - Separate GameMoveOutcome = GameEvent[] versus = GameErrorEvent,
//     processOutcome shouldn't do both.
// - Transform the GameEvents to ClientEvents via a new gameTransportLayer fn
export async function processOutcome(
  store: GameStore,
  gameOutcome: GameMoveOutcome
): Promise<ExpeditionUpdate> {
  if (Array.isArray(gameOutcome)) {
    const gameEvents = gameOutcome

    // Run persistence layer effects
    const persistenceResult = runPersistence(store, gameEvents)
    return await processPersistenceResult(persistenceResult)
  } else {
    const gameErrorEvent = gameOutcome
    throw new Error(
      `NOT IMPLEMENTED: controller got error event ${JSON.stringify(
        gameErrorEvent
      )}`
    )
  }
}

export async function processPersistenceResult(
  persistenceResult: PatchRequest | PersistenceError
): Promise<ExpeditionUpdate> {
  if (Array.isArray(persistenceResult)) {
    const gameStateDiff = persistenceResult

    // NOT IMPLEMENTED. TODO.
    // This should use some fn from gameTransportLayer
    const clientEvents: ClientEvent[] = []

    return { update: gameStateDiff, clientEvents }
  } else {
    throw new Error(
      `NOT IMPLEMENTED: runPersistence returned PersistenceError ${JSON.stringify(
        persistenceResult
      )}`
    )
  }
}

export async function beginExpeditionController(
  uid: string
): Promise<ExpeditionUpdate> {
  const store = await getUserGameStore(uid)

  const gameMode = store.getGameState().gameMode
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

  const gameMode = store.getGameState().gameMode
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

  const gameMode = store.getGameState().gameMode
  const gameOutcome = await expeditionMoves.turnBack(gameMode)

  return await processOutcome(store, gameOutcome)
}

export async function encounterCardChoiceController(args: {
  uid: string
  choiceIndex: number
}): Promise<ExpeditionUpdate> {
  const { uid, choiceIndex } = args
  const store = await getUserGameStore(uid)

  const gameState = store.getGameState()
  if (gameState.gameMode === ACTIVE_ENCOUNTER) {
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
      gameMode: gameState.gameMode,
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
}): Promise<ExpeditionUpdate> {
  const { uid, drifterCardId } = args
  const store = await getUserGameStore(uid)

  const gameMode = store.getGameState().gameMode
  const drifterCard = await getDrifterCard(drifterCardId)

  const gameOutcome = await expeditionMoves.playDrifterCard({
    gameMode,
    drifterCard
  })

  return await processOutcome(store, gameOutcome)
}
