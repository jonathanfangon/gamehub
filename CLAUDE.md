# Daily Puzzle Hub

> **IMPORTANT**: Always update this file when making changes to the app so future sessions have full context. This is the single source of truth for app state.

## What This Is

A mobile-first daily puzzle hub app — a collection of polished daily games inspired by NYT Games. Built as a PWA so it feels native on phones. Each game has a new puzzle daily, tracks stats/streaks, and supports share text. Features a points system and unlockable themes/customizations.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 8
- **Styling**: Tailwind CSS v4 (CSS-first config in `index.css`)
- **Routing**: React Router DOM v7
- **PWA**: vite-plugin-pwa
- **Auth + DB**: Supabase (free tier) — email/password auth, Postgres for cloud stats
- **Storage**: localStorage (primary) + Supabase cloud sync when logged in
- **Repo**: https://github.com/jonathanfangon/gamehub

## Architecture

```
src/
  App.tsx              — route definitions (all 5 games + stats + auth + shop + settings)
  index.css            — theme colors, 14+ animations, reduce-motion support
  main.tsx             — entry point with BrowserRouter + AuthProvider + ThemeProvider
  vite-env.d.ts        — Vite env type declarations
  components/
    Header.tsx         — back button, title, points badge, stats/settings icons
    Modal.tsx          — backdrop click-to-close + animated card
    StatsModal.tsx     — reusable stats display with share/clipboard button
    Keyboard.tsx       — QWERTY keyboard for Word Guess
    GameIcon.tsx       — custom SVG icons per game
    Tile.tsx           — reusable tile component
    Toast.tsx          — shared toast + points float animation
    Confetti.tsx       — canvas confetti burst on game wins
    PointsBadge.tsx    — points display (coin icon + balance)
  lib/
    storage.ts         — localStorage helpers + auto cloud sync on saveStats
    dailyPuzzle.ts     — getTodayKey(), getDayIndex(), pickPuzzle() (epoch: 2026-06-17)
    dates.ts           — date formatting
    supabase.ts        — Supabase client init (reads VITE_SUPABASE_URL/KEY from env)
    auth.tsx           — AuthProvider context + useAuth hook (email/password)
    cloudSync.ts       — push/pull/sync stats + rewards between localStorage and Supabase
    themes.ts          — 7 theme presets, tile skins, group palettes definitions
    themeContext.tsx    — ThemeProvider, useTheme() hook, runtime CSS var switching
    points.ts          — points system: earn, spend, unlock items, cloud sync
    preferences.ts     — user preferences (theme, tileSkin, groupPalette, reduceMotion)
  games/
    wordguess/         — Word Guess (Wordle clone) ✅
    groups/            — Groups (Connections) ✅ + shared useConnectionsGame hook
    nbagroups/         — NBA Groups ✅ (reuses GroupsBoard + useConnectionsGame)
    mathcrossword/     — Math Cross ✅ (unique digits 1-9, difficulty levels)
    nbatrivia/         — NBA Trivia ✅
  data/
    wordguess/         — 7 puzzles + valid word set
    groups/            — 12 hand-crafted puzzles
    nbagroups/         — 10 NBA-themed puzzles
    mathcrossword/     — 10 verified unique-digit puzzles
    nbatrivia/         — 10 sets of 5 questions (50 total)
  pages/
    Hub.tsx            — game cards with staggered animations, status pills, countdown timer
    Stats.tsx          — overview + per-game stat cards + account section
    Auth.tsx           — sign in / sign up page (email + password)
    Shop.tsx           — rewards shop: unlock themes, tile skins, group palettes
    Settings.tsx       — theme picker, reduce motion toggle, account, customize links
```

## Game Status — ALL 5 COMPLETE

### Word Guess ✅
- Wordle clone: guess 5-letter word in 6 tries
- Flip animations, keyboard with color states, shake on invalid
- **Win celebration**: confetti burst + staggered bounce on winning row
- Daily puzzle from 7-puzzle pool, valid word checking
- Stats modal (played, win%, streaks, distribution), share text
- Points awarded on completion (100–15 pts by guess count)

### Groups ✅
- Connections-style: sort 16 words into 4 color-coded groups
- Yellow (easy) → Purple (hard) difficulty
- Select 4 words, submit guess; "One away!" toast
- 4 mistakes allowed, auto-reveal remaining on loss
- Tile animations (pop select, shrink correct, shake wrong, group reveal)
- **Confetti on win**, points awarded (80–20 pts by mistakes)
- 12 hand-crafted puzzles, daily rotation
- Stats + share text with emoji grid
- Game logic extracted into reusable `useConnectionsGame` hook (shared with NBA Groups)

### NBA Groups ✅
- Same mechanics as Groups but NBA-themed categories
- Reuses `GroupsBoard` component and `useConnectionsGame` hook
- 10 NBA-themed puzzles (shot types, player names, team names, basketball terms)
- Confetti + points on win

### Math Cross ✅
- 3x3 number grid using digits 1-9 (each exactly once)
- Fill empty cells so all row AND column equations are satisfied
- **Difficulty levels**: Easy (5 given), Medium (3 given), Hard (1 given)
- Segmented difficulty selector, preference saved in localStorage
- Number pad shows used/available digits (used numbers greyed out + strikethrough)
- Check button with correct/incorrect cell highlighting (green/red)
- Row/column result indicators turn green when satisfied
- **Confetti on win**, points awarded (30/50/80 pts by difficulty)
- 10 verified puzzles, stats distribution tracks by difficulty level

