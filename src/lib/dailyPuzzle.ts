const EPOCH = new Date('2026-06-17').getTime()

export function getTodayKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function getDayIndex(): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.floor((today - EPOCH) / 86_400_000)
}

export function pickPuzzle<T>(puzzles: T[]): T {
  const idx = ((getDayIndex() % puzzles.length) + puzzles.length) % puzzles.length
  return puzzles[idx]
}
