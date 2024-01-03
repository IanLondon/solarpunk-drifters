import type { Skill, ImageInfo } from './openapiTypes'

export * from './dummyData'
export * from './openapiTypes'
export * from './selectors'

export const SKILLS_LIST: Skill[] = ['agility', 'harmony', 'diy', 'luck']

export const ACTIVE_ENCOUNTER = 'ACTIVE_ENCOUNTER'
export const BETWEEN_ENCOUNTERS = 'BETWEEN_ENCOUNTERS'
export const LOADOUT = 'LOADOUT'

export type GameMode =
  | typeof LOADOUT
  | typeof BETWEEN_ENCOUNTERS
  | typeof ACTIVE_ENCOUNTER

// TODO: this should be added to the OpenAPI spec and needs a route.
// It's like EncounterCard in the way it should have a GET
// and should have its TS type defined by an OpenAPI schema def.
export interface DrifterCard {
  id: string
  title: string
  description: string
  image: ImageInfo
}
