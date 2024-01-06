import type { MarkRequired } from 'ts-essentials'
import type { EncounterResult } from '@solarpunk-drifters/common'

/** Represents a pending EncounterResult
 * (we made a player move and are waiting for the server to give us the result) */
export interface PendingEncounterResult {
  // number of dice that are currently rolling (the server will tell us what the result is later)
  rollingDice?: number
}

export type RollResult = MarkRequired<EncounterResult, 'skillCheckRoll'>
// WARNING: this is a *type predicate*.
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
// If it's not unit-tested, it could easily break and TypeScript would
// then lie about the type. It's especially brittle because the
// EncounterResult type is defined externally, so we would likely forget to check
// this type predicate fn if/when EncounterResult changes.
export function isRollResult(er: EncounterResult): er is RollResult {
  return 'skillCheckRoll' in er && er.skillCheckRoll !== undefined
}
