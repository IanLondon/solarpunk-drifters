import type {
  ExpeditionProgress,
  GameMode,
  GameState
} from '@solarpunk-drifters/common'
import { type DeepReadonly } from 'ts-essentials'

export interface StoreError {
  method: keyof GameStore
  error: string
}
export type StoreOut = null | StoreError

export interface GameStore {
  // Write methods
  addSubtractInventoryItems: (
    itemPatch: Readonly<Record<string, number>>
  ) => StoreOut
  setGameMode: (gameMode: GameMode) => StoreOut
  setActiveEncounterCard: (cardId: string) => StoreOut
  clearActiveEncounterCard: () => StoreOut
  clearExpeditionState: () => StoreOut
  createExpeditionState: (progress: ExpeditionProgress) => StoreOut
  incrementExpeditionProgress: (distance: number) => StoreOut
  // Read methods
  getGameState: () => DeepReadonly<GameState>
}

export interface PersistenceError {
  error: true
  payload: string
} // TODO. NOT IMPLEMENTED
