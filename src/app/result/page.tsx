'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/SessionContext'
import { NeighbourhoodMatchCard } from '@/components/result/NeighbourhoodMatchCard'
import { SecondaryMatchCard } from '@/components/result/SecondaryMatchCard'
import { SaveBottomSheet } from '@/components/modals/SaveBottomSheet'
import { Button } from '@/components/ui/Button'
import { AptLogoHorizontal } from '@/components/ui/AptLogoHorizontal'
import { computeMatchSignals } from '@/lib/matching'
import { en } from '@/locales/en'
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
  const [saveOpen, setSaveOpen]                       = useState(false)
  const [dynamicAnalogousText, setDynamicAnalogousText] = useState<string | null>(null)

  // ── Fetch personalised analogous comparison from Claude ────────────────────
  useEffect(() => {
    if (!matchedNeighbourhood) return

    const description = state.favouriteDescription ?? state.currentDescription
    if (!description || description.trim().length < 30) return

    const place = [state.favouriteNeighbourhood, state.favouriteCity, state.favouriteCountry]
      .filter(Boolean).join(', ')

    fetch('/api/personalise', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPlace:                place || 'a place they love',
        userDescription:          description,
        neighbourhoodName:        matchedNeighbourhood.name,
        neighbourhoodDescription: matchedNeighbourhood.personalityDescription,
      }),
    })
      .then(r => r.json())
      .then((data: { text: string | null }) => {
        if (data.text) setDynamicAnalogousText(data.text)
      })
      .catch(() => { /* silent fallback to static text */ })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedNeighbourhood?.id])

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
  const bedroomKey: 'oneBed' | 'twoBed' | 'threeBed' =
    state.bedrooms === 2 ? 'twoBed' :
    state.bedrooms === 3 ? 'threeBed' : 'oneBed'
  const showAnalogous = !!state.favouriteNeighbourhood

  return (
    <>
      <div className="min-h-screen bg-[#FAF7F0]">
        <div className="max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-5 md:px-8 py-8">

          {/* Logo */}
          <div className="mb-8">
            <AptLogoHorizontal scheme="light" size="sm" />
          </div>

          {/* Primary match card */}
          <div className="mb-6">
            <NeighbourhoodMatchCard
              neighbourhood={matchedNeighbourhood}
              score={winnerScore}
              matches={winnerSignals.matches}
              gaps={winnerSignals.gaps}
              analogousText={showAnalogous ? (dynamicAnalogousText ?? analogousText) : undefined}
              bedroomKey={bedroomKey}
              onCta={() => router.push('/result/listing')}
            />
          </div>

          {/* Divider */}
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
