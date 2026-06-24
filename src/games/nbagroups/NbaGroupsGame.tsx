import { useState } from 'react'
import { Header } from '../../components/Header'
import { StatsModal } from '../../components/StatsModal'
import { Toast, PointsToast } from '../../components/Toast'
import { Confetti } from '../../components/Confetti'
import { GroupsBoard } from '../groups/GroupsBoard'
import { useConnectionsGame } from '../groups/useConnectionsGame'
import { PUZZLES } from '../../data/nbagroups/puzzles'
import { getStats } from '../../lib/storage'

function useNbaGroups() {
  return useConnectionsGame('nbagroups', PUZZLES, 'NBA Groups')
}

export function NbaGroupsGame() {
  const game = useNbaGroups()
  const [showStats, setShowStats] = useState(false)
  const stats = getStats('nbagroups')
  const showStatsButton = game.status !== 'playing' && !showStats

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="NBA Groups" />
      <Confetti trigger={game.status === 'won'} />

      <div className="flex-1 flex flex-col items-center max-w-[430px] mx-auto w-full relative">
        <Toast message={game.toastMessage} />
        <PointsToast amount={game.pointsAwarded} />

        <div className="w-full pt-4 text-center mb-3">
          <p className="text-sm text-text-secondary">Find the four NBA-themed groups!</p>
        </div>

        <div className="flex-1 flex flex-col justify-center w-full">
          <GroupsBoard
            solvedGroups={game.solvedGroups}
            remainingWords={game.remainingWords}
            selectedWords={game.selectedWords}
            animatingGroup={game.animatingGroup}
            shaking={game.shaking}
            onToggle={game.toggleWord}
            onAnimationComplete={game.onAnimationComplete}
          />
        </div>

        <div className="w-full px-4 pb-6 pt-3">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <span className="text-sm text-text-secondary">Mistakes remaining:</span>
            <div className="flex gap-1">
              {Array.from({ length: game.maxMistakes }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[14px] h-[14px] rounded-full transition-all duration-300 ${
                    i < game.mistakesLeft ? 'bg-text' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {game.status === 'playing' && (
            <div className="flex gap-2 justify-center">
              <button
                onClick={game.shuffle}
                className="px-5 py-2.5 rounded-full border border-border text-sm font-semibold
                  active:bg-bg-secondary transition-colors"
              >
                Shuffle
              </button>
              <button
                onClick={game.deselectAll}
                disabled={game.selectedWords.size === 0}
                className="px-5 py-2.5 rounded-full border border-border text-sm font-semibold
                  active:bg-bg-secondary transition-colors disabled:opacity-40"
              >
                Deselect All
              </button>
              <button
                onClick={game.submitGuess}
                disabled={game.selectedWords.size !== 4}
                className="px-5 py-2.5 rounded-full bg-text text-bg text-sm font-semibold
                  active:opacity-90 transition-all disabled:opacity-40"
              >
                Submit
              </button>
            </div>
          )}

          {showStatsButton && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowStats(true)}
                className="bg-correct text-white font-bold py-2.5 px-6 rounded-full text-sm active:scale-[0.98] transition-transform"
              >
                View Stats
              </button>
            </div>
          )}
        </div>
      </div>

      <StatsModal
        open={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        title="NBA Groups"
        shareText={game.status !== 'playing' ? game.generateShareText() : undefined}
      />
    </div>
  )
}
