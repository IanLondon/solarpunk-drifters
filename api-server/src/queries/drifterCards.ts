import {
  DEMO_MAKE_PROGRESS_DRIFTER_CARD,
  type DrifterCard
} from '@solarpunk-drifters/common'

export async function getDrifterCard(
  drifterCardId: string
): Promise<DrifterCard | null> {
  // TODO. JUST A STUB. NEED REAL DATA STORE (AND MORE THAN ONE CARD!)
  if (drifterCardId === DEMO_MAKE_PROGRESS_DRIFTER_CARD.id) {
    return DEMO_MAKE_PROGRESS_DRIFTER_CARD
  }
  return null
}
