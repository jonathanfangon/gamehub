export interface ThemeDefinition {
  id: string
  name: string
  emoji: string
  cost: number
  colors: Record<string, string>
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'light',
    name: 'Light',
    emoji: '☀️',
    cost: 0,
    colors: {
      '--color-bg': '#ffffff',
      '--color-bg-secondary': '#f7f7f8',
      '--color-text': '#121213',
      '--color-text-secondary': '#787c7e',
      '--color-border': '#d3d6da',
      '--color-border-active': '#878a8c',
      '--color-correct': '#6aaa64',
      '--color-present': '#c9b458',
      '--color-absent': '#787c7e',
      '--color-error': '#ff4444',
      '--color-accent': '#4a90d9',
      '--color-surface': '#ffffff',
      '--color-group-yellow': '#f9df6d',
      '--color-group-green': '#a0c35a',
      '--color-group-blue': '#b0c4ef',
      '--color-group-purple': '#ba81c5',
      '--color-key-bg': '#d3d6da',
      '--color-key-text': '#121213',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    emoji: '🌙',
    cost: 0,
    colors: {
      '--color-bg': '#121213',
      '--color-bg-secondary': '#1a1a1b',
      '--color-text': '#e8e8e8',
      '--color-text-secondary': '#818384',
      '--color-border': '#3a3a3c',
      '--color-border-active': '#565758',
      '--color-correct': '#538d4e',
      '--color-present': '#b59f3b',
      '--color-absent': '#3a3a3c',
      '--color-error': '#ff6b6b',
      '--color-accent': '#5b9bd5',
      '--color-surface': '#1e1e1f',
      '--color-group-yellow': '#c4a639',
      '--color-group-green': '#6aaa64',
      '--color-group-blue': '#85a5d4',
      '--color-group-purple': '#a065b0',
      '--color-key-bg': '#818384',
      '--color-key-text': '#e8e8e8',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    cost: 150,
    colors: {
      '--color-bg': '#0d1b2a',
      '--color-bg-secondary': '#1b2838',
      '--color-text': '#e0e8f0',
      '--color-text-secondary': '#8899aa',
      '--color-border': '#2a3f55',
      '--color-border-active': '#4a6580',
      '--color-correct': '#2ec4b6',
      '--color-present': '#e0a458',
      '--color-absent': '#2a3f55',
      '--color-error': '#ff6b6b',
      '--color-accent': '#48cae4',
      '--color-surface': '#162635',
      '--color-group-yellow': '#f0c040',
      '--color-group-green': '#2ec4b6',
      '--color-group-blue': '#48cae4',
      '--color-group-purple': '#9b72cf',
      '--color-key-bg': '#2a3f55',
      '--color-key-text': '#e0e8f0',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    cost: 200,
    colors: {
      '--color-bg': '#1a1020',
      '--color-bg-secondary': '#261830',
      '--color-text': '#f0e0e8',
      '--color-text-secondary': '#a08898',
      '--color-border': '#3d2848',
      '--color-border-active': '#5a3d68',
      '--color-correct': '#e07848',
      '--color-present': '#e8b040',
      '--color-absent': '#3d2848',
      '--color-error': '#ff5555',
      '--color-accent': '#f06090',
      '--color-surface': '#221428',
      '--color-group-yellow': '#f0a830',
      '--color-group-green': '#e07848',
      '--color-group-blue': '#d070a0',
      '--color-group-purple': '#8855cc',
      '--color-key-bg': '#3d2848',
      '--color-key-text': '#f0e0e8',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    cost: 200,
    colors: {
      '--color-bg': '#0f1a10',
      '--color-bg-secondary': '#1a2818',
      '--color-text': '#e0ead8',
      '--color-text-secondary': '#88a080',
      '--color-border': '#2a3d28',
      '--color-border-active': '#4a6048',
      '--color-correct': '#5cb85c',
      '--color-present': '#d4a843',
      '--color-absent': '#2a3d28',
      '--color-error': '#e05555',
      '--color-accent': '#70b870',
      '--color-surface': '#162015',
      '--color-group-yellow': '#d4a843',
      '--color-group-green': '#5cb85c',
      '--color-group-blue': '#6aada0',
      '--color-group-purple': '#9070b0',
      '--color-key-bg': '#2a3d28',
      '--color-key-text': '#e0ead8',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    emoji: '✨',
    cost: 250,
    colors: {
      '--color-bg': '#080810',
      '--color-bg-secondary': '#101020',
      '--color-text': '#e0e0f0',
      '--color-text-secondary': '#7070a0',
      '--color-border': '#252540',
      '--color-border-active': '#404070',
      '--color-correct': '#6a5acd',
      '--color-present': '#da70d6',
      '--color-absent': '#252540',
      '--color-error': '#ff5577',
      '--color-accent': '#7b68ee',
      '--color-surface': '#0e0e1c',
      '--color-group-yellow': '#da70d6',
      '--color-group-green': '#6a5acd',
      '--color-group-blue': '#4488ff',
      '--color-group-purple': '#9b59b6',
      '--color-key-bg': '#252540',
      '--color-key-text': '#e0e0f0',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    emoji: '🌸',
    cost: 300,
    colors: {
      '--color-bg': '#1c1018',
      '--color-bg-secondary': '#281820',
      '--color-text': '#f0e0e8',
      '--color-text-secondary': '#a08090',
      '--color-border': '#3d2030',
      '--color-border-active': '#604050',
      '--color-correct': '#e08090',
      '--color-present': '#d8a0c0',
      '--color-absent': '#3d2030',
      '--color-error': '#ff5577',
      '--color-accent': '#f0a0b8',
      '--color-surface': '#221420',
      '--color-group-yellow': '#f0c0a0',
      '--color-group-green': '#e08090',
      '--color-group-blue': '#c090d0',
      '--color-group-purple': '#9060a0',
      '--color-key-bg': '#3d2030',
      '--color-key-text': '#f0e0e8',
    },
  },
]

export function getThemeById(id: string): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

export interface TileSkin {
  id: string
  name: string
  cost: number
  borderRadius: string
  glow: boolean
}

export const TILE_SKINS: TileSkin[] = [
  { id: 'classic', name: 'Classic', cost: 0, borderRadius: '4px', glow: false },
  { id: 'rounded', name: 'Rounded', cost: 100, borderRadius: '12px', glow: false },
  { id: 'neon', name: 'Neon', cost: 200, borderRadius: '4px', glow: true },
]

export interface GroupPalette {
  id: string
  name: string
  cost: number
  colors: [string, string, string, string]
}

export const GROUP_PALETTES: GroupPalette[] = [
  { id: 'classic', name: 'Classic', cost: 0, colors: ['#f9df6d', '#a0c35a', '#b0c4ef', '#ba81c5'] },
  { id: 'pastel', name: 'Pastel', cost: 150, colors: ['#fde8a0', '#b8deb0', '#c8d8f0', '#d8b8e0'] },
  { id: 'electric', name: 'Electric', cost: 250, colors: ['#ffe600', '#39ff14', '#00d4ff', '#ff00ff'] },
]
