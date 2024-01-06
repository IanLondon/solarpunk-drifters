import React, { useMemo } from 'react'
import { ConnectedMiniDrifterCard } from './MiniDrifterCard'
import { selectDrifterCardInventory, useSelector } from '../lib/redux'

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
  const drifterCardInventory = useSelector(selectDrifterCardInventory)
  const drifterCardArray = useMemo((): readonly string[] => {
    if (drifterCardInventory === null) {
      return []
    }
    return Object.entries(drifterCardInventory).flatMap(([id, quantity]) => {
      return Array(quantity).fill(id)
    })
  }, [drifterCardInventory])
  return (
    <DrifterCardInventory>
      {/* NOTE: need to key by index bc multiples of the same card can exist */}
      {drifterCardArray.map((drifterCardId, index) => (
        <ConnectedMiniDrifterCard key={index} drifterCardId={drifterCardId} />
      ))}
    </DrifterCardInventory>
  )
}
