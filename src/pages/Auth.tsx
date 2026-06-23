import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useAuth } from '../lib/auth'
import { pushStatsToCloud, pullStatsFromCloud } from '../lib/cloudSync'

export function Auth() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'signup') {
      const err = await signUp(email, password)
      setLoading(false)
      if (err) {
        setError(err)
      } else {
        setSuccess('Check your email to confirm your account!')
      }
    } else {
      const err = await signIn(email, password)
      setLoading(false)
      if (err) {
        setError(err)
      } else {
        const { data: { session } } = await (await import('../lib/supabase')).supabase.auth.getSession()
        if (session?.user) {
          await pullStatsFromCloud(session.user.id)
          await pushStatsToCloud(session.user.id)
        }
        navigate('/')
      }
    }
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title={mode === 'signin' ? 'Sign In' : 'Sign Up'} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-[430px] mx-auto w-full">
        <div className="w-full">
          <h2 className="text-[22px] font-bold text-center mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-text-secondary text-center mb-6">
            {mode === 'signin'
              ? 'Sign in to sync your stats across devices'
              : 'Sign up to save your progress in the cloud'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text text-[15px]
                focus:outline-none focus:border-border-active transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text text-[15px]
                focus:outline-none focus:border-border-active transition-colors"
            />

            {error && (
              <p className="text-[13px] text-[#ff4444] text-center">{error}</p>
            )}
            {success && (
              <p className="text-[13px] text-correct text-center">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-text text-bg font-semibold text-[15px]
                active:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? '...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setSuccess(null) }}
              className="text-sm text-text-secondary"
            >
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold text-text">{mode === 'signin' ? 'Sign Up' : 'Sign In'}</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full text-center text-sm text-text-secondary"
          >
            Continue without account
          </button>
        </div>
      </div>
    </div>
  )
}
