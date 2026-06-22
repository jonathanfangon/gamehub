import { useState, useCallback, useMemo } from 'react'
import { pickPuzzle, getTodayKey, getDayIndex } from '../../lib/dailyPuzzle'
import { getProgress, saveProgress, getStats, saveStats, type GameId } from '../../lib/storage'
import { PUZZLES, type Operator, type MathDifficulty } from '../../data/mathcrossword/puzzles'

const GAME_ID: GameId = 'mathcrossword'
const DIFFICULTY_KEY = 'puzzlehub:mathcross:difficulty'

export type GameStatus = 'playing' | 'won'
export type CellState = 'empty' | 'given' | 'correct' | 'incorrect' | 'editing'

export interface CellInfo {
  index: number
  value: number | null
  solution: number
  state: CellState
  isGiven: boolean
}

interface MathCrossState {
  cells: (number | null)[]
  selectedCell: number | null
  status: GameStatus
  todayKey: string
  checked: boolean
  difficulty: MathDifficulty
}

function applyOp(a: number, op: Operator, b: number): number {
  return op === '+' ? a + b : a - b
}

function getSavedDifficulty(): MathDifficulty {
  return (localStorage.getItem(DIFFICULTY_KEY) as MathDifficulty) || 'medium'
}

function getGivenForDifficulty(puzzle: typeof PUZZLES[0], diff: MathDifficulty): number[] {
  switch (diff) {
    case 'easy': return puzzle.givenEasy
    case 'medium': return puzzle.givenMedium
    case 'hard': return puzzle.givenHard
  }
}

