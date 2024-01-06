import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  ENCOUNTER_OUTCOME_STRONG_SUCCESS,
  LOADOUT,
  type CharacterStats,
  type DrifterCard,
  type EncounterChoice,
  type GameMode,
  type GameState
} from '@solarpunk-drifters/common'
import { EXPEDITION_DISTANCE, INITIAL_EXPEDITION_PROGRESS } from './constants'
import * as gameEvents from './gameEvents'
import type { GameEventsOrError } from './gameEvents'
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
): Promise<GameEventsOrError> {
  if (gameMode !== LOADOUT) {
    return gameEvents.moveNotAllowedError()
  }

  const newEncounterCardId = await encounterCardDeck()
  return [
    gameEvents.drawEncounterCard(newEncounterCardId),
    gameEvents.newExpedition({
      current: INITIAL_EXPEDITION_PROGRESS,
      total: EXPEDITION_DISTANCE
    })
  ]
}

export async function nextEncounter(
  gameMode: GameMode,
  encounterCardDeck: EncounterCardDeckFn
): Promise<GameEventsOrError> {
  if (gameMode !== BETWEEN_ENCOUNTERS) {
    return gameEvents.moveNotAllowedError()
  }

  const newEncounterCardId = await encounterCardDeck()
  return [gameEvents.drawEncounterCard(newEncounterCardId)]
}

export async function turnBack(gameMode: GameMode): Promise<GameEventsOrError> {
  if (gameMode !== BETWEEN_ENCOUNTERS) {
    return gameEvents.moveNotAllowedError()
  }

  return [gameEvents.endExpedition(gameEvents.TURNED_BACK)]
}

export async function encounterCardChoice(args: {
  gameMode: GameMode
  characterStats: CharacterStats
  choice: EncounterChoice
  dice: DiceFn
  inventory: Readonly<GameState['inventory']> // TODO cleaner type
}): Promise<GameEventsOrError> {
  const { gameMode, characterStats, choice, dice, inventory } = args

  if (gameMode !== ACTIVE_ENCOUNTER) {
    return gameEvents.moveNotAllowedError()
  }

  const skill = choice.check?.skill
  const items = choice.check?.items
  if (skill !== undefined && items === undefined) {
    const skillCheckRoll = skillCheckRoller({ characterStats, dice, skill })
    const outcome = skillCheckRollToEncounterOutcome(skillCheckRoll)
    return [
      gameEvents.encounterResult({
        skillCheckRoll,
        outcome
      })
    ]
  }

  if (skill === undefined && items !== undefined) {
    const invalidItems = getInvalidItems({
      inventory,
      itemsToRemove: items
    })

    if (invalidItems.length > 0) {
      return gameEvents.notEnoughConsumablesError({
        items: invalidItems,
        resources: []
      })
    } else {
      return [
        // NOTE: our `items` is all positive, and addSubtractInventoryItems takes
        // a patch where negative values subtract from the inventory,
        // so we invert them
        gameEvents.addSubtractInventoryItems(mapValues(items, (n) => -1 * n)),
        gameEvents.encounterResult({
          outcome: ENCOUNTER_OUTCOME_STRONG_SUCCESS
        })
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
}): Promise<GameEventsOrError> {
  throw new Error('NOT IMPLEMENTED: playDrifterCard')
}
