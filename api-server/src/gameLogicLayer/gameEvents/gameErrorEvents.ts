export enum GameErrorEventTypes {
  MOVE_NOT_ALLOWED = 'MOVE_NOT_ALLOWED',
  NOT_ENOUGH_CONSUMABLES = 'NOT_ENOUGH_CONSUMABLES'
}

export interface ErrorEvent {
  type: string
  error: true
}

export interface MoveNotAllowedErrorEvent extends ErrorEvent {
  type: GameErrorEventTypes.MOVE_NOT_ALLOWED
}

export interface NotEnoughConsumablesErrorEvent extends ErrorEvent {
  type: GameErrorEventTypes.NOT_ENOUGH_CONSUMABLES
  items: string[]
  resources: string[]
}

export const gameEventErrorCreators = {
  moveNotAllowedError: (): MoveNotAllowedErrorEvent => ({
    error: true,
    type: GameErrorEventTypes.MOVE_NOT_ALLOWED
  }),
  notEnoughConsumablesError: (args: {
    items: string[]
    resources: []
  }): NotEnoughConsumablesErrorEvent => ({
    ...args,
    error: true,
    type: GameErrorEventTypes.NOT_ENOUGH_CONSUMABLES
  })
}

export type GameErrorEvent =
  | MoveNotAllowedErrorEvent
  | NotEnoughConsumablesErrorEvent
