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
import {
  TURNED_BACK,
  gameEventCreators,
  gameEventErrorCreators
} from './gameEvents'
import type { GameEventsOrError } from './gameEvents'
import type { DiceFn, EncounterCardDeckFn } from './types'
import {
  skillCheckRollToEncounterOutcome,
  skillCheckRoller
} from './encounterCardChecks'
import { getInvalidItems, toInventoryPatch } from '../utils/getInvalidItems'
import { mapValues } from 'lodash'

export async function beginExpedition(
  gameMode: GameMode,
  encounterCardDeck: EncounterCardDeckFn
): Promise<GameEventsOrError> {
  if (gameMode !== LOADOUT) {
    return gameEventErrorCreators.moveNotAllowedError()
  }

  const newEncounterCardId = await encounterCardDeck()
  return [
    gameEventCreators.drawEncounterCard(newEncounterCardId),
    gameEventCreators.newExpedition({
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
    return gameEventErrorCreators.moveNotAllowedError()
  }

  const newEncounterCardId = await encounterCardDeck()
  return [gameEventCreators.drawEncounterCard(newEncounterCardId)]
}

export async function turnBack(gameMode: GameMode): Promise<GameEventsOrError> {
  if (gameMode !== BETWEEN_ENCOUNTERS) {
    return gameEventErrorCreators.moveNotAllowedError()
  }

  return [gameEventCreators.endExpedition(TURNED_BACK)]
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
    return gameEventErrorCreators.moveNotAllowedError()
  }

  const skill = choice.check?.skill
  const items = choice.check?.items
  if (skill !== undefined && items === undefined) {
    const skillCheckRoll = skillCheckRoller({ characterStats, dice, skill })
    const outcome = skillCheckRollToEncounterOutcome(skillCheckRoll)
    return [
      gameEventCreators.encounterResult({
        skillCheckRoll,
        outcome
      })
    ]
  }

  if (skill === undefined && items !== undefined) {
    // NOTE: our `items` is all positive, and addSubtractInventoryItems takes
    // a patch where negative values subtract from the inventory,
    // so we invert them.
    const removeItemsPatch = toInventoryPatch(mapValues(items, (n) => -1 * n))
    const invalidItems = getInvalidItems({
      inventory,
      inventoryPatch: removeItemsPatch
    })

    if (invalidItems.length > 0) {
      return gameEventErrorCreators.notEnoughConsumablesError({
        items: invalidItems,
        resources: []
      })
    } else {
      return [
        gameEventCreators.addSubtractInventoryItems(removeItemsPatch),
        gameEventCreators.encounterResult({
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
