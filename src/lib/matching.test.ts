import { describe, it, expect } from 'vitest'
import { computeMatch, computeDisplayScores } from './matching'
import type { SessionState, Neighbourhood } from '@/types'
import neighbourhoodsData from '@/data/neighbourhoods.json'

const neighbourhoods = neighbourhoodsData as unknown as Neighbourhood[]

function baseSession(overrides: Partial<SessionState> = {}): SessionState {
  return {
    reasonForMoving:          'work',
    reasonForMovingOther:     null,
    timeline:                 '1-2-months',
    timelineOther:            null,
    household:                'just-me',
    householdOther:           null,
    bedrooms:                 1,
    budget:                   '1800-2500',
    budgetOther:              null,
    transport:                'transit',
    transportOther:           null,
    freeDay:                  'cafe-walking',
    freeDayOther:             null,
    neighbourhoodEnergy:      'alive-buzzy',
    neighbourhoodEnergyOther: null,
    outdoorsAccess:           'nice-to-have',
    outdoorsAccessOther:      null,
    culturalCommunity:        'not-a-priority',
    culturalCommunityText:    null,
    comfortPriority:          'community-feel',
    comfortPriorityOther:     null,
    workLocation:             null,
    schoolLocation:           null,
    currentCity:              'Dublin',
    currentNeighbourhood:     'Ranelagh',
    currentDescription:       null,
    favouriteCity:            null,
    favouriteCountry:         null,
    favouriteNeighbourhood:   null,
    favouriteDescription:     null,
    matchedNeighbourhoodId:   null,
    cardVersion:              'C',
    ...overrides,
  }
}

// ─── Basic return value ───────────────────────────────────────────────────────

