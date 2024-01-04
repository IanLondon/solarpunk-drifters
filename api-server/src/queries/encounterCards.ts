import type { EncounterCardDeckFn } from '../gameLogicLayer/types'
import {
  DEMO_BUFFALO_ENCOUNTER_CARD,
  type EncounterCard
} from '@solarpunk-drifters/common'

export async function getEncounterCard(
  encounterCardId: string
): Promise<EncounterCard | null> {
  // TODO. JUST A STUB. NEED REAL DATA STORE (AND MORE THAN ONE CARD!)
  if (encounterCardId === DEMO_BUFFALO_ENCOUNTER_CARD.id) {
    return DEMO_BUFFALO_ENCOUNTER_CARD
  }
  return null
}

export const encounterCardDeck: EncounterCardDeckFn = async () => {
  // TODO. Just a stub, we only have one card in the deck.
  return DEMO_BUFFALO_ENCOUNTER_CARD.id
}
