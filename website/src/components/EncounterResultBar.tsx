import React from 'react'
import { DiceRollResultBar, RandomRollingDiceBar } from '@/components/diceBars'
import { isRollResult } from '@/types'
import { type EncounterResult } from '@solarpunk-drifters/common'

interface EncounterResultBarProps {
  dismissEncounterResult: () => void
  encounterResult: EncounterResult | null
  rollingDice: number | null
}

/** Conditionally renders the results of a roll, or a pending roll, or nothing */
export default function EncounterResultBar(
  props: EncounterResultBarProps
): React.ReactNode {
  const { dismissEncounterResult, encounterResult, rollingDice } = props

  if (rollingDice !== null) {
    return <RandomRollingDiceBar dice={rollingDice} />
  } else if (encounterResult !== null) {
    let component: React.ReactNode

    if (isRollResult(encounterResult)) {
      component = <DiceRollResultBar rollResult={encounterResult} />
    } else {
      // TODO: not implemented, this is a dummy component. Needs design.
      // We have an outcome but the Encounter Card choice didn't use a dice roll.
      component = (
        <div>
          <strong>OUTCOME:</strong>
          {encounterResult.outcome}
        </div>
      )
    }

    return (
      <div>
        {component}
        <button onClick={dismissEncounterResult}>OK</button>
      </div>
    )
  }
}
