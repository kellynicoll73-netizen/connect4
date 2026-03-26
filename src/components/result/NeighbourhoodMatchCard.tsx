'use client'

import { useState } from 'react'
import type { Neighbourhood } from '@/types'
import { MatchSignalPills } from './MatchSignalPills'
import { AnalogousComparisonBlock } from './AnalogousComparisonBlock'
import { CommunityVoiceBlock } from './CommunityVoiceBlock'
import { Button } from '@/components/ui/Button'
import { en } from '@/locales/en'

interface NeighbourhoodMatchCardProps {
  neighbourhood:  Neighbourhood
  score:          number
  matches:        string[]
  gaps:           string[]
  analogousText?: string
  bedroomKey?:    'oneBed' | 'twoBed' | 'threeBed'
  onCta?:         () => void
}

export function NeighbourhoodMatchCard({
  neighbourhood,
  score,
  matches,
  gaps,
  analogousText,
  bedroomKey = 'oneBed',
  onCta,
}: NeighbourhoodMatchCardProps) {
  const [showFull, setShowFull] = useState(false)

  const desc        = neighbourhood.personalityDescription
  const isLong      = desc.length > 200
  const displayDesc = showFull || !isLong ? desc : desc.slice(0, 200) + '…'

  const medianRent     = neighbourhood.medianRent[bedroomKey]
  const bedroomLabel   = bedroomKey === 'twoBed' ? '2 bed' : bedroomKey === 'threeBed' ? '3 bed' : '1 bed'
  const walkabilityScore = neighbourhood.attributes.walkability

  return (
    <div className="flex flex-col">

      {/* Eyebrow */}
      <p className="font-body text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
        Your match
      </p>

      {/* Name */}
      <h1 className="font-display text-4xl font-bold text-apt-dark leading-tight mb-1">
        {neighbourhood.name}
      </h1>

      {/* Score */}
      <p className="font-body text-sm text-apt-terra font-semibold mb-1">
        {score}% match
      </p>

      {/* Tagline */}
      <p className="font-display text-apt-terra text-base mb-5">
        {neighbourhood.tagline}
      </p>

      {/* Match / gap pills */}
      <MatchSignalPills matches={matches} gaps={gaps} />

      {/* Key facts */}
      <div className="flex gap-4 mt-5 mb-5">
        <div className="flex-1 bg-white rounded-md border border-neutral-200 px-4 py-3">
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-neutral-400 mb-1">Walkability</p>
          <p className="font-body text-sm font-semibold text-neutral-900">{walkabilityScore}/10</p>
        </div>
        <div className="flex-1 bg-white rounded-md border border-neutral-200 px-4 py-3">
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-neutral-400 mb-1">Median rent ({bedroomLabel})</p>
          <p className="font-body text-sm font-semibold text-neutral-900">${medianRent.toLocaleString()}/mo</p>
        </div>
      </div>

      {/* Divider */}
      <hr className="mb-6 border-neutral-200" />

      {/* Personality description */}
      <div className="mb-5">
        <p className="text-xs font-body font-semibold uppercase tracking-widest text-neutral-400 mb-2">
          {en.result.whatItsLike}
        </p>
        <p className="font-body text-sm text-neutral-700 leading-relaxed">{displayDesc}</p>
        {isLong && (
          <button
            type="button"
            onClick={() => setShowFull(v => !v)}
            className="text-xs text-neutral-400 hover:text-neutral-600 mt-1"
          >
            {showFull ? 'Read less ↑' : 'Read more →'}
          </button>
        )}
      </div>

      {/* Analogous comparison */}
      {analogousText && (
        <div className="mb-6">
          <AnalogousComparisonBlock text={analogousText} />
        </div>
      )}

      {/* Community voice */}
      {neighbourhood.communityQuote && (
        <div className="mb-6">
          <CommunityVoiceBlock quote={neighbourhood.communityQuote} />
        </div>
      )}

      {/* CTA */}
      {onCta && (
        <div className="mb-2">
          <Button variant="primary" fullWidth onClick={onCta}>
            See what&apos;s available in {neighbourhood.name} →
          </Button>
        </div>
      )}
    </div>
  )
}
