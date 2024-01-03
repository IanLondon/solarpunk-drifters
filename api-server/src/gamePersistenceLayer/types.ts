import type { Operation } from 'rfc6902'
import type { GameMode } from '../controllers/gameState'
import type { ExpeditionProgress, GameState } from '@solarpunk-drifters/common'
import { type DeepReadonly } from 'ts-essentials'

export interface StoreError {
  method: keyof GameStore
  error: string
}
export type StoreOut = null | StoreError

export interface GameStore {
  // Write methods
  addInventoryItem: (item: string, quantity: number) => StoreOut
  removeInventoryItem: (item: string, quantity: number) => StoreOut
  setGameMode: (gameMode: GameMode) => StoreOut
  setActiveEncounterCard: (cardId: string) => StoreOut
  clearActiveEncounterCard: () => StoreOut
  clearExpeditionState: () => StoreOut
  createExpeditionState: (progress: ExpeditionProgress) => StoreOut
  incrementExpeditionProgress: (distance: number) => StoreOut
  // Read methods
  getGameState: () => DeepReadonly<GameState>
}

export type GameStateDiff = Operation[]

export interface PersistenceError {
  error: true
  payload: string
} // TODO. NOT IMPLEMENTED
