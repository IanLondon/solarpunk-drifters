import { describe, expect, it } from '@jest/globals'
import {
  type InMemoryDb,
  type InMemoryGameStoreForUser,
  createInMemoryGameStoreForUser,
  createInitialStoreState
} from './inMemoryStore'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '../controllers/gameState'
import type { GameStore } from './types'

const uid = 'some-user-id-123' as const

/**
 * Test helper to construct the in-memory GameStore
 * @param storeState Partial state that is shallowly spread over the default
 *   `createInitialStoreState()` output
 */
function createMemoryGameStoreHelper(
  storeState?: Partial<InMemoryGameStoreForUser>
): {
  inMemoryDb: InMemoryDb
  store: GameStore
} {
  const inMemoryDb = {
    [uid]: { ...createInitialStoreState(), ...storeState }
  }
  const store = createInMemoryGameStoreForUser(uid, inMemoryDb)
  return { inMemoryDb, store }
}

describe('createInMemoryGameStoreForUser', () => {
  it('should initialize game state if uid does not exist', () => {
    const inMemoryDb: InMemoryDb = {}
    createInMemoryGameStoreForUser(uid, inMemoryDb)

    expect(inMemoryDb).toHaveProperty(uid)
    expect(inMemoryDb[uid]).toEqual(createInitialStoreState())
  })

  it('should retrieve game state if uid does exist', () => {
    const userStore = createInitialStoreState()
    const inMemoryDb: InMemoryDb = { [uid]: userStore }
    createInMemoryGameStoreForUser(uid, inMemoryDb)

    expect(inMemoryDb).toHaveProperty(uid)
    expect(inMemoryDb[uid]).toEqual(userStore)
  })

  describe('addSubtractInventoryItems', () => {
    describe('addition', () => {
      it('should increment the quantity of the given item', () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { fooItem: 3 }
        })

        const output = store.addSubtractInventoryItems({ fooItem: 2 })

        expect(store.getGameState().inventory).toEqual({ fooItem: 3 + 2 })
        expect(output).toBe(null)
      })

      it("should create a new entry for an item that didn't exist", () => {
        const { store } = createMemoryGameStoreHelper()

        const output = store.addSubtractInventoryItems({ fooItem: 2 })

        expect(store.getGameState()).toHaveProperty('inventory.fooItem', 2)
        expect(output).toBe(null)
      })
    })

    describe('subtraction', () => {
      it('should remove an item if there is more than enough', () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { fooItem: 3 }
        })

        const output = store.addSubtractInventoryItems({ fooItem: -2 })

        expect(store.getGameState()).toHaveProperty('inventory.fooItem', 3 - 2)
        expect(output).toBe(null)
      })
      it("should set an item's quantity to zero if there is exactly enough", () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { fooItem: 3 }
        })

        const output = store.addSubtractInventoryItems({ fooItem: -3 })

        expect(store.getGameState()).toHaveProperty('inventory.fooItem', 0)
        expect(output).toBe(null)
      })
      it('should return an error if there is not enough', () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { fooItem: 2 }
        })

        const output = store.addSubtractInventoryItems({ fooItem: -3 })

        expect(store.getGameState()).toHaveProperty('inventory.fooItem', 2)
        expect(output).toEqual({
          method: 'addSubtractInventoryItems',
          error: 'insufficientQuantity'
        })
      })
    })

    describe('both addition and subtraction in the patch', () => {
      it('should do both addition and subtraction', () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { rations: 4, fooItem: 3 }
        })

        const output = store.addSubtractInventoryItems({
          rations: -1,
          fooItem: 2
        })

        expect(store.getGameState()).toHaveProperty('inventory.rations', 4 - 1)
        expect(store.getGameState()).toHaveProperty('inventory.fooItem', 3 + 2)
        expect(output).toBe(null)
      })

      it('should not do any addition operations if any subtractions would fail', () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { rations: 4, fooItem: 3 }
        })

        const output = store.addSubtractInventoryItems({
          rations: -100,
          fooItem: 2
        })

        // unchanged
        expect(store.getGameState()).toHaveProperty('inventory.rations', 4)
        expect(store.getGameState()).toHaveProperty('inventory.fooItem', 3)
        expect(output).toEqual({
          method: 'addSubtractInventoryItems',
          error: 'insufficientQuantity'
        })
      })
    })
  })

  describe('setGameMode', () => {
    it('should set the gameMode', () => {
      const { store } = createMemoryGameStoreHelper({
        gameMode: LOADOUT,
        // These fields can't be null if we're going to ACTIVE_ENCOUNTER:
        activeEncounterCardId: 'some-card-id',
        expeditionProgress: { current: 123, total: 1234 }
      })

      const output = store.setGameMode(ACTIVE_ENCOUNTER)

      expect(store.getGameState().gameMode).toEqual(ACTIVE_ENCOUNTER)
      expect(output).toEqual(null)
    })
  })

  describe('setActiveEncounterCard', () => {
    it('should set the active encounter card to the given cardId', () => {
      const cardId = 'some-test-card-id-8293'
      // set game mode for GameState type consistency
      const { store } = createMemoryGameStoreHelper({
        gameMode: ACTIVE_ENCOUNTER,
        expeditionProgress: { current: 123, total: 1234 }
      })

      const output = store.setActiveEncounterCard(cardId)

      expect(store.getGameState()).toHaveProperty(
        'activeEncounterCardId',
        cardId
      )
      expect(output).toEqual(null)
    })
  })

  describe('clearActiveEncounterCard', () => {
    it('should unset the active encounter card key', () => {
      const cardId = 'some-card-id-987'
      const { store } = createMemoryGameStoreHelper({
        gameMode: LOADOUT,
        activeEncounterCardId: cardId
      })

      const output = store.clearActiveEncounterCard()

      expect(store.getGameState()).not.toHaveProperty('activeEncounterCardId')
      expect(output).toEqual(null)
    })
  })

  describe('clearExpeditionState', () => {
    it('should unset the expeditionProgress ', () => {
      const initialProgress = { current: 123, total: 1234 }
      const { store } = createMemoryGameStoreHelper({
        expeditionProgress: initialProgress
      })

      const output = store.clearExpeditionState()

      expect(store.getGameState()).not.toHaveProperty('expeditionProgress')
      expect(output).toEqual(null)
    })
  })

  describe('createExpeditionState', () => {
    it('should set the expedition progress to given data', () => {
      const { store } = createMemoryGameStoreHelper({
        gameMode: BETWEEN_ENCOUNTERS
      })
      const newProgress = { current: 123, total: 1234 }

      const output = store.createExpeditionState(newProgress)

      expect(store.getGameState()).toHaveProperty(
        'expeditionProgress',
        newProgress
      )
      expect(output).toEqual(null)
    })
  })

  describe('incrementExpeditionProgress', () => {
    it('should increment the current expedition progress by the given distance', () => {
      const initialProgress = { current: 123, total: 1234 }
      const { store } = createMemoryGameStoreHelper({
        gameMode: BETWEEN_ENCOUNTERS,
        expeditionProgress: initialProgress
      })
      expect(store.getGameState()).toHaveProperty(
        'expeditionProgress',
        initialProgress
      )

      const output = store.incrementExpeditionProgress(500)

      expect(store.getGameState()).toHaveProperty('expeditionProgress', {
        current: 123 + 500,
        total: 1234
      })
      expect(output).toEqual(null)
    })

    it("should return an error if the expedition progress isn't instantiated", () => {
      const { store } = createMemoryGameStoreHelper()

      const output = store.incrementExpeditionProgress(500)

      expect(output).toEqual({
        method: 'incrementExpeditionProgress',
        error: 'noProgress'
      })
    })
  })
})
