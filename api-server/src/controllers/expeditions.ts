import { getUserGameStore } from '../queries/gameState'
import * as expeditionMoves from '../gameLogicLayer/expeditionMoves'
import runPersistence from '../gamePersistenceLayer'
import type { GameMoveOutcome } from '../gameLogicLayer/events'
import type {
  GameStateDiff,
  GameStore,
  PersistenceError
} from '../gamePersistenceLayer/types'
import { ACTIVE_ENCOUNTER } from './gameState'
import { getEncounterCard } from '../queries/encounterCards'
import { getDrifterCard } from '../queries/drifterCards'

type ClientEvent = never // NOT IMPLEMENTED. TODO

interface ExpeditionResponse {
  update: GameStateDiff
  clientEvents: ClientEvent[]
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
  store: GameStore,
  gameOutcome: GameMoveOutcome
): Promise<ExpeditionResponse> {
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
  persistenceResult: GameStateDiff | PersistenceError
): Promise<ExpeditionResponse> {
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
): Promise<ExpeditionResponse> {
  const store = await getUserGameStore(uid)

  const gameMode = store.getGameState().gameMode
  const gameOutcome = expeditionMoves.beginExpedition(
    gameMode,
    fakeEncounterCardDeck
  )

  return await processOutcome(store, gameOutcome)
}

export async function nextEncounterController(
  uid: string
): Promise<ExpeditionResponse> {
  const store = await getUserGameStore(uid)

  const gameMode = store.getGameState().gameMode
  const gameOutcome = expeditionMoves.nextEncounter(
    gameMode,
    fakeEncounterCardDeck
  )

  return await processOutcome(store, gameOutcome)
}

export async function turnBackController(
  uid: string
): Promise<ExpeditionResponse> {
  const store = await getUserGameStore(uid)

  const gameMode = store.getGameState().gameMode
  const gameOutcome = expeditionMoves.turnBack(gameMode)

  return await processOutcome(store, gameOutcome)
}

export async function encounterCardChoiceController(args: {
  uid: string
  choiceIndex: number
}): Promise<ExpeditionResponse> {
  const { uid, choiceIndex } = args
  const store = await getUserGameStore(uid)

  const gameState = store.getGameState()
  if (gameState.gameMode === ACTIVE_ENCOUNTER) {
    const encounterCardId = gameState.activeEncounterCardId

    const encounterCard = await getEncounterCard(encounterCardId)

    const gameOutcome = expeditionMoves.encounterCardChoice({
      gameMode: gameState.gameMode,
      choiceIndex,
      encounterCard
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
}): Promise<ExpeditionResponse> {
  const { uid, drifterCardId } = args
  const store = await getUserGameStore(uid)

  const gameMode = store.getGameState().gameMode
  const drifterCard = await getDrifterCard(drifterCardId)

  const gameOutcome = expeditionMoves.playDrifterCard({ gameMode, drifterCard })

  return await processOutcome(store, gameOutcome)
}
