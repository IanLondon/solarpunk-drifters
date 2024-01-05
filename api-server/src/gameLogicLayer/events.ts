import {
  type EncounterResult,
  type ExpeditionProgress
} from '@solarpunk-drifters/common'

// TODO: factor out new types! This should become a ClientEvent in the OpenAPI def
export const REACHED_DESTINATION = 'REACHED_DESTINATION'
export const OUT_OF_RATIONS = 'OUT_OF_RATIONS'
export const TURNED_BACK = 'TURNED_BACK'
export type ExpeditionOutcome =
  | typeof REACHED_DESTINATION
  | typeof OUT_OF_RATIONS
  | typeof TURNED_BACK

// GAME EVENTS

export const ADD_SUBTRACT_INVENTORY_ITEMS = 'ADD_SUBTRACT_INVENTORY_ITEMS'
export interface AddSubstractInventoryItems {
  type: typeof ADD_SUBTRACT_INVENTORY_ITEMS
  itemPatch: Readonly<Record<string, number>>
}
// TODO IMMEDIATELY rename addSubtractInventoryItems
export const addSubtractInventoryItems = (
  itemPatch: AddSubstractInventoryItems['itemPatch']
): AddSubstractInventoryItems => ({
  type: ADD_SUBTRACT_INVENTORY_ITEMS,
  itemPatch
})

export const NEW_EXPEDITION = 'NEW_EXPEDITION'
export interface NewExpeditionEvent extends ExpeditionProgress {
  type: typeof NEW_EXPEDITION
}
export const newExpedition = (
  distances: ExpeditionProgress
): NewExpeditionEvent => ({
  ...distances,
  type: NEW_EXPEDITION
})

export const DRAW_ENCOUNTER_CARD = 'DRAW_ENCOUNTER_CARD'
export interface DrawEncounterCardEvent {
  type: typeof DRAW_ENCOUNTER_CARD
  cardId: string
}
export const drawEncounterCard = (cardId: string): DrawEncounterCardEvent => ({
  type: DRAW_ENCOUNTER_CARD,
  cardId
})

export const ADVANCE_EXPEDITION_PROGRESS = 'ADVANCE_EXPEDITION_PROGRESS'
export interface AdvanceExpeditionProgressEvent {
  type: typeof ADVANCE_EXPEDITION_PROGRESS
  increment: number
}
/**
 * Add the given increment to the current expedition progress
 */
export const advanceExpeditionProgress = (
  increment: number
): AdvanceExpeditionProgressEvent => ({
  type: ADVANCE_EXPEDITION_PROGRESS,
  increment
})

export const END_EXPEDITION = 'END_EXPEDITION'
export interface EndExpeditionEvent {
  type: typeof END_EXPEDITION
  outcome: ExpeditionOutcome
}
export const endExpedition = (
  outcome: ExpeditionOutcome
): EndExpeditionEvent => ({
  type: END_EXPEDITION,
  outcome
})

export const ENCOUNTER_RESULT = 'ENCOUNTER_RESULT'
export interface EncounterResultEvent {
  type: typeof ENCOUNTER_RESULT
  encounterResult: EncounterResult
}

export const encounterResult = (
  // TODO IMMEDIATELY modify these args: should be EncounterResult from OpenAPI
  encounterResult: EncounterResult
): EncounterResultEvent => ({
  type: ENCOUNTER_RESULT,
  encounterResult
})

// ERRORS

export interface ErrorEvent {
  type: string
  error: true
}

export const MOVE_NOT_ALLOWED = 'MOVE_NOT_ALLOWED'
export interface MoveNotAllowedErrorEvent extends ErrorEvent {
  type: typeof MOVE_NOT_ALLOWED
}
export const moveNotAllowedError = (): MoveNotAllowedErrorEvent => ({
  error: true,
  type: MOVE_NOT_ALLOWED
})

export const NOT_ENOUGH_CONSUMABLES = 'NOT_ENOUGH_CONSUMABLES'
export interface NotEnoughConsumablesErrorEvent extends ErrorEvent {
  type: typeof NOT_ENOUGH_CONSUMABLES
  items: string[]
  resources: string[]
}
export const notEnoughConsumablesError = (args: {
  items: string[]
  resources: []
}): NotEnoughConsumablesErrorEvent => ({
  ...args,
  error: true,
  type: NOT_ENOUGH_CONSUMABLES
})

// BIG UNION TYPES

export type GameErrorEvent =
  | MoveNotAllowedErrorEvent
  | NotEnoughConsumablesErrorEvent

export type GameEvent =
  | AddSubstractInventoryItems
  | NewExpeditionEvent
  | DrawEncounterCardEvent
  | AdvanceExpeditionProgressEvent
  | EndExpeditionEvent
  | EncounterResultEvent

export type GameMoveOutcome = GameEvent[] | GameErrorEvent
