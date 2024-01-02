import { type GameState } from '../controllers/gameState'

// HACK to iterate quicker without DB schema design.
// Just a temporary "database" keyed by uuid
const inMemoryGameData: Record<string, GameState> = {}

function initialGameData (): GameState {
  return {
    gameMode: 'LOADOUT',
    characterStats: {
      agility: 0,
      harmony: 1,
      diy: -1,
      luck: 0
    },
    inventory: { rations: 10 },
    resources: {}
  }
}

/**
 * Creates initial game data for a new user
 */
// NOTE: IRL, this should be in the same transaction as insertUser
// bc if insertUser ever fails, this should not run!!
export async function createUserGameData (uid: string): Promise<void> {
  if (uid in inMemoryGameData) {
    throw new Error(`uid ${uid} already has game data`)
  }

  inMemoryGameData[uid] = initialGameData()
}

export async function getUserGameState (uid: string): Promise<GameState | null> {
  if (!(uid in inMemoryGameData)) {
    // TODO: this should be removed once we use real storage
    console.warn(`No game state for uid ${uid}. Auto-creating it!`)
    inMemoryGameData[uid] = initialGameData()
  }
  // IRL this function can return null, but not in this fake implementation
  return inMemoryGameData[uid]
}

/**
 * Remove the given quantities of items from the player's inventory, if there are enough
 */
export async function consumeInventoryItem (
  uid: string,
  item: string,
  quantity: number
): Promise<void> {
  if (!(uid in inMemoryGameData)) {
    throw new Error(`No game data for uid ${uid}`)
  }
  const data = inMemoryGameData[uid]
  const { inventory } = data

  // validate that we have enough items
  if (inventory[item] < quantity) {
    // TODO IMMEDIATELY return an error message, don't throw.
    throw new Error(`Insufficient quantity ${item} for ${uid}`)
  }

  // now validated, we can do it
  inventory[item] -= quantity
}
