/** Represents a pending EncounterResult
 * (we made a player move and are waiting for the server to give us the result) */
export interface PendingEncounterResult {
  // number of dice that are currently rolling (the server will tell us what the result is later)
  rollingDice?: number
}
