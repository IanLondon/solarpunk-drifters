import React, { useCallback } from 'react'
import EncounterCard from '@/components/EncounterCard'
import LoadingSection from '@/components/LoadingSection'
import RollResultBar from '@/components/RollResultBar'
import {
  postExpeditionAction,
  selectDiceRolls,
  useDispatch,
  useGetCardQuery,
  useSelector
} from '@/lib/redux'

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
  const rollResult = useSelector(selectDiceRolls)

  // TODO: use action creator to hide the play `action` string
  // TODO: error handling, delete 'void' here
  // (See ./page.tsx)
  const chooseOptionCb = useCallback(
    (choice: number) => {
      void dispatch(
        postExpeditionAction({
          action: 'encounter-card-choice',
          body: { choice }
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
      {rollResult !== null ? (
        <RollResultBar results={rollResult.rolls} />
      ) : null}
    </article>
  )
}
