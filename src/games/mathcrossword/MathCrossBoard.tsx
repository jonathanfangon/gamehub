import type { CellInfo } from './useMathCross'
import type { Operator } from '../../data/mathcrossword/puzzles'

interface MathCrossBoardProps {
  getCellInfo: (index: number) => CellInfo
  getRowEquation: (row: number) => { ops: [Operator, Operator]; result: number }
  getColEquation: (col: number) => { ops: [Operator, Operator]; result: number }
  isRowSatisfied: (row: number) => boolean | null
  isColSatisfied: (col: number) => boolean | null
  onSelectCell: (index: number) => void
  won: boolean
}

const cellStateStyles: Record<string, string> = {
  empty: 'bg-bg border-border text-text',
  given: 'bg-bg-secondary border-border-active text-text',
  editing: 'bg-bg border-border-active text-text',
  correct: 'bg-correct/15 border-correct text-correct',
  incorrect: 'bg-[error]/15 border-[error] text-[error]',
}

function OperatorCell({ op }: { op: Operator }) {
  return (
    <div className="w-[46px] h-[46px] flex items-center justify-center text-[18px] font-bold text-text-secondary">
      {op === '*' ? '×' : op}
    </div>
  )
}

function EqualsCell() {
  return (
    <div className="w-[46px] h-[46px] flex items-center justify-center text-[18px] font-bold text-text-secondary">
      =
    </div>
  )
}

function ResultCell({ value, satisfied }: { value: number; satisfied: boolean | null }) {
  const color = satisfied === true
    ? 'text-correct font-bold'
    : satisfied === false
      ? 'text-[error] font-bold'
      : 'text-text font-bold'

  return (
    <div className={`w-[46px] h-[46px] flex items-center justify-center text-[18px] ${color} rounded-lg bg-bg-secondary`}>
      {value}
    </div>
  )
}

export function MathCrossBoard({
  getCellInfo,
  getRowEquation,
  getColEquation,
  isRowSatisfied,
  isColSatisfied,
  onSelectCell,
  won,
}: MathCrossBoardProps) {
  const rows: React.ReactNode[] = []

  for (let r = 0; r < 3; r++) {
    const eq = getRowEquation(r)
    const rowSatisfied = isRowSatisfied(r)
    const cells: React.ReactNode[] = []

    for (let c = 0; c < 3; c++) {
      const idx = r * 3 + c
      const info = getCellInfo(idx)
      const style = cellStateStyles[info.state] ?? cellStateStyles.empty

      cells.push(
        <button
          key={`cell-${idx}`}
          onClick={() => onSelectCell(idx)}
          disabled={info.isGiven || won}
          className={`w-[46px] h-[46px] flex items-center justify-center text-[22px] font-bold
            rounded-lg border-2 select-none transition-all duration-150
            ${style}
            ${info.state === 'editing' ? 'ring-2 ring-blue-400/50' : ''}
            ${won ? 'bg-correct/15 border-correct text-correct' : ''}
          `}
          style={info.state === 'editing' && info.value !== null ? { animation: 'popIn 100ms ease' } : undefined}
        >
          {info.value}
        </button>,
      )

      if (c < 2) {
        cells.push(<OperatorCell key={`oph-${r}-${c}`} op={eq.ops[c]} />)
      }
    }

    cells.push(<EqualsCell key={`eq-${r}`} />)
    cells.push(<ResultCell key={`res-${r}`} value={eq.result} satisfied={rowSatisfied} />)

    rows.push(
      <div key={`row-${r}`} className="flex items-center justify-center gap-1">
        {cells}
      </div>,
    )

    if (r < 2) {
      const opRow: React.ReactNode[] = []
      for (let c = 0; c < 3; c++) {
        const colEq = getColEquation(c)
        opRow.push(
          <div key={`opv-${r}-${c}`} className="w-[46px] h-[24px] flex items-center justify-center text-[16px] font-bold text-text-secondary">
            {colEq.ops[r] === '*' ? '×' : colEq.ops[r]}
          </div>,
        )
        if (c < 2) {
          opRow.push(<div key={`spacer-${r}-${c}`} className="w-[46px]" />)
        }
      }
      rows.push(
        <div key={`oprow-${r}`} className="flex items-center justify-center gap-1">
          {opRow}
          <div className="w-[46px]" />
          <div className="w-[46px]" />
        </div>,
      )
    }
  }

  const equalsRow: React.ReactNode[] = []
  for (let c = 0; c < 3; c++) {
    equalsRow.push(
      <div key={`ceq-${c}`} className="w-[46px] h-[24px] flex items-center justify-center text-[16px] font-bold text-text-secondary">
        =
      </div>,
    )
    if (c < 2) {
      equalsRow.push(<div key={`spacer-eq-${c}`} className="w-[46px]" />)
    }
  }
  rows.push(
    <div key="equals-row" className="flex items-center justify-center gap-1">
      {equalsRow}
      <div className="w-[46px]" />
      <div className="w-[46px]" />
    </div>,
  )

  const resultRow: React.ReactNode[] = []
  for (let c = 0; c < 3; c++) {
    const colSatisfied = isColSatisfied(c)
    resultRow.push(<ResultCell key={`cres-${c}`} value={getColEquation(c).result} satisfied={colSatisfied} />)
    if (c < 2) {
      resultRow.push(<div key={`spacer-res-${c}`} className="w-[46px]" />)
    }
  }
  rows.push(
    <div key="result-row" className="flex items-center justify-center gap-1">
      {resultRow}
      <div className="w-[46px]" />
      <div className="w-[46px]" />
    </div>,
  )

  return <div className="flex flex-col gap-1 items-center">{rows}</div>
}
