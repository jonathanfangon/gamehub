type KeyState = 'unused' | 'correct' | 'present' | 'absent'

interface KeyboardProps {
  onKey: (key: string) => void
  keyStates: Record<string, KeyState>
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

const stateColors: Record<KeyState, string> = {
  unused: 'bg-key-bg text-key-text',
  correct: 'bg-correct text-white',
  present: 'bg-present text-white',
  absent: 'bg-absent text-white',
}

export function Keyboard({ onKey, keyStates }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-[6px] px-2 pb-2">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-[5px] justify-center">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === '⌫'
            const state = keyStates[key] ?? 'unused'

            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`${stateColors[state]} rounded-[4px] font-bold select-none active:opacity-80 transition-colors
                  ${isWide ? 'px-3 text-[11px] min-w-[52px]' : 'min-w-[30px] text-[13px]'}
                  h-[52px] flex items-center justify-center`}
              >
                {key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
