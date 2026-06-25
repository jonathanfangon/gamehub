import { useState } from 'react'
import { Header } from '../../components/Header'
import { Keyboard } from '../../components/Keyboard'
import { GameCompleteModal } from '../../components/GameCompleteModal'
import { Toast } from '../../components/Toast'
import { Confetti } from '../../components/Confetti'
import { WordGuessBoard } from './WordGuessBoard'
import { useWordGuess } from './useWordGuess'
import { getStats } from '../../lib/storage'

export function WordGuessGame() {
  const game = useWordGuess()
  const [showComplete, setShowComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const stats = getStats('wordguess')
  const won = game.status === 'won'
  const finished = game.status !== 'playing'

  const guessCount = game.guesses.length
  const winMessages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!']

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="Word Guess" />
      <Confetti trigger={showConfetti} />

      <div className="flex-1 flex flex-col items-center justify-between max-w-[430px] mx-auto w-full relative">
        <Toast message={game.toastMessage} />

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
              const isWin = game.guesses[game.guesses.length - 1]?.word === game.solution
              const isLoss = !isWin && game.guesses.length >= game.maxGuesses
              if (isWin) setShowConfetti(true)
              if (isWin || isLoss) {
                setTimeout(() => setShowComplete(true), 1000)
              }
            }}
          />
        </div>

        <div className="w-full pb-1">
          {finished && !showComplete && (
            <div className="flex justify-center mb-2">
              <button
                onClick={() => setShowComplete(true)}
                className="bg-correct text-white font-bold py-2 px-6 rounded-full text-sm active:scale-[0.98] transition-transform"
              >
                View Results
              </button>
            </div>
          )}
          <Keyboard onKey={game.onKey} keyStates={game.keyStates} />
        </div>
      </div>

      <GameCompleteModal
        open={showComplete}
        onClose={() => setShowComplete(false)}
        won={won}
        title="Word Guess"
        message={won ? winMessages[Math.min(guessCount - 1, 5)] : 'Better luck tomorrow!'}
        subtitle={won ? `Solved in ${guessCount}/${game.maxGuesses} guesses` : `The word was ${game.solution.toUpperCase()}`}
        pointsEarned={game.pointsAwarded ?? 0}
        stats={stats}
        shareText={finished ? game.generateShareText() : undefined}
      />
    </div>
  )
}
