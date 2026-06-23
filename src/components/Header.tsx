import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const isHub = location.pathname === '/'

  return (
    <header className="flex items-center justify-between border-b border-border px-4 h-[52px] shrink-0">
      {!isHub ? (
        <button
          onClick={() => navigate('/')}
          className="text-text-secondary text-sm font-medium flex items-center gap-1"
          aria-label="Back to hub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Games
        </button>
      ) : (
        <button
          onClick={() => navigate(user ? '/stats' : '/auth')}
          className="text-text-secondary active:text-text transition-colors"
          aria-label={user ? 'Profile' : 'Sign in'}
        >
          {user ? (
            <div className="w-[28px] h-[28px] rounded-full bg-correct flex items-center justify-center text-white text-[13px] font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          )}
        </button>
      )}
      <h1 className="text-base font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
        {title ?? 'Daily Puzzle Hub'}
      </h1>
      {isHub ? (
        <button
          onClick={() => navigate('/stats')}
          className="text-text-secondary active:text-text transition-colors"
          aria-label="View stats"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="12" width="4" height="9" rx="1" />
            <rect x="10" y="7" width="4" height="14" rx="1" />
            <rect x="17" y="3" width="4" height="18" rx="1" />
          </svg>
        </button>
      ) : (
        <div className="w-[60px]" />
      )}
    </header>
  )
}
