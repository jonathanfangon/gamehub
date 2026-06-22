import { useState } from 'react'
import { Header } from '../../components/Header'
import { Keyboard } from '../../components/Keyboard'
import { StatsModal } from '../../components/StatsModal'
import { WordGuessBoard } from './WordGuessBoard'
import { useWordGuess } from './useWordGuess'
import { getStats } from '../../lib/storage'

export function WordGuessGame() {
  const game = useWordGuess()
  const [showStats, setShowStats] = useState(false)
  const stats = getStats('wordguess')

  const showStatsAfterGame = game.status !== 'playing' && !showStats

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Word Guess" />

      <div className="flex-1 flex flex-col items-center justify-between max-w-[430px] mx-auto w-full relative">
        {game.toastMessage && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-text text-bg px-4 py-2 rounded-lg text-sm font-bold shadow-lg animate-[fadeIn_150ms_ease]">
            {game.toastMessage}
          </div>
        )}

        <div className="flex-1 flex items-center">
          <WordGuessBoard
            guesses={game.guesses}
            currentGuess={game.currentGuess}
            maxGuesses={game.maxGuesses}
            wordLength={game.wordLength}
            revealingRow={game.revealingRow}
            shakeRow={game.shakeRow}
            onRevealComplete={() => {
              game.onRevealComplete()
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
