import { isNumberCell, isOperatorCell, type CellContent } from '../../data/mathcrossword/puzzles'
import type { CellState } from './useMathCross'

interface MathCrossBoardProps {
  grid: CellContent[][]
  blankSet: Set<string>
  getCellState: (r: number, c: number) => CellState
  getCellValue: (r: number, c: number) => CellContent
  onSelectCell: (r: number, c: number) => void
  won: boolean
}

const stateStyles: Record<CellState, string> = {
  neutral: 'bg-bg border-border text-text',
  given: 'bg-bg-secondary border-border text-text',
  selected: 'bg-bg border-accent text-text ring-2 ring-accent/30',
  correct: 'bg-correct/15 border-correct text-correct',
  incorrect: 'bg-error/15 border-error text-error',
}

function NumberCell({
  value,
  state,
  isBlank,
  onClick,
  won,
}: {
  value: CellContent
  state: CellState
  isBlank: boolean
  onClick: () => void
  won: boolean
}) {
  const displayValue = value != null ? value : ''
  const style = won ? 'bg-correct/15 border-correct text-correct' : stateStyles[state]

  return (
    <button
      onClick={onClick}
      disabled={!isBlank || won}
      className={`w-[38px] h-[38px] flex items-center justify-center font-bold rounded-md
        border-2 select-none transition-all duration-150 text-[15px]
        ${style}
        ${isBlank && !won ? 'cursor-pointer active:scale-95' : ''}
        ${!isBlank ? 'cursor-default' : ''}`}
    >
      {displayValue}
    </button>
  )
}

function OperatorCell({ value }: { value: string }) {
  const display = value === '*' ? '×' : value
  return (
    <div className="w-[38px] h-[38px] flex items-center justify-center text-[15px] font-bold text-text-secondary">
      {display}
    </div>
  )
}

export function MathCrossBoard({
  grid,
  blankSet,
  getCellState,
  getCellValue,
  onSelectCell,
  won,
}: MathCrossBoardProps) {
  const rows = grid.length
  const cols = grid[0].length

  return (
    <div className="flex flex-col gap-0.5 items-center">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-0.5">
          {Array.from({ length: cols }, (_, c) => {
            const cell = grid[r][c]
            const key = `${r},${c}`

            if (cell === null) {
              return <div key={key} className="w-[38px] h-[38px]" />
            }

            if (isOperatorCell(cell)) {
              return <OperatorCell key={key} value={cell} />
            }

            if (isNumberCell(cell)) {
              const isBlank = blankSet.has(key)
              const state = getCellState(r, c)
              const value = getCellValue(r, c)
              return (
                <NumberCell
                  key={key}
                  value={value}
                  state={state}
                  isBlank={isBlank}
                  onClick={() => onSelectCell(r, c)}
                  won={won}
                />
              )
            }

            return <div key={key} className="w-[38px] h-[38px]" />
          })}
        </div>
      ))}
    </div>
  )
}
