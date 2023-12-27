import React from 'react'
import { type CharacterStats } from '@/types/gameState'
import { SKILLS_LIST } from '../types/encounter'
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
