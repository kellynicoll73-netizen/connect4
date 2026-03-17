import { en } from '@/locales/en'

interface MatchSignalPillsProps {
  matches: string[]
  gaps:    string[]
}

export function MatchSignalPills({ matches, gaps }: MatchSignalPillsProps) {
  if (matches.length === 0 && gaps.length === 0) return null

  return (
    <div className="space-y-4">
      {matches.length > 0 && (
        <div>
          <p className="text-xs font-body font-semibold tracking-wide text-neutral-400 mb-2">
            {en.result.matchPillsLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {matches.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-semibold bg-apt-lime-tint text-apt-dark tracking-wide"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {gaps.length > 0 && (
        <div>
          <p className="text-xs font-body font-semibold tracking-wide text-neutral-400 mb-2">
            {en.result.gapPillsLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {gaps.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-semibold bg-apt-terra-tint text-apt-terra tracking-wide"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
