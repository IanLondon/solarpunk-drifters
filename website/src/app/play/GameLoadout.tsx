import React from 'react'

export interface GameLoadoutProps {
  beginExpedition: () => void
}

export default function GameLoadout(props: GameLoadoutProps): React.ReactNode {
  return <button onClick={props.beginExpedition}>Begin Encounter</button>
}
