import { getUserGameState } from '../queries/gameState'
import type { GameState } from '@solarpunk-drifters/common'

// Just a wrapper for the query, bc currently this is a single query with no logic.
export async function getGameStateForUser(uid: string): Promise<GameState> {
  return await getUserGameState(uid)
}
