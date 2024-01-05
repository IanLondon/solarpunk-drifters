import type { DiceFn } from '../types'

/** Bakes in given rolls, and checks that it was called with the expected `n` */
export const diceMockerFactory =
  (mockRolls: number[]): DiceFn =>
  (n) => {
    if (n !== mockRolls.length) {
      throw new Error(
        `diceMocker expected n=${mockRolls.length}, called with ${n}`
      )
    }

    return mockRolls
  }

export const noDice: DiceFn = (n) => {
  throw new Error('noDice fake was called')
}
