import Image from 'next/image'
import React, { useCallback } from 'react'
import Card from './Card'
import { type DrifterCard } from '@solarpunk-drifters/common'
import { useGetDrifterCardQuery } from '../lib/redux'
import { usePlayDrifterCard } from '../lib/playerMoveHooks'

// TODO HACK
const THUMBNAIL_IMAGE_SCALE = 1 / 8

export interface MiniDrifterCardProps {
  card: DrifterCard
  onCardSelect: () => void
}

export function MiniDrifterCard(props: MiniDrifterCardProps): React.ReactNode {
  const { card, onCardSelect } = props

  return (
    <Card onClick={onCardSelect}>
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

export function LoadingMiniDrifterCard(): React.ReactNode {
  return (
    <Card>
      <p className='text-lg'>..Loading..</p>
      {/* TODO spinner here */}
    </Card>
  )
}

export function ConnectedMiniDrifterCard(props: {
  drifterCardId: string
}): React.ReactNode {
  const { drifterCardId } = props
  const playDrifterCard = usePlayDrifterCard()
  const onCardSelect = useCallback(() => {
    playDrifterCard(drifterCardId)
  }, [drifterCardId, playDrifterCard])

  const {
    data: drifterCardData,
    isFetching,
    isSuccess
  } = useGetDrifterCardQuery(props.drifterCardId)

  if (isFetching) {
    return <LoadingMiniDrifterCard />
  }
  // TODO: failure to fetch is NOT IMPLEMENTED
  if (!isSuccess) {
    return <div>X.X oh no</div>
  }
  return <MiniDrifterCard onCardSelect={onCardSelect} card={drifterCardData} />
}
