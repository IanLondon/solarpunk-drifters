import { describe, expect, it } from '@jest/globals'
import {
  arrayToAdditionInventoryPatch,
  getInvalidItems,
  toInventoryPatch
} from './getInvalidItems'

describe('arrayToAdditionInventoryPatch', () => {
  it('should convert an array of ids to a patch', () => {
    const ids = ['a', 'b', 'c', 'c', 'c', 'x', 'a']
    const result = arrayToAdditionInventoryPatch(ids)
    expect(result).toEqual({
      a: 2,
      b: 1,
      c: 3,
      x: 1
    })
  })
})

describe('getInvalidItems', () => {
  it('should ignore any positive values in the patch', () => {
    const inventory = { rations: 3 }
    const inventoryPatch = toInventoryPatch({ rations: 6, otherItem: 42 })

    expect(getInvalidItems({ inventory, inventoryPatch })).toHaveLength(0)
  })

  it('should return no invalid items if required items are sufficient', () => {
    const inventory = {
      rations: 3,
      testItem: 42
    }
    const inventoryPatch = toInventoryPatch({
      rations: -2,
      testItem: -5
    })

    const result = getInvalidItems({ inventory, inventoryPatch })

    expect(result).toHaveLength(0)
  })

  it('should return a list of insufficient items if any items are too low', () => {
    const inventory = {
      rations: 3,
      testItem: 42
    }
    const inventoryPatch = toInventoryPatch({
      rations: -2,
      testItem: -999,
      itemYouDoNotHave: -5
    })

    const result = getInvalidItems({ inventory, inventoryPatch })

    expect(result).toEqual(
      expect.arrayContaining(['testItem', 'itemYouDoNotHave'])
    )
    expect(result).toHaveLength(2)
  })
})
