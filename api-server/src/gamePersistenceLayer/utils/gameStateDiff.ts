import {
  CharacterStats,
  ExpeditionProgress,
  GameMode,
  GameState
} from '../../controllers/gameState'
import type { DiffableGameStore, GameStateDiff } from '../types'
import { createPatch } from 'rfc6902'

export type InMemoryDb = Record<string, InMemoryGameStoreForUser>

export interface InMemoryGameStoreForUser {
  activeEncounterCard: string | null
  characterStats: CharacterStats
  gameMode: GameMode
  inventory: Record<string, number>
  progress: ExpeditionProgress | null
}

export const createInMemoryGameStoreForUser = (
  uid: string,
  inMemoryDb: InMemoryDb
): DiffableGameStore => {
  if (uid in inMemoryDb) {
    console.log(`UID ${uid} has existing state.`)
  } else {
    console.log(`No game state for uid ${uid}, initializing.`)
    const newStore: InMemoryGameStoreForUser = {
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
    inMemoryDb[uid] = newStore
  }

  const store = inMemoryDb[uid]

  const getGameState = (): GameState => ({
    ...store,
    resources: {} // Not implemented, fake it out
  })

  let prevGameState = getGameState()

  return {
    addInventoryItem: (item, quantity) => {
      store.inventory[item] += quantity
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
