// TODO: rename this file gameEvents.ts and import like: `* as gameEvents` (find all)
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

export const ADD_DRIFTER_CARDS = 'ADD_DRIFTER_CARDS'
export interface AddDrifterCards {
  type: typeof ADD_DRIFTER_CARDS
  drifterCardIds: string[]
}
export const addDrifterCards = (drifterCardIds: string[]): AddDrifterCards => ({
  type: ADD_DRIFTER_CARDS,
  drifterCardIds
})

export const ADD_SUBTRACT_INVENTORY_ITEMS = 'ADD_SUBTRACT_INVENTORY_ITEMS'
export interface AddSubstractInventoryItems {
  type: typeof ADD_SUBTRACT_INVENTORY_ITEMS
  itemPatch: Readonly<Record<string, number>>
}
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

export const PLAY_CONSEQUENCE_CARDS = 'PLAY_CONSEQUENCE_CARDS'
export interface PlayConsequenceCardsEvent {
  type: typeof PLAY_CONSEQUENCE_CARDS
  consequenceCardIds: string[]
}
export const playConsequenceCards = (
  consequenceCardIds: string[]
): PlayConsequenceCardsEvent => ({
  type: PLAY_CONSEQUENCE_CARDS,
  consequenceCardIds
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
  | AddDrifterCards // TODO IMMEDIATELY: postfix type name with "Event" !
  | AddSubstractInventoryItems // TODO IMMEDIATELY: postfix type name with "Event" !
  | AdvanceExpeditionProgressEvent
  | DrawEncounterCardEvent
  | EncounterResultEvent
  | EndExpeditionEvent
  | NewExpeditionEvent
  | PlayConsequenceCardsEvent

export type GameEventsOrError = GameEvent[] | GameErrorEvent
