import { Header } from '../components/Header'
import { GameIcon } from '../components/GameIcon'
import { type GameId, getStats, type GameStats } from '../lib/storage'

interface GameInfo {
  id: GameId
  name: string
  color: string
}

const GAMES: GameInfo[] = [
  { id: 'wordguess', name: 'Word Guess', color: '#6aaa64' },
  { id: 'groups', name: 'Groups', color: '#ba81c5' },
  { id: 'nbagroups', name: 'NBA Groups', color: '#e8632b' },
  { id: 'mathcrossword', name: 'Math Cross', color: '#4a90d9' },
  { id: 'nbatrivia', name: 'NBA Trivia', color: '#1d428a' },
]

function StatRing({ value, max, color, size = 56 }: { value: number; max: number; color: string; size?: number }) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const pct = max > 0 ? value / max : 0
  const offset = circumference * (1 - pct)

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={4} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  )
}

function DistributionBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="w-3 text-right text-text-secondary font-medium">{label}</span>
      <div className="flex-1 h-[18px] bg-bg-secondary rounded-sm overflow-hidden">
        <div
          className="h-full bg-correct rounded-sm flex items-center justify-end px-1.5 transition-all duration-500 ease-out"
          style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
        >
          {count > 0 && <span className="text-[11px] text-white font-bold">{count}</span>}
        </div>
      </div>
    </div>
  )
}

function GameStatsCard({ game }: { game: GameInfo }) {
  const stats = getStats(game.id)
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0
  const hasPlayed = stats.played > 0

  const distEntries = Object.entries(stats.distribution).sort(([a], [b]) => Number(a) - Number(b))
  const maxDist = distEntries.length > 0 ? Math.max(...distEntries.map(([, v]) => v)) : 0

  return (
    <div className="border border-border rounded-xl p-4 bg-bg">
      <div className="flex items-center gap-3 mb-4">
        <GameIcon game={game.id} size={36} />
        <h3 className="font-bold text-[15px]">{game.name}</h3>
      </div>

      {!hasPlayed ? (
        <p className="text-sm text-text-secondary text-center py-4">No games played yet</p>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <StatRing value={stats.won} max={stats.played} color={game.color} />
                <span className="absolute inset-0 flex items-center justify-center text-[14px] font-bold rotate-0">
                  {winPct}%
                </span>
              </div>
              <span className="text-[11px] text-text-secondary mt-1">Win Rate</span>
            </div>
            {[
              { value: stats.played, label: 'Played' },
              { value: stats.currentStreak, label: 'Streak' },
              { value: stats.maxStreak, label: 'Best' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center flex-1 justify-center">
                <span className="text-[22px] font-bold">{item.value}</span>
                <span className="text-[11px] text-text-secondary">{item.label}</span>
              </div>
            ))}
          </div>

          {distEntries.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-text-secondary font-medium uppercase tracking-wide mb-1">
                Distribution
              </span>
              {distEntries.map(([key, count]) => (
                <DistributionBar key={key} label={key} count={count} max={maxDist} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function OverviewStats() {
  const allStats: { game: GameInfo; stats: GameStats }[] = GAMES.map((g) => ({
    game: g,
    stats: getStats(g.id),
  }))

  const totalPlayed = allStats.reduce((s, g) => s + g.stats.played, 0)
  const totalWon = allStats.reduce((s, g) => s + g.stats.won, 0)
  const totalStreak = allStats.reduce((s, g) => s + g.stats.currentStreak, 0)
  const bestStreak = Math.max(...allStats.map((g) => g.stats.maxStreak))
  const winPct = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0

  return (
    <div className="grid grid-cols-4 gap-2 mb-6 p-4 bg-bg-secondary rounded-xl">
      {[
        { value: totalPlayed, label: 'Total Played' },
        { value: `${winPct}%`, label: 'Win Rate' },
        { value: totalStreak, label: 'Combined\nStreak' },
        { value: bestStreak > 0 ? bestStreak : '–', label: 'Best Single\nStreak' },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-[22px] font-bold">{item.value}</div>
          <div className="text-[11px] text-text-secondary whitespace-pre-line leading-tight">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

export function Stats() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Your Stats" />

      <div className="flex-1 px-4 pt-5 pb-8 max-w-[430px] mx-auto w-full">
        <OverviewStats />

        <div className="flex flex-col gap-3">
          {GAMES.map((game) => (
            <GameStatsCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  )
}
