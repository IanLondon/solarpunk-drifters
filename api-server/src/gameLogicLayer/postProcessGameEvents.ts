import {
  ENCOUNTER_OUTCOME_FAILURE,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  ENCOUNTER_OUTCOME_STRONG_SUCCESS,
  type EncounterOutcome
} from '@solarpunk-drifters/common'
import { EXPEDITION_PROGRESS_AFTER_ENCOUNTER } from './constants'
import {
  GameEventTypes,
  type AddDrifterCards,
  type PlayConsequenceCardsEvent,
  type GameEvent
} from './gameEvents'
import { gameEventCreators } from './gameEvents'
import { type ConsequenceCardDeckFn, type DrifterCardDeckFn } from './types'

export type DrifterAndConsequenceCardGameEvents = Array<
  AddDrifterCards | PlayConsequenceCardsEvent
>

export const getDrifterAndConsequenceCards = async (args: {
  consequenceCardDeck: ConsequenceCardDeckFn
  drifterCardDeck: DrifterCardDeckFn
  outcome: EncounterOutcome
}): Promise<DrifterAndConsequenceCardGameEvents> => {
  const { outcome, consequenceCardDeck, drifterCardDeck } = args
  if (outcome === ENCOUNTER_OUTCOME_STRONG_SUCCESS) {
    const drifterCards = await Promise.all([
      drifterCardDeck(),
      drifterCardDeck()
    ])
    return [gameEventCreators.addDrifterCards(drifterCards)]
  } else if (outcome === ENCOUNTER_OUTCOME_MIXED_SUCCESS) {
    const consequenceCard = await consequenceCardDeck()
    const drifterCard = await drifterCardDeck()
    return [
      gameEventCreators.playConsequenceCards([consequenceCard]),
      gameEventCreators.addDrifterCards([drifterCard])
    ]
  } else if (outcome === ENCOUNTER_OUTCOME_FAILURE) {
    const consequenceCards = await Promise.all([
      consequenceCardDeck(),
      consequenceCardDeck()
    ])
    return [gameEventCreators.playConsequenceCards(consequenceCards)]
  }
  console.error(
    `getDrifterAndConsequenceCards got unexpected outcome ${outcome}`
  )
  return []
}

export async function postProcessGameEvents(args: {
  preGameEvents: GameEvent[]
  outcomeToCardGameEventsFn: (
    outcome: EncounterOutcome
  ) => Promise<DrifterAndConsequenceCardGameEvents>
}): Promise<GameEvent[]> {
  const { preGameEvents, outcomeToCardGameEventsFn } = args

  const result: GameEvent[] = []
  for (const gameEvent of preGameEvents) {
    // assume postProcessing game events always follow immediately after
    // the game events that trigger them.
    result.push(gameEvent)

    if (gameEvent.type === GameEventTypes.ENCOUNTER_RESULT) {
      const drifterAndConsequencesCards = await outcomeToCardGameEventsFn(
        gameEvent.encounterResult.outcome
      )

      result.push(
        gameEventCreators.advanceExpeditionProgress(
          EXPEDITION_PROGRESS_AFTER_ENCOUNTER
        )
      )

      result.push(...drifterAndConsequencesCards)
    }
  }

  return result
}
