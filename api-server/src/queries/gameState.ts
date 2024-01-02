import type { GameState } from '../controllers/gameState'
import { DiffableGameStore } from '../gamePersistenceLayer/types'
import {
  InMemoryDb,
  createInMemoryGameStoreForUser
} from '../gamePersistenceLayer/utils/gameStateDiff'

// HACK to iterate quicker without DB schema design.
// Just a temporary "database" keyed by uuid
const inMemoryDbSingleton: InMemoryDb = {}

// TODO: the fns below should be a factory bound with a store,
// rather than having the in-memory store hard-coded into them.

/**
 * Creates initial game data for a new user
 */
// NOTE: IRL, this should be in the same transaction as insertUser
// bc if insertUser ever fails, this should not run!!
export async function createUserGameData(uid: string): Promise<void> {
  createInMemoryGameStoreForUser(uid, inMemoryDbSingleton)
}

export async function getUserGameState(uid: string): Promise<GameState> {
  const store = createInMemoryGameStoreForUser(uid, inMemoryDbSingleton)
  return store.getGameState()
}

export async function getUserGameStore(
  uid: string
): Promise<DiffableGameStore> {
  return createInMemoryGameStoreForUser(uid, inMemoryDbSingleton)
}
