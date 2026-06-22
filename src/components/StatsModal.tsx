import { Modal } from './Modal'
import type { GameStats } from '../lib/storage'

interface StatsModalProps {
  open: boolean
  onClose: () => void
  stats: GameStats
  title: string
  shareText?: string
}

export function StatsModal({ open, onClose, stats, title, shareText }: StatsModalProps) {
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0

  const handleShare = async () => {
    if (!shareText) return
    try {
      await navigator.clipboard.writeText(shareText)
    } catch {
      // Fallback: share API
      if (navigator.share) {
        await navigator.share({ text: shareText })
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-bold text-center mb-4">{title}</h2>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { value: stats.played, label: 'Played' },
          { value: winPct, label: 'Win %' },
          { value: stats.currentStreak, label: 'Current\nStreak' },
          { value: stats.maxStreak, label: 'Max\nStreak' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-[11px] text-text-secondary whitespace-pre-line leading-tight">{item.label}</div>
          </div>
        ))}
      </div>

      {shareText && (
        <button
          onClick={handleShare}
          className="w-full bg-correct text-white font-bold py-3 rounded-full text-sm active:scale-[0.98] transition-transform"
        >
          Share
        </button>
      )}
    </Modal>
  )
}
