import { createSlice } from '@reduxjs/toolkit'
import { encounterUpdate } from '.'
import { type RollResult } from '..'

export type DiceRollState = RollResult | null

const initialState = null as DiceRollState

export const diceRollSlice = createSlice({
  name: 'diceRoll',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(encounterUpdate, (state, action) => {
      if (action.payload.rollResult !== undefined) {
        return action.payload.rollResult
      }
    })
  },
  selectors: {
    selectDiceRolls: (state) => state
  }
})

export const { selectDiceRolls } = diceRollSlice.selectors

export default diceRollSlice
