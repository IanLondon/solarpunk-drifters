import {
  CLIENT_EVENT_ENCOUNTER_RESULT,
  type ClientEvent,
  type ClientEventEncounterResult
} from './openapiTypes'

export function filterClientEventEncounterResult(
  clientEvents: ClientEvent[]
): ClientEventEncounterResult[] {
  return clientEvents.filter((ce) => ce.type === CLIENT_EVENT_ENCOUNTER_RESULT)
}
