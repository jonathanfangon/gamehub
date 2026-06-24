import { useState } from 'react'
import { Header } from '../components/Header'
import { useTheme } from '../lib/themeContext'
import { THEMES, TILE_SKINS, GROUP_PALETTES } from '../lib/themes'
import { getPoints, spendPoints, isUnlocked, unlockItem } from '../lib/points'
import { updatePreference, getPreferences } from '../lib/preferences'

function ThemeCard({ theme, active, owned, balance, onApply, onUnlock }: {
  theme: typeof THEMES[0]
  active: boolean
  owned: boolean
  balance: number
  onApply: () => void
  onUnlock: () => void
}) {
  const canAfford = balance >= theme.cost
  const swatches = [
    theme.colors['--color-bg'],
    theme.colors['--color-text'],
    theme.colors['--color-correct'],
    theme.colors['--color-accent'],
    theme.colors['--color-group-yellow'],
    theme.colors['--color-group-purple'],
  ]

  return (
    <div className={`rounded-xl border-2 p-3 transition-all ${
      active ? 'border-accent' : 'border-border'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{theme.emoji}</span>
          <span className="font-semibold text-[14px]">{theme.name}</span>
        </div>
        {active && (
          <span className="text-[11px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Active</span>
        )}
      </div>

      <div className="flex gap-1.5 mb-3">
        {swatches.map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border border-border"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {owned ? (
        <button
          onClick={onApply}
          disabled={active}
          className={`w-full py-2 rounded-lg text-[13px] font-semibold transition-all
            ${active
              ? 'bg-bg-secondary text-text-secondary'
              : 'bg-text text-bg active:opacity-90'
            }`}
        >
          {active ? 'Current' : 'Apply'}
        </button>
      ) : (
        <button
          onClick={onUnlock}
          disabled={!canAfford}
          className={`w-full py-2 rounded-lg text-[13px] font-semibold transition-all
            ${canAfford
              ? 'bg-accent text-white active:opacity-90'
              : 'bg-bg-secondary text-text-secondary'
            }`}
        >
          {canAfford ? `Unlock — ${theme.cost} pts` : `${theme.cost} pts needed`}
        </button>
      )}
    </div>
  )
}

function ItemCard({ name, cost, owned, active, canAfford, onApply, onUnlock, preview }: {
  name: string
  cost: number
  owned: boolean
  active: boolean
  canAfford: boolean
  onApply: () => void
  onUnlock: () => void
  preview: React.ReactNode
}) {
  return (
    <div className={`rounded-xl border-2 p-3 transition-all ${
      active ? 'border-accent' : 'border-border'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[14px]">{name}</span>
        {active && (
          <span className="text-[11px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Active</span>
        )}
      </div>
      <div className="mb-3">{preview}</div>
      {cost === 0 ? (
        <button
          onClick={onApply}
          disabled={active}
          className={`w-full py-2 rounded-lg text-[13px] font-semibold transition-all
            ${active ? 'bg-bg-secondary text-text-secondary' : 'bg-text text-bg active:opacity-90'}`}
        >
          {active ? 'Current' : 'Apply'}
        </button>
      ) : owned ? (
        <button
          onClick={onApply}
          disabled={active}
          className={`w-full py-2 rounded-lg text-[13px] font-semibold transition-all
            ${active ? 'bg-bg-secondary text-text-secondary' : 'bg-text text-bg active:opacity-90'}`}
        >
          {active ? 'Current' : 'Apply'}
        </button>
      ) : (
        <button
          onClick={onUnlock}
          disabled={!canAfford}
          className={`w-full py-2 rounded-lg text-[13px] font-semibold transition-all
            ${canAfford ? 'bg-accent text-white active:opacity-90' : 'bg-bg-secondary text-text-secondary'}`}
        >
          {canAfford ? `Unlock — ${cost} pts` : `${cost} pts needed`}
        </button>
      )}
    </div>
  )
}

export function Shop() {
  const { themeId, setTheme } = useTheme()
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate((n) => n + 1)
  const { balance } = getPoints()
  const prefs = getPreferences()

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Shop" />

      <div className="flex-1 px-4 pt-5 pb-8 max-w-[430px] mx-auto w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-bg-secondary rounded-full px-5 py-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
              <circle cx="12" cy="12" r="10" />
              <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor" stroke="none">P</text>
            </svg>
            <span className="text-xl font-bold">{balance}</span>
            <span className="text-sm text-text-secondary">points</span>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Themes</h2>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                active={themeId === theme.id}
                owned={isUnlocked('themes', theme.id)}
                balance={balance}
                onApply={() => setTheme(theme.id)}
                onUnlock={() => {
                  if (spendPoints(theme.cost)) {
                    unlockItem('themes', theme.id)
                    setTheme(theme.id)
                    refresh()
                  }
                }}
              />
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Tile Skins <span className="font-normal">(Word Guess)</span></h2>
          <div className="grid grid-cols-2 gap-3">
            {TILE_SKINS.map((skin) => (
              <ItemCard
                key={skin.id}
                name={skin.name}
                cost={skin.cost}
                owned={isUnlocked('tileSkins', skin.id)}
                active={prefs.tileSkin === skin.id}
                canAfford={balance >= skin.cost}
                onApply={() => { updatePreference('tileSkin', skin.id); refresh() }}
                onUnlock={() => {
                  if (spendPoints(skin.cost)) {
                    unlockItem('tileSkins', skin.id)
                    updatePreference('tileSkin', skin.id)
                    refresh()
                  }
                }}
                preview={
                  <div className="flex gap-1">
                    {['W', 'O', 'R', 'D'].map((l, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 flex items-center justify-center text-[13px] font-bold text-white bg-correct"
                        style={{
                          borderRadius: skin.borderRadius,
                          boxShadow: skin.glow ? '0 0 8px rgba(106,170,100,0.6)' : undefined,
                        }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Group Palettes <span className="font-normal">(Groups)</span></h2>
          <div className="grid grid-cols-2 gap-3">
            {GROUP_PALETTES.map((palette) => (
              <ItemCard
                key={palette.id}
                name={palette.name}
                cost={palette.cost}
                owned={isUnlocked('palettes', palette.id)}
                active={prefs.groupPalette === palette.id}
                canAfford={balance >= palette.cost}
                onApply={() => { updatePreference('groupPalette', palette.id); refresh() }}
                onUnlock={() => {
                  if (spendPoints(palette.cost)) {
                    unlockItem('palettes', palette.id)
                    updatePreference('groupPalette', palette.id)
                    refresh()
                  }
                }}
                preview={
                  <div className="flex gap-1.5">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
