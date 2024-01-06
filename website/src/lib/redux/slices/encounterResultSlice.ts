import { createSlice } from '@reduxjs/toolkit'
import { encounterUpdate } from '.'
import {
  type EncounterResult,
  clientEventFilters
} from '@solarpunk-drifters/common'
import type { PendingEncounterResult } from '@/types'
import { ENCOUNTER_CARD_CHOICE, expeditionPlayerMoveSentAction } from '..'

type EncounterResultState =
  | {
      result: EncounterResult
    }
  | {
      pending: PendingEncounterResult
    }
  | null

const initialState = null as EncounterResultState

export const encounterResultSlice = createSlice({
  name: 'encounterResult',
  initialState,
  reducers: {
    dismissEncounterResult() {
      return null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(expeditionPlayerMoveSentAction, (state, action) => {
        if (action.payload.moveType === ENCOUNTER_CARD_CHOICE) {
          return { pending: action.payload.meta }
        }
      })
      .addCase(encounterUpdate, (state, action) => {
        if (action.payload.clientEvents !== undefined) {
          const rollResultEvents = clientEventFilters.encounterResult(
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
          return { result: rollResultEvents[0].payload }
        }
      })
  },
  selectors: {
    /** The last received EncounterResult, or null if we're either
     * (1.) currently pending or (2.) have not made any encounter choices yet
     * */
    selectEncounterResult: (state): EncounterResult | null =>
      state !== null && 'result' in state ? state.result : null,

    selectEncounterResultIsPending: (state): boolean =>
      state !== null && 'pending' in state,

    /** Number of dice that are currently "rolling". This only happens when
     * we have made a player move that has a dice roll result involved.
     */
    selectRollingDice: (state): number | null =>
      state !== null &&
      'pending' in state &&
      state.pending.rollingDice !== undefined
        ? state.pending.rollingDice
        : null
  }
})

export const { dismissEncounterResult } = encounterResultSlice.actions
export const {
  selectEncounterResult,
  selectEncounterResultIsPending,
  selectRollingDice
} = encounterResultSlice.selectors

export default encounterResultSlice
