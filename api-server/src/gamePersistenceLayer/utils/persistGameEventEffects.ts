import {
  ACTIVE_ENCOUNTER,
  BETWEEN_ENCOUNTERS,
  LOADOUT
} from '@solarpunk-drifters/common'
import * as gameEvents from '../../gameLogicLayer/gameEvents'
import type { GameEvent } from '../../gameLogicLayer/gameEvents'
import type { GameStore, StoreError, StoreOut } from '../types'

function filterOutput(...so: StoreOut[]): StoreError[] {
  return so.filter((item): item is StoreError => item !== null)
}

// TODO: implement error handling, allow transaction
export default async function persistGameEventEffects(
  store: GameStore,
  e: GameEvent
): Promise<StoreError[]> {
  switch (e.type) {
    case gameEvents.ADD_DRIFTER_CARDS: {
      console.warn(
        'persistGameEventEffects: ADD_DRIFTER_CARDS is NOT IMPLEMENTED'
      )
      // NOT IMPLEMENTED
      return []
    }

    case gameEvents.ADD_SUBTRACT_INVENTORY_ITEMS: {
      const { itemPatch } = e
      const out = await store.addSubtractInventoryItems(itemPatch)
      return filterOutput(out)
    }

    case gameEvents.NEW_EXPEDITION: {
      const { current, total } = e
      const out = await store.createExpeditionState({ current, total })
      return filterOutput(out)
    }

    case gameEvents.DRAW_ENCOUNTER_CARD: {
      const { cardId } = e
      const out1 = await store.setActiveEncounterCard(cardId)
      const out2 = await store.setGameMode(ACTIVE_ENCOUNTER)
      return filterOutput(out1, out2)
    }

    case gameEvents.ADVANCE_EXPEDITION_PROGRESS: {
      const { increment } = e
      const out = await store.incrementExpeditionProgress(increment)
      return filterOutput(out)
    }

    case gameEvents.END_EXPEDITION: {
      const out1 = await store.setGameMode(LOADOUT)
      const out2 = await store.clearExpeditionState()
      return filterOutput(out1, out2)
    }

    case gameEvents.ENCOUNTER_RESULT: {
      const out1 = await store.clearActiveEncounterCard()
      const out2 = await store.setGameMode(BETWEEN_ENCOUNTERS)
      return filterOutput(out1, out2)
    }

    case gameEvents.PLAY_CONSEQUENCE_CARDS: {
      console.warn(
        'persistGameEventEffects: PLAY_CONSEQUENCE_CARDS is NOT IMPLEMENTED'
      )
      // NOT IMPLEMENTED
      return []
    }

    default:
      throw new Error(
        `persistGameEventEffects got unexpected GameEvent: ${JSON.stringify(e)}`
      )
  }
}
