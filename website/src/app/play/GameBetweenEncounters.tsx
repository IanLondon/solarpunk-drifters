import React from 'react'
import { ConnectedDrifterCardInventory } from '@/components/DrifterCardInventory'
import { useNextEncounter, useTurnBack } from '@/lib/playerMoveHooks'

export default function GameBetweenEncounters(): React.ReactNode {
  const nextEncounter = useNextEncounter()
  const turnBack = useTurnBack()

  return (
    <article className='flex flex-col'>
      <button onClick={nextEncounter}>Draw the next Encounter card</button>

      <div className='text-center'>
        <p>Play a Drifter Card from your hand...</p>

        <ConnectedDrifterCardInventory />
      </div>

      <button onClick={turnBack}>Turn Back</button>
    </article>
  )
}
