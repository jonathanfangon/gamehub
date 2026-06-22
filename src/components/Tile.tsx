import type { ReactNode } from 'react'

type TileState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent'

interface TileProps {
  children?: ReactNode
  state?: TileState
  size?: 'sm' | 'md'
  animationDelay?: number
}

const stateStyles: Record<TileState, string> = {
  empty: 'border-2 border-border bg-bg text-text',
  tbd: 'border-2 border-border-active bg-bg text-text',
  correct: 'border-0 bg-correct text-white',
  present: 'border-0 bg-present text-white',
  absent: 'border-0 bg-absent text-white',
}

export function Tile({ children, state = 'empty', size = 'md', animationDelay }: TileProps) {
  const sizeClass = size === 'sm' ? 'w-[40px] h-[40px] text-lg' : 'w-[52px] h-[52px] text-[28px]'

  return (
    <div
      className={`inline-flex items-center justify-center font-bold uppercase select-none ${sizeClass} ${stateStyles[state]}`}
      style={animationDelay !== undefined ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
