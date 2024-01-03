import type { GameStore } from './types'
import type { DeepReadonly } from 'ts-essentials'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT,
  type GameMode
} from '../controllers/gameState'
import type {
  CharacterStats,
  ExpeditionProgress,
  GameState
} from '@solarpunk-drifters/common'

export type InMemoryDb = Record<string, InMemoryGameStoreForUser>

// NOTE: this is similar to GameState, but doesn't use union type
// to exclude invalid states.
export interface InMemoryGameStoreForUser {
  characterStats: CharacterStats
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
        inventory,
        resources,
        expeditionProgress
      }
    }
  } else if (gameMode === LOADOUT) {
    return {
      gameMode,
      characterStats,
      inventory,
      resources
    }
  } else {
    throw new Error(`Invalid gameState: unexpected gameMode ${gameMode as any}`)
  }
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
    addInventoryItem: (item, quantity) => {
      if (item in store.inventory) {
        store.inventory[item] += quantity
      } else {
        store.inventory[item] = quantity
      }
      return null
    },
    removeInventoryItem: (item, quantity) => {
      const prevQuantity = store.inventory[item]
      if (prevQuantity < quantity) {
        return { method: 'removeInventoryItem', error: 'insufficientQuantity' }
      }
      store.inventory[item] -= quantity
      return null
    },
    setGameMode: (gameMode) => {
      store.gameMode = gameMode
      return null
    },
    setActiveEncounterCard: (cardId) => {
      store.activeEncounterCardId = cardId
      return null
    },
    clearActiveEncounterCard: () => {
      store.activeEncounterCardId = null
      return null
    },
    clearExpeditionState: () => {
      store.expeditionProgress = null
      return null
    },
    createExpeditionState: (progress) => {
      store.expeditionProgress = progress
      return null
    },
    incrementExpeditionProgress: (distance) => {
      if (store.expeditionProgress === null) {
        return { method: 'incrementExpeditionProgress', error: 'noProgress' }
      }
      store.expeditionProgress.current += distance
      return null
    },
    getGameState: () => rawStoreStateToGameState(store)
  }
}
