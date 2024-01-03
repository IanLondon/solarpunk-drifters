import type { Skill, ExpeditionProgress } from '@solarpunk-drifters/common'

export const ACTIVE_ENCOUNTER = 'ACTIVE_ENCOUNTER'
export const BETWEEN_ENCOUNTERS = 'BETWEEN_ENCOUNTERS'
export const LOADOUT = 'LOADOUT'

export type GameMode =
  | typeof LOADOUT
  | typeof BETWEEN_ENCOUNTERS
  | typeof ACTIVE_ENCOUNTER

export type CharacterStats = Record<Skill, number>

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
