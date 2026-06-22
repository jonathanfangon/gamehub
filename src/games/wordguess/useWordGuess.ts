import { useState, useCallback, useEffect } from 'react'
import { pickPuzzle, getTodayKey } from '../../lib/dailyPuzzle'
import { getProgress, saveProgress, getStats, saveStats, type GameId } from '../../lib/storage'
import { PUZZLES } from '../../data/wordguess/puzzles'
import { VALID_WORDS } from '../../data/wordguess/words'

const GAME_ID: GameId = 'wordguess'
const MAX_GUESSES = 6
const WORD_LENGTH = 5

export type LetterState = 'correct' | 'present' | 'absent'
export type GameStatus = 'playing' | 'won' | 'lost'

export interface EvaluatedGuess {
  word: string
  states: LetterState[]
}

interface WordGuessState {
  guesses: EvaluatedGuess[]
  currentGuess: string
  status: GameStatus
  solution: string
  revealingRow: number | null
  shakeRow: boolean
  todayKey: string
}

function evaluateGuess(guess: string, solution: string): LetterState[] {
  const states: LetterState[] = Array(WORD_LENGTH).fill('absent')
  const solutionChars = solution.split('')
  const remaining = [...solutionChars]

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === solutionChars[i]) {
      states[i] = 'correct'
      remaining[i] = ''
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (states[i] === 'correct') continue
    const idx = remaining.indexOf(guess[i])
    if (idx !== -1) {
      states[i] = 'present'
      remaining[idx] = ''
    }
  }

  return states
}

function buildKeyStates(guesses: EvaluatedGuess[]): Record<string, 'unused' | 'correct' | 'present' | 'absent'> {
  const keys: Record<string, 'unused' | 'correct' | 'present' | 'absent'> = {}
  const priority: Record<string, number> = { correct: 3, present: 2, absent: 1, unused: 0 }

  for (const guess of guesses) {
    for (let i = 0; i < guess.word.length; i++) {
      const letter = guess.word[i]
      const state = guess.states[i]
      const current = keys[letter] ?? 'unused'
      if (priority[state] > priority[current]) {
        keys[letter] = state
      }
    }
  }
  return keys
}

export function useWordGuess() {
  const todayKey = getTodayKey()
  const puzzle = pickPuzzle(PUZZLES)
  const solution = puzzle.solution

  const [state, setState] = useState<WordGuessState>(() => {
    const saved = getProgress(GAME_ID)
    if (saved && saved.date === todayKey) {
      const data = saved.data as { guesses: EvaluatedGuess[] }
      return {
        guesses: data.guesses,
        currentGuess: '',
        status: saved.status === 'in-progress' ? 'playing' : saved.status === 'won' ? 'won' : 'lost',
        solution,
        revealingRow: null,
        shakeRow: false,
        todayKey,
      }
    }
    return {
      guesses: [],
      currentGuess: '',
      status: 'playing',
      solution,
      revealingRow: null,
      shakeRow: false,
      todayKey,
    }
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 1500)
  }, [])

  const persist = useCallback((guesses: EvaluatedGuess[], status: GameStatus) => {
    saveProgress(GAME_ID, {
      date: todayKey,
      status: status === 'playing' ? 'in-progress' : status,
      data: { guesses },
    })
  }, [todayKey])

  const finishGame = useCallback((guesses: EvaluatedGuess[], won: boolean) => {
    const stats = getStats(GAME_ID)
    stats.played += 1
    if (won) {
      stats.won += 1
      stats.currentStreak += 1
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
      const key = String(guesses.length)
      stats.distribution[key] = (stats.distribution[key] ?? 0) + 1
    } else {
      stats.currentStreak = 0
    }
    saveStats(GAME_ID, stats)
  }, [])

  const onKey = useCallback((key: string) => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.revealingRow !== null) return prev

      if (key === '⌫') {
        return { ...prev, currentGuess: prev.currentGuess.slice(0, -1), shakeRow: false }
      }

      if (key === 'ENTER') {
        if (prev.currentGuess.length < WORD_LENGTH) {
          showToast('Not enough letters')
          return { ...prev, shakeRow: true }
        }

        if (!VALID_WORDS.has(prev.currentGuess)) {
          showToast('Not in word list')
          return { ...prev, shakeRow: true }
        }

        const states = evaluateGuess(prev.currentGuess, prev.solution)
        const newGuess: EvaluatedGuess = { word: prev.currentGuess, states }
        const newGuesses = [...prev.guesses, newGuess]
        const won = prev.currentGuess === prev.solution
        const lost = !won && newGuesses.length >= MAX_GUESSES
        const newStatus: GameStatus = won ? 'won' : lost ? 'lost' : 'playing'

        persist(newGuesses, newStatus)

        return {
          ...prev,
          guesses: newGuesses,
          currentGuess: '',
          revealingRow: newGuesses.length - 1,
          shakeRow: false,
        }
      }

      if (prev.currentGuess.length >= WORD_LENGTH) return prev
      if (!/^[A-Z]$/.test(key)) return prev

      return { ...prev, currentGuess: prev.currentGuess + key, shakeRow: false }
    })
  }, [persist, showToast])

  const onRevealComplete = useCallback(() => {
    setState((prev) => {
      const lastGuess = prev.guesses[prev.guesses.length - 1]
      const won = lastGuess.word === prev.solution
      const lost = !won && prev.guesses.length >= MAX_GUESSES
      const newStatus: GameStatus = won ? 'won' : lost ? 'lost' : 'playing'

      if (won || lost) {
        finishGame(prev.guesses, won)
        if (won) {
          const messages = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew']
          showToast(messages[prev.guesses.length - 1])
        } else {
          showToast(prev.solution)
        }
      }

      return { ...prev, revealingRow: null, status: newStatus }
    })
  }, [finishGame, showToast])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === 'Enter') {
        onKey('ENTER')
      } else if (e.key === 'Backspace') {
        onKey('⌫')
      } else {
        const letter = e.key.toUpperCase()
        if (/^[A-Z]$/.test(letter)) {
          onKey(letter)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onKey])

  const keyStates = buildKeyStates(state.guesses)

  const generateShareText = (): string => {
    const dayIndex = Math.floor((new Date(todayKey).getTime() - new Date('2026-06-17').getTime()) / 86_400_000)
    const score = state.status === 'won' ? `${state.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`
    const grid = state.guesses.map((g) =>
      g.states.map((s) => s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛').join('')
    ).join('\n')
    return `Daily Puzzle Hub - Word Guess #${dayIndex}\n${score}\n\n${grid}`
  }

  return {
    guesses: state.guesses,
    currentGuess: state.currentGuess,
    status: state.status,
    solution: state.solution,
    revealingRow: state.revealingRow,
    shakeRow: state.shakeRow,
    toastMessage,
    keyStates,
    maxGuesses: MAX_GUESSES,
    wordLength: WORD_LENGTH,
    onKey,
    onRevealComplete,
    generateShareText,
    todayKey,
  }
}
