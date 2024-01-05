import { describe, expect, it } from '@jest/globals'
import { getInvalidItems } from './getInvalidItems'

describe('getInvalidItems', () => {
  it('should throw an error if any itemsToRemove are negative', () => {
    const inventory = { rations: 3 }
    const itemsToRemove = { rations: -1 }

    expect(() => getInvalidItems({ inventory, itemsToRemove })).toThrow(
      /negative requiredItems value/
    )
  })

  it('should return true if required items are sufficient', () => {
    const inventory = {
      rations: 3,
      testItem: 42
    }
    const itemsToRemove = {
      rations: 2,
      testItem: 5
    }

    const result = getInvalidItems({ inventory, itemsToRemove })

    expect(result).toHaveLength(0)
  })

  it('should return a list of insufficient items if any items are too low', () => {
    const inventory = {
      rations: 3,
      testItem: 42
    }
    const itemsToRemove = {
      rations: 2,
      testItem: 999,
      itemYouDoNotHave: 5
    }

    const result = getInvalidItems({ inventory, itemsToRemove })

    expect(result).toEqual(
      expect.arrayContaining(['testItem', 'itemYouDoNotHave'])
    )
    expect(result).toHaveLength(2)
  })
})
