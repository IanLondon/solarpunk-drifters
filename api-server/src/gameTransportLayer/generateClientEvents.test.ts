import { describe, expect, it } from '@jest/globals'
import { generateClientEvents } from '.'
import * as gameEvents from '../gameLogicLayer/gameEvents'
import {
  type ClientEvent,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  type EncounterResult,
  clientEventCreators
} from '@solarpunk-drifters/common'

describe('generateClientEvents', () => {
  it('should not generate anything given irrelevant GameEvents', () => {
    const input = [
      gameEvents.addSubtractInventoryItems({}),
      gameEvents.drawEncounterCard('some-id'),
      gameEvents.advanceExpeditionProgress(42)
    ]

    const output = generateClientEvents(input)

    expect(output).toHaveLength(0)
  })

  it('should generate Encounter Result ClientEvent from Encounter Result GameEvent', () => {
    const someEncounterResult: EncounterResult = {
      outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
    }
    const input = [gameEvents.encounterResult(someEncounterResult)]
    const expectedClientEvents: ClientEvent[] = [
      clientEventCreators.encounterResult(someEncounterResult)
    ]

    const output = generateClientEvents(input)

    expect(output).toEqual(expectedClientEvents)
  })

  // TODO. Needs to be implemented in OpenAPI first
  //   it('should generate End Expedition ClientEvent from End Expedition GameEvent', () => {
  //     ...
  //   })
})
