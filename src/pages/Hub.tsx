import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { GameIcon } from '../components/GameIcon'
import { formatDisplayDate } from '../lib/dates'
import { getTodayKey } from '../lib/dailyPuzzle'
import { type GameId, isTodayComplete, isTodayStarted, getStats } from '../lib/storage'
import { getPoints } from '../lib/points'

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

function getStatusLabel(id: GameId, todayKey: string): { text: string; style: string } {
  if (isTodayComplete(id, todayKey)) {
    return { text: '✓ Completed', style: 'bg-correct/10 text-correct' }
  }
  if (isTodayStarted(id, todayKey)) {
    return { text: 'In Progress', style: 'bg-present/10 text-present' }
  }
  return { text: 'Play', style: 'bg-bg-secondary text-text-secondary' }
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

function Countdown() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function update() {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-center text-[13px] text-text-secondary">
      Next puzzle in <span className="font-bold text-text tabular-nums">{timeLeft}</span>
    </div>
  )
}

export function Hub() {
  const todayKey = getTodayKey()
  const navigate = useNavigate()
  const { history } = getPoints()

  const todayPoints = history
    .filter((h) => h.date === todayKey)
    .reduce((sum, h) => sum + h.amount, 0)

  const totalStreak = GAMES.reduce((sum, g) => sum + getStats(g.id).currentStreak, 0)
  const anyComplete = GAMES.some((g) => isTodayComplete(g.id, todayKey))

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />

      <div className="flex-1 px-4 pt-5 pb-8 max-w-[430px] mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[13px] text-text-secondary">{formatDisplayDate()}</p>
          {todayPoints > 0 && (
            <button
              onClick={() => navigate('/shop')}
              className="text-[12px] font-bold text-accent animate-[fadeIn_300ms_ease]"
            >
              +{todayPoints} pts today
            </button>
          )}
        </div>
        <h2 className="text-[22px] font-bold tracking-tight mb-5">Today's Games</h2>

        <div className="flex flex-col gap-3">
          {GAMES.map((game, i) => {
            const status = getStatusLabel(game.id, todayKey)
            return (
              <button
                key={game.id}
                onClick={() => navigate(game.route)}
                className="flex items-center gap-3.5 p-3 rounded-xl border border-border bg-bg
                  active:bg-bg-secondary active:scale-[0.98] transition-all text-left w-full
                  animate-[fadeIn_300ms_ease-out] opacity-0"
                style={{
                  animationDelay: `${i * 60}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <GameIcon game={game.id} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-text">{game.name}</span>
                    <MiniStreak id={game.id} />
                  </div>
                  <div className="text-[13px] text-text-secondary">{game.tagline}</div>
                </div>
                <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${status.style}`}>
                  {status.text}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {totalStreak > 0 && (
            <div className="text-center text-[13px] text-text-secondary">
              Combined streak: <span className="font-bold text-text">{totalStreak}</span>
            </div>
          )}
          {anyComplete && <Countdown />}
        </div>
      </div>
    </div>
  )
}
