import { type ClientEvent } from '@solarpunk-drifters/common'
import { ENCOUNTER_RESULT, type GameEvent } from '../gameLogicLayer/gameEvents'
import * as clientEvents from './clientEvents'
export function generateClientEvents(gameEvents: GameEvent[]): ClientEvent[] {
  const result: ClientEvent[] = []

  for (const gameEvent of gameEvents) {
    if (gameEvent.type === ENCOUNTER_RESULT) {
      result.push(clientEvents.encounterResult(gameEvent.encounterResult))
    }
  }

  return result
}
