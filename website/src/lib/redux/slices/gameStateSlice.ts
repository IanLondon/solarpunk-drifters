import { createAction, createSlice } from '@reduxjs/toolkit'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  type ServerGameState
} from '@/types/gameState'
import type { ExpeditionProgress } from '@solarpunk-drifters/common'
import { type ServerExpeditionUpdate } from '..'

type GameState = ServerGameState | null

const initialState = null as GameState

export const setGameState = createAction<ServerGameState, 'SET_GAME_STATE'>(
  'SET_GAME_STATE'
)

export const encounterUpdate = createAction<
  ServerExpeditionUpdate,
  'ENCOUNTER_UPDATE'
>('ENCOUNTER_UPDATE')

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(setGameState, (state, action) => {
      return action.payload
    })

    builder.addCase(encounterUpdate, (state, action) => {
      if (state === null) {
        console.error(
          'tried to partially update the game state before initial state was set'
        )
      } else {
        if (action.payload.update !== undefined) {
          // Simply spread the update into the state. Assume that it's been validated upstream
          Object.assign(state, action.payload.update)
        }
      }
    })
  },
  selectors: {
    selectActiveEncounterCardId: (state): string | null =>
      state?.gameMode === ACTIVE_ENCOUNTER ? state.activeEncounterCardId : null,
    selectCharacterStats: (state) => state?.characterStats ?? null,
    selectGameMode: (state): ServerGameState['gameMode'] | null =>
      state?.gameMode ?? null,
    selectInventory: (state) => state?.inventory ?? null,
    selectResources: (state) => state?.resources ?? null,
    selectExpeditionProgress: (state): ExpeditionProgress | null =>
      state?.gameMode === ACTIVE_ENCOUNTER ||
      state?.gameMode === BETWEEN_ENCOUNTERS
        ? state.expeditionProgress
        : null
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
