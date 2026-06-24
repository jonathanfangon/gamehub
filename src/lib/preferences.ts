export interface UserPreferences {
  theme: string
  reduceMotion: boolean
  tileSkin: string
  groupPalette: string
}

const PREFS_KEY = 'puzzlehub:preferences'

const DEFAULTS: UserPreferences = {
  theme: 'light',
  reduceMotion: false,
  tileSkin: 'classic',
  groupPalette: 'classic',
}

export function getPreferences(): UserPreferences {
  const raw = localStorage.getItem(PREFS_KEY)
  if (!raw) return { ...DEFAULTS }
  return { ...DEFAULTS, ...JSON.parse(raw) }
}

export function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): UserPreferences {
  const prefs = getPreferences()
  prefs[key] = value
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  return prefs
}
