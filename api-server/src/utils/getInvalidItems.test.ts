import { describe, expect, it } from '@jest/globals'
import { getInvalidItems, toInventoryPatch } from './getInvalidItems'

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
