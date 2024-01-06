import {
  clientEventCreators,
  type ClientEvent,
  type EncounterResult
} from '@solarpunk-drifters/common'
import { GameEventTypes, type GameEvent } from '../gameLogicLayer/gameEvents'
export function generateClientEvents(gameEvents: GameEvent[]): ClientEvent[] {
  const result: ClientEvent[] = []

  for (const gameEvent of gameEvents) {
    if (gameEvent.type === GameEventTypes.ENCOUNTER_RESULT) {
      const encounterResult: EncounterResult = gameEvent.encounterResult
      const c = clientEventCreators.encounterResult(encounterResult)
      result.push(c)
    }
  }

  return result
}
