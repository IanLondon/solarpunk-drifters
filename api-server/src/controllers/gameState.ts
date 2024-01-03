import { getUserGameState } from '../queries/gameState'
import type { GameState } from '@solarpunk-drifters/common'

// TODO IMMEDIATELY these are duplicated in website/src/types/gameState.ts
// Refactor them out (here and in website) to @solarpunk-drifters/common

export const ACTIVE_ENCOUNTER = 'ACTIVE_ENCOUNTER'
export const BETWEEN_ENCOUNTERS = 'BETWEEN_ENCOUNTERS'
export const LOADOUT = 'LOADOUT'

export type GameMode =
  | typeof LOADOUT
  | typeof BETWEEN_ENCOUNTERS
  | typeof ACTIVE_ENCOUNTER

// Just a wrapper for the query, bc currently this is a single query with no logic.
export async function getGameStateForUser(uid: string): Promise<GameState> {
  return await getUserGameState(uid)
}
