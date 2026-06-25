import { useState, useEffect, useRef } from 'react'
import { Header } from '../../components/Header'
import { GameCompleteModal } from '../../components/GameCompleteModal'
import { Toast } from '../../components/Toast'
import { Confetti } from '../../components/Confetti'
import { useNbaTrivia } from './useNbaTrivia'
import { getStats } from '../../lib/storage'

function ChoiceButton({ label, index, selected, correctIndex, revealed, animating, onSelect }: {
  label: string
  index: number
  selected: number | null
  correctIndex: number
  revealed: boolean
  animating: boolean
  onSelect: (i: number) => void
}) {
  const isThis = selected === index
  const isCorrect = index === correctIndex
  const isAnimatingThis = animating && isThis

  let style = 'bg-bg-secondary text-text border-border'
  if (revealed) {
    if (isCorrect) {
      style = 'bg-correct text-white border-correct'
    } else if (isThis && !isCorrect) {
      style = 'bg-error text-white border-error'
    } else {
      style = 'bg-bg-secondary text-text-secondary border-border opacity-60'
    }
  } else if (isAnimatingThis) {
    style = 'bg-text text-bg border-text'
  }

  return (
    <button
      onClick={() => onSelect(index)}
      disabled={revealed || animating}
      className={`w-full p-3.5 rounded-xl border-2 text-left font-medium text-[15px]
        transition-all duration-200 active:scale-[0.98] disabled:active:scale-100
        ${style}`}
    >
      <span className="mr-2 text-[13px] opacity-60">{String.fromCharCode(65 + index)}.</span>
      {label}
    </button>
  )
}

function ProgressDots({ total, current, allRevealed, allAnswers, correctAnswers }: {
  total: number
  current: number
  allRevealed: boolean[]
  allAnswers: (number | null)[]
  correctAnswers: number[]
}) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current
        const answered = allRevealed[i]
        const isCorrect = answered && allAnswers[i] === correctAnswers[i]

        let color = 'bg-border'
        if (answered) {
          color = isCorrect ? 'bg-correct' : 'bg-error'
        } else if (isActive) {
          color = 'bg-text'
        }

        return (
          <button
            key={i}
            onClick={() => {}}
            className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${color}
              ${isActive ? 'scale-125' : ''}`}
          />
        )
      })}
    </div>
  )
}

export function NbaTriviaGame() {
  const game = useNbaTrivia()
  const [showComplete, setShowComplete] = useState(false)
  const stats = getStats('nbatrivia')
  const finished = game.status === 'finished'
  const won = finished && game.score >= 3
  const wasFinishedOnMount = useRef(finished)

  useEffect(() => {
    if (finished && !showComplete && !wasFinishedOnMount.current) {
      const timer = setTimeout(() => setShowComplete(true), 800)
      return () => clearTimeout(timer)
    }
  }, [finished, showComplete])

  const scoreMessages: Record<number, string> = {
    5: 'Perfect Score!',
    4: 'Amazing!',
    3: 'Nice job!',
    2: 'Not bad!',
    1: 'Tough day!',
    0: 'Better luck tomorrow!',
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header title="NBA Trivia" />
      <Confetti trigger={won} />

      <div className="flex-1 flex flex-col items-center max-w-[430px] mx-auto w-full relative">
        <Toast message={game.toastMessage} />

        <div className="w-full pt-4 px-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-text-secondary">
              Question {game.currentQuestion + 1} of {game.totalQuestions}
            </span>
            <span className="text-[13px] font-bold text-correct">
              {game.score}/{game.totalQuestions}
            </span>
          </div>
          <ProgressDots
            total={game.totalQuestions}
            current={game.currentQuestion}
            allRevealed={game.allRevealed}
            allAnswers={game.allAnswers}
            correctAnswers={game.correctAnswers}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center w-full px-4">
          <div key={game.currentQuestion} className="animate-[slideInRight_250ms_ease-out]">
            <h2 className="text-[18px] font-bold text-center mb-6 leading-snug">
              {game.question.question}
            </h2>

            <div className="flex flex-col gap-2.5">
              {game.question.choices.map((choice, i) => (
                <ChoiceButton
                  key={`${game.currentQuestion}-${i}`}
                  label={choice}
                  index={i}
                  selected={game.answer}
                  correctIndex={game.question.answer}
                  revealed={game.revealed}
                  animating={game.animatingChoice !== null}
                  onSelect={game.selectAnswer}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full px-4 pb-6 pt-4">
          {game.status === 'playing' && game.revealed && (
            <div className="flex justify-center">
              {game.currentQuestion < game.totalQuestions - 1 ? (
                <button
                  onClick={game.nextQuestion}
                  className="px-6 py-2.5 rounded-full bg-text text-bg text-sm font-semibold
                    active:opacity-90 transition-all"
                >
                  Next Question
                </button>
              ) : null}
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
        title="NBA Trivia"
        message={scoreMessages[game.score] ?? 'Game Over'}
        subtitle={`You got ${game.score} out of ${game.totalQuestions} correct`}
        pointsEarned={game.pointsAwarded ?? 0}
        stats={stats}
        shareText={finished ? game.generateShareText() : undefined}
      />
    </div>
  )
}
