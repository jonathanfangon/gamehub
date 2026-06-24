import { useState, useEffect, useCallback } from 'react'
import { Header } from '../../components/Header'
import { StatsModal } from '../../components/StatsModal'
import { Toast, PointsToast } from '../../components/Toast'
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

function NumberPad({ onNumber, onClear, disabled, usedNumbers, selectedCellValue }: {
  onNumber: (n: number) => void
  onClear: () => void
  disabled: boolean
  usedNumbers: Set<number>
  selectedCellValue: number | null
}) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const isUsed = usedNumbers.has(n) && n !== selectedCellValue
          return (
            <button
              key={n}
              onClick={() => onNumber(n)}
              disabled={disabled || isUsed}
              className={`w-[52px] h-[48px] rounded-lg font-bold text-lg
                active:opacity-80 transition-all select-none
                ${isUsed
                  ? 'bg-border/50 text-text-secondary/40 line-through'
                  : 'bg-key-bg text-key-text'
                }
                disabled:opacity-40`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2">
        {[6, 7, 8, 9].map((n) => {
          const isUsed = usedNumbers.has(n) && n !== selectedCellValue
          return (
            <button
              key={n}
              onClick={() => onNumber(n)}
              disabled={disabled || isUsed}
              className={`w-[52px] h-[48px] rounded-lg font-bold text-lg
                active:opacity-80 transition-all select-none
                ${isUsed
                  ? 'bg-border/50 text-text-secondary/40 line-through'
                  : 'bg-key-bg text-key-text'
                }
                disabled:opacity-40`}
            >
              {n}
            </button>
          )
        })}
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
  const [showStats, setShowStats] = useState(false)
  const stats = getStats('mathcrossword')
  const showStatsButton = game.status === 'won' && !showStats

  const selectedCellValue = game.selectedCell !== null ? game.cells[game.selectedCell] : null

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

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Math Cross" />
      <Confetti trigger={game.status === 'won'} />

      <div className="flex-1 flex flex-col items-center max-w-[430px] mx-auto w-full relative">
        <Toast message={game.toastMessage} />
        <PointsToast amount={game.pointsAwarded} />

        <div className="w-full pt-4 px-4 mb-2">
          <p className="text-sm text-text-secondary text-center mb-3">
            Place digits 1–9 (each once) to make every equation work
          </p>
          <DifficultySelector
            current={game.difficulty}
            onChange={game.setDifficulty}
            disabled={game.status === 'won'}
          />
        </div>

        <div className="flex-1 flex items-center">
          <MathCrossBoard
            getCellInfo={game.getCellInfo}
            getRowEquation={game.getRowEquation}
            getColEquation={game.getColEquation}
            isRowSatisfied={game.isRowSatisfied}
            isColSatisfied={game.isColSatisfied}
            onSelectCell={game.selectCell}
            won={game.status === 'won'}
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

          {showStatsButton && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowStats(true)}
                className="bg-correct text-white font-bold py-2.5 px-6 rounded-full text-sm active:scale-[0.98] transition-transform"
              >
                View Stats
              </button>
            </div>
          )}

          <NumberPad
            onNumber={game.inputNumber}
            onClear={game.clearCell}
            disabled={game.status !== 'playing' || game.selectedCell === null}
            usedNumbers={game.usedNumbers}
            selectedCellValue={selectedCellValue}
          />
        </div>
      </div>

      <StatsModal
        open={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        title="Math Cross"
        shareText={game.status === 'won' ? game.generateShareText() : undefined}
      />
    </div>
  )
}
