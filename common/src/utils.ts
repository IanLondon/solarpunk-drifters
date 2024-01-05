export function getRandomD6(): number {
  return Math.floor(Math.random() * 6) + 1
}

export function getRandomND6(n: number): number[] {
  return Array.from({ length: n }, () => getRandomD6())
}
