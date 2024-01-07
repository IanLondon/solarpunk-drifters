import { describe, expect, it } from '@jest/globals'
import { generateClientEvents } from '.'
import { gameEventCreators } from '../gameLogicLayer/gameEvents'
import {
  type ClientEvent,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  clientEventCreators,
  type EncounterResult
} from '@solarpunk-drifters/common'
import { toInventoryPatch } from '../utils/getInvalidItems'

describe('generateClientEvents', () => {
  it('should not generate anything given irrelevant GameEvents', () => {
    const input = [
      gameEventCreators.addSubtractInventoryItems(toInventoryPatch({})),
      gameEventCreators.drawEncounterCard('some-id'),
      gameEventCreators.advanceExpeditionProgress(42)
    ]

    const output = generateClientEvents(input)

    expect(output).toHaveLength(0)
  })

  it('should generate Encounter Result ClientEvent from Encounter Result GameEvent', () => {
    const someEncounterResult: EncounterResult = {
      consequenceCardIds: [],
      outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
    }
    const input = [gameEventCreators.encounterResult(someEncounterResult)]
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
