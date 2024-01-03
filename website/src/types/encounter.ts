import type { Skill, ImageInfo } from '@solarpunk-drifters/common'

// TODO: factor these out into openapi, maybe rename it from "openapi" to "common"

export const SKILLS_LIST: Skill[] = ['agility', 'harmony', 'diy', 'luck']

export interface EncounterRisk {
  loseItem?: string
  loseResource?: string
  loomingDangerIncrease?: number
}

interface SkillCheck {
  skill: Skill
}

interface ItemCheck {
  items: Record<string, number>
}

export type EncounterCheck = (SkillCheck & ItemCheck) | ItemCheck | SkillCheck

export interface EncounterChoice {
  description: string
  check: EncounterCheck
  risk: EncounterRisk
}

export interface EncounterCardData {
  id: string
  title: string
  description: string
  image: ImageInfo
  choices: EncounterChoice[]
}
