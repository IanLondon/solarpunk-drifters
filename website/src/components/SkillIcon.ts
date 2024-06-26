import type React from 'react'
import type { Skill } from '@solarpunk-drifters/common'

export default function SkillIcon(props: { skill: Skill }): React.ReactNode {
  switch (props.skill) {
    case 'agility':
      return '🐇'
    case 'diy':
      return '🔧'
    case 'harmony':
      return '🕊'
    case 'luck':
      return '🃏'
    default:
      props.skill satisfies never
  }
}
