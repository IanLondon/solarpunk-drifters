/* Core */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState: ExampleSliceState = {
  value: 0
}

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    }
  }
})

/* Types */
export interface ExampleSliceState {
  value: number
}
