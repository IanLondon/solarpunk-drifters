// NOTE: disable this rule so we can any-type the fake `store`
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, jest } from '@jest/globals'
import persistGameEventEffects from './persistGameEventEffects'
import {
  OUT_OF_RATIONS,
  REACHED_DESTINATION,
  TURNED_BACK,
  gameEventCreators
} from '../../gameLogicLayer/gameEvents'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  type ExpeditionProgress
} from '@solarpunk-drifters/common'
import { type StoreError } from '../types'
import { toInventoryPatch } from '../../utils/getInvalidItems'

// In these tests, we construct a fake store containing only the methods we
// expect to be called.
//
// If we made a full mock store, we'd have to do extra assertions to check
// that only those methods were called and no other methods were.

describe('persistGameEventEffects', () => {
  describe('AddDrifterCards', () => {
    it('should add drifter cards to drifterCardInventory', async () => {
      const store = { addSubtractDrifterCards: jest.fn(() => null) }
      const e = gameEventCreators.addDrifterCards([
        'some-card-id',
        'other-card-id'
      ])
      const expectedDrifterCardPatch = toInventoryPatch({
        'some-card-id': 1,
        'other-card-id': 1
      })

      const out = await persistGameEventEffects(store as any, e)

      expect(store.addSubtractDrifterCards.mock.calls).toEqual([
        [expectedDrifterCardPatch]
      ])
      expect(out).toEqual([])
    })
  })

  describe('AddSubstractInventoryItems', () => {
    it('should add item to inventory', async () => {
      const store = { addSubtractInventoryItems: jest.fn(() => null) }
      const itemPatch = toInventoryPatch({ rations: 3, testItem: -5 })
      const e = gameEventCreators.addSubtractInventoryItems(itemPatch)

      const out = await persistGameEventEffects(store as any, e)

      expect(store.addSubtractInventoryItems.mock.calls).toEqual([[itemPatch]])
      expect(out).toEqual([])
    })
  })

  describe('error handling', () => {
    it('should return StoreError[] if there are errors (only testing addSubtractInventoryItems)', async () => {
      const testStoreError: StoreError = {
        method: 'addSubtractInventoryItems',
        error: 'some mock error'
      }
      const store = {
        addSubtractInventoryItems: jest.fn(() => testStoreError)
      }
      const itemPatch = toInventoryPatch({ rations: 3 })
      const e = gameEventCreators.addSubtractInventoryItems(itemPatch)

      const out = await persistGameEventEffects(store as any, e)

      expect(out).toEqual([testStoreError])
    })
  })

  describe('NewExpeditionEvent', () => {
    it('should create a new expedition state', async () => {
      const store = {
        createExpeditionState: jest.fn(() => null)
      }
      const expeditionDistances: ExpeditionProgress = {
        current: 11,
        total: 1234
      }

      const e = gameEventCreators.newExpedition(expeditionDistances)
      const out = await persistGameEventEffects(store as any, e)

      expect(store.createExpeditionState.mock.calls).toEqual([
        [expeditionDistances]
      ])
      expect(out).toEqual([])
    })
  })

  describe('DrawEncounterCardEvent', () => {
    it('should set the active encounter card and set game mode to ACTIVE_ENCOUNTER', async () => {
      const store = {
        setActiveEncounterCard: jest.fn(() => null),
        setGameMode: jest.fn(() => null)
      }
      const cardId = '123-fake-card-id'
      const e = gameEventCreators.drawEncounterCard(cardId)
      const out = await persistGameEventEffects(store as any, e)

      expect(store.setActiveEncounterCard.mock.calls).toEqual([[cardId]])
      expect(store.setGameMode.mock.calls).toEqual([[ACTIVE_ENCOUNTER]])
      expect(out).toEqual([])
    })
  })

  describe('AdvanceExpeditionProgressEvent', () => {
    it('should increment the given expedition progress distance', async () => {
      const store = {
        incrementExpeditionProgress: jest.fn(() => null)
      }
      const increment = 5
      const e = gameEventCreators.advanceExpeditionProgress(increment)
      const out = await persistGameEventEffects(store as any, e)

      expect(store.incrementExpeditionProgress.mock.calls).toEqual([
        [increment]
      ])
      expect(out).toEqual([])
    })
  })

  describe('EndExpeditionEvent', () => {
    const outcomes = [REACHED_DESTINATION, OUT_OF_RATIONS, TURNED_BACK] as const
    outcomes.forEach((outcome) => {
      describe(`Outcome: ${outcome}`, () => {
        it('should clear the expedition state and set the game mode to LOADOUT', async () => {
          const store = {
            setGameMode: jest.fn(() => null),
            clearExpeditionState: jest.fn(() => null)
          }
          const e = gameEventCreators.endExpedition(outcome)

          const out = await persistGameEventEffects(store as any, e)

          expect(store.setGameMode.mock.calls).toEqual([[LOADOUT]])
          expect(store.clearExpeditionState).toBeCalledTimes(1)
          expect(out).toEqual([])
        })
      })
    })
  })

  describe('EncounterResultEvent', () => {
    it('should clear the active encounter card and set game mode to BETWEEN_ENCOUNTERS', async () => {
      const store = {
        setGameMode: jest.fn(() => null),
        clearActiveEncounterCard: jest.fn(() => null)
      }
      const e = gameEventCreators.encounterResult({
        outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
      })

      const out = await persistGameEventEffects(store as any, e)

      expect(store.clearActiveEncounterCard).toBeCalledTimes(1)
      expect(store.setGameMode.mock.calls).toEqual([[BETWEEN_ENCOUNTERS]])
      expect(out).toEqual([])
    })
  })
})
