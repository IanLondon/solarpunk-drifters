import { describe, expect, it } from '@jest/globals'
import { type RollResult, isRollResult } from '.'
import {
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  type EncounterResult
} from '@solarpunk-drifters/common'

// NOTE: it's important to explicitly annotate the input types here,
// because these tests mosty guard against the type changing.

describe('isRollResult', () => {
  it('should return true for a RollResult', () => {
    const input: RollResult = {
      skillCheckRoll: { rolls: [1], disadvantage: false },
      outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
    }

    expect(isRollResult(input)).toEqual(true)
  })

  it('should return false for a non-RollResult EncounterResult (no rolls key)', () => {
    const input: EncounterResult = {
      outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
    }

    expect(isRollResult(input)).toEqual(false)
  })

  it('should return false for a non-RollResult EncounterResult (rolls: undefined)', () => {
    const input: EncounterResult = {
      skillCheckRoll: undefined,
      outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
    }

    expect(isRollResult(input)).toEqual(false)
  })
})
