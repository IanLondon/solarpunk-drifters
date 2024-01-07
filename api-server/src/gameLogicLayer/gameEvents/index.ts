import {
  type EncounterResult,
  type ExpeditionProgress
} from '@solarpunk-drifters/common'
import type { InventoryPatch } from '../../types'
import type { GameErrorEvent } from './gameErrorEvents'
import { type MarkOptional } from 'ts-essentials'

export * from './gameErrorEvents'

// TODO: factor out new types! This should become a ClientEvent in the OpenAPI def
export const REACHED_DESTINATION = 'REACHED_DESTINATION'
export const OUT_OF_RATIONS = 'OUT_OF_RATIONS'
export const TURNED_BACK = 'TURNED_BACK'
export type ExpeditionOutcome =
  | typeof REACHED_DESTINATION
  | typeof OUT_OF_RATIONS
  | typeof TURNED_BACK

// GAME EVENTS

export enum GameEventTypes {
  ADD_DRIFTER_CARDS = 'ADD_DRIFTER_CARDS',
  ADD_SUBTRACT_INVENTORY_ITEMS = 'ADD_SUBTRACT_INVENTORY_ITEMS',
  ADVANCE_EXPEDITION_PROGRESS = 'ADVANCE_EXPEDITION_PROGRESS',
  DRAW_ENCOUNTER_CARD = 'DRAW_ENCOUNTER_CARD',
  ENCOUNTER_RESULT = 'ENCOUNTER_RESULT',
  END_EXPEDITION = 'END_EXPEDITION',
  NEW_EXPEDITION = 'NEW_EXPEDITION',
  PLAY_CONSEQUENCE_CARDS = 'PLAY_CONSEQUENCE_CARDS'
}

export interface AddDrifterCards {
  type: GameEventTypes.ADD_DRIFTER_CARDS
  drifterCardIds: string[]
}
export interface AddSubstractInventoryItems {
  type: GameEventTypes.ADD_SUBTRACT_INVENTORY_ITEMS
  itemPatch: InventoryPatch
}
export interface NewExpeditionEvent extends ExpeditionProgress {
  type: GameEventTypes.NEW_EXPEDITION
}

export interface PlayConsequenceCardsEvent {
  type: GameEventTypes.PLAY_CONSEQUENCE_CARDS
  consequenceCardIds: string[]
}
export interface AdvanceExpeditionProgressEvent {
  type: GameEventTypes.ADVANCE_EXPEDITION_PROGRESS
  increment: number
}
export interface DrawEncounterCardEvent {
  type: GameEventTypes.DRAW_ENCOUNTER_CARD
  cardId: string
}

export interface EndExpeditionEvent {
  type: GameEventTypes.END_EXPEDITION
  outcome: ExpeditionOutcome
}

export interface EncounterResultEvent {
  type: GameEventTypes.ENCOUNTER_RESULT
  encounterResult: EncounterResult
}

export const gameEventCreators = {
  addDrifterCards: (drifterCardIds: string[]): AddDrifterCards => ({
    type: GameEventTypes.ADD_DRIFTER_CARDS,
    drifterCardIds
  }),

  addSubtractInventoryItems: (
    itemPatch: AddSubstractInventoryItems['itemPatch']
  ): AddSubstractInventoryItems => ({
    type: GameEventTypes.ADD_SUBTRACT_INVENTORY_ITEMS,
    itemPatch
  }),

  newExpedition: (distances: ExpeditionProgress): NewExpeditionEvent => ({
    ...distances,
    type: GameEventTypes.NEW_EXPEDITION
  }),

  playConsequenceCards: (
    consequenceCardIds: string[]
  ): PlayConsequenceCardsEvent => ({
    type: GameEventTypes.PLAY_CONSEQUENCE_CARDS,
    consequenceCardIds
  }),

  drawEncounterCard: (cardId: string): DrawEncounterCardEvent => ({
    type: GameEventTypes.DRAW_ENCOUNTER_CARD,
    cardId
  }),

  advanceExpeditionProgress: (
    increment: number
  ): AdvanceExpeditionProgressEvent => ({
    type: GameEventTypes.ADVANCE_EXPEDITION_PROGRESS,
    increment
  }),

  endExpedition: (outcome: ExpeditionOutcome): EndExpeditionEvent => ({
    type: GameEventTypes.END_EXPEDITION,
    outcome
  }),

  encounterResult: (
    args: MarkOptional<EncounterResult, 'consequenceCardIds'>
  ): EncounterResultEvent => ({
    type: GameEventTypes.ENCOUNTER_RESULT,
    encounterResult: {
      ...args,
      consequenceCardIds: args.consequenceCardIds ?? []
    }
  })
}

// ERRORS

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
