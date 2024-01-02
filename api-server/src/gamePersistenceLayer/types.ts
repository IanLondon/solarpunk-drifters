import type { Operation } from 'rfc6902'
import type {
  ExpeditionProgress,
  GameMode,
  GameState
} from '../controllers/gameState'

export type StoreError = { method: keyof GameStore; error: string }
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
  getGameState: () => GameState
}

export type GameStateDiff = Operation[]

export interface DiffableGameStore extends GameStore {
  getGameStateDiff: () => GameStateDiff
  clearGameStateDiff: () => StoreOut
}

export type PersistenceError = { error: true; payload: string } // TODO. NOT IMPLEMENTED
