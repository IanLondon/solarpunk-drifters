// NOTE: disable this rule so we can any-type the fake `store`
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, jest } from '@jest/globals'
import persistGameEventEffects from './persistGameEventEffects'
import * as events from '../../gameLogicLayer/events'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '../../controllers/gameState'
import { type ExpeditionProgress } from '@solarpunk-drifters/openapi'
import { type StoreError } from '../types'

// In these tests, we construct a fake store containing only the methods we
// expect to be called.
//
// If we made a full mock store, we'd have to do extra assertions to check
// that only those methods were called and no other methods were.

describe('persistGameEventEffects', () => {
  describe('AddItemToInventoryEvent', () => {
    it('should add item to inventory', () => {
      const store = { addInventoryItem: jest.fn(() => null) }

      const item = 'rations'
      const quantity = 3
      const e = events.addItemToInventory(item, quantity)

      const out = persistGameEventEffects(store as any, e)

      expect(store.addInventoryItem.mock.calls).toEqual([[item, quantity]])
      expect(out).toEqual([])
    })
  })

  describe('error handling', () => {
    it('should return StoreError[] if there are errors (only testing addItemToInventory)', () => {
      const testStoreError: StoreError = {
        method: 'addInventoryItem',
        error: 'some mock error'
      }
      const store = {
        addInventoryItem: jest.fn(() => testStoreError)
      }

      const item = 'rations'
      const quantity = 3
      const e = events.addItemToInventory(item, quantity)

      const out = persistGameEventEffects(store as any, e)

      expect(out).toEqual([testStoreError])
    })
  })

  describe('NewExpeditionEvent', () => {
    it('should create a new expedition state', () => {
      const store = {
        createExpeditionState: jest.fn(() => null)
      }

      const expeditionDistances: ExpeditionProgress = {
        current: 11,
        total: 1234
      }

      const e = events.newExpedition(expeditionDistances)
      const out = persistGameEventEffects(store as any, e)

      expect(store.createExpeditionState.mock.calls).toEqual([
        [expeditionDistances]
      ])
      expect(out).toEqual([])
    })
  })
  describe('DrawEncounterCardEvent', () => {
    it('should set the active encounter card and set game mode to ACTIVE_ENCOUNTER', () => {
      const store = {
        setActiveEncounterCard: jest.fn(() => null),
        setGameMode: jest.fn(() => null)
      }
      const cardId = '123-fake-card-id'
      const e = events.drawEncounterCard(cardId)
      const out = persistGameEventEffects(store as any, e)

      expect(store.setActiveEncounterCard.mock.calls).toEqual([[cardId]])
      expect(store.setGameMode.mock.calls).toEqual([[ACTIVE_ENCOUNTER]])
      expect(out).toEqual([])
    })
  })
  describe('AdvanceExpeditionProgressEvent', () => {
    it('should increment the given expedition progress distance', () => {
      const store = {
        incrementExpeditionProgress: jest.fn(() => null)
      }
      const increment = 5
      const e = events.advanceExpeditionProgress(increment)
      const out = persistGameEventEffects(store as any, e)

      expect(store.incrementExpeditionProgress.mock.calls).toEqual([
        [increment]
      ])
      expect(out).toEqual([])
    })
  })
  describe('CompleteActiveEncounterEvent', () => {
    it('should clear the active encounter card and set game mode to BETWEEN_ENCOUNTERS', () => {
      const store = {
        setGameMode: jest.fn(() => null),
        clearActiveEncounterCard: jest.fn(() => null)
      }
      const e = events.completeActiveEncounter()
      const out = persistGameEventEffects(store as any, e)

      expect(store.clearActiveEncounterCard).toBeCalledTimes(1)
      expect(store.setGameMode.mock.calls).toEqual([[BETWEEN_ENCOUNTERS]])
      expect(out).toEqual([])
    })
  })
  describe('EndExpeditionEvent', () => {
    const outcomes = [
      events.REACHED_DESTINATION,
      events.OUT_OF_RATIONS,
      events.TURNED_BACK
    ] as const
    outcomes.forEach((outcome) => {
      describe(`Outcome: ${outcome}`, () => {
        it('should clear the expedition state and set the game mode to LOADOUT', () => {
          const store = {
            setGameMode: jest.fn(() => null),
            clearExpeditionState: jest.fn(() => null)
          }
          const e = events.endExpedition(outcome)
          const out = persistGameEventEffects(store as any, e)

          expect(store.setGameMode.mock.calls).toEqual([[LOADOUT]])
          expect(store.clearExpeditionState).toBeCalledTimes(1)
          expect(out).toEqual([])
        })
      })
    })
  })
  describe('DiceRollOutcomeEvent', () => {
    it('should do nothing (dice rolls are not persisted)', () => {
      const store = {}
      const rolls = [3]
      const outcome = events.ROLL_OUTCOME_MIXED_SUCCESS
      const e = events.diceRollOutcome(rolls, outcome)
      const out = persistGameEventEffects(store as any, e)
      expect(out).toEqual([])
    })
  })
})
