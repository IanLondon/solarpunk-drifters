import { describe, expect, it } from '@jest/globals'
import {
  moveNotAllowedError,
  drawEncounterCard,
  newExpedition,
  endExpedition,
  TURNED_BACK
} from './events'
import { beginExpedition, nextEncounter, turnBack } from './expeditionMoves'
import { EXPEDITION_DISTANCE, INITIAL_EXPEDITION_PROGRESS } from './constants'
import { type EncounterCardDeckFn } from './types'

// TODO IMMEDIATELY import these
const LOADOUT = 'LOADOUT' as const
const BETWEEN_ENCOUNTERS = 'BETWEEN_ENCOUNTERS' as const
const ACTIVE_ENCOUNTER = 'ACTIVE_ENCOUNTER' as const

// TODO LATER import these too
export const NOT_LOADOUT = [BETWEEN_ENCOUNTERS, ACTIVE_ENCOUNTER]
export const NOT_BETWEEN_ENCOUNTERS = [LOADOUT, ACTIVE_ENCOUNTER]
export const NOT_ACTIVE_ENCOUNTER = [LOADOUT, BETWEEN_ENCOUNTERS]

// TODO hook up to mocks
const MOCK_ENCOUNTER_CARD_ID = 'mock-encounter-card-id'

// const diceMockerFactory =
//   (
//     outcome: DiceRollOutcome,
//     rolls: number[],
//     expectedN: number,
//     expectedModifier: number
//   ) =>
//   (n: number, modifier: number): DiceRoll => {
//     if (n !== expectedN) {
//       throw new Error(`diceMocker expected n=${expectedN}, called with ${n}`)
//     }
//     if (modifier !== expectedModifier) {
//       throw new Error(
//         `diceMocker expected modifier=${expectedModifier}, called with ${modifier}`
//       )
//     }
//     return {
//       outcome,
//       rolls
//     }
//   }

// const noDice = (n: number, modifier: number): DiceRoll => {
//   throw new Error('noDice fake was called')
// }

const encounterCardDeckMocker: EncounterCardDeckFn = async () =>
  MOCK_ENCOUNTER_CARD_ID

describe('expedition moves', () => {
  describe('begin expedition', () => {
    it('should begin new expedition and start an active encounter', async () => {
      const output = await beginExpedition(LOADOUT, encounterCardDeckMocker)

      expect(output).toEqual([
        drawEncounterCard(MOCK_ENCOUNTER_CARD_ID),
        newExpedition({
          current: INITIAL_EXPEDITION_PROGRESS,
          total: EXPEDITION_DISTANCE
        })
      ])
    })

    NOT_LOADOUT.forEach((gameMode) => {
      it(`should give an error when in any mode but loadout (${gameMode})`, async () => {
        const output = await beginExpedition(gameMode, encounterCardDeckMocker)
        expect(output).toEqual(moveNotAllowedError())
      })
    })
  })

  describe('next encounter', () => {
    it('should start a new encounter', async () => {
      const output = await nextEncounter(
        BETWEEN_ENCOUNTERS,
        encounterCardDeckMocker
      )

      expect(output).toEqual([drawEncounterCard(MOCK_ENCOUNTER_CARD_ID)])
    })

    NOT_BETWEEN_ENCOUNTERS.forEach((gameMode) => {
      it(`should give an error when in any mode but "between encounters" (${gameMode})`, async () => {
        const output = await nextEncounter(gameMode, encounterCardDeckMocker)

        expect(output).toEqual(moveNotAllowedError())
      })
    })
  })
})

describe('turn back', () => {
  it('should end the expedition', async () => {
    const output = await turnBack(BETWEEN_ENCOUNTERS)

    expect(output).toEqual([endExpedition(TURNED_BACK)])
  })

  NOT_BETWEEN_ENCOUNTERS.forEach((gameMode) => {
    it(`should give an error when in any mode but "between encounters" (${gameMode})`, async () => {
      const output = await turnBack(gameMode)
      expect(output).toEqual(moveNotAllowedError())
    })
  })
})

describe('encounter card choice', () => {
  it('should generate a dice roll and a game state update', () => {
    // NOTE: this will probably call a few fns (prob faked here, passed in as args)
    //   TODO
    // no more encounter card
    // expect(output.activeEncounterCardId).toBeUndefined()
  })
  it('should give an error when in any mode but "active encounter"', () => {
    // TODO
  })
})

describe('play drifter card', () => {
  it('should play the selected drifter card when "between encounters"', () => {
    // TODO
    // NOTE: this will probably call a few fns (prob faked here, passed in as args)
  })
  it('should give an error when in any mode but "between encounters"', () => {
    // TODO
  })
})
