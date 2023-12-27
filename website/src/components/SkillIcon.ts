import type React from 'react'
import { type Skill } from '@/types/encounter'

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
  }
}
