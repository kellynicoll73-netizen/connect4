import type { Neighbourhood } from '@/types'
import { MatchSignalPills } from './MatchSignalPills'

interface SecondaryMatchCardProps {
  neighbourhood: Neighbourhood
  score:         number
  matches:       string[]
  gaps:          string[]
}

export function SecondaryMatchCard({
  neighbourhood,
  score,
  matches,
  gaps,
}: SecondaryMatchCardProps) {
  return (
    <div className="border border-neutral-200 rounded-md px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-neutral-900 leading-tight">
            {neighbourhood.name}
          </h3>
          <p className="font-display italic text-primary-400 text-sm mt-0.5">
            {neighbourhood.tagline}
          </p>
        </div>
        <p className="font-body text-sm font-semibold text-apt-terra shrink-0">{score}% match</p>
      </div>

      <MatchSignalPills matches={matches} gaps={gaps} />
    </div>
  )
}
