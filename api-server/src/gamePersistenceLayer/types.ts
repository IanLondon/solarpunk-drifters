import type {
  ExpeditionProgress,
  GameMode,
  GameState
} from '@solarpunk-drifters/common'
import type { DeepReadonly } from 'ts-essentials'
import type { GameEvent } from '../gameLogicLayer/gameEvents'
import type { InventoryPatch } from '../types'

export interface StoreError {
  method: keyof GameStore
  error: string
}
export type StoreOut = null | StoreError

export interface GameStore {
  // Write methods
  addSubtractInventoryItems: (itemPatch: InventoryPatch) => Promise<StoreOut>
  addSubtractDrifterCards: (
    drifterCardPatch: InventoryPatch
  ) => Promise<StoreOut>
  setGameMode: (gameMode: GameMode) => Promise<StoreOut>
  setActiveEncounterCard: (cardId: string) => Promise<StoreOut>
  clearActiveEncounterCard: () => Promise<StoreOut>
  clearExpeditionState: () => Promise<StoreOut>
  createExpeditionState: (progress: ExpeditionProgress) => Promise<StoreOut>
  incrementExpeditionProgress: (distance: number) => Promise<StoreOut>
  // Read methods
  getGameState: () => Promise<DeepReadonly<GameState>>
}

/** A fn bound to a store that persists the given game event to the store */
export type GameEventPersistor = (e: GameEvent) => Promise<StoreError[]>

export interface PersistenceError {
  error: true
  payload: string
} // TODO. NOT IMPLEMENTED
