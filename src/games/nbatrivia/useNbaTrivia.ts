import { useState, useCallback } from 'react'
import { pickPuzzle, getTodayKey, getDayIndex } from '../../lib/dailyPuzzle'
import { getProgress, saveProgress, getStats, saveStats, type GameId } from '../../lib/storage'
import { PUZZLES } from '../../data/nbatrivia/puzzles'

const GAME_ID: GameId = 'nbatrivia'

export type GameStatus = 'playing' | 'finished'

interface TriviaState {
  currentQuestion: number
  answers: (number | null)[]
  revealed: boolean[]
  score: number
  status: GameStatus
  todayKey: string
}

export function useNbaTrivia() {
  const todayKey = getTodayKey()
  const puzzle = pickPuzzle(PUZZLES)
  const dayIndex = getDayIndex()
  const totalQuestions = puzzle.questions.length

  const [state, setState] = useState<TriviaState>(() => {
    const saved = getProgress(GAME_ID)
    if (saved && saved.date === todayKey) {
      const data = saved.data as {
        answers: (number | null)[]
        revealed: boolean[]
        score: number
        currentQuestion: number
      }
      const allAnswered = data.revealed.every(Boolean)
      return {
        currentQuestion: data.currentQuestion,
        answers: data.answers,
        revealed: data.revealed,
        score: data.score,
        status: allAnswered ? 'finished' : 'playing',
        todayKey,
      }
    }

    return {
      currentQuestion: 0,
      answers: Array(totalQuestions).fill(null),
      revealed: Array(totalQuestions).fill(false),
      score: 0,
      status: 'playing',
      todayKey,
    }
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [animatingChoice, setAnimatingChoice] = useState<number | null>(null)

  const showToast = useCallback((msg: string, duration = 1500) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), duration)
  }, [])

  const persist = useCallback((answers: (number | null)[], revealed: boolean[], score: number, currentQuestion: number, finished: boolean) => {
    saveProgress(GAME_ID, {
      date: todayKey,
      status: finished ? 'won' : 'in-progress',
      data: { answers, revealed, score, currentQuestion },
    })
  }, [todayKey])

  const selectAnswer = useCallback((choiceIndex: number) => {
    if (state.status === 'finished') return
    if (state.revealed[state.currentQuestion]) return

    setAnimatingChoice(choiceIndex)

    const question = puzzle.questions[state.currentQuestion]
    const isCorrect = choiceIndex === question.answer
    const newScore = isCorrect ? state.score + 1 : state.score
    const newAnswers = [...state.answers]
    newAnswers[state.currentQuestion] = choiceIndex
    const newRevealed = [...state.revealed]
    newRevealed[state.currentQuestion] = true

    const isLast = state.currentQuestion === totalQuestions - 1
    const finished = isLast

    persist(newAnswers, newRevealed, newScore, state.currentQuestion, finished)

    if (isCorrect) {
      showToast('Correct!')
    }

    setTimeout(() => {
      setAnimatingChoice(null)

      if (finished) {
        const stats = getStats(GAME_ID)
        stats.played += 1
        const won = newScore >= 3
        if (won) {
          stats.won += 1
          stats.currentStreak += 1
          stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
        } else {
          stats.currentStreak = 0
        }
        const key = String(newScore)
        stats.distribution[key] = (stats.distribution[key] ?? 0) + 1
        saveStats(GAME_ID, stats)
      }

      setState((prev) => ({
        ...prev,
        answers: newAnswers,
        revealed: newRevealed,
        score: newScore,
        status: finished ? 'finished' : 'playing',
      }))
    }, 1200)
  }, [state, puzzle, persist, showToast, totalQuestions])

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestion >= totalQuestions - 1) return prev
      return { ...prev, currentQuestion: prev.currentQuestion + 1 }
    })
  }, [totalQuestions])

  const prevQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestion <= 0) return prev
      return { ...prev, currentQuestion: prev.currentQuestion - 1 }
    })
  }, [])

  const goToQuestion = useCallback((idx: number) => {
    setState((prev) => ({ ...prev, currentQuestion: idx }))
  }, [])

  const currentQ = puzzle.questions[state.currentQuestion]
  const currentAnswer = state.answers[state.currentQuestion]
  const currentRevealed = state.revealed[state.currentQuestion]

  const generateShareText = (): string => {
    const grid = state.answers.map((a, i) => {
      if (a === null) return '⬜'
      return a === puzzle.questions[i].answer ? '✅' : '❌'
    }).join('')
    return `Daily Puzzle Hub - NBA Trivia #${dayIndex}\n${state.score}/${totalQuestions}\n\n${grid}`
  }

  return {
    currentQuestion: state.currentQuestion,
    totalQuestions,
    question: currentQ,
    answer: currentAnswer,
    revealed: currentRevealed,
    allRevealed: state.revealed,
    allAnswers: state.answers,
    score: state.score,
    status: state.status,
    toastMessage,
    animatingChoice,
    todayKey: state.todayKey,
    correctAnswers: puzzle.questions.map((q) => q.answer),
    selectAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    generateShareText,
  }
}
