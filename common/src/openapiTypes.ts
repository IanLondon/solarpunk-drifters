import type { components, paths } from './openapi-api'

export { paths }

// Turn messy auto-generated types into nicer named types
export type ActiveEncounterGameState =
  components['schemas']['ActiveEncounterGameState']

export type BetweenEncountersGameState =
  components['schemas']['BetweenEncountersGameState']

export type CharacterStats = components['schemas']['CharacterStats']

export type ClientEvent = components['schemas']['ClientEvent']

export type ClientEventEncounterResult =
  components['schemas']['ClientEventEncounterResult']
export const CLIENT_EVENT_ENCOUNTER_RESULT: ClientEventEncounterResult['type'] =
  'CLIENT_EVENT_ENCOUNTER_RESULT'

export type CoreGameState = components['schemas']['CoreGameState']

export type EncounterCard = components['schemas']['EncounterCard']

export type EncounterCheck = components['schemas']['EncounterCheck']

export type EncounterChoice = components['schemas']['EncounterChoice']

export type EncounterRisk = components['schemas']['EncounterRisk']

export type ExpeditionProgress = components['schemas']['ExpeditionProgress']

export type ExpeditionUpdate = components['schemas']['ExpeditionUpdate']

export type GameState = Required<components['schemas']['GameState']>

export type ImageInfo = components['schemas']['ImageInfo']

export type LoadoutGameState = Required<
  components['schemas']['LoadoutGameState']
>

/** A JSON Patch (RFC 6902) for some JSON object. */
export type PatchRequest = components['schemas']['PatchRequest']

export type EncounterResult = components['schemas']['EncounterResult']
export type EncounterOutcome = EncounterResult['outcome']
export const ENCOUNTER_OUTCOME_FAILURE: EncounterOutcome =
  'ENCOUNTER_OUTCOME_FAILURE'
export const ENCOUNTER_OUTCOME_MIXED_SUCCESS: EncounterOutcome =
  'ENCOUNTER_OUTCOME_MIXED_SUCCESS'
export const ENCOUNTER_OUTCOME_STRONG_SUCCESS: EncounterOutcome =
  'ENCOUNTER_OUTCOME_STRONG_SUCCESS'

export type Skill = components['schemas']['Skill']

export type StatNumber = components['schemas']['StatNumber']

export type UserLogin = components['schemas']['UserLogin']
