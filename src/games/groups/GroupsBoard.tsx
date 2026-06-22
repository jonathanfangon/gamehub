import { useEffect, useRef } from 'react'
import type { SolvedGroup } from './useGroups'
import type { Difficulty } from '../../data/groups/puzzles'

interface GroupsBoardProps {
  solvedGroups: SolvedGroup[]
  remainingWords: string[]
  selectedWords: Set<string>
  animatingGroup: SolvedGroup | null
  shaking: boolean
  onToggle: (word: string) => void
  onAnimationComplete: () => void
}

const difficultyColors: Record<Difficulty, string> = {
  yellow: 'bg-group-yellow text-[#1a1a1a]',
  green: 'bg-group-green text-[#1a1a1a]',
  blue: 'bg-group-blue text-[#1a1a1a]',
  purple: 'bg-group-purple text-white',
}

function fontSizeForWord(word: string): string {
  if (word.length > 7) return 'text-[11px]'
  if (word.length > 5) return 'text-[13px]'
  return 'text-[14px]'
}

function SolvedRow({ group, index }: { group: SolvedGroup; index: number }) {
  return (
    <div
      className={`${difficultyColors[group.difficulty]} rounded-lg py-3 px-4 text-center w-full`}
      style={{ animation: `groupReveal 400ms ease ${index * 80}ms both` }}
    >
      <div className="font-bold text-[15px] uppercase tracking-wide">{group.category}</div>
      <div className="text-[13px] mt-0.5 opacity-80">{group.words.join(', ')}</div>
    </div>
  )
}

export function GroupsBoard({
  solvedGroups,
  remainingWords,
  selectedWords,
  animatingGroup,
  shaking,
  onToggle,
  onAnimationComplete,
}: GroupsBoardProps) {
  const animTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!animatingGroup) return

    animTimerRef.current = setTimeout(() => {
      onAnimationComplete()
    }, 600)

    return () => clearTimeout(animTimerRef.current)
  }, [animatingGroup, onAnimationComplete])

  const animatingWords = animatingGroup ? new Set(animatingGroup.words) : new Set<string>()

  return (
    <div className="flex flex-col gap-2 w-full px-4">
      {solvedGroups.map((group, i) => (
        <SolvedRow key={group.category} group={group} index={i} />
      ))}

      {remainingWords.length > 0 && (
        <div className={`grid grid-cols-4 gap-2 ${shaking ? 'animate-[headShake_400ms_ease]' : ''}`}>
          {remainingWords.map((word) => {
            const isSelected = selectedWords.has(word)
            const isAnimating = animatingWords.has(word)

            return (
              <button
                key={word}
                onClick={() => onToggle(word)}
                disabled={!!animatingGroup}
                className={`rounded-lg py-3 px-1 font-bold uppercase select-none transition-all duration-150 active:scale-[0.96]
                  ${fontSizeForWord(word)}
                  ${isAnimating
                    ? 'bg-text text-bg scale-[0.95] opacity-0'
                    : isSelected
                      ? 'bg-text text-bg scale-[1.02]'
                      : 'bg-bg-secondary text-text'
                  }
                `}
                style={isAnimating ? { animation: 'tileShrink 400ms ease forwards' } : undefined}
              >
                {word}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
