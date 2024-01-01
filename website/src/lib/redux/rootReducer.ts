import { diceRollSlice, encounterCardSlice, gameStateSlice } from './slices'

export const reducer = {
  [diceRollSlice.reducerPath]: diceRollSlice.reducer,
  [encounterCardSlice.reducerPath]: encounterCardSlice.reducer,
  [gameStateSlice.reducerPath]: gameStateSlice.reducer
}
