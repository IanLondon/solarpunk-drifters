import { describe, expect, it } from '@jest/globals'
import {
  TURNED_BACK,
  gameEventCreators,
  gameEventErrorCreators
} from './gameEvents'
import {
  beginExpedition,
  encounterCardChoice,
  nextEncounter,
  turnBack
} from './expeditionMoves'
import { EXPEDITION_DISTANCE, INITIAL_EXPEDITION_PROGRESS } from './constants'
import { type EncounterCardDeckFn } from './types'
import {
  type CharacterStats,
  type EncounterChoice,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  ENCOUNTER_OUTCOME_STRONG_SUCCESS,
  BETWEEN_ENCOUNTERS,
  ACTIVE_ENCOUNTER,
  LOADOUT
} from '@solarpunk-drifters/common'
import { diceMockerFactory, noDice } from './__fixtures__/diceFnFakes'
import { toInventoryPatch } from '../utils/getInvalidItems'

// TODO LATER import these too
export const NOT_LOADOUT = [BETWEEN_ENCOUNTERS, ACTIVE_ENCOUNTER] as const
export const NOT_BETWEEN_ENCOUNTERS = [LOADOUT, ACTIVE_ENCOUNTER] as const
export const NOT_ACTIVE_ENCOUNTER = [LOADOUT, BETWEEN_ENCOUNTERS] as const

// TODO hook up to mocks
const MOCK_ENCOUNTER_CARD_ID = 'mock-encounter-card-id'

const encounterCardDeckMocker: EncounterCardDeckFn = async () =>
  MOCK_ENCOUNTER_CARD_ID

describe('expedition moves', () => {
  describe('begin expedition', () => {
    it('should begin new expedition and start an active encounter', async () => {
      const output = await beginExpedition(LOADOUT, encounterCardDeckMocker)

      expect(output).toEqual([
        gameEventCreators.drawEncounterCard(MOCK_ENCOUNTER_CARD_ID),
        gameEventCreators.newExpedition({
          current: INITIAL_EXPEDITION_PROGRESS,
          total: EXPEDITION_DISTANCE
        })
      ])
    })

    NOT_LOADOUT.forEach((gameMode) => {
      it(`should give an error when in any mode but loadout (${gameMode})`, async () => {
        const output = await beginExpedition(gameMode, encounterCardDeckMocker)
        expect(output).toEqual(gameEventErrorCreators.moveNotAllowedError())
      })
    })
  })

  describe('next encounter', () => {
    it('should start a new encounter', async () => {
      const output = await nextEncounter(
        BETWEEN_ENCOUNTERS,
        encounterCardDeckMocker
      )

      expect(output).toEqual([
        gameEventCreators.drawEncounterCard(MOCK_ENCOUNTER_CARD_ID)
      ])
    })

    NOT_BETWEEN_ENCOUNTERS.forEach((gameMode) => {
      it(`should give an error when in any mode but "between encounters" (${gameMode})`, async () => {
        const output = await nextEncounter(gameMode, encounterCardDeckMocker)

        expect(output).toEqual(gameEventErrorCreators.moveNotAllowedError())
      })
    })
  })
})

describe('turn back', () => {
  it('should end the expedition', async () => {
    const output = await turnBack(BETWEEN_ENCOUNTERS)

    expect(output).toEqual([gameEventCreators.endExpedition(TURNED_BACK)])
  })

  NOT_BETWEEN_ENCOUNTERS.forEach((gameMode) => {
    it(`should give an error when in any mode but "between encounters" (${gameMode})`, async () => {
      const output = await turnBack(gameMode)
      expect(output).toEqual(gameEventErrorCreators.moveNotAllowedError())
    })
  })
})

describe('encounter card choice', () => {
  it('should return an encounter result for a skill check,', async () => {
    const gameMode = ACTIVE_ENCOUNTER
    const characterStats: CharacterStats = {
      agility: 1,
      harmony: 2,
      diy: 3,
      luck: 1
    }
    const choice: EncounterChoice = {
      description: 'test choice',
      check: {
        skill: 'harmony'
      }
    }

    const rolls = [3, 4] // harmony, with 2 points, should roll 2 dice

    const dice = diceMockerFactory(rolls)

    const output = await encounterCardChoice({
      gameMode,
      characterStats,
      choice,
      dice,
      inventory: {}
    })

    expect(output).toEqual([
      gameEventCreators.encounterResult({
        skillCheckRoll: { rolls, disadvantage: false },
        outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
      })
    ])
  })

  it('should return an encounter result for a valid item check,', async () => {
    const gameMode = ACTIVE_ENCOUNTER
    const characterStats: CharacterStats = {
      agility: 1,
      harmony: 2,
      diy: 3,
      luck: 1
    }
    const choice: EncounterChoice = {
      description: 'test choice',
      check: {
        items: {
          rations: 2,
          testItem: 42
        }
      }
    }

    const dice = noDice

    const output = await encounterCardChoice({
      gameMode,
      characterStats,
      choice,
      dice,
      inventory: {
        rations: 3,
        testItem: 42
      }
    })

    expect(output).toEqual([
      gameEventCreators.addSubtractInventoryItems(
        toInventoryPatch({ rations: -2, testItem: -42 })
      ),
      gameEventCreators.encounterResult({
        outcome: ENCOUNTER_OUTCOME_STRONG_SUCCESS
      })
    ])
  })

  it('should return an encounter result for an invalid item check,', async () => {
    const gameMode = ACTIVE_ENCOUNTER
    const characterStats: CharacterStats = {
      agility: 1,
      harmony: 2,
      diy: 3,
      luck: 1
    }
    const choice: EncounterChoice = {
      description: 'test choice',
      check: {
        items: {
          // it takes 3 rations
          rations: 3
        }
      }
    }

    const dice = noDice

    const output = await encounterCardChoice({
      gameMode,
      characterStats,
      choice,
      dice,
      inventory: {
        // oh no we only have 2 but need 3
        rations: 2
      }
    })

    expect(output).toEqual(
      gameEventErrorCreators.notEnoughConsumablesError({
        items: ['rations'],
        resources: []
      })
    )
  })

  it('should give an error when in any mode but "active encounter"', async () => {
    const output = await encounterCardChoice({
      gameMode: LOADOUT,
      characterStats: {} as any,
      choice: {} as any,
      dice: noDice,
      inventory: {}
    })

    expect(output).toEqual(gameEventErrorCreators.moveNotAllowedError())
  })
})

describe('play drifter card', () => {
  it('should play the selected drifter card when "between encounters"', () => {
    // TODO
    // NOTE: this will probably call a few fns (prob faked here, passed in as args)
  })
  it('should give an error when in any mode but "between encounters"', () => {
    // TODO
  })
})
