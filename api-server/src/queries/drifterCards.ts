import {
  DEMO_MAKE_PROGRESS_DRIFTER_CARD,
  type DrifterCard
} from '@solarpunk-drifters/common'
import { type DrifterCardDeckFn } from '../gameLogicLayer/types'

export async function getDrifterCard(
  drifterCardId: string
): Promise<DrifterCard | null> {
  // TODO. JUST A STUB. NEED REAL DATA STORE (AND MORE THAN ONE CARD!)
  if (drifterCardId === DEMO_MAKE_PROGRESS_DRIFTER_CARD.id) {
    return DEMO_MAKE_PROGRESS_DRIFTER_CARD
  }
  return null
}

export const drifterCardDeck: DrifterCardDeckFn = async () => {
  // TODO. Just a stub, we only have one card in the deck.
  return DEMO_MAKE_PROGRESS_DRIFTER_CARD.id
}
