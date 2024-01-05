/** Gets an encounter card ID. (Later, it will take args to have selection logic) */
export type EncounterCardDeckFn = () => Promise<string>

/** Rolls Nd6 dice */
export type DiceFn = (n: number) => number[]
