import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '@solarpunk-drifters/common'
import * as events from '../../gameLogicLayer/events'
import type { GameEvent } from '../../gameLogicLayer/events'
import type { GameStore, StoreError, StoreOut } from '../types'

function filterOutput(...so: StoreOut[]): StoreError[] {
  return so.filter((item): item is StoreError => item !== null)
}

// TODO: implement error handling, allow transaction
export default function persistGameEventEffects(
  store: GameStore,
  e: GameEvent
): StoreError[] {
  switch (e.type) {
    case events.ADD_SUBTRACT_INVENTORY_ITEMS: {
      const { itemPatch } = e
      const out = store.addSubtractInventoryItems(itemPatch)
      return filterOutput(out)
    }

    case events.NEW_EXPEDITION: {
      const { current, total } = e
      const out = store.createExpeditionState({ current, total })
      return filterOutput(out)
    }

    case events.DRAW_ENCOUNTER_CARD: {
      const { cardId } = e
      const out1 = store.setActiveEncounterCard(cardId)
      const out2 = store.setGameMode(ACTIVE_ENCOUNTER)
      return filterOutput(out1, out2)
    }

    case events.ADVANCE_EXPEDITION_PROGRESS: {
      const { increment } = e
      const out = store.incrementExpeditionProgress(increment)
      return filterOutput(out)
    }

    case events.END_EXPEDITION: {
      const out1 = store.setGameMode(LOADOUT)
      const out2 = store.clearExpeditionState()
      return filterOutput(out1, out2)
    }

    case events.ENCOUNTER_RESULT: {
      const out1 = store.clearActiveEncounterCard()
      const out2 = store.setGameMode(BETWEEN_ENCOUNTERS)
      return filterOutput(out1, out2)
    }

    default:
      throw new Error(
        `persistGameEventEffects got unexpected GameEvent: ${JSON.stringify(e)}`
      )
  }
}
