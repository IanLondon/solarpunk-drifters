import React from 'react'
import type { ExpeditionProgress } from '@solarpunk-drifters/common'
import { selectExpeditionProgress, useSelector } from '@/lib/redux'

type ProgressMeterProps = ExpeditionProgress

export function ProgressMeter(props: ProgressMeterProps): React.ReactNode {
  const { current, total } = props
  const percent = current / total
  return (
    <article className='w-full'>
      <div className='h-2 bg-slate-800'>
        <div
          className='h-full bg-amber-400'
          style={{ width: `${percent * 100}%` }}
        />
      </div>
      <div className='flex justify-between'>
        <div className='text-amber-400'>{current} km</div>
        <div>/</div>
        <div>{total} km</div>
      </div>
    </article>
  )
}

export function ConnectedProgressMeter(): React.ReactNode {
  const expeditionProgress = useSelector(selectExpeditionProgress)
  if (expeditionProgress !== null) {
    return <ProgressMeter {...expeditionProgress} />
  }
}
