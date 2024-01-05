import React, { useCallback } from 'react'
import EncounterCard from '@/components/EncounterCard'
import LoadingSection from '@/components/LoadingSection'
import {
  ENCOUNTER_CARD_CHOICE,
  postExpeditionPlayerMove,
  selectEncounterResult,
  selectRollingDice,
  useDispatch,
  useGetEncounterCardQuery,
  useSelector
} from '@/lib/redux'
import { DiceRollResultBar, RandomRollingDiceBar } from '@/components/diceBars'
import { isRollResult } from '@/types'

/** Conditionally renders the results of a roll, or a pending roll, or nothing */
function EncounterResultBar(): React.ReactNode {
  const rollingDice = useSelector(selectRollingDice)
  const encounterResult = useSelector(selectEncounterResult)

  if (rollingDice !== null) {
    return <RandomRollingDiceBar dice={rollingDice} />
  } else if (encounterResult !== null) {
    if (isRollResult(encounterResult)) {
      return <DiceRollResultBar rollResult={encounterResult} />
    } else {
      // TODO: not implemented, this is a dummy component. Needs design.
      // We have an outcome but the Encounter Card choice didn't use a dice roll.
      return (
        <div>
          <strong>OUTCOME:</strong>
          {encounterResult.outcome}
        </div>
      )
    }
  }
}

export interface GameActiveEncounterProps {
  activeEncounterCardId: string
}

export default function GameActiveEncounter(
  props: GameActiveEncounterProps
): React.ReactNode {
  const {
    data: encounterCardData,
    isFetching,
    isSuccess
  } = useGetEncounterCardQuery(props.activeEncounterCardId)

  const dispatch = useDispatch()

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
      <EncounterCard data={encounterCardData} onChooseOption={chooseOptionCb} />
      <EncounterResultBar />
    </article>
  )
}
