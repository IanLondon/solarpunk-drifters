import {
  type CharacterStats,
  type ExpeditionProgress,
  type GameMode,
  type GameState
} from '../controllers/gameState'
import { createPatch } from 'rfc6902'
import type { DiffableGameStore } from './types'
import type { DeepReadonly } from 'ts-essentials'

export type InMemoryDb = Record<string, InMemoryGameStoreForUser>

export interface InMemoryGameStoreForUser {
  activeEncounterCard: string | null
  characterStats: CharacterStats
  gameMode: GameMode
  inventory: Record<string, number>
  progress: ExpeditionProgress | null
}

export function createInitialStoreState(): InMemoryGameStoreForUser {
  return {
    activeEncounterCard: null,
    characterStats: {
      agility: 0,
      harmony: 1,
      diy: -1,
      luck: 0
    },
    gameMode: 'LOADOUT',
    inventory: { rations: 10 },
    progress: null
  }
}

export const createInMemoryGameStoreForUser = (
  uid: string,
  inMemoryDb: InMemoryDb
): DiffableGameStore => {
  if (uid in inMemoryDb) {
    console.log(`UID ${uid} has existing state.`)
  } else {
    console.log(`No game state for uid ${uid}, initializing.`)
    const newStore = createInitialStoreState()
    inMemoryDb[uid] = newStore
  }

  const store = inMemoryDb[uid]

  // NOTE: consumers must not use this as a hack to mutate the store,
  // so DeepReadonly is necessary.
  // (Could deep copy here, but trying to be performant.)
  const getGameState = (): DeepReadonly<GameState> => ({
    ...store,
    resources: {} // Not implemented, fake it out
  })

  // NOTE: since we're caching this to derive the patch, it must be a deep copy.
  // TODO: use a deepCopy util fn instead of JSON ser/deser
  let prevGameState = JSON.parse(JSON.stringify(getGameState()))

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
      store.activeEncounterCard = cardId
      return null
    },
    clearActiveEncounterCard: () => {
      store.activeEncounterCard = null
      return null
    },
    clearExpeditionState: () => {
      store.progress = null
      return null
    },
    createExpeditionState: (progress) => {
      store.progress = progress
      return null
    },
    incrementExpeditionProgress: (distance) => {
      if (store.progress === null) {
        return { method: 'incrementExpeditionProgress', error: 'noProgress' }
      }
      store.progress.current += distance
      return null
    },
    getGameState,
    getGameStateDiff: () => {
      const patch = createPatch(prevGameState, getGameState())
      return patch
    },
    clearGameStateDiff: () => {
      prevGameState = getGameState()
      return null
    }
  }
}
