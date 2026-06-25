import { useState, useCallback, useMemo } from 'react'
import { getTodayKey, getDayIndex } from '../../lib/dailyPuzzle'
import { getProgress, saveProgress, getStats, saveStats, type GameId } from '../../lib/storage'
import { calculatePoints, addPoints } from '../../lib/points'
import {
  getPuzzlePool, isNumberCell,
  type MathDifficulty, type MathCrossPuzzle, type CellContent,
} from '../../data/mathcrossword/puzzles'

const GAME_ID: GameId = 'mathcrossword'
const DIFFICULTY_KEY = 'puzzlehub:mathcross:difficulty'

export type GameStatus = 'playing' | 'won'
export type CellState = 'neutral' | 'given' | 'selected' | 'correct' | 'incorrect'

function getSavedDifficulty(): MathDifficulty {
  return (localStorage.getItem(DIFFICULTY_KEY) as MathDifficulty) || 'medium'
}

function pickFromPool(pool: MathCrossPuzzle[]): MathCrossPuzzle {
  const dayIndex = getDayIndex()
  return pool[dayIndex % pool.length]
}

function cellKey(r: number, c: number) {
  return `${r},${c}`
}

interface MathCrossState {
  inputs: Record<string, number | null>
  selectedCell: [number, number] | null
  status: GameStatus
  todayKey: string
  checked: boolean
  difficulty: MathDifficulty
}

