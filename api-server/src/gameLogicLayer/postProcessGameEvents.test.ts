import { describe, expect, it } from '@jest/globals'
import {
  type DrifterAndConsequenceCardGameEvents,
  getDrifterAndConsequenceCards,
  postProcessGameEvents
} from './postProcessGameEvents'
import * as gameEvents from './gameEvents'
import { EXPEDITION_PROGRESS_AFTER_ENCOUNTER } from './constants'
import {
  ENCOUNTER_OUTCOME_FAILURE,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  ENCOUNTER_OUTCOME_STRONG_SUCCESS,
  type EncounterOutcome,
  type EncounterResult
} from '@solarpunk-drifters/common'

const consequencesMock = async (
  outcome: EncounterOutcome
): Promise<DrifterAndConsequenceCardGameEvents> => {
  return ['fake-consequences-and-drifter-card-events' as any]
}

describe('postProcessGameEvents', () => {
  it('should pass-through empty array', async () => {
    const output = await postProcessGameEvents({
      preGameEvents: [],
      outcomeToCardGameEventsFn: consequencesMock
    })
    expect(output).toHaveLength(0)
  })

  it('should pass-through arbitrary events', async () => {
    // make up an event so it definitely doesn't have any mechanism to handle it
    const preGameEvents: any[] = [{ type: 'fakeGameEventForTesting' }]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const output = await postProcessGameEvents({
      preGameEvents,
      outcomeToCardGameEventsFn: consequencesMock
    })
    expect(output).toEqual(preGameEvents)
  })

  it(
    `should add ${EXPEDITION_PROGRESS_AFTER_ENCOUNTER}km expedition progress after` +
      'any encounter result event, and add Consequence Card and Drifter Card events',
    async () => {
      const someEncounterResult: EncounterResult = {
        outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
      }
      const preGameEvents = [gameEvents.encounterResult(someEncounterResult)]
      const output = await postProcessGameEvents({
        preGameEvents,
        outcomeToCardGameEventsFn: consequencesMock
      })

      expect(output).toEqual([
        gameEvents.encounterResult(someEncounterResult),
        gameEvents.advanceExpeditionProgress(
          EXPEDITION_PROGRESS_AFTER_ENCOUNTER
        ),
        'fake-consequences-and-drifter-card-events'
      ])
    }
  )
})

describe('getDrifterAndConsequenceCards', () => {
  const makeFakeDeck = (...args: string[]): (() => Promise<string>) => {
    const ids = [...args]
    return async () => {
      const result = ids.shift()
      if (result === undefined) {
        throw new Error('fake deck called more times than expected')
      }
      return result
    }
  }
  it('should add 2 Consequence Cards after a "failure" encounter result', async () => {
    const outcome = ENCOUNTER_OUTCOME_FAILURE

    const output = await getDrifterAndConsequenceCards({
      consequenceCardDeck: makeFakeDeck(
        'consequence-card-a',
        'consequence-card-b'
      ),
      drifterCardDeck: makeFakeDeck(),
      outcome
    })

    expect(output).toEqual([
      gameEvents.playConsequenceCards([
        'consequence-card-a',
        'consequence-card-b'
      ])
    ])
  })

  it('should add 1 Consequence Card and 1 Drifter Card after a "mixed success" encounter result', async () => {
    const outcome = ENCOUNTER_OUTCOME_MIXED_SUCCESS

    const output = await getDrifterAndConsequenceCards({
      consequenceCardDeck: makeFakeDeck('consequence-card-a'),
      drifterCardDeck: makeFakeDeck('drifter-card-a'),
      outcome
    })

    expect(output).toEqual(
      expect.arrayContaining([gameEvents.addDrifterCards(['drifter-card-a'])])
    )
    expect(output).toEqual(
      expect.arrayContaining([
        gameEvents.playConsequenceCards(['consequence-card-a'])
      ])
    )
    expect(output).toHaveLength(2)
  })

  it('should add 2 Drifter Cards after a "strong success" encounter result', async () => {
    const outcome = ENCOUNTER_OUTCOME_STRONG_SUCCESS

    const output = await getDrifterAndConsequenceCards({
      consequenceCardDeck: makeFakeDeck(),
      drifterCardDeck: makeFakeDeck('drifter-card-a', 'drifter-card-b'),
      outcome
    })

    expect(output).toEqual([
      gameEvents.addDrifterCards(['drifter-card-a', 'drifter-card-b'])
    ])
  })
})
