import React, { useCallback } from 'react'
import EncounterCard from '@/components/EncounterCard'
import LoadingSection from '@/components/LoadingSection'
import RollResultBar from '@/components/RollResultBar'
import {
  ENCOUNTER_CARD_CHOICE,
  postExpeditionPlayerMove,
  selectDiceState,
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
  const rollResult = useSelector(selectDiceState)

  // TODO: use action creator to hide the `moveType` string
  // TODO: error handling, delete 'void' here
  // (See ./page.tsx)
  const chooseOptionCb = useCallback(
    (choice: number) => {
      const rollingDice = 3 // TODO this should be derived from the encounter card choice
      void dispatch(
        postExpeditionPlayerMove({
          moveType: ENCOUNTER_CARD_CHOICE,
          body: { choice },
          meta: { rollingDice }
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
      {rollResult !== null ? <RollResultBar {...rollResult} /> : null}
    </article>
  )
}
