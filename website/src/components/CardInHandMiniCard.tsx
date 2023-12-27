import Image from 'next/image'
import React, { useCallback } from 'react'
import Card from './Card'
import { type CardInHand } from '@/types'

// TODO HACK
const THUMBNAIL_IMAGE_SCALE = 1 / 8

export interface CardInHandMiniCardProps {
  card: CardInHand
  onCardSelect: (cardId: string) => void
}

export function CardInHandMiniCard(
  props: CardInHandMiniCardProps
): React.ReactNode {
  const { card, onCardSelect } = props
  const onCardClick = useCallback(() => {
    onCardSelect(card.id)
  }, [card, onCardSelect])

  return (
    <Card onClick={onCardClick}>
      <p className='text-lg'>{card.title}</p>
      {/* <p>{card.description}</p> */}
      {/* TODO: make a specific Image component that takes {data: ImageData} props instead */}
      <Image
        className='m-auto'
        alt={card.image.alt}
        width={card.image.width * THUMBNAIL_IMAGE_SCALE}
        height={card.image.height * THUMBNAIL_IMAGE_SCALE}
        src={card.image.src}
        priority
      />
    </Card>
  )
}