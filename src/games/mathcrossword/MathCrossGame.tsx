import { useState, useEffect, useCallback, useRef } from 'react'
import { Header } from '../../components/Header'
import { GameCompleteModal } from '../../components/GameCompleteModal'
import { Toast } from '../../components/Toast'
import { Confetti } from '../../components/Confetti'
import { MathCrossBoard } from './MathCrossBoard'
import { useMathCross } from './useMathCross'
import { getStats } from '../../lib/storage'
import type { MathDifficulty } from '../../data/mathcrossword/puzzles'

const DIFFICULTIES: { key: MathDifficulty; label: string }[] = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
]

function DifficultySelector({ current, onChange, disabled }: {
  current: MathDifficulty
  onChange: (d: MathDifficulty) => void
  disabled: boolean
}) {
  return (
    <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
      {DIFFICULTIES.map((d) => (
        <button
          key={d.key}
          onClick={() => onChange(d.key)}
          disabled={disabled}
          className={`flex-1 py-1.5 px-3 rounded-md text-[13px] font-semibold transition-all
            ${current === d.key
              ? 'bg-surface text-text shadow-sm'
              : 'text-text-secondary'
            }
            disabled:opacity-60`}
        >
          {d.label}
        </button>
      ))}
    </div>
  )
}

function NumberPad({ onNumber, onClear, disabled }: {
  onNumber: (n: number) => void
  onClear: () => void
  disabled: boolean
}) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onNumber(n)}
            disabled={disabled}
            className="w-[52px] h-[48px] rounded-lg font-bold text-lg bg-key-bg text-key-text
              active:opacity-80 transition-all select-none disabled:opacity-40"
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {[6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => onNumber(n)}
            disabled={disabled}
            className="w-[52px] h-[48px] rounded-lg font-bold text-lg bg-key-bg text-key-text
              active:opacity-80 transition-all select-none disabled:opacity-40"
          >
            {n}
          </button>
        ))}
        <button
          onClick={onClear}
          disabled={disabled}
          className="w-[52px] h-[48px] rounded-lg bg-key-bg text-key-text font-bold text-sm
            active:opacity-80 transition-colors disabled:opacity-40 select-none"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}

export function MathCrossGame() {
  const game = useMathCross()
  const [showComplete, setShowComplete] = useState(false)
  const stats = getStats('mathcrossword')
  const won = game.status === 'won'
  const wasFinishedOnMount = useRef(won)

  useEffect(() => {
    if (won && !showComplete && !wasFinishedOnMount.current) {
      const timer = setTimeout(() => setShowComplete(true), 800)
      return () => clearTimeout(timer)
    }
  }, [won, showComplete])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (game.status !== 'playing') return

    const num = parseInt(e.key)
    if (num >= 1 && num <= 9) {
      game.inputNumber(num)
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      game.clearCell()
    }
  }, [game])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const diffLabel = game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)
  const gridRows = game.puzzle.grid.length
  const sizeLabel = gridRows <= 5 && game.puzzle.grid[0].length <= 5
    ? 'Small Grid'
    : gridRows <= 5
      ? 'Medium Grid'
      : 'Large Grid'

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Math Cross" />
      <Confetti trigger={won} />

      <div className="flex-1 flex flex-col items-center max-w-[430px] mx-auto w-full relative">
        <Toast message={game.toastMessage} />

        <div className="w-full pt-4 px-4 mb-2">
          <p className="text-sm text-text-secondary text-center mb-3">
            Fill in the missing numbers to complete all equations
          </p>
          <DifficultySelector
            current={game.difficulty}
            onChange={game.setDifficulty}
            disabled={won}
          />
          <p className="text-[11px] text-text-secondary text-center mt-2">
            {sizeLabel} · {game.blankSet.size} cells to fill
          </p>
        </div>

        <div className="flex-1 flex items-center px-2">
          <MathCrossBoard
            grid={game.puzzle.grid}
            blankSet={game.blankSet}
            getCellState={game.getCellState}
            getCellValue={game.getCellValue}
            onSelectCell={game.selectCell}
            won={won}
          />
        </div>

        <div className="w-full px-4 pb-6 pt-3">
          {game.status === 'playing' && (
            <div className="flex justify-center mb-4">
              <button
                onClick={game.checkAnswers}
                className="px-6 py-2.5 rounded-full bg-text text-bg text-sm font-semibold
                  active:opacity-90 transition-all"
              >
                Check
              </button>
            </div>
          )}

          {won && !showComplete && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowComplete(true)}
                className="bg-correct text-white font-bold py-2.5 px-6 rounded-full text-sm active:scale-[0.98] transition-transform"
              >
                View Results
              </button>
            </div>
          )}

          <NumberPad
            onNumber={game.inputNumber}
            onClear={game.clearCell}
            disabled={game.status !== 'playing' || game.selectedCell === null}
          />
        </div>
      </div>

      <GameCompleteModal
        open={showComplete}
        onClose={() => setShowComplete(false)}
        won={true}
        title="Math Cross"
        message="Perfect!"
        subtitle={`Solved on ${diffLabel} · ${sizeLabel}`}
        pointsEarned={game.pointsAwarded ?? 0}
        stats={stats}
        shareText={won ? game.generateShareText() : undefined}
      />
    </div>
  )
}
