import { createAction, createSlice } from '@reduxjs/toolkit'
import { type ServerGameState } from '@/types/gameState'
import { type PlayActionUpdate } from '..'

type GameState = ServerGameState | null

const initialState = null as GameState

export const setGameState = createAction<ServerGameState, 'SET_GAME_STATE'>(
  'SET_GAME_STATE'
)

export const playActionResponse = createAction<
  PlayActionUpdate,
  'PLAY_ACTION_RESPONSE'
>('PLAY_ACTION_RESPONSE')

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(setGameState, (state, action) => {
      return action.payload
    })

    builder.addCase(playActionResponse, (state, action) => {
      if (state === null) {
        console.error(
          'tried to partially update the game state before initial state was set'
        )
      } else {
        // Simply spread the update into the state
        Object.assign(state, action.payload)
      }
    })
  },
  selectors: {
    selectActiveEncounterCardId: (state) =>
      state?.activeEncounterCardId ?? null,
    selectCharacterStats: (state) => state?.characterStats ?? null,
    selectGameMode: (state) => state?.gameMode ?? null,
    selectInventory: (state) => state?.inventory ?? null,
    selectResources: (state) => state?.resources ?? null,
    selectExpeditionProgress: (state) => state?.expeditionProgress ?? null
  }
})

export const {
  selectActiveEncounterCardId,
  selectCharacterStats,
  selectGameMode,
  selectInventory,
  selectResources,
  selectExpeditionProgress
} = gameStateSlice.selectors

export default gameStateSlice
