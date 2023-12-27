import type { Skill } from './encounter'

export const ACTIVE_ENCOUNTER = 'ACTIVE_ENCOUNTER'
export const BETWEEN_ENCOUNTERS = 'BETWEEN_ENCOUNTERS'
export const LOADOUT = 'LOADOUT'

export type GameMode =
  | typeof LOADOUT
  | typeof BETWEEN_ENCOUNTERS
  | typeof ACTIVE_ENCOUNTER

export type CharacterStats = Record<Skill, number>

export interface ExpeditionProgress {
  current: number
  total: number
}

export interface ServerGameState {
  characterStats: CharacterStats
  gameMode: GameMode
  inventory: Record<string, number>
  resources: Record<string, number>
  activeEncounterCardId: string | null
  expeditionProgress: ExpeditionProgress | null
}
