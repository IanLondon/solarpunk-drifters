// NOTE: disable this rule so we can any-type the fake `store`
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, jest } from '@jest/globals'
import persistGameEventEffects from './persistGameEventEffects'
import * as events from '../../gameLogicLayer/events'
import {
  BETWEEN_ENCOUNTERS,
  type ExpeditionProgress,
  LOADOUT
} from '../../controllers/gameState'

// In these tests, we construct a fake store containing only the methods we
// expect to be called.
//
// If we made a full mock store, we'd have to do extra assertions to check
// that only those methods were called and no other methods were.

describe('persistGameEventEffects', () => {
  describe('AddItemToInventoryEvent', () => {
    it('should add item to inventory', () => {
      const store = { addInventoryItem: jest.fn() }

      const item = 'rations'
      const quantity = 3
      const e = events.addItemToInventory(item, quantity)

      persistGameEventEffects(store as any, e)

      expect(store.addInventoryItem.mock.calls).toEqual([[item, quantity]])
    })
  })
  describe('NewExpeditionEvent', () => {
    it('should create a new expedition state', () => {
      const store = { createExpeditionState: jest.fn() }

      const expeditionDistances: ExpeditionProgress = {
        current: 11,
        total: 1234
      }

      const e = events.newExpedition(expeditionDistances)
      persistGameEventEffects(store as any, e)

      expect(store.createExpeditionState.mock.calls).toEqual([
        [expeditionDistances]
      ])
    })
  })
  describe('DrawEncounterCardEvent', () => {
    it('should set the active encounter card', () => {
      const store = { setActiveEncounterCard: jest.fn() }
      const cardId = '123-fake-card-id'
      const e = events.drawEncounterCard(cardId)
      persistGameEventEffects(store as any, e)

      expect(store.setActiveEncounterCard.mock.calls).toEqual([[cardId]])
    })
  })
  describe('AdvanceExpeditionProgressEvent', () => {
    it('should increment the given expedition progress distance', () => {
      const store = {
        incrementExpeditionProgress: jest.fn()
      }
      const increment = 5
      const e = events.advanceExpeditionProgress(increment)
      persistGameEventEffects(store as any, e)

      expect(store.incrementExpeditionProgress.mock.calls).toEqual([
        [increment]
      ])
    })
  })
  describe('CompleteActiveEncounterEvent', () => {
    it('should clear the active encounter card and set game mode to BETWEEN_ENCOUNTERS', () => {
      const store = {
        setGameMode: jest.fn(),
        clearActiveEncounterCard: jest.fn()
      }
      const e = events.completeActiveEncounter()
      persistGameEventEffects(store as any, e)

      expect(store.clearActiveEncounterCard).toBeCalledTimes(1)
      expect(store.setGameMode.mock.calls).toEqual([[BETWEEN_ENCOUNTERS]])
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
            setGameMode: jest.fn(),
            clearExpeditionState: jest.fn()
          }
          const e = events.endExpedition(outcome)
          persistGameEventEffects(store as any, e)

          expect(store.setGameMode.mock.calls).toEqual([[LOADOUT]])
          expect(store.clearExpeditionState).toBeCalledTimes(1)
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
      persistGameEventEffects(store as any, e)
    })
  })
})
