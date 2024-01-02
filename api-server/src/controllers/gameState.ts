import { getUserGameState } from '../queries/gameState'

// TODO IMMEDIATELY these are duplicated in website/src/types/gameState.ts

const ACTIVE_ENCOUNTER = 'ACTIVE_ENCOUNTER'
const BETWEEN_ENCOUNTERS = 'BETWEEN_ENCOUNTERS'
const LOADOUT = 'LOADOUT'

type GameMode =
  | typeof LOADOUT
  | typeof BETWEEN_ENCOUNTERS
  | typeof ACTIVE_ENCOUNTER

type Skill = string // TODO IMMEDIATELY HACK

type CharacterStats = Record<Skill, number>

export interface GameState {
  characterStats: CharacterStats
  gameMode: GameMode
  inventory: Record<string, number>
  resources: Record<string, number>
}

// Just a wrapper for the query, bc currently this is a single query with no logic.
export async function getGameStateForUser (
  uid: string
): Promise<GameState | null> {
  return await getUserGameState(uid)
}
