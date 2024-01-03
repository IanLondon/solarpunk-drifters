import type {
  CharacterStats,
  ExpeditionProgress,
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '@solarpunk-drifters/common'

// NOTE: these types are similar to those in common, which are generated from
// the OpenAPI definition. However, the generated types are much looser than we
// want in the website application, so we define stricter ones here

export interface CoreServerGameState {
  characterStats: CharacterStats
  inventory: Record<string, number>
  resources: Record<string, number>
}

export interface ActiveEncounterServerGameState extends CoreServerGameState {
  gameMode: typeof ACTIVE_ENCOUNTER
  activeEncounterCardId: string
  expeditionProgress: ExpeditionProgress
}

export interface BetweenEncountersServerGameState extends CoreServerGameState {
  gameMode: typeof BETWEEN_ENCOUNTERS
  expeditionProgress: ExpeditionProgress
}

export interface LoadoutServerGameState extends CoreServerGameState {
  gameMode: typeof LOADOUT
}

export type ServerGameState =
  | ActiveEncounterServerGameState
  | BetweenEncountersServerGameState
  | LoadoutServerGameState
