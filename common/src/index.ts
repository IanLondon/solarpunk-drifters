import type { Skill, ImageInfo } from './openapiTypes'

export * from './dummyData'
export * from './openapiTypes'
export * from './selectors'
export * from './utils'

export const SKILLS_LIST: Skill[] = ['agility', 'harmony', 'diy', 'luck']

export const ACTIVE_ENCOUNTER = 'ACTIVE_ENCOUNTER'
export const BETWEEN_ENCOUNTERS = 'BETWEEN_ENCOUNTERS'
export const LOADOUT = 'LOADOUT'

export type GameMode =
  | typeof LOADOUT
  | typeof BETWEEN_ENCOUNTERS
  | typeof ACTIVE_ENCOUNTER
