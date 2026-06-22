# Daily Puzzle Hub

> **IMPORTANT**: Always update this file when making changes to the app so future sessions have full context. This is the single source of truth for app state.

## What This Is

A mobile-first daily puzzle hub app — a collection of polished daily games inspired by NYT Games. Built as a PWA so it feels native on phones. Each game has a new puzzle daily, tracks stats/streaks, and supports share text.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 8
- **Styling**: Tailwind CSS v4 (CSS-first config in `index.css`)
- **Routing**: React Router DOM v7
- **PWA**: vite-plugin-pwa
- **Storage**: localStorage (per-game progress + stats)
- **No backend** — all client-side, daily puzzles rotate via deterministic day-index

## Architecture

```
src/
  App.tsx              — route definitions (all 5 games + stats)
  index.css            — theme colors, animations
  main.tsx             — entry point with BrowserRouter
  components/          — shared UI (Header, Modal, StatsModal, Keyboard, GameIcon, Tile)
  lib/
    storage.ts         — localStorage helpers (progress, stats per GameId)
    dailyPuzzle.ts     — getTodayKey(), getDayIndex(), pickPuzzle() (epoch: 2026-06-17)
    dates.ts           — date formatting
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
    Hub.tsx            — game cards, status badges, streak flames, stats icon
    Stats.tsx          — overview + per-game stat cards with win rings & distributions
    Placeholder.tsx    — no longer used (all games built)
```

## Game Status — ALL 5 COMPLETE

### Word Guess ✅
- Wordle clone: guess 5-letter word in 6 tries
- Flip animations, keyboard with color states, shake on invalid
- Daily puzzle from 7-puzzle pool, valid word checking
- Stats modal (played, win%, streaks, distribution), share text

### Groups ✅
- Connections-style: sort 16 words into 4 color-coded groups
- Yellow (easy) → Purple (hard) difficulty
- Select 4 words, submit guess; "One away!" toast
- 4 mistakes allowed, auto-reveal remaining on loss
- Tile animations (pop select, shrink correct, shake wrong, group reveal)
- 12 hand-crafted puzzles, daily rotation
- Stats + share text with emoji grid
- Game logic extracted into reusable `useConnectionsGame` hook (shared with NBA Groups)

### NBA Groups ✅
- Same mechanics as Groups but NBA-themed categories
- Reuses `GroupsBoard` component and `useConnectionsGame` hook
- 10 NBA-themed puzzles (shot types, player names, team names, basketball terms)
- Categories designed with cross-group ambiguity for challenge

### Math Cross ✅
- 3x3 number grid using digits 1-9 (each exactly once)
- Fill empty cells so all row AND column equations are satisfied
- **Difficulty levels**: Easy (5 given), Medium (3 given), Hard (1 given)
- Segmented difficulty selector, preference saved in localStorage
- Number pad shows used/available digits (used numbers greyed out + strikethrough)
- Keyboard support (1-9, backspace)
- Check button with correct/incorrect cell highlighting (green/red)
- Row/column result indicators turn green when satisfied
- 10 verified puzzles (all equations confirmed correct, all use digits 1-9 exactly once)
- Stats: distribution tracks by difficulty level

### NBA Trivia ✅
- 5 multiple-choice NBA questions per day
- Animated answer reveal (correct = green, wrong = red, others dim)
- Progress dots showing answered/current/unanswered
- Score tracking (X/5), end-of-game summary message
- Auto-advance after reveal, navigate via progress dots
- 10 question sets (50 total), daily rotation
- Stats: win = 3+ correct, distribution tracks score

## Hub Features
- Game cards with status (Play / In Progress / Completed)
- Flame streak badges on each game card showing current streak
- Stats bar chart icon in header → navigates to /stats page
- Combined streak counter at bottom
- Game icons: custom SVG per game (word tiles, color grid, basketball, math grid, question mark)

## Stats Page (`/stats`)
- Overview section: total played, overall win rate, combined streak, best single streak
- Per-game cards with:
  - Circular SVG win-rate ring (color-coded per game)
  - Played / Streak / Best stats
  - Distribution bar chart (guess count for WordGuess/Groups, difficulty for MathCross, score for Trivia)
  - "No games played yet" state for unplayed games

## Shared Infrastructure
- `GameId` type: `'wordguess' | 'groups' | 'nbagroups' | 'mathcrossword' | 'nbatrivia'`
- `storage.ts` — getProgress/saveProgress/getStats/saveStats/isTodayComplete/isTodayStarted
- `dailyPuzzle.ts` — deterministic daily puzzle selection from pool
- `useConnectionsGame` — shared hook for Groups + NBA Groups (takes gameId, puzzles, shareLabel)
- `StatsModal` — reusable stats display with share/clipboard button
- `Modal` — backdrop click-to-close + animated card
- `Header` — back-to-hub button + centered title + stats icon (hub only)
- CSS animations: flipIn, popIn, headShake, bounceIn, fadeIn, groupReveal, tileShrink, modalIn

## Design Principles
- Mobile-first, max-width 430px content area
- Touch-optimized (active:scale, no hover-dependent UI)
- Safe area insets for notch devices (env() padding on #root)
- Daily puzzle model — one puzzle per day, progress persists in localStorage
- Polished animations on every interaction
- Share text generation for social sharing after completion
- Each game follows same pattern: useGameHook → Board component → Game wrapper with header/toast/stats
