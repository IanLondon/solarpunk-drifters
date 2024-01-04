import React, { useState } from 'react'
import DieD6 from './DieD6'
import { useInterval } from 'react-use'
import { type RollResult } from '@solarpunk-drifters/common'
import { type Rolling } from '../types'

export function getRandomD6(): number {
  return Math.floor(Math.random() * 6) + 1
}

export function getRandomND6(n: number): number[] {
  return Array.from({ length: n }, () => getRandomD6())
}

const ROLL_DELAY = 100

type RollResultBarProps = RollResult | Rolling

function DiceBar(props: { children: React.ReactNode }): React.ReactNode {
  return (
    <div className='min-h-16 w-full text-center text-6xl text-amber-400'>
      {props.children}
    </div>
  )
}

function RandomRollingDiceBar(props: { dice: number }): React.ReactNode {
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

export default function RollResultBar(
  props: RollResultBarProps
): React.ReactNode {
  if ('rollingDice' in props) {
    return <RandomRollingDiceBar dice={props.rollingDice} />
  } else {
    return (
      <DiceBar>
        {props.rolls.map((i) => (
          <DieD6 key={i} n={i} />
        ))}
        <div>{props.outcome}</div>
      </DiceBar>
    )
  }
}
