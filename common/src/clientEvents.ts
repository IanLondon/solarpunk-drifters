import type { EncounterResult } from './openapiTypes'
import type { components } from './openapi-api'

interface clientEventBrand {
  _clientEventBrand: any
}

export type ClientEvent = components['schemas']['ClientEvent'] &
  clientEventBrand

export type ClientEventEncounterResult =
  components['schemas']['ClientEventEncounterResult'] & clientEventBrand
export const CLIENT_EVENT_ENCOUNTER_RESULT: ClientEventEncounterResult['type'] =
  'CLIENT_EVENT_ENCOUNTER_RESULT'
function encounterResult(
  encounterResult: EncounterResult
): ClientEventEncounterResult {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    type: CLIENT_EVENT_ENCOUNTER_RESULT,
    payload: encounterResult
  } as ClientEventEncounterResult
}
export function filterEncounterResult(
  clientEvents: ClientEvent[]
): ClientEventEncounterResult[] {
  return clientEvents.filter((ce) => ce.type === CLIENT_EVENT_ENCOUNTER_RESULT)
}

export const clientEventTypes = {
  CLIENT_EVENT_ENCOUNTER_RESULT
}

export const clientEventCreators = {
  encounterResult
}

export const clientEventFilters = {
  encounterResult: filterEncounterResult
}
