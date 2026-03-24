'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  SessionState,
  Neighbourhood,
  ListingObject,
  CardVersion,
} from '@/types'
import { computeTopMatches, computeDisplayScores } from '@/lib/matching'
import neighbourhoodsData from '@/data/neighbourhoods.json'

const neighbourhoods = neighbourhoodsData as unknown as Neighbourhood[]

// ─── Initial state ────────────────────────────────────────────────────────────

function getInitialCardVersion(): CardVersion {
  const env = process.env.NEXT_PUBLIC_CARD_VERSION
  if (env === 'A' || env === 'B' || env === 'C') return env
  return 'C'
}

const INITIAL_STATE: SessionState = {
  reasonForMoving:          null,
  reasonForMovingOther:     null,
  workLocation:             null,
  schoolLocation:           null,
  timeline:                 null,
  timelineOther:            null,
  household:                null,
  householdOther:           null,
  bedrooms:                 null,
  budget:                   null,
  budgetOther:              null,
  transport:                null,
  transportOther:           null,
  freeDay:                  null,
  freeDayOther:             null,
  neighbourhoodEnergy:      null,
  neighbourhoodEnergyOther: null,
  outdoorsAccess:           null,
  outdoorsAccessOther:      null,
  culturalCommunity:        null,
  culturalCommunityText:    null,
  comfortPriority:          null,
  comfortPriorityOther:     null,
  currentCity:              null,
  currentNeighbourhood:     null,
  currentDescription:       null,
  favouriteNeighbourhood:   null,
  favouriteCity:            null,
  favouriteCountry:         null,
  favouriteDescription:     null,
  matchedNeighbourhoodId:   null,
  cardVersion:              getInitialCardVersion(),
}

// ─── Context value type ───────────────────────────────────────────────────────

interface SessionContextValue {
  state:                SessionState
  setAnswer:            (field: keyof SessionState, value: unknown) => void
  runMatching:          () => Promise<void>
  resetSession:         () => void
  // Derived
  isQuizComplete:       boolean
  matchedNeighbourhood: Neighbourhood | null
  selectedListing:      ListingObject | null
  topMatches:           Array<{ neighbourhood: Neighbourhood; score: number }>
  // Claude personalisation — pre-loaded during matching
  personalText:         string | null
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SessionContext = createContext<SessionContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(INITIAL_STATE)
  const [personalText, setPersonalText] = useState<string | null>(null)

  const setAnswer = (field: keyof SessionState, value: unknown) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }

  const runMatching = async () => {
    // Structural match (always works)
    const structuralScores = computeDisplayScores(state, neighbourhoods)

    // Try semantic match
    const userText = [
      state.favouriteDescription,
      state.favouriteNeighbourhood,
      state.favouriteCity,
      state.favouriteCountry,
      state.culturalCommunityText,
    ].filter(Boolean).join('. ')

    console.log('[Matching] Semantic text sent to Voyage:', userText || '(none — structural only)')

    let semanticScores: Record<string, number> = {}
    if (userText.trim()) {
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: userText }),
        })
        if (res.ok) {
          const data = await res.json() as { semanticScores?: Record<string, number> }
          semanticScores = data.semanticScores ?? {}
        }
      } catch { /* fallback to structural only */ }
    }

    // Blend scores (70% structural, 30% semantic)
    const hasSemantic = Object.keys(semanticScores).length > 0
    const blendedScores = neighbourhoods.map((n) => ({
      id: n.id,
      score: hasSemantic
        ? (structuralScores[n.id] ?? 0) * 0.7 + (semanticScores[n.id] ?? 50) * 0.3
        : (structuralScores[n.id] ?? 0),
    }))

    const best = blendedScores.reduce((a, b) => b.score > a.score ? b : a)

    const top5blended = [...blendedScores].sort((a, b) => b.score - a.score).slice(0, 5)
    console.log(
      '[Matching] Top 5 blended (70% structural + 30% semantic):',
      top5blended.map(({ id, score }) => `${id}:${score.toFixed(1)}`).join(' | ')
    )
    console.log('[Matching] Winner:', best.id)

    setState((prev) => ({ ...prev, matchedNeighbourhoodId: best.id }))

    // ── Claude personalisation — run immediately after match is found ──────────
    // This runs during the loading screen so results page renders fully complete.
    const bestNeighbourhood = neighbourhoods.find((n) => n.id === best.id)
    const description = state.favouriteDescription ?? state.currentDescription
    if (bestNeighbourhood && description && description.trim().length >= 30) {
      const place = [state.favouriteNeighbourhood, state.favouriteCity, state.favouriteCountry]
        .filter(Boolean).join(', ')
      try {
        const res = await fetch('/api/personalise', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userPlace:                place || 'a place they love',
            userDescription:          description,
            neighbourhoodName:        bestNeighbourhood.name,
            neighbourhoodDescription: bestNeighbourhood.personalityDescription,
          }),
        })
        if (res.ok) {
          const data = await res.json() as { text: string | null }
          if (data.text) setPersonalText(data.text)
        }
      } catch { /* silent fallback to static text */ }
    }
  }

  const resetSession = () => {
    setState({ ...INITIAL_STATE, cardVersion: state.cardVersion })
    setPersonalText(null)
  }

  // Derived values — computed, not stored
  const isQuizComplete =
    state.reasonForMoving !== null &&
    state.timeline !== null &&
    state.household !== null &&
    state.bedrooms !== null &&
    state.budget !== null &&
    state.transport !== null &&
    state.freeDay !== null &&
    state.neighbourhoodEnergy !== null &&
    state.outdoorsAccess !== null &&
    state.culturalCommunity !== null &&
    state.comfortPriority !== null

  const matchedNeighbourhood: Neighbourhood | null = state.matchedNeighbourhoodId
    ? (neighbourhoods.find((n) => n.id === state.matchedNeighbourhoodId) ?? null)
    : null

  const topMatches = useMemo(
    () => state.matchedNeighbourhoodId ? computeTopMatches(state, neighbourhoods, 3) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )

  const selectedListing: ListingObject | null = (() => {
    if (!matchedNeighbourhood || !state.bedrooms) return null
    const key =
      state.bedrooms === 1 ? 'oneBed' :
      state.bedrooms === 2 ? 'twoBed' :
      'threeBed'
    return matchedNeighbourhood.listings[key]
  })()

  const value = useMemo<SessionContextValue>(
    () => ({
      state,
      setAnswer,
      runMatching,
      resetSession,
      isQuizComplete,
      matchedNeighbourhood,
      selectedListing,
      topMatches,
      personalText,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession must be used inside <SessionProvider>')
  }
  return ctx
}