export function useMathCross() {
  const todayKey = getTodayKey()
  const puzzle = pickPuzzle(PUZZLES)
  const dayIndex = getDayIndex()

  const [state, setState] = useState<MathCrossState>(() => {
    const savedDiff = getSavedDifficulty()
    const saved = getProgress(GAME_ID)

    if (saved && saved.date === todayKey) {
      const data = saved.data as {
        cells: (number | null)[]
        checked: boolean
        difficulty: MathDifficulty
      }
      const diff = data.difficulty || savedDiff
      return {
        cells: data.cells,
        selectedCell: null,
        status: saved.status === 'won' ? 'won' : 'playing',
        todayKey,
        checked: data.checked ?? false,
        difficulty: diff,
      }
    }

    const given = getGivenForDifficulty(puzzle, savedDiff)
    const cells: (number | null)[] = Array(9).fill(null)
    for (const i of given) cells[i] = puzzle.numbers[i]

    return {
      cells,
      selectedCell: null,
      status: 'playing',
      todayKey,
      checked: false,
      difficulty: savedDiff,
    }
  })

  const givenSet = useMemo(
    () => new Set(getGivenForDifficulty(puzzle, state.difficulty)),
    [puzzle, state.difficulty],
  )

  const usedNumbers = useMemo(() => {
    const used = new Set<number>()
    for (const v of state.cells) {
      if (v !== null) used.add(v)
    }
    return used
  }, [state.cells])

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = useCallback((msg: string, duration = 1500) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), duration)
  }, [])

  const persist = useCallback((cells: (number | null)[], status: GameStatus, checked: boolean, difficulty: MathDifficulty) => {
    saveProgress(GAME_ID, {
      date: todayKey,
      status: status === 'playing' ? 'in-progress' : status,
      data: { cells, checked, difficulty },
    })
  }, [todayKey])

  const setDifficulty = useCallback((diff: MathDifficulty) => {
    localStorage.setItem(DIFFICULTY_KEY, diff)
    const given = getGivenForDifficulty(puzzle, diff)
    const cells: (number | null)[] = Array(9).fill(null)
    for (const i of given) cells[i] = puzzle.numbers[i]

    setState({
      cells,
      selectedCell: null,
      status: 'playing',
      todayKey,
      checked: false,
      difficulty: diff,
    })

    saveProgress(GAME_ID, {
      date: todayKey,
      status: 'in-progress',
      data: { cells, checked: false, difficulty: diff },
    })
  }, [puzzle, todayKey])

  const selectCell = useCallback((index: number) => {
    setState((prev) => {
      if (prev.status !== 'playing' || givenSet.has(index)) return prev
      return { ...prev, selectedCell: prev.selectedCell === index ? null : index }
    })
  }, [givenSet])

  const inputNumber = useCallback((num: number) => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.selectedCell === null) return prev
      if (givenSet.has(prev.selectedCell)) return prev

      const currentVal = prev.cells[prev.selectedCell]
      if (num !== currentVal && usedNumbers.has(num) && currentVal !== num) {
        const otherCellHasIt = prev.cells.some((v, i) => v === num && i !== prev.selectedCell)
        if (otherCellHasIt) return prev
      }

      const newCells = [...prev.cells]
      newCells[prev.selectedCell] = num
      persist(newCells, 'playing', false, prev.difficulty)
      return { ...prev, cells: newCells, checked: false }
    })
  }, [givenSet, usedNumbers, persist])

  const clearCell = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.selectedCell === null) return prev
      if (givenSet.has(prev.selectedCell)) return prev

      const newCells = [...prev.cells]
      newCells[prev.selectedCell] = null
      persist(newCells, 'playing', false, prev.difficulty)
      return { ...prev, cells: newCells, checked: false }
    })
  }, [givenSet, persist])

  const checkAnswers = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev

      const allFilled = prev.cells.every((c) => c !== null)
      if (!allFilled) {
        showToast('Fill all cells first')
        return prev
      }

      const allCorrect = prev.cells.every((c, i) => c === puzzle.numbers[i])

      if (allCorrect) {
        const stats = getStats(GAME_ID)
        stats.played += 1
        stats.won += 1
        stats.currentStreak += 1
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
        const key = prev.difficulty
        stats.distribution[key] = (stats.distribution[key] ?? 0) + 1
        saveStats(GAME_ID, stats)
        persist(prev.cells, 'won', true, prev.difficulty)
        showToast('Perfect!')
        return { ...prev, status: 'won' as GameStatus, checked: true, selectedCell: null }
      }

      persist(prev.cells, 'playing', true, prev.difficulty)
      showToast('Some numbers are wrong')
      return { ...prev, checked: true }
    })
  }, [puzzle, persist, showToast])

  const getCellInfo = useCallback((index: number): CellInfo => {
    const isGiven = givenSet.has(index)
    const value = state.cells[index]
    const solution = puzzle.numbers[index]

    let cellState: CellState = 'empty'
    if (isGiven) {
      cellState = 'given'
    } else if (state.selectedCell === index) {
      cellState = 'editing'
    } else if (state.checked && value !== null) {
      cellState = value === solution ? 'correct' : 'incorrect'
    } else if (value !== null) {
      cellState = 'editing'
    }

    return { index, value, solution, state: cellState, isGiven }
  }, [state.cells, state.selectedCell, state.checked, givenSet, puzzle])

  const getRowEquation = (row: number) => ({
    ops: [puzzle.opsHorizontal[row * 2], puzzle.opsHorizontal[row * 2 + 1]] as [Operator, Operator],
    result: puzzle.rowResults[row],
    cells: [row * 3, row * 3 + 1, row * 3 + 2],
  })

  const getColEquation = (col: number) => ({
    ops: [puzzle.opsVertical[col * 2], puzzle.opsVertical[col * 2 + 1]] as [Operator, Operator],
    result: puzzle.colResults[col],
    cells: [col, col + 3, col + 6],
  })

  const isRowSatisfied = (row: number): boolean | null => {
    const eq = getRowEquation(row)
    const vals = eq.cells.map((i) => state.cells[i])
    if (vals.some((v) => v === null)) return null
    return applyOp(applyOp(vals[0]!, eq.ops[0], vals[1]!), eq.ops[1], vals[2]!) === eq.result
  }

  const isColSatisfied = (col: number): boolean | null => {
    const eq = getColEquation(col)
    const vals = eq.cells.map((i) => state.cells[i])
    if (vals.some((v) => v === null)) return null
    return applyOp(applyOp(vals[0]!, eq.ops[0], vals[1]!), eq.ops[1], vals[2]!) === eq.result
  }

  const generateShareText = (): string => {
    const label = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)
    return `Daily Puzzle Hub - Math Cross #${dayIndex}\nDifficulty: ${label}\nSolved!`
  }

  return {
    cells: state.cells,
    selectedCell: state.selectedCell,
    status: state.status,
    checked: state.checked,
    difficulty: state.difficulty,
    toastMessage,
    todayKey: state.todayKey,
    puzzle,
    usedNumbers,
    getCellInfo,
    getRowEquation,
    getColEquation,
    isRowSatisfied,
    isColSatisfied,
    selectCell,
    inputNumber,
    clearCell,
    checkAnswers,
    setDifficulty,
    generateShareText,
  }
}
