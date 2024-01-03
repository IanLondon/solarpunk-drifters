import persistGameEventEffects from './utils/persistGameEventEffects'
import type { GameEvent } from '../gameLogicLayer/events'
import type { GameStore, GameStateDiff, PersistenceError } from './types'
import { createPatch } from 'rfc6902'

export default function runPersistence(
  store: GameStore,
  gameEvents: GameEvent[]
): GameStateDiff | PersistenceError {
  // TODO: use deep copy instead of JSON ser/deser
  const initialGameState = JSON.parse(JSON.stringify(store.getGameState()))

  // Run persistence layer effects
  for (const evt of gameEvents) {
    // TODO: implement error handling, early abort
    // TODO: allow transaction
    const persistOut = persistGameEventEffects(store, evt)
    if (persistOut.length > 0) {
      throw new Error(
        `Not implemented: got errors from persistGameEventEffects. ${JSON.stringify(
          persistOut
        )}`
      )
    }
  }

  const finalGameState = store.getGameState()

  return createPatch(initialGameState, finalGameState)
}
