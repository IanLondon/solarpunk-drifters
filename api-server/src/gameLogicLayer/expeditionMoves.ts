import {
  type EncounterChoice,
  type DrifterCard,
  type CharacterStats,
  ACTIVE_ENCOUNTER,
  type GameState,
  ENCOUNTER_OUTCOME_STRONG_SUCCESS
} from '@solarpunk-drifters/common'
import {
  type GameMode,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '../controllers/gameState'
import { EXPEDITION_DISTANCE, INITIAL_EXPEDITION_PROGRESS } from './constants'
import * as events from './events'
import type { GameMoveOutcome } from './events'
import type { DiceFn, EncounterCardDeckFn } from './types'
import {
  skillCheckRollToEncounterOutcome,
  skillCheckRoller
} from './encounterCardChecks'
import { getInvalidItems } from '../utils/getInvalidItems'
import { mapValues } from 'lodash'

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
  gameMode: GameMode
  characterStats: CharacterStats
  choice: EncounterChoice
  dice: DiceFn
  inventory: Readonly<GameState['inventory']> // TODO cleaner type
}): Promise<GameMoveOutcome> {
  const { gameMode, characterStats, choice, dice, inventory } = args

  if (gameMode !== ACTIVE_ENCOUNTER) {
    return events.moveNotAllowedError()
  }

  const skill = choice.check?.skill
  const items = choice.check?.items
  if (skill !== undefined && items === undefined) {
    const skillCheckRoll = skillCheckRoller({ characterStats, dice, skill })
    const outcome = skillCheckRollToEncounterOutcome(skillCheckRoll)
    return [
      // TODO IMMEDIATELY: disadvantage should go in this event
      events.encounterResult(skillCheckRoll.rolls, outcome)
    ]
  }

  if (skill === undefined && items !== undefined) {
    const invalidItems = getInvalidItems({
      inventory,
      itemsToRemove: items
    })

    if (invalidItems.length > 0) {
      return events.notEnoughConsumablesError({
        items: invalidItems,
        resources: []
      })
    } else {
      return [
        // NOTE: our `items` is all positive, and addSubtractInventoryItems takes
        // a patch where negative values subtract from the inventory,
        // so we invert them
        events.addItemToInventory(mapValues(items, (n) => -1 * n)),
        // TODO: no rolls
        events.encounterResult([], ENCOUNTER_OUTCOME_STRONG_SUCCESS)
      ]
    }
  }

  throw new Error(
    'not implemented, expected choice to have either skill check XOR item check'
  )
}

export async function playDrifterCard(args: {
  gameMode: GameMode
  drifterCard: DrifterCard
}): Promise<GameMoveOutcome> {
  throw new Error('NOT IMPLEMENTED: playDrifterCard')
}
