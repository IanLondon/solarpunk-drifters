import { createSlice } from '@reduxjs/toolkit'
import { encounterUpdate } from '.'
import {
  type RollResult,
  filterClientEventRollResult
} from '@solarpunk-drifters/common'

export type DiceRollState = RollResult | null

const initialState = null as DiceRollState

export const diceRollSlice = createSlice({
  name: 'diceRoll',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(encounterUpdate, (state, action) => {
      if (action.payload.clientEvents !== undefined) {
        const rollResultEvents = filterClientEventRollResult(
          action.payload.clientEvents
        )
        if (rollResultEvents.length === 0) {
          // no client events of interest
          return state
        }
        if (rollResultEvents.length > 1) {
          console.error(
            `NOT IMPLEMENTED: got multiple roll events, expected just one. Roll events: ${JSON.stringify(
              rollResultEvents
            )}`
          )
        }
        return rollResultEvents[0].payload
      }
    })
  },
  selectors: {
    selectDiceRolls: (state) => state
  }
})

export const { selectDiceRolls } = diceRollSlice.selectors

export default diceRollSlice
