import { type Dispatch } from '@reduxjs/toolkit'
import { EXPEDITIONS_URL, GAME_STATE_URL } from '@/app/serverRoutes'
import { encounterUpdate, setGameState } from '.'
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

// Moves a player can make related to an expedition
export type ExpeditionMove =
  | {
      action: typeof BEGIN_EXPEDITION
    }
  | {
      action: typeof NEXT_ENCOUNTER
    }
  | {
      action: typeof TURN_BACK
    }
  | { action: typeof ENCOUNTER_CARD_CHOICE; body: { choice: number } }
  | { action: typeof PLAY_CARD; body: { cardId: string } }

export interface RollResult {
  rolls: number[]
}

export interface ServerExpeditionUpdate {
  rollResult?: RollResult
  update?: Partial<ServerGameState>
}

export function postExpeditionAction(action: ExpeditionMove) {
  return async function postExpeditionActionThunk(dispatch: Dispatch) {
    // TODO: DRY vs above
    try {
      const response = await fetch(`${EXPEDITIONS_URL}/${action.action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'body' in action ? JSON.stringify(action.body) : undefined
      })
      const text = await response.text()

      // TODO: validate input with JSON Schema
      const json: ServerExpeditionUpdate | null =
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
