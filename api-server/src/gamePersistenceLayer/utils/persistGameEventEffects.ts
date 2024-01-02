import {
  BETWEEN_ENCOUNTERS,
  ExpeditionProgress,
  GameMode,
  GameState,
  LOADOUT
} from '../../controllers/gameState'
import * as events from '../../gameLogicLayer/events'
import type { GameEvent } from '../../gameLogicLayer/events'
import type { GameStore } from '../types'

// TODO: implement error handling, allow transaction
export default function persistGameEventEffects(
  store: GameStore,
  e: GameEvent
): void {
  switch (e.type) {
    case events.ADD_ITEM_TO_INVENTORY: {
      const { item, quantity } = e
      store.addInventoryItem(item, quantity)
      break
    }

    case events.NEW_EXPEDITION: {
      const { current, total } = e
      store.createExpeditionState({ current, total })
      break
    }

    case events.DRAW_ENCOUNTER_CARD: {
      const { cardId } = e
      store.setActiveEncounterCard(cardId)
      break
    }

    case events.ADVANCE_EXPEDITION_PROGRESS: {
      const { increment } = e
      store.incrementExpeditionProgress(increment)
      break
    }

    case events.COMPLETE_ACTIVE_ENCOUNTER: {
      store.clearActiveEncounterCard()
      store.setGameMode(BETWEEN_ENCOUNTERS)
      break
    }

    case events.END_EXPEDITION: {
      store.setGameMode(LOADOUT)
      store.clearExpeditionState()
      break
    }

    case events.DICE_ROLL_OUTCOME: {
      // do nothing
      break
    }

    default:
      console.error(`persistGameEventEffects got unexpected GameEvent: ${e}`)
      break
  }
}
