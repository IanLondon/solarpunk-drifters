import {
  type GameMode,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '../controllers/gameState'
import { EXPEDITION_DISTANCE, INITIAL_EXPEDITION_PROGRESS } from './constants'
import * as events from './events'
import type { GameMoveOutcome } from './events'

// TODO: factor out these types

// TODO: remove this? Unused?
// export type DiceFn = (n: number, modifier: number) => DiceRoll

export type EncounterCardDeckFn = () => string

// =========

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

export function encounterCardChoice(args: {
  choiceIndex: number
  encounterCard: unknown // EncounterCard -- TODO import type
  gameMode: GameMode
}): GameMoveOutcome {
  // const { gameMode, encounterCard, choiceIndex } = args
  throw new Error('NOT IMPLEMENTED: encounterCardChoice')
}

export function playDrifterCard(args: {
  gameMode: GameMode
  drifterCard: unknown // TODO: define DrifterCard type
}): GameMoveOutcome {
  throw new Error('NOT IMPLEMENTED: playDrifterCard')
}
