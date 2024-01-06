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
} from '@solarpunk-drifters/common'
import type { GameStore } from './types'
import { toInventoryPatch } from '../utils/getInvalidItems'

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
      it('should increment the quantity of the given item', async () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { fooItem: 3 }
        })

        const output = await store.addSubtractInventoryItems(
          toInventoryPatch({ fooItem: 2 })
        )
        const gameState = await store.getGameState()

        expect(gameState.inventory).toEqual({ fooItem: 3 + 2 })
        expect(output).toBe(null)
      })

      it("should create a new entry for an item that didn't exist", async () => {
        const { store } = createMemoryGameStoreHelper()

        const output = await store.addSubtractInventoryItems(
          toInventoryPatch({ fooItem: 2 })
        )

        expect(await store.getGameState()).toHaveProperty(
          'inventory.fooItem',
          2
        )
        expect(output).toBe(null)
      })
    })

    describe('subtraction', () => {
      it('should remove an item if there is more than enough', async () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { fooItem: 3 }
        })

        const output = await store.addSubtractInventoryItems(
          toInventoryPatch({ fooItem: -2 })
        )

        expect(await store.getGameState()).toHaveProperty(
          'inventory.fooItem',
          3 - 2
        )
        expect(output).toBe(null)
      })
      it("should set an item's quantity to zero if there is exactly enough", async () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { fooItem: 3 }
        })

        const output = await store.addSubtractInventoryItems(
          toInventoryPatch({ fooItem: -3 })
        )

        expect(await store.getGameState()).toHaveProperty(
          'inventory.fooItem',
          0
        )
        expect(output).toBe(null)
      })
      it('should return an error if there is not enough', async () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { fooItem: 2 }
        })

        const output = await store.addSubtractInventoryItems(
          toInventoryPatch({ fooItem: -3 })
        )

        expect(await store.getGameState()).toHaveProperty(
          'inventory.fooItem',
          2
        )
        expect(output).toEqual({
          method: 'addSubtractInventoryItems',
          error: 'insufficientQuantity'
        })
      })
    })

    describe('both addition and subtraction in the patch', () => {
      it('should do both addition and subtraction', async () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { rations: 4, fooItem: 3 }
        })

        const output = await store.addSubtractInventoryItems(
          toInventoryPatch({
            rations: -1,
            fooItem: 2
          })
        )
        const gameState = await store.getGameState()

        expect(gameState).toHaveProperty('inventory.rations', 4 - 1)
        expect(gameState).toHaveProperty('inventory.fooItem', 3 + 2)
        expect(output).toBe(null)
      })

      it('should not do any addition operations if any subtractions would fail', async () => {
        const { store } = createMemoryGameStoreHelper({
          inventory: { rations: 4, fooItem: 3 }
        })

        const output = await store.addSubtractInventoryItems(
          toInventoryPatch({
            rations: -100,
            fooItem: 2
          })
        )
        const gameState = await store.getGameState()

        // unchanged
        expect(gameState).toHaveProperty('inventory.rations', 4)
        expect(gameState).toHaveProperty('inventory.fooItem', 3)
        expect(output).toEqual({
          method: 'addSubtractInventoryItems',
          error: 'insufficientQuantity'
        })
      })
    })
  })

  describe('setGameMode', () => {
    it('should set the gameMode', async () => {
      const { store } = createMemoryGameStoreHelper({
        gameMode: LOADOUT,
        // These fields can't be null if we're going to ACTIVE_ENCOUNTER:
        activeEncounterCardId: 'some-card-id',
        expeditionProgress: { current: 123, total: 1234 }
      })

      const output = await store.setGameMode(ACTIVE_ENCOUNTER)
      const gameState = await store.getGameState()

      expect(gameState.gameMode).toEqual(ACTIVE_ENCOUNTER)
      expect(output).toEqual(null)
    })
  })

  describe('setActiveEncounterCard', () => {
    it('should set the active encounter card to the given cardId', async () => {
      const cardId = 'some-test-card-id-8293'
      // set game mode for GameState type consistency
      const { store } = createMemoryGameStoreHelper({
        gameMode: ACTIVE_ENCOUNTER,
        expeditionProgress: { current: 123, total: 1234 }
      })

      const output = await store.setActiveEncounterCard(cardId)

      expect(await store.getGameState()).toHaveProperty(
        'activeEncounterCardId',
        cardId
      )
      expect(output).toEqual(null)
    })
  })

  describe('clearActiveEncounterCard', () => {
    it('should unset the active encounter card key', async () => {
      const cardId = 'some-card-id-987'
      const { store } = createMemoryGameStoreHelper({
        gameMode: LOADOUT,
        activeEncounterCardId: cardId
      })

      const output = await store.clearActiveEncounterCard()

      expect(await store.getGameState()).not.toHaveProperty(
        'activeEncounterCardId'
      )
      expect(output).toEqual(null)
    })
  })

  describe('clearExpeditionState', () => {
    it('should unset the expeditionProgress ', async () => {
      const initialProgress = { current: 123, total: 1234 }
      const { store } = createMemoryGameStoreHelper({
        expeditionProgress: initialProgress
      })

      const output = await store.clearExpeditionState()

      expect(await store.getGameState()).not.toHaveProperty(
        'expeditionProgress'
      )
      expect(output).toEqual(null)
    })
  })

  describe('createExpeditionState', () => {
    it('should set the expedition progress to given data', async () => {
      const { store } = createMemoryGameStoreHelper({
        gameMode: BETWEEN_ENCOUNTERS
      })
      const newProgress = { current: 123, total: 1234 }

      const output = await store.createExpeditionState(newProgress)

      expect(await store.getGameState()).toHaveProperty(
        'expeditionProgress',
        newProgress
      )
      expect(output).toEqual(null)
    })
  })

  describe('incrementExpeditionProgress', () => {
    it('should increment the current expedition progress by the given distance', async () => {
      const initialProgress = { current: 123, total: 1234 }
      const { store } = createMemoryGameStoreHelper({
        gameMode: BETWEEN_ENCOUNTERS,
        expeditionProgress: initialProgress
      })
      expect(await store.getGameState()).toHaveProperty(
        'expeditionProgress',
        initialProgress
      )

      const output = await store.incrementExpeditionProgress(500)

      expect(await store.getGameState()).toHaveProperty('expeditionProgress', {
        current: 123 + 500,
        total: 1234
      })
      expect(output).toEqual(null)
    })

    it("should return an error if the expedition progress isn't instantiated", async () => {
      const { store } = createMemoryGameStoreHelper()

      const output = await store.incrementExpeditionProgress(500)

      expect(output).toEqual({
        method: 'incrementExpeditionProgress',
        error: 'noProgress'
      })
    })
  })
})
