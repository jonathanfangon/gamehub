import { Header } from '../components/Header'

interface PlaceholderProps {
  title: string
}

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header title={title} />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">{title}</p>
          <p className="text-text-secondary text-sm">Coming soon</p>
        </div>
      </div>
    </div>
  )
}
