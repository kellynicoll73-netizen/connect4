'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/SessionContext'
import { MatchSignalPills } from '@/components/result/MatchSignalPills'
import { AnalogousComparisonBlock } from '@/components/result/AnalogousComparisonBlock'
import { CommunityVoiceBlock } from '@/components/result/CommunityVoiceBlock'
import { SecondaryMatchCard } from '@/components/result/SecondaryMatchCard'
import { SaveBottomSheet } from '@/components/modals/SaveBottomSheet'
import { Button } from '@/components/ui/Button'
import { AptLogoHorizontal } from '@/components/ui/AptLogoHorizontal'
import { computeMatchSignals } from '@/lib/matching'
import { en, t } from '@/locales/en'
import type { Neighbourhood } from '@/types'

function getAnalogousText(
  neighbourhood: Neighbourhood,
  city: string | null,
  hood: string | null
): string {
  if (city && hood) {
    const key = `${city}_${hood}`
    if (key in neighbourhood.analogousComparisons) {
      return neighbourhood.analogousComparisons[key]
    }
  }
  if (city) {
    const cityKey = Object.keys(neighbourhood.analogousComparisons).find(
      (k) => k.startsWith(city + '_')
    )
    if (cityKey) return neighbourhood.analogousComparisons[cityKey]
  }
  return neighbourhood.analogousComparisons['default'] ?? ''
}

export default function ResultPage() {
  const router = useRouter()
  const { matchedNeighbourhood, state, resetSession, topMatches } = useSession()
  const [saveOpen, setSaveOpen] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  if (!matchedNeighbourhood) {
    if (typeof window !== 'undefined') router.replace('/quiz/1')
    return null
  }

  const winnerScore   = topMatches[0]?.score ?? 100
  const runnerUps     = topMatches
    .filter((m) => m.neighbourhood.id !== matchedNeighbourhood.id)
    .slice(0, 2)
  const winnerSignals = computeMatchSignals(state, matchedNeighbourhood)
  const analogousText = getAnalogousText(
    matchedNeighbourhood,
    state.favouriteCity ?? state.currentCity,
    state.favouriteNeighbourhood ?? state.currentNeighbourhood
  )

  // Personality description with truncation
  const desc = matchedNeighbourhood.personalityDescription
  const isLong = desc.length > 200
  const displayDesc = showFullDescription || !isLong ? desc : desc.slice(0, 200) + '…'

  // Key facts
  const bedroomKey =
    state.bedrooms === 2 ? 'twoBed' :
    state.bedrooms === 3 ? 'threeBed' : 'oneBed'
  const medianRent = matchedNeighbourhood.medianRent[bedroomKey]
  const bedroomLabel =
    state.bedrooms === 2 ? '2 bed' :
    state.bedrooms === 3 ? '3 bed' : '1 bed'
  const walkabilityScore = matchedNeighbourhood.attributes.walkability

  const showAnalogous = !!state.favouriteNeighbourhood

  return (
    <>
      <div className="min-h-screen bg-[#FAF7F0]">
        <div className="max-w-lg mx-auto px-5 py-8">

          {/* Logo */}
          <div className="mb-8">
            <AptLogoHorizontal scheme="light" size="sm" />
          </div>

          {/* 1. Neighbourhood name */}
          <h1 className="font-display text-4xl font-bold text-apt-dark leading-tight mb-1">
            {matchedNeighbourhood.name}
          </h1>

          {/* 2. Score */}
          <p className="font-body text-sm text-apt-terra font-semibold mb-1">
            <span>{winnerScore}% match</span>
          </p>

          {/* 3. Tagline */}
          <p className="font-display text-apt-terra text-base mb-5">
            {matchedNeighbourhood.tagline}
          </p>

          {/* 4. Match/gap pills */}
          <MatchSignalPills
            matches={winnerSignals.matches}
            gaps={winnerSignals.gaps}
          />

          {/* 5. Key facts row — just under pills */}
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

          {/* 6. Divider */}
          <hr className="mb-6 border-neutral-200" />

          {/* 7. Personality description with show more */}
          <div className="mb-5">
            <p className="text-xs font-body font-semibold uppercase tracking-widest text-neutral-400 mb-2">
              {en.result.whatItsLike}
            </p>
            <p className="font-body text-sm text-neutral-700 leading-relaxed">{displayDesc}</p>
            {isLong && !showFullDescription && (
              <button
                onClick={() => setShowFullDescription(true)}
                className="text-xs text-neutral-400 hover:text-neutral-600 mt-1"
              >
                Read more →
              </button>
            )}
          </div>

          {/* 8. CTA — right after description */}
          <div className="mb-6">
            <Button
              variant="primary"
              fullWidth
              onClick={() => router.push('/result/listing')}
            >
              {t('result.rentalEntry', { neighbourhood: matchedNeighbourhood.name })}
            </Button>
          </div>

          {/* 9. Analogous comparison */}
          {showAnalogous && analogousText && (
            <div className="mb-6">
              <AnalogousComparisonBlock text={analogousText} />
            </div>
          )}

          {/* 10. Community voice quote */}
          {matchedNeighbourhood.communityQuote && (
            <div className="mb-6">
              <CommunityVoiceBlock quote={matchedNeighbourhood.communityQuote} />
            </div>
          )}

          {/* 11. Divider */}
          <hr className="my-6 border-neutral-200" />

          {/* 12. Secondary match cards */}
          {runnerUps.length > 0 && (
            <div className="mb-6">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                {en.result.alsoConsider}
              </p>
              <div className="space-y-4">
                {runnerUps.map(({ neighbourhood, score }) => {
                  const signals = computeMatchSignals(state, neighbourhood)
                  return (
                    <SecondaryMatchCard
                      key={neighbourhood.id}
                      neighbourhood={neighbourhood}
                      score={score}
                      matches={signals.matches}
                      gaps={signals.gaps}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* 13. Divider */}
          <hr className="my-6 border-neutral-200" />

          {/* 14. Save CTA */}
          <div className="space-y-3 mb-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setSaveOpen(true)}
            >
              {en.result.saveButton}
            </Button>
          </div>

          {/* 14. Start again */}
          <button
            type="button"
            onClick={() => { resetSession(); router.push('/') }}
            className="w-full text-center font-body text-sm text-neutral-400 hover:text-neutral-600 transition-colors py-2 mb-8"
          >
            {en.result.startAgain}
          </button>

          {/* 15. Worth knowing disclaimer */}
          <div className="bg-[#F4E8E0] border-l-[3px] border-[#7A3E28] rounded-sm px-4 py-3">
            <p className="text-xs font-body font-semibold uppercase tracking-widest text-neutral-500 mb-2">
              {en.result.worthKnowingLabel}
            </p>
            <p className="font-body text-sm text-neutral-600 leading-relaxed">
              {en.result.worthKnowing}
            </p>
          </div>

        </div>
      </div>
      <SaveBottomSheet isOpen={saveOpen} onClose={() => setSaveOpen(false)} />
    </>
  )
}
