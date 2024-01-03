import {
  CLIENT_EVENT_ROLL_RESULT,
  type ClientEvent,
  type ClientEventRollResult
} from './openapiTypes'

export function filterClientEventRollResult(
  clientEvents: ClientEvent[]
): ClientEventRollResult[] {
  return clientEvents.filter((ce) => ce.type === CLIENT_EVENT_ROLL_RESULT)
}
