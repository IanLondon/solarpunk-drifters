import persistGameEventEffects from './utils/persistGameEventEffects'
import type { GameEvent } from '../gameLogicLayer/events'
import type {
  DiffableGameStore,
  GameStateDiff,
  PersistenceError
} from './types'

export default function runPersistence(
  store: DiffableGameStore,
  gameEvents: GameEvent[]
): GameStateDiff | PersistenceError {
  // Run persistence layer effects
  for (const e of gameEvents) {
    // TODO: implement error handling, early abort
    // TODO: allow transaction
    persistGameEventEffects(store, e)
  }

  return store.getGameStateDiff()
}
