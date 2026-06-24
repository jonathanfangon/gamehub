import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useTheme } from '../lib/themeContext'
import { THEMES } from '../lib/themes'
import { isUnlocked } from '../lib/points'
import { useAuth } from '../lib/auth'

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-[44px] h-[26px] rounded-full transition-colors ${
        enabled ? 'bg-correct' : 'bg-border'
      }`}
    >
      <div className={`absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white shadow transition-transform ${
        enabled ? 'left-[21px]' : 'left-[3px]'
      }`} />
    </button>
  )
}

export function Settings() {
  const navigate = useNavigate()
  const { themeId, setTheme, reduceMotion, setReduceMotion } = useTheme()
  const { user, signOut } = useAuth()

  const unlockedThemes = THEMES.filter((t) => isUnlocked('themes', t.id))

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Settings" />

      <div className="flex-1 px-4 pt-5 pb-8 max-w-[430px] mx-auto w-full">
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Account</h2>
          {user ? (
            <div className="rounded-xl border border-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[32px] h-[32px] rounded-full bg-correct flex items-center justify-center text-white text-[14px] font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[14px]">{user.email}</p>
                  <p className="text-[12px] text-correct">Synced</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="text-[13px] text-text-secondary font-medium px-3 py-1.5 rounded-full border border-border
                  active:bg-bg-secondary transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="w-full rounded-xl border border-border p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-[14px]">Sign in to sync</p>
                <p className="text-[12px] text-text-secondary">Save stats across devices</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Theme</h2>
          <div className="flex gap-2 flex-wrap">
            {unlockedThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-all text-[13px] font-semibold
                  ${themeId === theme.id ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text'}`}
              >
                <span>{theme.emoji}</span>
                {theme.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="mt-2 text-[13px] text-accent font-medium"
          >
            Get more themes →
          </button>
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Accessibility</h2>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="font-semibold text-[14px]">Reduce motion</p>
              <p className="text-[12px] text-text-secondary">Minimize animations</p>
            </div>
            <ToggleSwitch enabled={reduceMotion} onChange={setReduceMotion} />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Customize</h2>
          <button
            onClick={() => navigate('/shop')}
            className="w-full rounded-xl border border-border p-3 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-[14px]">Shop</p>
              <p className="text-[12px] text-text-secondary">Themes, tile skins, color palettes</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </section>
      </div>
    </div>
  )
}
