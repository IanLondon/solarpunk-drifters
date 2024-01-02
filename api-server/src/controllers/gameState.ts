import { getUserGameState } from '../queries/gameState'

// TODO IMMEDIATELY these are duplicated in website/src/types/gameState.ts

export const ACTIVE_ENCOUNTER = 'ACTIVE_ENCOUNTER'
export const BETWEEN_ENCOUNTERS = 'BETWEEN_ENCOUNTERS'
export const LOADOUT = 'LOADOUT'

export interface ExpeditionProgress {
  current: number
  total: number
}

export type GameMode =
  | typeof LOADOUT
  | typeof BETWEEN_ENCOUNTERS
  | typeof ACTIVE_ENCOUNTER

export type Skill = string // TODO IMMEDIATELY HACK

export type CharacterStats = Record<Skill, number>

export interface GameState {
  characterStats: CharacterStats
  gameMode: GameMode
  inventory: Record<string, number>
  resources: Record<string, number>
}

// Just a wrapper for the query, bc currently this is a single query with no logic.
export async function getGameStateForUser(uid: string): Promise<GameState> {
  return await getUserGameState(uid)
}
