import { describe, expect, it } from '@jest/globals'
import {
  skillCheckRollToEncounterOutcome,
  skillCheckRoller
} from './encounterCardChecks'
import {
  ENCOUNTER_OUTCOME_FAILURE,
  type CharacterStats,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  ENCOUNTER_OUTCOME_STRONG_SUCCESS
} from '@solarpunk-drifters/common'
import { diceMockerFactory, noDice } from './__fixtures__/diceFnFakes'

describe('skillCheckRoller', () => {
  describe('it should make a roll using a number of dice matching the skill points', () => {
    const getResult = (
      skillValue: number,
      rolls: number[]
    ): ReturnType<typeof skillCheckRoller> => {
      // just use agility for all checks in this set of tests, and change its value
      const skill = 'agility'
      const characterStats: CharacterStats = {
        agility: skillValue,
        harmony: 99,
        diy: 99,
        luck: 99
      }

      const dice = diceMockerFactory(rolls)

      return skillCheckRoller({
        characterStats,
        dice,
        skill
      })
    }
    it('should not roll at disadvantage when skill is >= 1 (case: skill = 1)', () => {
      const rolls = [4]
      const result = getResult(1, rolls)

      expect(result).toEqual({ rolls, disadvantage: false })
    })

    it('should not roll at disadvantage when skill is >= 1 (case: skill = 2)', () => {
      const rolls = [4, 1]
      const result = getResult(2, rolls)

      expect(result).toEqual({ rolls, disadvantage: false })
    })

    it('should roll at disadvantage when skill is 0', () => {
      const rolls = [4, 1]
      const result = getResult(0, rolls)

      expect(result).toEqual({ rolls, disadvantage: true })
    })

    it('should throw an error when skill is negative', () => {
      expect(() =>
        skillCheckRoller({
          characterStats: { agility: -1, diy: 1, luck: 1, harmony: 1 },
          dice: noDice,
          skill: 'agility'
        })
      ).toThrow(/negative/)
    })
  })
})

describe('skillCheckRollToEncounterOutcome', () => {
  describe('no disadvantage', () => {
    it.each([
      { rolls: [1], expected: ENCOUNTER_OUTCOME_FAILURE },
      { rolls: [2], expected: ENCOUNTER_OUTCOME_FAILURE },
      { rolls: [3], expected: ENCOUNTER_OUTCOME_MIXED_SUCCESS },
      { rolls: [4], expected: ENCOUNTER_OUTCOME_MIXED_SUCCESS },
      { rolls: [5], expected: ENCOUNTER_OUTCOME_STRONG_SUCCESS },
      { rolls: [6], expected: ENCOUNTER_OUTCOME_STRONG_SUCCESS },
      { rolls: [1, 6], expected: ENCOUNTER_OUTCOME_STRONG_SUCCESS },
      { rolls: [2, 4], expected: ENCOUNTER_OUTCOME_MIXED_SUCCESS }
    ])(
      'should return a $expected outcome if the roll is $rolls',
      ({ rolls, expected }) => {
        const outcome = skillCheckRollToEncounterOutcome({
          rolls,
          disadvantage: false
        })
        expect(outcome).toEqual(expected)
      }
    )
  })

  describe('with disadvantage', () => {
    it.each([
      { rolls: [1, 6], expected: ENCOUNTER_OUTCOME_FAILURE },
      { rolls: [2, 6], expected: ENCOUNTER_OUTCOME_FAILURE },
      { rolls: [3, 6], expected: ENCOUNTER_OUTCOME_MIXED_SUCCESS },
      { rolls: [4, 6], expected: ENCOUNTER_OUTCOME_MIXED_SUCCESS },
      { rolls: [5, 6], expected: ENCOUNTER_OUTCOME_STRONG_SUCCESS },
      { rolls: [6, 6], expected: ENCOUNTER_OUTCOME_STRONG_SUCCESS },
      { rolls: [1, 1], expected: ENCOUNTER_OUTCOME_FAILURE },
      { rolls: [1, 4], expected: ENCOUNTER_OUTCOME_FAILURE }
    ])(
      'should return a $expected outcome if the roll is $rolls',
      ({ rolls, expected }) => {
        const outcome = skillCheckRollToEncounterOutcome({
          rolls,
          disadvantage: true
        })
        expect(outcome).toEqual(expected)
      }
    )
  })

  it('should throw an error if it gets zero rolls', () => {
    expect(() =>
      skillCheckRollToEncounterOutcome({ rolls: [], disadvantage: true })
    ).toThrow(/zero rolls/)
    expect(() =>
      skillCheckRollToEncounterOutcome({ rolls: [], disadvantage: false })
    ).toThrow(/zero rolls/)
  })

  it.each([{ disadvantage: true }, { disadvantage: false }])(
    'should throw an error if it gets an out-of-bound roll (disadvantage: $disadvantage)',
    ({ disadvantage }) => {
      expect(() =>
        skillCheckRollToEncounterOutcome({ rolls: [-1], disadvantage })
      ).toThrow(/roll value/)

      expect(() =>
        skillCheckRollToEncounterOutcome({ rolls: [7], disadvantage })
      ).toThrow(/roll value/)
    }
  )
})
