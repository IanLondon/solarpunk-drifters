import {
  encounterResultSlice,
  encounterCardSlice,
  gameStateSlice
} from './slices'

export const reducer = {
  [encounterResultSlice.reducerPath]: encounterResultSlice.reducer,
  [encounterCardSlice.reducerPath]: encounterCardSlice.reducer,
  [gameStateSlice.reducerPath]: gameStateSlice.reducer
}
