import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { getThemeById, type ThemeDefinition } from './themes'
import { getPreferences, updatePreference } from './preferences'

interface ThemeContextValue {
  themeId: string
  currentTheme: ThemeDefinition
  setTheme: (id: string) => void
  reduceMotion: boolean
  setReduceMotion: (enabled: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: ThemeDefinition) {
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(key, value)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState(() => {
    const prefs = getPreferences()
    const theme = getThemeById(prefs.theme)
    applyTheme(theme)
    return prefs.theme
  })

  const [reduceMotion, setReduceMotionState] = useState(() => {
    const prefs = getPreferences()
    if (prefs.reduceMotion) {
      document.documentElement.classList.add('reduce-motion')
    }
    return prefs.reduceMotion
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches && !getPreferences().reduceMotion) {
      setReduceMotionState(true)
      document.documentElement.classList.add('reduce-motion')
    }
  }, [])

  const setTheme = useCallback((id: string) => {
    const theme = getThemeById(id)
    document.documentElement.classList.add('theme-transition')
    applyTheme(theme)
    setThemeId(id)
    updatePreference('theme', id)
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 350)
  }, [])

  const setReduceMotion = useCallback((enabled: boolean) => {
    setReduceMotionState(enabled)
    updatePreference('reduceMotion', enabled)
    if (enabled) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }
  }, [])

  const currentTheme = getThemeById(themeId)

  return (
    <ThemeContext value={{ themeId, currentTheme, setTheme, reduceMotion, setReduceMotion }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
