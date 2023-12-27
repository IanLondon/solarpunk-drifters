import React from 'react'
import { CardInHandMiniCard } from './CardInHandMiniCard'
import type { CardInHand } from '../types'

// Shows all the cards in your hand
export default function CardInHandInventory(props: {
  cards: CardInHand[]
  onCardSelect: (cardId: string) => void
}): React.ReactNode {
  const { cards, onCardSelect } = props
  return (
    <div className='flex h-60 w-full justify-center bg-slate-600'>
      {cards.map((card, i) => (
        <span key={i} className='max-w-40 flex-1'>
          <CardInHandMiniCard card={card} onCardSelect={onCardSelect} />
        </span>
      ))}
    </div>
  )
}
