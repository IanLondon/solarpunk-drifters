import React from 'react'
import { MiniDrifterCard } from './MiniDrifterCard'
import type { DrifterCard } from '@solarpunk-drifters/common'

// Shows all the cards in your hand
export default function DrifterCardInventory(props: {
  cards: DrifterCard[]
  onCardSelect: (cardId: string) => void
}): React.ReactNode {
  const { cards, onCardSelect } = props
  return (
    <div className='flex h-60 w-full justify-center bg-slate-600'>
      {cards.map((card, i) => (
        <span key={i} className='max-w-40 flex-1'>
          <MiniDrifterCard card={card} onCardSelect={onCardSelect} />
        </span>
      ))}
    </div>
  )
}
