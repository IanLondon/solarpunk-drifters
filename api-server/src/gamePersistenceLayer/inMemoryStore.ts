import type { GameStore, StoreOut } from './types'
import type { DeepReadonly } from 'ts-essentials'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT,
  type CharacterStats,
  type ExpeditionProgress,
  type GameMode,
  type GameState
} from '@solarpunk-drifters/common'
import { getInvalidItems } from '../utils/getInvalidItems'
import { type InventoryPatch } from '../types'

export type InMemoryDb = Record<string, InMemoryGameStoreForUser>

// NOTE: this is similar to GameState, but doesn't use union type
// to exclude invalid states.
export interface InMemoryGameStoreForUser {
  characterStats: CharacterStats
  drifterCardInventory: Record<string, number>
  gameMode: GameMode
  inventory: Record<string, number>
  resources: Record<string, never> // NOT IMPLEMENTED
  activeEncounterCardId: string | null
  expeditionProgress: ExpeditionProgress | null
}

export function createInitialStoreState(): InMemoryGameStoreForUser {
  return {
    characterStats: {
      agility: 0,
      harmony: 1,
      diy: -1,
      luck: 0
    },
    drifterCardInventory: {},
    gameMode: 'LOADOUT',
    inventory: { rations: 10 },
    resources: {},
    activeEncounterCardId: null,
    expeditionProgress: null
  }
}

// NOTE: consumers must not use this as a hack to mutate the store,
// so DeepReadonly is necessary.
// (Could deep copy here to be extra safe, but it's less performant.)
export function rawStoreStateToGameState(
  store: InMemoryGameStoreForUser
): DeepReadonly<GameState> {
  const {
    characterStats,
    drifterCardInventory,
    gameMode,
    inventory,
    resources,
    activeEncounterCardId,
    expeditionProgress
  } = store
  if (gameMode === ACTIVE_ENCOUNTER) {
    if (activeEncounterCardId === null) {
      throw new Error(
        'Invalid gameState: activeEncounterCardId is null while gameMode is ACTIVE_ENCOUNTER'
      )
    } else if (expeditionProgress === null) {
      throw new Error(
        'Invalid gameState: expeditionProgress is null while gameMode is ACTIVE_ENCOUNTER'
      )
    } else {
      return {
        gameMode,
        characterStats,
        drifterCardInventory,
        inventory,
        resources,
        activeEncounterCardId,
        expeditionProgress
      }
    }
  } else if (gameMode === BETWEEN_ENCOUNTERS) {
    if (expeditionProgress === null) {
      throw new Error(
        'Invalid gameState: expeditionProgress is null while gameMode is BETWEEN_ENCOUNTERS'
      )
    } else {
      return {
        gameMode,
        characterStats,
        drifterCardInventory,
        inventory,
        resources,
        expeditionProgress
      }
    }
  } else if (gameMode === LOADOUT) {
    return {
      gameMode,
      characterStats,
      drifterCardInventory,
      inventory,
      resources
    }
  } else {
    throw new Error(`Invalid gameState: unexpected gameMode ${gameMode as any}`)
  }
}

function applyInventoryPatch(args: {
  inventory: Record<string, number>
  inventoryPatch: InventoryPatch
}): StoreOut {
  const { inventory, inventoryPatch } = args
  // Pick the negative values and then invert them for getInvalidItems
  // (we're only checking validity of items that will be removed, which are
  // the itemPatch's negative values)
  const invalidItems = getInvalidItems({
    inventory,
    inventoryPatch
  })

  if (invalidItems.length > 0) {
    return {
      method: 'addSubtractInventoryItems',
      error: 'insufficientQuantity'
    }
  }

  Object.entries(inventoryPatch).forEach(([item, diff]) => {
    if (item in inventory) {
      inventory[item] += diff
    } else {
      inventory[item] = diff
    }
  })

  return null
}

export function createInMemoryGameStoreForUser(
  uid: string,
  inMemoryDb: InMemoryDb
): GameStore {
  if (uid in inMemoryDb) {
    console.log(`UID ${uid} has existing state.`)
  } else {
    console.log(`No game state for uid ${uid}, initializing.`)
    const newStore = createInitialStoreState()
    inMemoryDb[uid] = newStore
  }

  const store = inMemoryDb[uid]

  return {
    addSubtractDrifterCards: async (drifterCardPatch) => {
      return applyInventoryPatch({
        inventory: store.drifterCardInventory,
        inventoryPatch: drifterCardPatch
      })
    },
    addSubtractInventoryItems: async (itemPatch) => {
      return applyInventoryPatch({
        inventory: store.inventory,
        inventoryPatch: itemPatch
      })
    },
    setGameMode: async (gameMode) => {
      store.gameMode = gameMode
      return null
    },
    setActiveEncounterCard: async (cardId) => {
      store.activeEncounterCardId = cardId
      return null
    },
    clearActiveEncounterCard: async () => {
      store.activeEncounterCardId = null
      return null
    },
    clearExpeditionState: async () => {
      store.expeditionProgress = null
      return null
    },
    createExpeditionState: async (progress) => {
      store.expeditionProgress = progress
      return null
    },
    incrementExpeditionProgress: async (distance) => {
      if (store.expeditionProgress === null) {
        return { method: 'incrementExpeditionProgress', error: 'noProgress' }
      }
      store.expeditionProgress.current += distance
      return null
    },
    getGameState: async () => rawStoreStateToGameState(store)
  }
}
