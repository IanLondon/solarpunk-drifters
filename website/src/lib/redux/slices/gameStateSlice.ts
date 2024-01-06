import { createAction, createSlice } from '@reduxjs/toolkit'
import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  type GameState,
  type ExpeditionProgress,
  type ExpeditionUpdate
} from '@solarpunk-drifters/common'
import { applyPatch } from 'rfc6902'

const initialState = null as GameState | null

export const setGameState = createAction<GameState, 'SET_GAME_STATE'>(
  'SET_GAME_STATE'
)

export const encounterUpdate = createAction<
  ExpeditionUpdate,
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
          // Apply the JSON Patch to the state. Assume that it's been validated upstream.
          applyPatch(state, action.payload.update)
        }
      }
    })
  },
  selectors: {
    selectActiveEncounterCardId: (state): string | null =>
      state?.gameMode === ACTIVE_ENCOUNTER ? state.activeEncounterCardId : null,
    selectCharacterStats: (state) => state?.characterStats ?? null,
    selectGameMode: (state): GameState['gameMode'] | null =>
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
