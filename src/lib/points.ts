import type { GameId } from './storage'

export interface PointsState {
  total: number
  balance: number
  history: PointEntry[]
}

export interface PointEntry {
  date: string
  game: GameId
  amount: number
  reason: string
}

export interface UnlockedItems {
  themes: string[]
  tileSkins: string[]
  palettes: string[]
}

const POINTS_KEY = 'puzzlehub:points'
const UNLOCKED_KEY = 'puzzlehub:unlocked'

export function getPoints(): PointsState {
  const raw = localStorage.getItem(POINTS_KEY)
  if (!raw) return { total: 0, balance: 0, history: [] }
  return JSON.parse(raw) as PointsState
}

function savePoints(state: PointsState) {
  localStorage.setItem(POINTS_KEY, JSON.stringify(state))
  queueRewardsSync()
}

export function addPoints(game: GameId, amount: number, reason: string): PointsState {
  if (amount <= 0) return getPoints()
  const state = getPoints()
  const entry: PointEntry = {
    date: new Date().toISOString().split('T')[0],
    game,
    amount,
    reason,
  }
  state.total += amount
  state.balance += amount
  state.history = [entry, ...state.history].slice(0, 50)
  savePoints(state)
  return state
}

export function spendPoints(amount: number): boolean {
  const state = getPoints()
  if (state.balance < amount) return false
  state.balance -= amount
  savePoints(state)
  return true
}

export function getUnlocked(): UnlockedItems {
  const raw = localStorage.getItem(UNLOCKED_KEY)
  if (!raw) return { themes: ['light', 'dark'], tileSkins: ['classic'], palettes: ['classic'] }
  return JSON.parse(raw) as UnlockedItems
}

function saveUnlocked(items: UnlockedItems) {
  localStorage.setItem(UNLOCKED_KEY, JSON.stringify(items))
  queueRewardsSync()
}

export function unlockItem(category: keyof UnlockedItems, id: string): boolean {
  const items = getUnlocked()
  if (items[category].includes(id)) return true
  items[category].push(id)
  saveUnlocked(items)
  return true
}

export function isUnlocked(category: keyof UnlockedItems, id: string): boolean {
  return getUnlocked()[category].includes(id)
}

export function calculatePoints(
  game: GameId,
  result: 'won' | 'lost',
  detail: Record<string, number>
): { amount: number; reason: string } {
  if (result === 'lost') {
    return { amount: 0, reason: '' }
  }

  let amount = 0
  let reason = ''

  switch (game) {
    case 'wordguess': {
      const guesses = detail.guesses ?? 6
      const scale = [100, 80, 60, 40, 25, 15]
      amount = scale[Math.min(guesses - 1, 5)]
      reason = `Word Guess (${guesses}/6)`
      break
    }
    case 'groups':
    case 'nbagroups': {
      const mistakes = detail.mistakes ?? 4
      const scale = [80, 60, 40, 20]
      amount = scale[Math.min(mistakes, 3)]
      const label = game === 'nbagroups' ? 'NBA Groups' : 'Groups'
      reason = `${label} (${mistakes} mistakes)`
      break
    }
    case 'mathcrossword': {
      const diff = detail.difficulty ?? 0
      const scale = [30, 50, 80]
      amount = scale[Math.min(diff, 2)]
      const labels = ['Easy', 'Medium', 'Hard']
      reason = `Math Cross (${labels[diff]})`
      break
    }
    case 'nbatrivia': {
      const score = detail.score ?? 0
      const scale: Record<number, number> = { 5: 75, 4: 50, 3: 30, 2: 10 }
      amount = scale[score] ?? 0
      reason = `NBA Trivia (${score}/5)`
      break
    }
  }

  const streak = detail.streak ?? 0
  if (streak > 1) {
    const bonus = (streak - 1) * 10
    amount += bonus
    reason += ` +${bonus} streak`
  }

  return { amount, reason }
}

function queueRewardsSync() {
  import('./supabase').then(({ supabase }) => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return
      import('./cloudSync').then(({ pushRewardsToCloud }) => {
        pushRewardsToCloud(session.user.id)
      })
    })
  }).catch(() => {})
}
