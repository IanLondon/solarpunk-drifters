import {
  type DrifterCard,
  type EncounterCard
} from '@solarpunk-drifters/common'
import {
  type GameMode,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '../controllers/gameState'
import { EXPEDITION_DISTANCE, INITIAL_EXPEDITION_PROGRESS } from './constants'
import * as events from './events'
import type { GameMoveOutcome } from './events'
import type { EncounterCardDeckFn } from './types'

export async function beginExpedition(
  gameMode: GameMode,
  encounterCardDeck: EncounterCardDeckFn
): Promise<GameMoveOutcome> {
  if (gameMode !== LOADOUT) {
    return events.moveNotAllowedError()
  }

  const newEncounterCardId = await encounterCardDeck()
  return [
    events.drawEncounterCard(newEncounterCardId),
    events.newExpedition({
      current: INITIAL_EXPEDITION_PROGRESS,
      total: EXPEDITION_DISTANCE
    })
  ]
}

export async function nextEncounter(
  gameMode: GameMode,
  encounterCardDeck: EncounterCardDeckFn
): Promise<GameMoveOutcome> {
  if (gameMode !== BETWEEN_ENCOUNTERS) {
    return events.moveNotAllowedError()
  }

  const newEncounterCardId = await encounterCardDeck()
  return [events.drawEncounterCard(newEncounterCardId)]
}

export async function turnBack(gameMode: GameMode): Promise<GameMoveOutcome> {
  if (gameMode !== BETWEEN_ENCOUNTERS) {
    return events.moveNotAllowedError()
  }

  return [events.endExpedition(events.TURNED_BACK)]
}

export async function encounterCardChoice(args: {
  choiceIndex: number
  encounterCard: EncounterCard
  gameMode: GameMode
}): Promise<GameMoveOutcome> {
  // const { gameMode, encounterCard, choiceIndex } = args
  throw new Error('NOT IMPLEMENTED: encounterCardChoice')
}

export async function playDrifterCard(args: {
  gameMode: GameMode
  drifterCard: DrifterCard
}): Promise<GameMoveOutcome> {
  throw new Error('NOT IMPLEMENTED: playDrifterCard')
}
