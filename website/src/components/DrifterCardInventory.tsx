import React from 'react'
import { ConnectedMiniDrifterCard } from './MiniDrifterCard'
import { DEMO_MAKE_PROGRESS_DRIFTER_CARD } from '@solarpunk-drifters/common'

/** Shows all the Drifter Cards in your hand */
export function DrifterCardInventory(props: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <div className='flex h-60 w-full justify-center bg-slate-600'>
      {props.children}
    </div>
  )
}

export function ConnectedDrifterCardInventory(): React.ReactNode {
  // TODO: not implemented, we should be able to select this from gameState
  const drifterCardInventory = [DEMO_MAKE_PROGRESS_DRIFTER_CARD.id]
  return (
    <DrifterCardInventory>
      {/* NOTE: need to key by index bc multiples of the same card can exist */}
      {drifterCardInventory.map((drifterCardId, index) => (
        <ConnectedMiniDrifterCard key={index} drifterCardId={drifterCardId} />
      ))}
    </DrifterCardInventory>
  )
}
