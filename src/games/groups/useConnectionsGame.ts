import { useState, useCallback, useMemo } from 'react'
import { pickPuzzle, getTodayKey, getDayIndex } from '../../lib/dailyPuzzle'
import { getProgress, saveProgress, getStats, saveStats, type GameId } from '../../lib/storage'
import { calculatePoints, addPoints } from '../../lib/points'
import type { GroupDef, GroupsPuzzle, Difficulty } from '../../data/groups/puzzles'

const MAX_MISTAKES = 4

export type GameStatus = 'playing' | 'won' | 'lost'

export interface SolvedGroup {
  category: string
  words: string[]
  difficulty: Difficulty
}

interface GroupsState {
  solvedGroups: SolvedGroup[]
  remainingWords: string[]
  selectedWords: Set<string>
  mistakesLeft: number
  status: GameStatus
  todayKey: string
  animatingGroup: SolvedGroup | null
  shaking: boolean
  oneAway: boolean
}

const DIFFICULTY_ORDER: Difficulty[] = ['yellow', 'green', 'blue', 'purple']

function shuffleWithSeed(arr: string[], seed: number): string[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function useConnectionsGame(gameId: GameId, puzzles: GroupsPuzzle[], shareLabel: string) {
  const todayKey = getTodayKey()
  const puzzle = pickPuzzle(puzzles)
  const dayIndex = getDayIndex()

  const groupMap = useMemo(() => {
    const map = new Map<string, GroupDef>()
    for (const g of puzzle.groups) {
      for (const w of g.words) {
        map.set(w, g)
      }
    }
    return map
  }, [puzzle])

  const [state, setState] = useState<GroupsState>(() => {
    const saved = getProgress(gameId)
    if (saved && saved.date === todayKey) {
      const data = saved.data as {
        solvedGroups: SolvedGroup[]
        remainingWords: string[]
        mistakesLeft: number
      }
      const allSolved = data.solvedGroups.length === 4
      const lost = data.mistakesLeft <= 0 && !allSolved
      return {
        solvedGroups: data.solvedGroups,
        remainingWords: data.remainingWords,
        selectedWords: new Set(),
        mistakesLeft: data.mistakesLeft,
        status: allSolved ? 'won' : lost ? 'lost' : 'playing',
        todayKey,
        animatingGroup: null,
        shaking: false,
        oneAway: false,
      }
    }

    const allWords = puzzle.groups.flatMap((g) => g.words)
    return {
      solvedGroups: [],
      remainingWords: shuffleWithSeed(allWords, dayIndex + 1),
      selectedWords: new Set(),
      mistakesLeft: MAX_MISTAKES,
      status: 'playing',
      todayKey,
      animatingGroup: null,
      shaking: false,
      oneAway: false,
    }
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null)

  const showToast = useCallback((msg: string, duration = 1500) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), duration)
  }, [])

  const persist = useCallback((solvedGroups: SolvedGroup[], remainingWords: string[], mistakesLeft: number, status: GameStatus) => {
    saveProgress(gameId, {
      date: todayKey,
      status: status === 'playing' ? 'in-progress' : status,
      data: { solvedGroups, remainingWords, mistakesLeft },
    })
  }, [gameId, todayKey])

  const finishGame = useCallback((won: boolean, mistakesUsed: number) => {
    const stats = getStats(gameId)
    stats.played += 1
    if (won) {
      stats.won += 1
      stats.currentStreak += 1
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
      const key = String(mistakesUsed)
      stats.distribution[key] = (stats.distribution[key] ?? 0) + 1
    } else {
      stats.currentStreak = 0
    }
    saveStats(gameId, stats)
  }, [gameId])

  const toggleWord = useCallback((word: string) => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.animatingGroup) return prev
      const next = new Set(prev.selectedWords)
      if (next.has(word)) {
        next.delete(word)
      } else {
        if (next.size >= 4) return prev
        next.add(word)
      }
      return { ...prev, selectedWords: next, shaking: false, oneAway: false }
    })
  }, [])

  const deselectAll = useCallback(() => {
    setState((prev) => ({ ...prev, selectedWords: new Set(), shaking: false, oneAway: false }))
  }, [])

  const shuffle = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev
      const shuffled = [...prev.remainingWords]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return { ...prev, remainingWords: shuffled }
    })
  }, [])

  const submitGuess = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.selectedWords.size !== 4 || prev.animatingGroup) return prev

      const selected = [...prev.selectedWords]
      const targetGroup = groupMap.get(selected[0])!
      const allMatch = selected.every((w) => groupMap.get(w) === targetGroup)

      if (allMatch) {
        const solved: SolvedGroup = {
          category: targetGroup.category,
          words: [...targetGroup.words],
          difficulty: targetGroup.difficulty,
        }
        return { ...prev, animatingGroup: solved, shaking: false, oneAway: false }
      }

      const isOneAway = selected.some((w) => {
        const g = groupMap.get(w)!
        return selected.filter((w2) => groupMap.get(w2) === g).length === 3
      })

      const newMistakes = prev.mistakesLeft - 1

      if (isOneAway) showToast('One away!')

      if (newMistakes <= 0) {
        const allRemaining = puzzle.groups
          .filter((g) => !prev.solvedGroups.some((s) => s.category === g.category))
          .sort((a, b) => DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty))
          .map((g) => ({ category: g.category, words: [...g.words], difficulty: g.difficulty }))

        const newSolved = [...prev.solvedGroups, ...allRemaining]
        persist(newSolved, [], 0, 'lost')
        finishGame(false, MAX_MISTAKES)
        const { amount, reason } = calculatePoints(gameId, 'lost', { mistakes: MAX_MISTAKES })
        if (amount > 0) {
          addPoints(gameId, amount, reason)
          setPointsAwarded(amount)
          setTimeout(() => setPointsAwarded(null), 2000)
        }

        return {
          ...prev, solvedGroups: newSolved, remainingWords: [], selectedWords: new Set(),
          mistakesLeft: 0, status: 'lost' as GameStatus, shaking: true, oneAway: isOneAway,
        }
      }

      persist(prev.solvedGroups, prev.remainingWords, newMistakes, 'playing')
      return { ...prev, selectedWords: new Set(), mistakesLeft: newMistakes, shaking: true, oneAway: isOneAway }
    })
  }, [groupMap, persist, finishGame, showToast, puzzle.groups])

  const onAnimationComplete = useCallback(() => {
    setState((prev) => {
      if (!prev.animatingGroup) return prev
      const solved = prev.animatingGroup
      const newSolved = [...prev.solvedGroups, solved]
      const newRemaining = prev.remainingWords.filter((w) => !solved.words.includes(w))
      const won = newSolved.length === 4
      const newStatus: GameStatus = won ? 'won' : 'playing'

      persist(newSolved, newRemaining, prev.mistakesLeft, newStatus)
      if (won) {
        finishGame(true, MAX_MISTAKES - prev.mistakesLeft)
        const stats = getStats(gameId)
        const { amount, reason } = calculatePoints(
          gameId, 'won',
          { mistakes: MAX_MISTAKES - prev.mistakesLeft, streak: stats.currentStreak }
        )
        if (amount > 0) {
          addPoints(gameId, amount, reason)
          setPointsAwarded(amount)
          setTimeout(() => setPointsAwarded(null), 2000)
        }
      }

      return {
        ...prev, solvedGroups: newSolved, remainingWords: newRemaining,
        selectedWords: new Set(), animatingGroup: null, status: newStatus,
      }
    })
  }, [persist, finishGame])

  const generateShareText = (): string => {
    const mistakesUsed = MAX_MISTAKES - state.mistakesLeft
    const difficultyEmoji: Record<Difficulty, string> = {
      yellow: '🟨', green: '🟩', blue: '🟦', purple: '🟪',
    }
    const grid = state.solvedGroups.map((g) => difficultyEmoji[g.difficulty].repeat(4)).join('\n')
    return `Daily Puzzle Hub - ${shareLabel} #${dayIndex}\nMistakes: ${mistakesUsed}\n\n${grid}`
  }

  return {
    solvedGroups: state.solvedGroups, remainingWords: state.remainingWords,
    selectedWords: state.selectedWords, mistakesLeft: state.mistakesLeft,
    status: state.status, animatingGroup: state.animatingGroup,
    shaking: state.shaking, oneAway: state.oneAway, toastMessage, pointsAwarded,
    maxMistakes: MAX_MISTAKES, todayKey: state.todayKey,
    toggleWord, deselectAll, shuffle, submitGuess, onAnimationComplete, generateShareText,
  }
}
