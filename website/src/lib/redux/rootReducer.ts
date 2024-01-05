import { apiCacheSlice, encounterResultSlice, gameStateSlice } from './slices'

export const reducer = {
  [apiCacheSlice.reducerPath]: apiCacheSlice.reducer,
  [encounterResultSlice.reducerPath]: encounterResultSlice.reducer,
  [gameStateSlice.reducerPath]: gameStateSlice.reducer
}