### NBA Trivia ✅
- 5 multiple-choice NBA questions per day
- **Slide transitions** between questions (slideInRight animation)
- Animated answer reveal (correct = green, wrong = red, others dim)
- Progress dots showing answered/current/unanswered
- **Score reveal animation** (countUp) on finish
- Confetti on 3+ correct, points awarded (75–10 pts by score)
- 10 question sets (50 total), daily rotation

## Points & Rewards System

### Earning Points
- **Word Guess**: 100/80/60/40/25/15 pts (by guess count 1-6)
- **Groups / NBA Groups**: 80/60/40/20 pts (by 0-3 mistakes)
- **Math Cross**: 30/50/80 pts (easy/medium/hard)
- **NBA Trivia**: 75/50/30/10 pts (by score 5-2)
- **Streak bonus**: +10 pts per streak day beyond 1

### Unlockable Items
| Category | Items | Costs |
|----------|-------|-------|
| Themes | Light (free), Dark (free), Ocean (150), Sunset (200), Forest (200), Midnight (250), Sakura (300) |
| Tile Skins | Classic (free), Rounded (100), Neon (200) |
| Group Palettes | Classic (free), Pastel (150), Electric (250) |

### Persistence
- Points state (`puzzlehub:points`): total, balance, last 50 history entries
- Unlocked items (`puzzlehub:unlocked`): themes[], tileSkins[], palettes[]
- Cloud synced via `game_id = '_rewards'` row in existing `user_stats` table

## Theme System
- 7 color themes (2 free, 5 unlockable)
- Runtime CSS variable override via `ThemeProvider`
- Smooth 300ms transition when switching themes
- Each theme defines all 18+ CSS variables (bg, text, border, game colors, etc.)
- `useTheme()` hook: `{ themeId, setTheme, currentTheme, reduceMotion, setReduceMotion }`
- Reduce motion support: `.reduce-motion` class disables all animations

## Hub Features
- Game cards with staggered fadeIn entrance animations (60ms offset per card)
- Status pills: "✓ Completed" (green bg), "In Progress" (amber bg), "Play" (gray bg)
- Flame streak badges on each game card
- Points badge in header → navigates to /shop
- Settings gear icon → /settings
- Stats icon → /stats
- "+X pts today" banner when points earned
- Countdown timer to next puzzle (shows after any game completed)
- Combined streak counter at bottom

## Stats Page (`/stats`)
- Account section (sign in prompt or email + sign out)
- Overview: total played, win rate, combined streak, best single streak
- Per-game cards: SVG win-rate ring, played/streak/best, distribution chart

## Shop Page (`/shop`)
- Points balance display at top
- Themes section: 2-column grid, color swatches, unlock/apply buttons
- Tile Skins section: preview tiles with skin styles applied
- Group Palettes section: preview color dots
- Lock/unlock state, insufficient points messaging

## Settings Page (`/settings`)
- Account section (sign in/out)
- Theme quick-switch (unlocked themes only) with "Get more →" link
- Reduce motion toggle
- Customize → Shop link

## Shared Infrastructure
- `GameId` type: `'wordguess' | 'groups' | 'nbagroups' | 'mathcrossword' | 'nbatrivia'`
- `storage.ts` — getProgress/saveProgress/getStats/saveStats/isTodayComplete/isTodayStarted
- `dailyPuzzle.ts` — deterministic daily puzzle selection from pool
- `useConnectionsGame` — shared hook for Groups + NBA Groups
- `Toast` + `PointsToast` — shared toast components used by all games
- `Confetti` — canvas confetti triggered on game wins
- `PointsBadge` — points display in header
- Page transitions: fadeIn animation keyed by route pathname
- CSS animations (14+): flipIn, popIn, headShake, bounceIn, fadeIn, groupReveal, tileShrink, modalIn, slideInRight, slideOutLeft, celebrationBounce, countUp, shimmer, pointsFloat, pageIn

## Auth & Cloud Sync

- **Supabase** free tier: email/password auth, Postgres database
- **AuthProvider** wraps the app in `main.tsx`, provides `useAuth()` hook
- **Cloud sync**: `saveStats()` auto-triggers background push; rewards sync via `pushRewardsToCloud`
- **On login**: pulls cloud stats + rewards, merges with local, then pushes back
- **Without account**: app works fully offline with localStorage only
- **Database**: single `user_stats` table with RLS (users can only access their own rows)
  - Schema: `(user_id, game_id)` PK, `stats` jsonb, `progress` jsonb, `updated_at`
  - `game_id = '_rewards'` stores points + unlocked items
  - Migration SQL in `supabase/schema.sql`
- **Env vars** needed: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`

### Supabase Setup Steps (for new environment)
1. Create free project at supabase.com
2. Copy project URL and anon key into `.env`
3. Run `supabase/schema.sql` in the Supabase SQL Editor
4. Enable email auth in Supabase Auth settings (enabled by default)

## Design Principles
- Mobile-first, max-width 430px content area
- Touch-optimized (active:scale, no hover-dependent UI)
- Safe area insets for notch devices (env() padding on #root)
- Daily puzzle model — one puzzle per day, progress persists in localStorage
- Polished animations on every interaction (with reduce-motion support)
- Points reward loop: play games → earn points → unlock customizations
- Share text generation for social sharing after completion
- Each game follows same pattern: useGameHook → Board component → Game wrapper with header/toast/confetti/stats
