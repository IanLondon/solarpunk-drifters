import React, { useState } from 'react'
import DieD6 from './DieD6'
import { useInterval } from 'react-use'
import type { RollResult } from '../types'
import { getRandomND6 } from '@solarpunk-drifters/common'

const ROLL_DELAY = 100

function DiceBar(props: { children: React.ReactNode }): React.ReactNode {
  return (
    <div className='min-h-16 w-full text-center text-6xl text-amber-400'>
      {props.children}
    </div>
  )
}

export function DiceRollResultBar(props: {
  rollResult: RollResult
}): React.ReactNode {
  const { rolls, outcome } = props.rollResult
  return (
    <DiceBar>
      {rolls.map((i) => (
        <DieD6 key={i} n={i} />
      ))}
      {/* TODO presentation is not implemented, need design */}
      <div>{outcome}</div>
    </DiceBar>
  )
}

export function RandomRollingDiceBar(props: { dice: number }): React.ReactNode {
  const [diceValues, setDiceValues] = useState(getRandomND6(props.dice))

  useInterval(() => {
    setDiceValues(getRandomND6(props.dice))
  }, ROLL_DELAY)

  return (
    <DiceBar>
      {diceValues.map((n, i) => (
        <DieD6 key={i} n={n} />
      ))}
    </DiceBar>
  )
}