export function useMathCross() {
  const todayKey = getTodayKey()
  const dayIndex = getDayIndex()

  const [state, setState] = useState<MathCrossState>(() => {
    const savedDiff = getSavedDifficulty()
    const saved = getProgress(GAME_ID)

    if (saved && saved.date === todayKey) {
      const data = saved.data as {
        inputs: Record<string, number | null>
        checked: boolean
        difficulty: MathDifficulty
      }
      const diff = data.difficulty || savedDiff
      return {
        inputs: data.inputs ?? {},
        selectedCell: null,
        status: saved.status === 'won' ? 'won' : 'playing',
        todayKey,
        checked: data.checked ?? false,
        difficulty: diff,
      }
    }

    return {
      inputs: {},
      selectedCell: null,
      status: 'playing',
      todayKey,
      checked: false,
      difficulty: savedDiff,
    }
  })

  const puzzle = useMemo(
    () => pickFromPool(getPuzzlePool(state.difficulty)),
    [state.difficulty],
  )

  const blankSet = useMemo(() => {
    const set = new Set<string>()
    for (const [r, c] of puzzle.blanks[state.difficulty]) {
      set.add(cellKey(r, c))
    }
    return set
  }, [puzzle, state.difficulty])

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null)

  const showToast = useCallback((msg: string, duration = 1500) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), duration)
  }, [])

  const persist = useCallback(
    (inputs: Record<string, number | null>, status: GameStatus, checked: boolean, difficulty: MathDifficulty) => {
      saveProgress(GAME_ID, {
        date: todayKey,
        status: status === 'playing' ? 'in-progress' : status,
        data: { inputs, checked, difficulty },
      })
    },
    [todayKey],
  )

  const setDifficulty = useCallback((diff: MathDifficulty) => {
    localStorage.setItem(DIFFICULTY_KEY, diff)
    setState({
      inputs: {},
      selectedCell: null,
      status: 'playing',
      todayKey,
      checked: false,
      difficulty: diff,
    })
    saveProgress(GAME_ID, {
      date: todayKey,
      status: 'in-progress',
      data: { inputs: {}, checked: false, difficulty: diff },
    })
  }, [todayKey])

  const selectCell = useCallback((r: number, c: number) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev
      const key = cellKey(r, c)
      if (!blankSet.has(key)) return prev
      const isSame = prev.selectedCell?.[0] === r && prev.selectedCell?.[1] === c
      return { ...prev, selectedCell: isSame ? null : [r, c] }
    })
  }, [blankSet])

  const inputNumber = useCallback((num: number) => {
    setState((prev) => {
      if (prev.status !== 'playing' || !prev.selectedCell) return prev
      const key = cellKey(prev.selectedCell[0], prev.selectedCell[1])
      if (!blankSet.has(key)) return prev

      const newInputs = { ...prev.inputs, [key]: num }
      persist(newInputs, 'playing', false, prev.difficulty)
      return { ...prev, inputs: newInputs, checked: false }
    })
  }, [blankSet, persist])

  const clearCell = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing' || !prev.selectedCell) return prev
      const key = cellKey(prev.selectedCell[0], prev.selectedCell[1])
      if (!blankSet.has(key)) return prev

      const newInputs = { ...prev.inputs, [key]: null }
      persist(newInputs, 'playing', false, prev.difficulty)
      return { ...prev, inputs: newInputs, checked: false }
    })
  }, [blankSet, persist])

  const checkAnswers = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev

      const allFilled = [...blankSet].every((key) => prev.inputs[key] != null)
      if (!allFilled) {
        showToast('Fill all cells first')
        return prev
      }

      const allCorrect = [...blankSet].every((key) => {
        const [r, c] = key.split(',').map(Number)
        return prev.inputs[key] === puzzle.grid[r][c]
      })

      if (allCorrect) {
        const stats = getStats(GAME_ID)
        stats.played += 1
        stats.won += 1
        stats.currentStreak += 1
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
        const diffKey = prev.difficulty
        stats.distribution[diffKey] = (stats.distribution[diffKey] ?? 0) + 1
        saveStats(GAME_ID, stats)
        persist(prev.inputs, 'won', true, prev.difficulty)

        const { amount, reason } = calculatePoints(
          GAME_ID, 'won',
          { difficulty: diffKey === 'easy' ? 0 : diffKey === 'medium' ? 1 : 2, streak: stats.currentStreak },
        )
        if (amount > 0) {
          addPoints(GAME_ID, amount, reason)
          setPointsAwarded(amount)
          setTimeout(() => setPointsAwarded(null), 2000)
        }

        showToast('Perfect!')
        return { ...prev, status: 'won' as GameStatus, checked: true, selectedCell: null }
      }

      persist(prev.inputs, 'playing', true, prev.difficulty)
      showToast('Some numbers are wrong')
      return { ...prev, checked: true }
    })
  }, [blankSet, puzzle, persist, showToast])

  const getCellState = useCallback(
    (r: number, c: number): CellState => {
      const key = cellKey(r, c)
      const cell = puzzle.grid[r]?.[c]
      if (!isNumberCell(cell)) return 'neutral'
      if (!blankSet.has(key)) return 'given'
      if (state.selectedCell?.[0] === r && state.selectedCell?.[1] === c) return 'selected'
      if (state.checked && state.inputs[key] != null) {
        return state.inputs[key] === cell ? 'correct' : 'incorrect'
      }
      return 'neutral'
    },
    [puzzle, blankSet, state.selectedCell, state.checked, state.inputs],
  )

  const getCellValue = useCallback(
    (r: number, c: number): CellContent => {
      const key = cellKey(r, c)
      const cell = puzzle.grid[r]?.[c]
      if (!isNumberCell(cell)) return cell
      if (blankSet.has(key)) return state.inputs[key] ?? null
      return cell
    },
    [puzzle, blankSet, state.inputs],
  )

  const generateShareText = (): string => {
    const label = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)
    const rows = puzzle.grid.length
    const cols = puzzle.grid[0].length
    const size = rows <= 5 && cols <= 5 ? 'Small' : rows <= 5 ? 'Medium' : 'Large'
    return `Daily Puzzle Hub - Math Cross #${dayIndex}\n${size} Grid (${label})\nSolved! ✅`
  }

  return {
    puzzle,
    inputs: state.inputs,
    selectedCell: state.selectedCell,
    status: state.status,
    checked: state.checked,
    difficulty: state.difficulty,
    toastMessage,
    pointsAwarded,
    blankSet,
    getCellState,
    getCellValue,
    selectCell,
    inputNumber,
    clearCell,
    checkAnswers,
    setDifficulty,
    generateShareText,
  }
}
