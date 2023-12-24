export type Skill = 'agility' | 'harmony' | 'diy' | 'luck'

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
