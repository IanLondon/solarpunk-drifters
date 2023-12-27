import React from 'react'
import CardInHandInventory from '@/components/CardInHandInventory'
import { type CardInHand } from '@/types'

export interface GameBetweenEncountersProps {
  nextEncounter: () => void
  turnBack: () => void
  onCardSelect: (cardId: string) => void
  cardsInHand: CardInHand[]
}

export default function GameBetweenEncounters(
  props: GameBetweenEncountersProps
): React.ReactNode {
  const { nextEncounter, turnBack, onCardSelect, cardsInHand } = props
  return (
    <article className='flex flex-col'>
      <button onClick={nextEncounter}>Draw the next Encounter card</button>

      <div className='text-center'>
        <p>Play a card from your hand...</p>

        <CardInHandInventory onCardSelect={onCardSelect} cards={cardsInHand} />
      </div>

      <button onClick={turnBack}>Turn Back</button>
    </article>
  )
}
