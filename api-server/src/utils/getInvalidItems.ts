import type { InventoryPatch } from '../types'

export function toInventoryPatch(
  inventoryPatch: Record<string, number>
): InventoryPatch {
  return inventoryPatch as InventoryPatch
}

/** Returns names of any items that have insufficent quanitities to be removed. */
export function getInvalidItems(args: {
  inventory: Readonly<Record<string, number>>
  inventoryPatch: InventoryPatch
}): string[] {
  const { inventory, inventoryPatch } = args
  const invalidItems = Object.entries(inventoryPatch).flatMap(
    ([item, diff]) => {
      const inventoryQuantity = inventory[item] ?? 0
      return inventoryQuantity + diff >= 0 ? [] : item
    }
  )

  return invalidItems
}
