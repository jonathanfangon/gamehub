import { useEffect, useRef, useState } from 'react'
import type { EvaluatedGuess, GameStatus } from './useWordGuess'

interface WordGuessBoardProps {
  guesses: EvaluatedGuess[]
  currentGuess: string
  maxGuesses: number
  wordLength: number
  revealingRow: number | null
  shakeRow: boolean
  status: GameStatus
  onRevealComplete: () => void
}

const stateColors: Record<string, string> = {
  correct: 'bg-correct text-white border-correct',
  present: 'bg-present text-white border-present',
  absent: 'bg-absent text-white border-absent',
}

export function WordGuessBoard({
  guesses,
  currentGuess,
  maxGuesses,
  wordLength,
  revealingRow,
  shakeRow,
  status,
  onRevealComplete,
}: WordGuessBoardProps) {
  const revealTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set())
  const [celebrateRow, setCelebrateRow] = useState<number | null>(null)

  useEffect(() => {
    if (revealingRow === null) return

    const timers: ReturnType<typeof setTimeout>[] = []

    for (let c = 0; c < wordLength; c++) {
      const timer = setTimeout(() => {
        setRevealedCells((prev) => {
          const next = new Set(prev)
          next.add(`${revealingRow}-${c}`)
          return next
        })
      }, c * 300 + 150)
      timers.push(timer)
    }

    revealTimerRef.current = setTimeout(() => {
      onRevealComplete()
    }, wordLength * 300 + 250)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(revealTimerRef.current)
    }
  }, [revealingRow, onRevealComplete, wordLength])

  useEffect(() => {
    if (status === 'won' && guesses.length > 0) {
      const timer = setTimeout(() => {
        setCelebrateRow(guesses.length - 1)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [status, guesses.length])

  const rows: React.ReactNode[] = []

  for (let r = 0; r < maxGuesses; r++) {
    const isRevealing = revealingRow === r
    const isCurrentRow = r === guesses.length && revealingRow === null
    const isShaking = isCurrentRow && shakeRow
    const isCelebrating = celebrateRow === r

    const cells: React.ReactNode[] = []

    for (let c = 0; c < wordLength; c++) {
      let letter = ''
      let cellClass = 'border-2 border-border bg-bg text-text'
      let animStyle: React.CSSProperties = {}

      if (r < guesses.length) {
        const guess = guesses[r]
        letter = guess.word[c]

        if (isRevealing) {
          const cellRevealed = revealedCells.has(`${r}-${c}`)
          if (cellRevealed) {
            cellClass = stateColors[guess.states[c]]
          }
          animStyle = {
            animation: `flipIn 500ms ease ${c * 300}ms forwards`,
          }
        } else {
          cellClass = stateColors[guess.states[c]]
          if (isCelebrating) {
            animStyle = {
              animation: `celebrationBounce 500ms ease ${c * 100}ms`,
            }
          }
        }
      } else if (isCurrentRow && c < currentGuess.length) {
        letter = currentGuess[c]
        cellClass = 'border-2 border-border-active bg-bg text-text'
        animStyle = { animation: 'popIn 100ms ease' }
      }

      cells.push(
        <div
          key={c}
          className={`w-[52px] h-[52px] flex items-center justify-center text-[28px] font-bold uppercase select-none transition-colors ${cellClass}`}
          style={animStyle}
        >
          {letter}
        </div>
      )
    }

    rows.push(
      <div
        key={r}
        className={`flex gap-[5px] justify-center ${isShaking ? 'animate-[headShake_400ms_ease]' : ''}`}
      >
        {cells}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[5px] items-center py-2">
      {rows}
    </div>
  )
}
