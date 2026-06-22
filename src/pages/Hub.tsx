import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { GameIcon } from '../components/GameIcon'
import { formatDisplayDate } from '../lib/dates'
import { getTodayKey } from '../lib/dailyPuzzle'
import { type GameId, isTodayComplete, isTodayStarted, getStats } from '../lib/storage'

interface GameCardInfo {
  id: GameId
  name: string
  tagline: string
  route: string
}

const GAMES: GameCardInfo[] = [
  { id: 'wordguess', name: 'Word Guess', tagline: 'Guess the 5-letter word', route: '/word-guess' },
  { id: 'groups', name: 'Groups', tagline: 'Find the four groups', route: '/groups' },
  { id: 'nbagroups', name: 'NBA Groups', tagline: 'NBA-themed connections', route: '/nba-groups' },
  { id: 'mathcrossword', name: 'Math Cross', tagline: 'Numbers in a grid', route: '/math-crossword' },
  { id: 'nbatrivia', name: 'NBA Trivia', tagline: 'Test your NBA knowledge', route: '/nba-trivia' },
]

function getStatusLabel(id: GameId, todayKey: string): { text: string; color: string } {
  if (isTodayComplete(id, todayKey)) return { text: 'Completed', color: 'text-correct' }
  if (isTodayStarted(id, todayKey)) return { text: 'In Progress', color: 'text-present' }
  return { text: 'Play', color: 'text-text-secondary' }
}

function MiniStreak({ id }: { id: GameId }) {
  const stats = getStats(id)
  if (stats.currentStreak <= 0) return null
  return (
    <span className="text-[11px] text-present font-bold flex items-center gap-0.5">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1c0 0-5 4.5-5 8.5C3 12.5 5.2 15 8 15s5-2.5 5-5.5C13 5.5 8 1 8 1z" />
      </svg>
      {stats.currentStreak}
    </span>
  )
}

export function Hub() {
  const todayKey = getTodayKey()
  const navigate = useNavigate()

  const totalStreak = GAMES.reduce((sum, g) => {
    const s = getStats(g.id)
    return sum + s.currentStreak
  }, 0)

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />

      <div className="flex-1 px-4 pt-5 pb-8 max-w-[430px] mx-auto w-full">
        <p className="text-[13px] text-text-secondary mb-1">{formatDisplayDate()}</p>
        <h2 className="text-[22px] font-bold tracking-tight mb-5">Today's Games</h2>

        <div className="flex flex-col gap-3">
          {GAMES.map((game) => {
            const status = getStatusLabel(game.id, todayKey)
            return (
              <button
                key={game.id}
                onClick={() => navigate(game.route)}
                className="flex items-center gap-3.5 p-3 rounded-xl border border-border bg-bg
                  active:bg-bg-secondary transition-colors text-left w-full"
              >
                <GameIcon game={game.id} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-text">{game.name}</span>
                    <MiniStreak id={game.id} />
                  </div>
                  <div className="text-[13px] text-text-secondary">{game.tagline}</div>
                </div>
                <span className={`text-[13px] font-medium ${status.color} shrink-0`}>
                  {status.text}
                </span>
              </button>
            )
          })}
        </div>

        {totalStreak > 0 && (
          <div className="mt-6 text-center text-[13px] text-text-secondary">
            Combined streak: <span className="font-bold text-text">{totalStreak}</span>
          </div>
        )}
      </div>
    </div>
  )
}
