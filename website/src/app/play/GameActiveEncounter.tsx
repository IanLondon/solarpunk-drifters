import React, { useCallback } from 'react'
import EncounterCard from '@/components/EncounterCard'
import { postPlayAction, useDispatch, useGetCardQuery } from '@/lib/redux'
import LoadingSection from '../../components/LoadingSection'

export interface GameActiveEncounterProps {
  activeEncounterCardId: string
}

export default function GameActiveEncounter(
  props: GameActiveEncounterProps
): React.ReactNode {
  const {
    data: cardData,
    isFetching,
    isSuccess
  } = useGetCardQuery(props.activeEncounterCardId)

  const dispatch = useDispatch()

  // TODO: use action creator to hide the play `action` string
  // TODO: error handling, delete 'void' here
  // (See ./page.tsx)
  const chooseOptionCb = useCallback(
    (choice: number) => {
      void dispatch(
        postPlayAction({
          action: 'encounter-card-choice',
          payload: { choice }
        })
      )
    },
    [dispatch]
  )

  if (isFetching) {
    return <LoadingSection />
  } else if (!isSuccess) {
    // TODO handle gracefully
    return <div>ERROR FETCHING!</div>
  }
  return (
    <article>
      <div>Active encounter!!!</div>
      <EncounterCard data={cardData} onChooseOption={chooseOptionCb} />
    </article>
  )
}
