import { createPatch } from 'rfc6902'
import type { GameState, PatchRequest } from '@solarpunk-drifters/common'
import type { GameEvent } from '../gameLogicLayer/events'
import type { GameEventPersistor, PersistenceError } from './types'

export default async function runPersistence(
  gameEvents: GameEvent[],
  gameEventPersistor: GameEventPersistor,
  getGameState: () => Promise<GameState>
): Promise<PatchRequest | PersistenceError> {
  // TODO: use deep copy instead of JSON ser/deser
  const initialGameState = JSON.parse(JSON.stringify(await getGameState()))

  // Run persistence layer effects
  for (const evt of gameEvents) {
    // TODO: implement error handling, early abort
    // TODO: allow transaction
    const persistOut = await gameEventPersistor(evt)
    if (persistOut.length > 0) {
      throw new Error(
        `Not implemented: got errors from persistGameEventEffects. ${JSON.stringify(
          persistOut
        )}`
      )
    }
  }

  const finalGameState = await getGameState()

  return createPatch(initialGameState, finalGameState)
}
