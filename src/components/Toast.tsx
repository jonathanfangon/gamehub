interface ToastProps {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  if (!message) return null

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50
      bg-text text-bg px-5 py-2.5 rounded-lg text-sm font-bold
      animate-[fadeIn_150ms_ease]">
      {message}
    </div>
  )
}

interface PointsToastProps {
  amount: number | null
}

export function PointsToast({ amount }: PointsToastProps) {
  if (!amount) return null

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50
      text-accent font-bold text-lg
      animate-[pointsFloat_1.2s_ease-out_forwards]">
      +{amount} pts
    </div>
  )
}
