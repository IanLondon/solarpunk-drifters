import React from 'react'

const UNICODE_DICE: Record<number, string> = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅'
}

export default function DieD6(props: { n: number }): React.ReactNode {
  return <span>{UNICODE_DICE[props.n]}</span>
}
