import { useState } from 'react'
import { Header } from '../../components/Header'
import { Keyboard } from '../../components/Keyboard'
import { StatsModal } from '../../components/StatsModal'
import { Toast, PointsToast } from '../../components/Toast'
import { Confetti } from '../../components/Confetti'
import { WordGuessBoard } from './WordGuessBoard'
import { useWordGuess } from './useWordGuess'
import { getStats } from '../../lib/storage'

export function WordGuessGame() {
  const game = useWordGuess()
  const [showStats, setShowStats] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const stats = getStats('wordguess')

  const showStatsAfterGame = game.status !== 'playing' && !showStats

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Word Guess" />
      <Confetti trigger={showConfetti} />

      <div className="flex-1 flex flex-col items-center justify-between max-w-[430px] mx-auto w-full relative">
        <Toast message={game.toastMessage} />
        <PointsToast amount={game.pointsAwarded} />

        <div className="flex-1 flex items-center">
          <WordGuessBoard
            guesses={game.guesses}
            currentGuess={game.currentGuess}
            maxGuesses={game.maxGuesses}
            wordLength={game.wordLength}
            revealingRow={game.revealingRow}
            shakeRow={game.shakeRow}
            status={game.status}
            onRevealComplete={() => {
              game.onRevealComplete()
              if (game.guesses[game.guesses.length - 1]?.word === game.solution) {
                setShowConfetti(true)
              }
              setTimeout(() => setShowStats(true), 1200)
            }}
          />
        </div>

        <div className="w-full pb-1">
          {showStatsAfterGame && (
            <div className="flex justify-center mb-2">
              <button
                onClick={() => setShowStats(true)}
                className="bg-correct text-white font-bold py-2 px-6 rounded-full text-sm active:scale-[0.98] transition-transform"
              >
                View Stats
              </button>
            </div>
          )}
          <Keyboard onKey={game.onKey} keyStates={game.keyStates} />
        </div>
      </div>

      <StatsModal
        open={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        title="Word Guess"
        shareText={game.status !== 'playing' ? game.generateShareText() : undefined}
      />
    </div>
  )
}
