import { type ExpeditionProgress } from '@solarpunk-drifters/openapi'

// TODO: factor out new types!
export const REACHED_DESTINATION = 'REACHED_DESTINATION'
export const OUT_OF_RATIONS = 'OUT_OF_RATIONS'
export const TURNED_BACK = 'TURNED_BACK'
export type ExpeditionOutcome =
  | typeof REACHED_DESTINATION
  | typeof OUT_OF_RATIONS
  | typeof TURNED_BACK

export const ROLL_OUTCOME_FAILURE = 'ROLL_OUTCOME_FAILURE'
export const ROLL_OUTCOME_MIXED_SUCCESS = 'ROLL_OUTCOME_MIXED_SUCCESS'
export const ROLL_OUTCOME_STRONG_SUCCESS = 'ROLL_OUTCOME_STRONG_SUCCESS'
export type DiceRollOutcome =
  | typeof ROLL_OUTCOME_FAILURE
  | typeof ROLL_OUTCOME_MIXED_SUCCESS
  | typeof ROLL_OUTCOME_STRONG_SUCCESS
export interface DiceRoll {
  outcome: DiceRollOutcome
  rolls: number[]
}

// OUTCOMES

export const ADD_ITEM_TO_INVENTORY = 'ADD_ITEM_TO_INVENTORY'
export interface AddItemToInventoryEvent {
  type: typeof ADD_ITEM_TO_INVENTORY
  item: string
  quantity: number
}
export const addItemToInventory = (
  item: string,
  quantity: number
): AddItemToInventoryEvent => ({
  type: ADD_ITEM_TO_INVENTORY,
  item,
  quantity
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

export const COMPLETE_ACTIVE_ENCOUNTER = 'COMPLETE_ACTIVE_ENCOUNTER'
export interface CompleteActiveEncounterEvent {
  type: typeof COMPLETE_ACTIVE_ENCOUNTER
}
export const completeActiveEncounter = (): CompleteActiveEncounterEvent => ({
  type: COMPLETE_ACTIVE_ENCOUNTER
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

export const DICE_ROLL_OUTCOME = 'DICE_ROLL_OUTCOME'
export interface DiceRollOutcomeEvent {
  type: typeof DICE_ROLL_OUTCOME
  rolls: number[]
  outcome: DiceRollOutcome
}
export const diceRollOutcome = (
  rolls: number[],
  outcome: DiceRollOutcome
): DiceRollOutcomeEvent => ({
  type: DICE_ROLL_OUTCOME,
  rolls,
  outcome
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

// BIG UNION TYPES

export type GameErrorEvent = MoveNotAllowedErrorEvent

export type GameEvent =
  | AddItemToInventoryEvent
  | NewExpeditionEvent
  | DrawEncounterCardEvent
  | AdvanceExpeditionProgressEvent
  | CompleteActiveEncounterEvent
  | EndExpeditionEvent
  | DiceRollOutcomeEvent

export type GameMoveOutcome = GameEvent[] | GameErrorEvent
