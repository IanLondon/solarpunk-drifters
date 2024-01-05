import React from 'react'
import { SKILLS_LIST, type CharacterStats } from '@solarpunk-drifters/common'
import { selectCharacterStats, useSelector } from '@/lib/redux'
import SkillIcon from './SkillIcon'

export function CharacterStatsBar(props: {
  stats: CharacterStats
}): React.ReactNode {
  return (
    <article className='flex w-full justify-between px-1'>
      {SKILLS_LIST.map((skill) => (
        <span key={skill}>
          <SkillIcon skill={skill} />
          <span className='ml-2'>{props.stats[skill]}</span>
        </span>
      ))}
    </article>
  )
}

export function ConnectedCharacterStatsBar(): React.ReactNode {
  const characterStats = useSelector(selectCharacterStats)
  if (characterStats !== null) {
    return <CharacterStatsBar stats={characterStats} />
  }
  // TODO NOT IMPLEMENTED NEEDS DESIGN
  return <span>loading stats...</span>
}
