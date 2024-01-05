import {
  type EncounterResult,
  type ClientEventEncounterResult,
  CLIENT_EVENT_ENCOUNTER_RESULT
} from '@solarpunk-drifters/common'

export function encounterResult(
  encounterResult: EncounterResult
): ClientEventEncounterResult {
  return { type: CLIENT_EVENT_ENCOUNTER_RESULT, payload: encounterResult }
}
