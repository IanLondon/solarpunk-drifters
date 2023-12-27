import { encounterCardSlice, gameStateSlice } from './slices'

export const reducer = {
  gameState: gameStateSlice.reducer,
  [encounterCardSlice.reducerPath]: encounterCardSlice.reducer
}
