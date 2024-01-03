import React from 'react'
import { SKILLS_LIST, type CharacterStats } from '@solarpunk-drifters/common'
import SkillIcon from './SkillIcon'

export default function CharacterStatsBar(props: {
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
