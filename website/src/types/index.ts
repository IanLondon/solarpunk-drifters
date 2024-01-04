export * from './gameState'

/** Represents a number of dice that are currently rolling and "indeterminate".
 * (We are waiting for the RollResult) */
export interface Rolling {
  rollingDice: number
}
