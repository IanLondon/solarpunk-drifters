import {
  type CharacterStats,
  type EncounterOutcome,
  type Skill,
  type SkillCheckRoll,
  ENCOUNTER_OUTCOME_FAILURE,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  ENCOUNTER_OUTCOME_STRONG_SUCCESS
} from '@solarpunk-drifters/common'
import type { DiceFn } from './types'

/** Returns results of a dice roll and whether it's at "disadvantage" */
export function skillCheckRoller(args: {
  characterStats: CharacterStats
  dice: DiceFn
  skill: Skill
}): SkillCheckRoll {
  const { characterStats, dice, skill } = args

  const skillPoints = characterStats[skill]
  if (skillPoints < 0) {
    throw new Error('skillCheckRoller got skill points with negative value')
  }

  const disadvantage = skillPoints === 0

  if (disadvantage) {
    const rolls = dice(2)
    return {
      rolls,
      disadvantage
    }
  } else {
    const rolls = dice(skillPoints)
    return { rolls, disadvantage }
  }
}

export function skillCheckRollToEncounterOutcome(
  skillCheckRoll: SkillCheckRoll
): EncounterOutcome {
  const { rolls, disadvantage } = skillCheckRoll
  if (rolls.length === 0) {
    throw new Error(
      'skillCheckRollToEncounterOutcome got zero rolls, cannot derive outcome'
    )
  }

  // Only one roll is important, the "key roll"
  let keyRoll: number
  if (disadvantage) {
    keyRoll = Math.min(...rolls)
  } else {
    keyRoll = Math.max(...rolls)
  }

  if (keyRoll === 1 || keyRoll === 2) {
    return ENCOUNTER_OUTCOME_FAILURE
  } else if (keyRoll === 3 || keyRoll === 4) {
    return ENCOUNTER_OUTCOME_MIXED_SUCCESS
  } else if (keyRoll === 5 || keyRoll === 6) {
    return ENCOUNTER_OUTCOME_STRONG_SUCCESS
  } else {
    throw new Error(`unexpected roll value (should be 1 to 6): ${keyRoll}`)
  }
}
