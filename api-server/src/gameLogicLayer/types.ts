/** Gets an encounter card ID. (Later, it will take args to have selection logic) */
export type EncounterCardDeckFn = () => Promise<string>

/** Rolls Nd6 dice */
export type DiceFn = (n: number) => number[]

// TODO IMMEDIATELY: this should be a type in OpenAPI, bc the client needs to know
// about disadvantage...
export interface SkillCheckRoll {
  rolls: number[]
  disadvantage: boolean
}
