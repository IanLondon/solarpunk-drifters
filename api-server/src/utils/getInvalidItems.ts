/** Returns names of any items that have insufficent quanitities to be removed. */
export function getInvalidItems(args: {
  inventory: Readonly<Record<string, number>>
  itemsToRemove: Readonly<Record<string, number>>
}): string[] {
  const { inventory, itemsToRemove } = args
  const invalidItems = Object.entries(itemsToRemove).flatMap(
    ([item, quantity]) => {
      if (quantity < 0) {
        throw new Error(
          'getInvalidItems did not expect negative requiredItems value'
        )
      }
      const inventoryCount = inventory[item] ?? 0
      return inventoryCount >= quantity ? [] : item
    }
  )

  return invalidItems
}
