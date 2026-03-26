'use client'

import { useState } from 'react'
import type { Neighbourhood } from '@/types'
import { MatchSignalPills } from './MatchSignalPills'

interface SecondaryMatchCardProps {
  neighbourhood:   Neighbourhood
  score:           number
  matches:         string[]
  gaps:            string[]
  userDescription: string | null
  userPlace:       string
}

/** Expandable card for a secondary neighbourhood match. Lazily fetches a
 *  Claude-generated comparison blurb when the user taps "Explore this match". */
export function SecondaryMatchCard({
  neighbourhood,
  score,
  matches,
  gaps,
  userDescription,
  userPlace,
}: SecondaryMatchCardProps) {
  const [isExpanded, setIsExpanded]     = useState(false)
  const [personalText, setPersonalText] = useState<string | null>(null)
  const [isLoading, setIsLoading]       = useState(false)
  const [hasFetched, setHasFetched]     = useState(false)

  const handleExpand = async () => {
    setIsExpanded(true)

    // Only fetch once, and only if there's enough free text to work with
    if (hasFetched || !userDescription || userDescription.trim().length < 30) return

    setIsLoading(true)
    setHasFetched(true)

    try {
      const res = await fetch('/api/personalise', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPlace,
          userDescription,
          neighbourhoodName:        neighbourhood.name,
          neighbourhoodDescription: neighbourhood.personalityDescription,
        }),
      })
      if (res.ok) {
        const data = await res.json() as { text: string | null }
        if (data.text) setPersonalText(data.text)
      }
    } catch { /* silent — fallback copy shown instead */ }
    finally { setIsLoading(false) }
  }

  return (
    <div className="border border-neutral-200 rounded-md px-4 py-4 space-y-3">

      {/* Header — always visible */}
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

      {/* Expand / collapse */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={handleExpand}
          className="font-body text-sm text-primary-400 hover:text-primary-600 transition-colors"
        >
          Explore this match →
        </button>
      ) : (
        <div className="space-y-4 pt-1">

          {/* Personality description */}
          <p className="font-body text-sm text-neutral-600 leading-relaxed">
            {neighbourhood.personalityDescription}
          </p>

          {/* How it compares — lazy Claude text, always shown when expanded */}
          <div className="border border-neutral-200 rounded-md px-4 py-3">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
              How it compares to what you know
            </p>
            {isLoading ? (
              <p className="font-display italic text-neutral-400 text-sm">
                Finding the connection…
              </p>
            ) : personalText ? (
              <p className="font-body text-sm text-neutral-700 leading-relaxed">
                {personalText}
              </p>
            ) : (
              <p className="font-body text-sm text-neutral-500 leading-relaxed">
                Every neighbourhood has its own rhythm — explore to find yours.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="font-body text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ← Show less
          </button>
        </div>
      )}
    </div>
  )
}
