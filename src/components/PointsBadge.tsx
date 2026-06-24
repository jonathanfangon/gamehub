import { getPoints } from '../lib/points'

export function PointsBadge({ onClick }: { onClick?: () => void }) {
  const { balance } = getPoints()

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-text-secondary active:text-text transition-colors"
      aria-label={`${balance} points`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" stroke="none">P</text>
      </svg>
      <span className="text-[13px] font-bold tabular-nums">{balance}</span>
    </button>
  )
}
