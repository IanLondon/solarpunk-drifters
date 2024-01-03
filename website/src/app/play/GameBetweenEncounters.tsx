import React from 'react'
import DrifterCardInventory from '@/components/DrifterCardInventory'
import type { DrifterCard } from '@solarpunk-drifters/common'

export interface GameBetweenEncountersProps {
  nextEncounter: () => void
  turnBack: () => void
  onCardSelect: (cardId: string) => void
  drifterCards: DrifterCard[]
}

export default function GameBetweenEncounters(
  props: GameBetweenEncountersProps
): React.ReactNode {
  const { nextEncounter, turnBack, onCardSelect, drifterCards } = props
  return (
    <article className='flex flex-col'>
      <button onClick={nextEncounter}>Draw the next Encounter card</button>

      <div className='text-center'>
        <p>Play a card from your hand...</p>

        <DrifterCardInventory
          onCardSelect={onCardSelect}
          cards={drifterCards}
        />
      </div>

      <button onClick={turnBack}>Turn Back</button>
    </article>
  )
}
