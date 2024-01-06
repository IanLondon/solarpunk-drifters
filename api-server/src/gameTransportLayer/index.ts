import {
  clientEventCreators,
  type ClientEvent,
  type EncounterResult
} from '@solarpunk-drifters/common'
import { ENCOUNTER_RESULT, type GameEvent } from '../gameLogicLayer/gameEvents'
export function generateClientEvents(gameEvents: GameEvent[]): ClientEvent[] {
  const result: ClientEvent[] = []

  for (const gameEvent of gameEvents) {
    if (gameEvent.type === ENCOUNTER_RESULT) {
      const encounterResult: EncounterResult = gameEvent.encounterResult
      const c = clientEventCreators.encounterResult(encounterResult)
      result.push(c)
    }
  }

  return result
}
