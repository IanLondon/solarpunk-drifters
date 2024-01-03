import {
  type GameMode,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '../controllers/gameState'
import * as events from './events'
import type { DiceRoll, GameMoveOutcome } from './events'

// TODO: factor out these types

export type DiceFn = (n: number, modifier: number) => DiceRoll

export type EncounterCardDeckFn = () => string

// =========

// TODO: factor out these game constants

export const INITIAL_EXPEDITION_PROGRESS = 100
export const EXPEDITION_DISTANCE = 1500

// ^^^^^^^^^

export function beginExpedition(
  gameMode: GameMode,
  encounterCardDeck: EncounterCardDeckFn
): GameMoveOutcome {
  if (gameMode !== LOADOUT) {
    return events.moveNotAllowedError()
  }

  const newEncounterCardId = encounterCardDeck()
  return [
    events.drawEncounterCard(newEncounterCardId),
    events.newExpedition({
      current: INITIAL_EXPEDITION_PROGRESS,
      total: EXPEDITION_DISTANCE
    })
  ]
}

export function nextEncounter(
  gameMode: GameMode,
  encounterCardDeck: EncounterCardDeckFn
): GameMoveOutcome {
  if (gameMode !== BETWEEN_ENCOUNTERS) {
    return events.moveNotAllowedError()
  }

  const newEncounterCardId = encounterCardDeck()
  return [events.drawEncounterCard(newEncounterCardId)]
}

export function turnBack(gameMode: GameMode): GameMoveOutcome {
  if (gameMode !== BETWEEN_ENCOUNTERS) {
    return events.moveNotAllowedError()
  }

  return [events.endExpedition(events.TURNED_BACK)]
}
