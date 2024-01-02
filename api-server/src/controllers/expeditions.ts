import { getUserGameStore } from '../queries/gameState'
import * as expeditionMoves from '../gameLogicLayer/expeditionMoves'
import runPersistence from '../gamePersistenceLayer'
import type { GameMoveOutcome } from '../gameLogicLayer/events'
import type {
  DiffableGameStore,
  GameStateDiff,
  GameStore,
  PersistenceError
} from '../gamePersistenceLayer/types'

type ClientEvent = never // NOT IMPLEMENTED. TODO

interface ExpeditionResponse {
  update: GameStateDiff
  clientEvents: Array<ClientEvent>
}

function fakeEncounterCardDeck(): string {
  return 'fake-encounter-card-id'
}

/**
 * This is the "imperative shell" of "functional core, imperative shell."
 */
// TODO: break up into smaller parts:
// - Separate GameMoveOutcome = GameEvent[] versus = GameErrorEvent,
//     processOutcome shouldn't do both.
// - Transform the GameEvents to ClientEvents via a new gameTransportLayer fn
export async function processOutcome(
  store: DiffableGameStore,
  gameOutcome: GameMoveOutcome
): Promise<ExpeditionResponse> {
  if (Array.isArray(gameOutcome)) {
    const gameEvents = gameOutcome

    // Run persistence layer effects
    const persistenceResult = runPersistence(store, gameEvents)
    return processPersistenceResult(persistenceResult)
  } else {
    const gameErrorEvent = gameOutcome
    throw new Error(
      `NOT IMPLEMENTED: controller got error event ${gameErrorEvent}`
    )
  }
}

export async function processPersistenceResult(
  persistenceResult: GameStateDiff | PersistenceError
): Promise<ExpeditionResponse> {
  if (Array.isArray(persistenceResult)) {
    const gameStateDiff = persistenceResult

    // NOT IMPLEMENTED. TODO.
    // This should use some fn from gameTransportLayer
    const clientEvents: Array<ClientEvent> = []

    return { update: gameStateDiff, clientEvents }
  } else {
    throw new Error(
      `NOT IMPLEMENTED: runPersistence returned PersistenceError ${persistenceResult}`
    )
  }
}

export async function beginExpeditionController(
  uid: string
): Promise<ExpeditionResponse> {
  const store = await getUserGameStore(uid)

  const gameMode = store.getGameState().gameMode
  const gameOutcome = expeditionMoves.beginExpedition(
    gameMode,
    fakeEncounterCardDeck
  )

  return await processOutcome(store, gameOutcome)
}
