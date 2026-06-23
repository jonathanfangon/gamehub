import { supabase } from './supabase'
import { type GameId, type GameStats, getStats, saveStats, getProgress, saveProgress, type GameProgress } from './storage'

const ALL_GAMES: GameId[] = ['wordguess', 'groups', 'nbagroups', 'mathcrossword', 'nbatrivia']

export async function pushStatsToCloud(userId: string) {
  for (const gameId of ALL_GAMES) {
    const stats = getStats(gameId)
    if (stats.played === 0) continue

    const progress = getProgress(gameId)

    await supabase.from('user_stats').upsert({
      user_id: userId,
      game_id: gameId,
      stats: stats,
      progress: progress,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,game_id' })
  }
}

export async function pullStatsFromCloud(userId: string) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('game_id, stats, progress')
    .eq('user_id', userId)

  if (error || !data) return

  for (const row of data) {
    const gameId = row.game_id as GameId
    const cloudStats = row.stats as GameStats
    const cloudProgress = row.progress as GameProgress | null
    const localStats = getStats(gameId)

    // Merge: keep whichever has more games played
    if (cloudStats.played > localStats.played) {
      saveStats(gameId, cloudStats)
    } else if (localStats.played > cloudStats.played) {
      // Local is ahead — will push on next sync
    }

    if (cloudProgress) {
      const localProgress = getProgress(gameId)
      if (!localProgress || cloudProgress.date > localProgress.date) {
        saveProgress(gameId, cloudProgress)
      }
    }
  }
}

export async function syncGameToCloud(userId: string, gameId: GameId) {
  const stats = getStats(gameId)
  const progress = getProgress(gameId)

  await supabase.from('user_stats').upsert({
    user_id: userId,
    game_id: gameId,
    stats: stats,
    progress: progress,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,game_id' })
}
