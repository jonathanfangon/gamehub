import { useState, useEffect, useRef } from 'react'
import { Header } from '../../components/Header'
import { GameCompleteModal } from '../../components/GameCompleteModal'
import { Toast } from '../../components/Toast'
import { Confetti } from '../../components/Confetti'
import { GroupsBoard } from './GroupsBoard'
import { useGroups } from './useGroups'
import { getStats } from '../../lib/storage'

export function GroupsGame() {
  const game = useGroups()
  const [showComplete, setShowComplete] = useState(false)
  const stats = getStats('groups')
  const won = game.status === 'won'
  const lost = game.status === 'lost'
  const finished = won || lost
  const wasFinishedOnMount = useRef(finished)

  useEffect(() => {
    if (finished && !showComplete && !wasFinishedOnMount.current) {
      const timer = setTimeout(() => setShowComplete(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [finished, showComplete])

  const mistakesUsed = game.maxMistakes - game.mistakesLeft
  const winMessages = ['Flawless!', 'Excellent!', 'Well done!', 'Close one!']

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Groups" />
      <Confetti trigger={won} />

      <div className="flex-1 flex flex-col items-center max-w-[430px] mx-auto w-full relative">
        <Toast message={game.toastMessage} />

        <div className="w-full pt-4 text-center mb-3">
          <p className="text-sm text-text-secondary">Create four groups of four!</p>
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

          {finished && !showComplete && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowComplete(true)}
                className="bg-correct text-white font-bold py-2.5 px-6 rounded-full text-sm active:scale-[0.98] transition-transform"
              >
                View Results
              </button>
            </div>
          )}
        </div>
      </div>

      <GameCompleteModal
        open={showComplete}
        onClose={() => setShowComplete(false)}
        won={won}
        title="Groups"
        message={won ? winMessages[Math.min(mistakesUsed, 3)] : 'Better luck tomorrow!'}
        subtitle={won ? `Solved with ${mistakesUsed} mistake${mistakesUsed !== 1 ? 's' : ''}` : 'All 4 mistakes used'}
        pointsEarned={game.pointsAwarded ?? 0}
        stats={stats}
        shareText={finished ? game.generateShareText() : undefined}
      />
    </div>
  )
}
