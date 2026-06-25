import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { GameStats } from '../lib/storage'

interface GameCompleteModalProps {
  open: boolean
  onClose: () => void
  won: boolean
  title: string
  message: string
  subtitle?: string
  pointsEarned: number
  stats: GameStats
  shareText?: string
}

function AnimatedPoints({ target }: { target: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<number>(null)

  useEffect(() => {
    if (target <= 0) return
    const duration = 800
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => { if (ref.current) cancelAnimationFrame(ref.current) }
  }, [target])

  if (target <= 0) return null

  return (
    <div className="animate-[countUp_500ms_ease-out]">
      <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-5 py-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
          <circle cx="12" cy="12" r="10" />
          <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" stroke="none">P</text>
        </svg>
        <span className="text-xl font-bold text-accent tabular-nums">+{value}</span>
      </div>
    </div>
  )
}

export function GameCompleteModal({
  open,
  onClose,
  won,
  title,
  message,
  subtitle,
  pointsEarned,
  stats,
  shareText,
}: GameCompleteModalProps) {
  const navigate = useNavigate()
  const backdropRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0

  const handleShare = async () => {
    if (!shareText) return
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText })
      } else {
        await navigator.clipboard.writeText(shareText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 animate-[fadeIn_200ms_ease]"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="bg-bg rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-[380px] max-h-[85dvh] overflow-y-auto
        animate-[modalSlideUp_350ms_cubic-bezier(0.16,1,0.3,1)]">
        <div className="p-6 text-center">
          <p className="text-[11px] uppercase tracking-widest text-text-secondary mb-1">{title}</p>

          <div className="mb-1">
            <span className="text-4xl">
              {won ? '🎉' : '😔'}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-1 animate-[countUp_400ms_ease-out]">
            {message}
          </h2>

          {subtitle && (
            <p className="text-sm text-text-secondary mb-4">{subtitle}</p>
          )}

          {pointsEarned > 0 && (
            <div className="mb-4">
              <AnimatedPoints target={pointsEarned} />
            </div>
          )}

          <div className="grid grid-cols-4 gap-1 mb-5 bg-bg-secondary rounded-xl p-3">
            {[
              { value: stats.played, label: 'Played' },
              { value: `${winPct}%`, label: 'Win' },
              { value: stats.currentStreak, label: 'Streak' },
              { value: stats.maxStreak, label: 'Best' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xl font-bold">{item.value}</div>
                <div className="text-[11px] text-text-secondary">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {shareText && (
              <button
                onClick={handleShare}
                className="w-full py-3 rounded-full bg-correct text-white font-bold text-sm
                  active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                {copied ? (
                  'Copied!'
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Share Result
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => { onClose(); navigate('/') }}
              className="w-full py-3 rounded-full border border-border text-sm font-semibold
                active:bg-bg-secondary transition-colors"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
