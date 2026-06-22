export type GameId = 'wordguess' | 'groups' | 'nbagroups' | 'mathcrossword' | 'nbatrivia'

export interface GameProgress {
  date: string
  status: 'in-progress' | 'won' | 'lost'
  data: unknown
}

export interface GameStats {
  played: number
  won: number
  currentStreak: number
  maxStreak: number
  distribution: Record<string, number>
}

function storageKey(game: GameId, suffix: string): string {
  return `puzzlehub:${game}:${suffix}`
}

export function getProgress(game: GameId): GameProgress | null {
  const raw = localStorage.getItem(storageKey(game, 'progress'))
  if (!raw) return null
  return JSON.parse(raw) as GameProgress
}

export function saveProgress(game: GameId, progress: GameProgress): void {
  localStorage.setItem(storageKey(game, 'progress'), JSON.stringify(progress))
}

export function getStats(game: GameId): GameStats {
  const raw = localStorage.getItem(storageKey(game, 'stats'))
  if (!raw) {
    return { played: 0, won: 0, currentStreak: 0, maxStreak: 0, distribution: {} }
  }
  return JSON.parse(raw) as GameStats
}

export function saveStats(game: GameId, stats: GameStats): void {
  localStorage.setItem(storageKey(game, 'stats'), JSON.stringify(stats))
}

export function isTodayComplete(game: GameId, todayKey: string): boolean {
  const progress = getProgress(game)
  return progress !== null && progress.date === todayKey && progress.status !== 'in-progress'
}

export function isTodayStarted(game: GameId, todayKey: string): boolean {
  const progress = getProgress(game)
  return progress !== null && progress.date === todayKey
}
