/** Represents a set of additions and subtractions to an inventory.
 *  Positive quantities add, negative quantities subtract.
 * */
export type InventoryPatch = Readonly<Record<string, number>> & {
  _inventoryPatchBrand: any
}
