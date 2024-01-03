import { describe, expect, it } from '@jest/globals'
import {
  type InMemoryDb,
  type InMemoryGameStoreForUser,
  createInMemoryGameStoreForUser,
  createInitialStoreState
} from './inMemoryStore'
import { type DiffableGameStore } from './types'
import { ACTIVE_ENCOUNTER, LOADOUT } from '../controllers/gameState'

const uid = 'some-user-id-123' as const

/**
 * Test helper to construct the in memory DiffableGameStore
 * @param storeState Partial state that is shallowly spread over the default
 *   `createInitialStoreState()` output
 */
function createMemoryGameStoreHelper(
  storeState?: Partial<InMemoryGameStoreForUser>
): {
  inMemoryDb: InMemoryDb
  store: DiffableGameStore
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
    const userStore: any = 'foo'
    const inMemoryDb: InMemoryDb = { [uid]: userStore }
    createInMemoryGameStoreForUser(uid, inMemoryDb)

    expect(inMemoryDb).toHaveProperty(uid)
    expect(inMemoryDb[uid]).toEqual(userStore)
  })

  describe('addInventoryItem', () => {
    it('should increment the quantity of the given item', () => {
      const { store } = createMemoryGameStoreHelper({
        inventory: { fooItem: 3 }
      })

      const output = store.addInventoryItem('fooItem', 2)

      expect(store.getGameState().inventory).toEqual({ fooItem: 3 + 2 })
      expect(output).toBe(null)
    })

    it("should create a new entry for an item that didn't exist", () => {
      const { store } = createMemoryGameStoreHelper()

      const output = store.addInventoryItem('fooItem', 2)

      expect(store.getGameState()).toHaveProperty('inventory.fooItem', 2)
      expect(output).toBe(null)
    })
  })

  describe('removeInventoryItem', () => {
    it('should remove an item if there is more than enough', () => {
      const { store } = createMemoryGameStoreHelper({
        inventory: { fooItem: 3 }
      })

      const output = store.removeInventoryItem('fooItem', 2)

      expect(store.getGameState()).toHaveProperty('inventory.fooItem', 3 - 2)
      expect(output).toBe(null)
    })
    it("should set an item's quantity to zero if there is exactly enough", () => {
      const { store } = createMemoryGameStoreHelper({
        inventory: { fooItem: 3 }
      })

      const output = store.removeInventoryItem('fooItem', 3)

      expect(store.getGameState()).toHaveProperty('inventory.fooItem', 0)
      expect(output).toBe(null)
    })
    it('should return an error if there is not enough', () => {
      const { store } = createMemoryGameStoreHelper({
        inventory: { fooItem: 2 }
      })

      const output = store.removeInventoryItem('fooItem', 3)

      expect(output).toEqual({
        method: 'removeInventoryItem',
        error: 'insufficientQuantity'
      })
    })
  })

  describe('setGameMode', () => {
    it('should set the gameMode', () => {
      const { store } = createMemoryGameStoreHelper()
      // just ensure the initial isn't the same as our expected
      expect(store.getGameState().gameMode).toEqual(LOADOUT)

      const output = store.setGameMode(ACTIVE_ENCOUNTER)

      expect(store.getGameState().gameMode).toEqual(ACTIVE_ENCOUNTER)
      expect(output).toEqual(null)
    })
  })

  describe('setActiveEncounterCard', () => {
    it('should set the active encounter card to the given cardId', () => {
      const cardId = 'some-test-card-id-8293'
      // set game mode just for data consistency
      const { store } = createMemoryGameStoreHelper({
        gameMode: ACTIVE_ENCOUNTER
      })

      const output = store.setActiveEncounterCard(cardId)

      expect(store.getGameState()).toHaveProperty('activeEncounterCard', cardId)
      expect(output).toEqual(null)
    })
  })

  describe('clearActiveEncounterCard', () => {
    it('should set the active encounter card to null', () => {
      const cardId = 'some-card-id-987'
      const { store } = createMemoryGameStoreHelper({
        activeEncounterCard: cardId
      })
      expect(store.getGameState()).toHaveProperty('activeEncounterCard', cardId)

      const output = store.clearActiveEncounterCard()

      expect(store.getGameState()).toHaveProperty('activeEncounterCard', null)
      expect(output).toEqual(null)
    })
  })

  describe('clearExpeditionState', () => {
    it('should set the expedition progress to null', () => {
      const initialProgress = { current: 123, total: 1234 }
      const { store } = createMemoryGameStoreHelper({
        progress: initialProgress
      })
      expect(store.getGameState()).toHaveProperty('progress', initialProgress)

      const output = store.clearExpeditionState()

      expect(store.getGameState()).toHaveProperty('progress', null)
      expect(output).toEqual(null)
    })
  })

  describe('createExpeditionState', () => {
    it('should set the expedition progress to given data', () => {
      const { store } = createMemoryGameStoreHelper()
      const newProgress = { current: 123, total: 1234 }

      const output = store.createExpeditionState(newProgress)

      expect(store.getGameState()).toHaveProperty('progress', newProgress)
      expect(output).toEqual(null)
    })
  })

  describe('incrementExpeditionProgress', () => {
    it('should increment the current expedition progress by given distance', () => {
      const initialProgress = { current: 123, total: 1234 }
      const { store } = createMemoryGameStoreHelper({
        progress: initialProgress
      })
      expect(store.getGameState()).toHaveProperty('progress', initialProgress)

      const output = store.incrementExpeditionProgress(500)

      expect(store.getGameState()).toHaveProperty('progress', {
        current: 123 + 500,
        total: 1234
      })
      expect(output).toEqual(null)
    })

    it('should return an error if the expedition progress isn\t instantiated', () => {
      const { store } = createMemoryGameStoreHelper()

      const output = store.incrementExpeditionProgress(500)

      expect(output).toEqual({
        method: 'incrementExpeditionProgress',
        error: 'noProgress'
      })
    })
  })

  describe('getGameStateDiff', () => {
    it('should return the diff after changes have been made', () => {
      const { store } = createMemoryGameStoreHelper()
      const cardId = 'some-card-id-387'

      store.addInventoryItem('fooItem', 3)
      store.setActiveEncounterCard(cardId)

      const diff = store.getGameStateDiff()

      expect(diff).toEqual(
        expect.arrayContaining([
          { op: 'replace', path: '/activeEncounterCard', value: cardId },
          { op: 'add', path: '/inventory/fooItem', value: 3 }
        ])
      )
      expect(diff).toHaveLength(2)
    })
  })

  describe('clearGameStateDiff', () => {
    it('should clear the diff after changes have been made', () => {
      const { store } = createMemoryGameStoreHelper()
      const cardId = 'some-card-id-387'

      // same setup as getGameStateDiff test above
      store.addInventoryItem('fooItem', 3)
      store.setActiveEncounterCard(cardId)

      expect(store.getGameStateDiff()).toHaveLength(2)

      // test for repeated querying, should be the same
      expect(store.getGameStateDiff()).toHaveLength(2)

      // now reset it
      store.clearGameStateDiff()

      expect(store.getGameStateDiff()).toHaveLength(0)
    })
  })
})
