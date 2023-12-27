import { type Dispatch } from '@reduxjs/toolkit'
import { GAME_STATE_URL, PLAY_ACTION_URL } from '@/app/serverRoutes'
import { playActionResponse, setGameState } from '.'
import { type ServerGameState } from '@/types/gameState'

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

// TODO: factor out to types/
export const BEGIN_EXPEDITION = 'begin-expedition'
export const NEXT_ENCOUNTER = 'next-encounter'
export const TURN_BACK = 'turn-back'
export const ENCOUNTER_CARD_CHOICE = 'encounter-card-choice'
export const PLAY_CARD = 'play-card'
export type PlayAction =
  | {
      action: typeof BEGIN_EXPEDITION
    }
  | {
      action: typeof NEXT_ENCOUNTER
    }
  | {
      action: typeof TURN_BACK
    }
  | { action: typeof ENCOUNTER_CARD_CHOICE; payload: { choice: number } }
  | { action: typeof PLAY_CARD; payload: { cardId: string } }

export type PlayActionUpdate = Partial<ServerGameState>

export function postPlayAction(action: PlayAction) {
  return async function postPlayActionThunk(dispatch: Dispatch) {
    // TODO: DRY vs above
    try {
      const response = await fetch(`${PLAY_ACTION_URL}/${action.action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'payload' in action ? JSON.stringify(action.payload) : undefined
      })
      const text = await response.text()

      // TODO: validate input with JSON Schema
      const json: PlayActionUpdate | null =
        text === '' ? null : JSON.parse(text)
      if (response.status !== 200) {
        console.error(
          `Server did not give 200 response, got ${response.status}`
        )
      } else if (json === null) {
        console.error('No JSON response from server')
      } else {
        dispatch(playActionResponse(json))
      }
    } catch (err) {
      console.error('Error posting action', err)
    }
  }
}
