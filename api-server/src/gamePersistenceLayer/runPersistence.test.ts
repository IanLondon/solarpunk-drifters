import { describe, expect, it } from '@jest/globals'
import runPersistence from '.'
import { type GameState } from '@solarpunk-drifters/common'
import { drawEncounterCard } from '../gameLogicLayer/events'
import { type GameEventPersistor } from './types'

function dummyGetGameState(
  beforePersistence: any,
  afterPersistence: any
): () => Promise<GameState> {
  const gameStateReturns = [beforePersistence, afterPersistence] as GameState[]
  const getGameState = async (): Promise<GameState> => {
    const res = gameStateReturns.shift()
    if (res === undefined) {
      throw new Error('dummy getGameState called more than twice')
    }
    return res
  }
  return getGameState
}

describe('runPersistence', () => {
  it('should generate a patch ', async () => {
    const getGameState = dummyGetGameState({ a: 1 }, { a: 2, b: 5 })
    const gameEvents = [drawEncounterCard('some-id')]
    const persistor: GameEventPersistor = async (e) => []

    const patch = await runPersistence(gameEvents, persistor, getGameState)

    expect(patch).toEqual(
      expect.arrayContaining([
        { op: 'replace', path: '/a', value: 2 },
        { op: 'add', path: '/b', value: 5 }
      ])
    )
    expect(patch).toHaveLength(2)
  })
})