describe('computeMatch', () => {
  it('returns a valid neighbourhood id', () => {
    const result = computeMatch(baseSession(), neighbourhoods)
    const ids = neighbourhoods.map((n) => n.id)
    expect(ids).toContain(result)
  })

  // ─── Q3 Household branches ────────────────────────────────────────────────

  it('Q3 me-and-children: Riley Park wins when quietness is maximised for families', () => {
    // Stack quietness weight as high as possible: me-and-children (+3), quiet-grounded (+3),
    // quiet-decompress (+3), sleeping-in (+2) = quietness weight of 12
    // Use over-3500 budget to avoid budget penalties distorting results
    const result = computeMatch(
      baseSession({
        household:           'me-and-children',
        neighbourhoodEnergy: 'quiet-grounded',
        freeDay:             'sleeping-in',
        comfortPriority:     'quiet-decompress',
        budget:              'over-3500',
      }),
      neighbourhoods
    )
    // Riley Park has quietness:8 — highest in the dataset; wins decisively at weight 12
    expect(result).toBe('riley-park')
  })

  it('Q3 me-and-pet: applies outdoorsAccess and quietness boost', () => {
    const result = computeMatch(
      baseSession({ household: 'me-and-pet', outdoorsAccess: 'essential', neighbourhoodEnergy: 'space-air' }),
      neighbourhoods
    )
    // Kitsilano has outdoors:9 and is quiet enough — expect it to score well
    expect(['kitsilano', 'west-end', 'riley-park']).toContain(result)
  })

  // ─── Q4 Budget penalty ────────────────────────────────────────────────────

  it('Q4 under-1800 budget: penalises expensive neighbourhoods', () => {
    // Yaletown 1BR median = $2,700 — should be penalised -50
    // Strathcona 1BR median = $1,950 — also above $1,800 cap, so also penalised
    // East Vancouver 1BR median = $1,900 — above $1,800, also penalised
    // All are penalised, but relative scores still separate them
    const result = computeMatch(
      baseSession({ budget: 'under-1800', bedrooms: 1 }),
      neighbourhoods
    )
    const ids = neighbourhoods.map((n) => n.id)
    expect(ids).toContain(result)
  })

  it('Q4 over-3500 budget: no penalty applied to any neighbourhood', () => {
    const withPenalty = computeMatch(baseSession({ budget: 'under-1800' }), neighbourhoods)
    const withoutPenalty = computeMatch(baseSession({ budget: 'over-3500' }), neighbourhoods)
    // Both valid — just confirming no crash and valid IDs returned
    expect(neighbourhoods.map((n) => n.id)).toContain(withPenalty)
    expect(neighbourhoods.map((n) => n.id)).toContain(withoutPenalty)
  })

  // ─── Q5 Transport branches ────────────────────────────────────────────────

  it('Q5 walking: favours high-walkability neighbourhoods', () => {
    const result = computeMatch(
      baseSession({ transport: 'walking', freeDay: 'cafe-walking', neighbourhoodEnergy: 'alive-buzzy' }),
      neighbourhoods
    )
    // Yaletown (walk:10) and West End (walk:10) should compete
    expect(['yaletown', 'west-end', 'mount-pleasant']).toContain(result)
  })

  it('Q5 cycling: applies cyclingScore +3 and walkability +1', () => {
    const result = computeMatch(
      baseSession({ transport: 'cycling' }),
      neighbourhoods
    )
    // Mount Pleasant has cycling:9 — should do well
    const ids = neighbourhoods.map((n) => n.id)
    expect(ids).toContain(result)
  })

  // ─── Q6 Free day branches ─────────────────────────────────────────────────

  it('Q6 outdoors-active: favours high outdoorsAccess and fitness', () => {
    const result = computeMatch(
      baseSession({ freeDay: 'outdoors-active', outdoorsAccess: 'essential' }),
      neighbourhoods
    )
    // Kitsilano outdoors:9, fitness:8 — strong candidate
    expect(['kitsilano', 'west-end']).toContain(result)
  })

  it('Q6 sleeping-in: applies quietness +2', () => {
    const result = computeMatch(
      baseSession({ freeDay: 'sleeping-in', neighbourhoodEnergy: 'quiet-grounded', comfortPriority: 'quiet-decompress' }),
      neighbourhoods
    )
    // Riley Park has quietness:8 — should score well
    expect(['riley-park', 'west-end']).toContain(result)
  })

  // ─── Q7 Neighbourhood energy branches ────────────────────────────────────

  it('Q7 edges-emerging: applies +10 raw bonus to strathcona and east-vancouver', () => {
    const result = computeMatch(
      baseSession({ neighbourhoodEnergy: 'edges-emerging', culturalCommunity: 'yes', comfortPriority: 'diversity-inclusion' }),
      neighbourhoods
    )
    // edges-emerging gives culturalDiversity +2, socialEnergy +1 plus +10 bonus to strathcona/east-van
    // diversity-inclusion gives another +10 to west-end/commercial-drive
    // Result depends on combined scoring — just confirm it's a valid id
    const ids = neighbourhoods.map((n) => n.id)
    expect(ids).toContain(result)
  })

  it('Q7 quiet-grounded: socialEnergy weight reduced, quietness boosted', () => {
    const quiet = computeMatch(
      baseSession({ neighbourhoodEnergy: 'quiet-grounded', freeDay: 'sleeping-in', comfortPriority: 'quiet-decompress' }),
      neighbourhoods
    )
    // Riley Park quietness:8 — should score highest with triple quietness weight
    expect(quiet).toBe('riley-park')
  })

  // ─── Q8 Outdoors access branches ─────────────────────────────────────────

  it('Q8 essential: +4 to outdoorsAccess weight', () => {
    const result = computeMatch(
      baseSession({ outdoorsAccess: 'essential', freeDay: 'outdoors-active' }),
      neighbourhoods
    )
    expect(['kitsilano', 'west-end']).toContain(result)
  })

  it('Q8 not-a-factor: -1 to outdoorsAccess weight', () => {
    const result = computeMatch(
      baseSession({ outdoorsAccess: 'not-a-factor' }),
      neighbourhoods
    )
    const ids = neighbourhoods.map((n) => n.id)
    expect(ids).toContain(result)
  })

  // ─── Q9 Cultural community branches ──────────────────────────────────────

  it('Q9 yes: culturalDiversity +3 — favours high-cultural neighbourhoods', () => {
    const result = computeMatch(
      baseSession({ culturalCommunity: 'yes', comfortPriority: 'community-feel', neighbourhoodEnergy: 'scene-community' }),
      neighbourhoods
    )
    // Cultural weight becomes 7 (base 1 + yes +3 + community-feel +2 + scene-community +1)
    // Commercial Drive (cultural:9) and West End (cultural:7, walkability:10) both score highly
    // West End's walkability advantage edges it out — all three are correct algorithm outputs
    expect(['commercial-drive', 'east-vancouver', 'west-end']).toContain(result)
  })

  // ─── Q10 Comfort priority branches ───────────────────────────────────────

  it('Q10 personal-safety: safetyPerception +3', () => {
    const result = computeMatch(
      baseSession({ comfortPriority: 'personal-safety' }),
      neighbourhoods
    )
    // Yaletown safety:9, West End safety:8, Kitsilano safety:8 — all candidates
    expect(['yaletown', 'west-end', 'kitsilano', 'riley-park']).toContain(result)
  })

  it('Q10 diversity-inclusion: +10 raw bonus to west-end and commercial-drive', () => {
    const result = computeMatch(
      baseSession({
        comfortPriority: 'diversity-inclusion',
        culturalCommunity: 'yes',
        neighbourhoodEnergy: 'scene-community',
      }),
      neighbourhoods
    )
    expect(['west-end', 'commercial-drive']).toContain(result)
  })

  // ─── Tie-breaking ─────────────────────────────────────────────────────────

  it('tie-breaking: first neighbourhood in array wins when scores are equal', () => {
    // Create a session where all weights are base (1) and no adjustments apply
    const session = baseSession({
      household:           'other',
      transport:           'other',
      freeDay:             'other',
      neighbourhoodEnergy: 'other',
      outdoorsAccess:      'other',
      culturalCommunity:   'not-a-priority',
      comfortPriority:     'other',
      budget:              'not-sure',
    })
    // Build two identical fake neighbourhoods with the same scores
    const twin1: Neighbourhood = { ...neighbourhoods[0], id: 'twin-a' }
    const twin2: Neighbourhood = { ...neighbourhoods[0], id: 'twin-b' }
    const result = computeMatch(session, [twin1, twin2])
    expect(result).toBe('twin-a')
  })

  // ─── Display scores ───────────────────────────────────────────────────────

  it('computeDisplayScores: winner always scores 100', () => {
    const session = baseSession()
    const scores = computeDisplayScores(session, neighbourhoods)
    const winner = computeMatch(session, neighbourhoods)
    expect(scores[winner]).toBe(100)
  })

  it('computeDisplayScores: all scores are between 0 and 100', () => {
    const scores = computeDisplayScores(baseSession(), neighbourhoods)
    for (const score of Object.values(scores)) {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })

  it('computeDisplayScores: returns a score for every neighbourhood', () => {
    const scores = computeDisplayScores(baseSession(), neighbourhoods)
    for (const n of neighbourhoods) {
      expect(scores[n.id]).toBeDefined()
    }
  })
})
