import type { GameId } from '../lib/storage'

interface GameIconProps {
  game: GameId
  size?: number
}

export function GameIcon({ game, size = 48 }: GameIconProps) {
  const s = size
  const pad = s * 0.15

  switch (game) {
    case 'wordguess':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
          <rect width={s} height={s} rx={s * 0.18} fill="#6AAA64" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={pad + i * (s - 2 * pad) / 5 + 1}
              y={s * 0.35}
              width={(s - 2 * pad) / 5 - 2}
              height={(s - 2 * pad) / 5 - 2}
              rx={2}
              fill="rgba(255,255,255,0.9)"
            />
          ))}
        </svg>
      )
    case 'groups':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
          <rect width={s} height={s} rx={s * 0.18} fill="#BA81C5" />
          {[
            ['#F9DF6D', 0, 0], ['#A0C35A', 1, 0],
            ['#B0C4EF', 0, 1], ['#BA81C5', 1, 1],
          ].map(([color, col, row]) => (
            <rect
              key={`${col}-${row}`}
              x={pad + (col as number) * ((s - 2 * pad) / 2) + 1}
              y={pad + (row as number) * ((s - 2 * pad) / 2) + 1}
              width={(s - 2 * pad) / 2 - 2}
              height={(s - 2 * pad) / 2 - 2}
              rx={3}
              fill={color as string}
              opacity={0.9}
            />
          ))}
        </svg>
      )
    case 'nbagroups':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
          <rect width={s} height={s} rx={s * 0.18} fill="#E8632B" />
          <circle cx={s / 2} cy={s / 2} r={s * 0.28} fill="rgba(255,255,255,0.9)" />
          <path d={`M${s * 0.35} ${s * 0.3} Q${s * 0.5} ${s * 0.55} ${s * 0.65} ${s * 0.3}`} stroke="#E8632B" strokeWidth={2} fill="none" />
          <line x1={s * 0.5} y1={s * 0.22} x2={s * 0.5} y2={s * 0.78} stroke="#E8632B" strokeWidth={1.5} />
        </svg>
      )
    case 'mathcrossword':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
          <rect width={s} height={s} rx={s * 0.18} fill="#4A90D9" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={pad + c * ((s - 2 * pad) / 3) + 1}
                y={pad + r * ((s - 2 * pad) / 3) + 1}
                width={(s - 2 * pad) / 3 - 2}
                height={(s - 2 * pad) / 3 - 2}
                rx={1}
                fill={(r + c) % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'}
              />
            ))
          )}
        </svg>
      )
    case 'nbatrivia':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
          <rect width={s} height={s} rx={s * 0.18} fill="#1D428A" />
          <text x={s / 2} y={s * 0.62} textAnchor="middle" fontSize={s * 0.45} fill="white" fontWeight="bold">?</text>
        </svg>
      )
  }
}
