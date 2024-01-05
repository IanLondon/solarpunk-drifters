import { createAction, type Dispatch } from '@reduxjs/toolkit'
import { EXPEDITIONS_URL, GAME_STATE_URL } from '@/app/serverRoutes'
import { encounterUpdate, setGameState } from '.'
import type { PendingEncounterResult, ServerGameState } from '@/types'
import { type ExpeditionUpdate } from '@solarpunk-drifters/common'

export function fetchInitialGameState() {
  return async function fetchInitialGameStateThunk(dispatch: Dispatch) {
    try {
      const response = await fetch(GAME_STATE_URL, {
        headers: { 'Content-Type': 'application/json' }
      })
      const text = await response.text()
      // TODO: validate input with JSON Schema
      const json: ServerGameState | null = text === '' ? null : JSON.parse(text)
      if (response.status !== 200) {
        console.error(
          `Server did not give 200 response, got ${response.status}`
        )
      } else if (json === null) {
        console.error('No JSON response from server')
      } else {
        dispatch(setGameState(json))
      }
    } catch (err) {
      console.error('Error fetching game state:', err)
    }
  }
}

// TODO: these constants and types should be imported from OpenAPI spec common/ module
// (or at least derived from imports)
export const BEGIN_EXPEDITION = 'begin-expedition'
export const NEXT_ENCOUNTER = 'next-encounter'
export const TURN_BACK = 'turn-back'
export const ENCOUNTER_CARD_CHOICE = 'encounter-card-choice'
export const PLAY_DRIFTER_CARD = 'play-drifter-card'

// Moves a player can make related to an expedition
type ExpeditionMove =
  | {
      moveType: typeof BEGIN_EXPEDITION
    }
  | {
      moveType: typeof NEXT_ENCOUNTER
    }
  | {
      moveType: typeof TURN_BACK
    }
  | {
      moveType: typeof ENCOUNTER_CARD_CHOICE
      body: { choice: number }
      meta: PendingEncounterResult
    }
  | { moveType: typeof PLAY_DRIFTER_CARD; body: { drifterCardId: string } }

// Redux action. The above are generic descriptions of "player moves".
export const expeditionPlayerMoveSentAction = createAction<
  ExpeditionMove,
  'EXPEDITION_MOVE_SENT'
>('EXPEDITION_MOVE_SENT')

export function postExpeditionPlayerMove(move: ExpeditionMove) {
  return async function postExpeditionPlayerMoveThunk(dispatch: Dispatch) {
    // TODO: DRY vs above

    // Dispatch an action indicating that the player made an Expedition Player Move
    dispatch(expeditionPlayerMoveSentAction(move))

    try {
      const response = await fetch(`${EXPEDITIONS_URL}/${move.moveType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'body' in move ? JSON.stringify(move.body) : undefined
      })
      const text = await response.text()

      // TODO: validate input with JSON Schema
      const json: ExpeditionUpdate | null =
        text === '' ? null : JSON.parse(text)
      if (response.status !== 200) {
        console.error(
          `Server did not give 200 response, got ${response.status}`
        )
      } else if (json === null) {
        console.error('No JSON response from server')
      } else {
        dispatch(encounterUpdate(json))
      }
    } catch (err) {
      console.error('Error posting action', err)
    }
  }
}
