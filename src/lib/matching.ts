import type { SessionState, Neighbourhood, NeighbourhoodAttributes } from '@/types'

// ─── Weight table ─────────────────────────────────────────────────────────────

type AttributeWeights = Record<keyof NeighbourhoodAttributes, number>

function baseWeights(): AttributeWeights {
  return {
    walkability:       1,
    transitScore:      1,
    cyclingScore:      1,
    outdoorsAccess:    1,
    culturalDiversity: 1,
    safetyPerception:  1,
    socialEnergy:      1,
    fitnessAccess:     1,
    quietness:         1,
  }
}

function applyWeightAdjustments(session: SessionState): AttributeWeights {
  const w = baseWeights()

  // Q3 — Household
  switch (session.household) {
    case 'just-me':
      w.quietness += 1
      break
    case 'me-and-pet':
      w.outdoorsAccess += 1
      w.quietness += 1
      break
    case 'me-and-partner':
      w.socialEnergy += 1
      break
    case 'me-and-children':
      w.quietness += 3
      w.safetyPerception += 2
      w.outdoorsAccess += 1
      w.socialEnergy -= 1
      break
  }

  // Q5 — Transport
  switch (session.transport) {
    case 'transit':
      w.transitScore += 3
      break
    case 'walking':
      w.walkability += 3
      break
    case 'cycling':
      w.cyclingScore += 3
      w.walkability += 1
      break
    // 'car' and 'other': no adjustment
  }

  // Q6 — Free day
  switch (session.freeDay) {
    case 'cafe-walking':
      w.walkability += 2
      w.socialEnergy += 1
      break
    case 'outdoors-active':
      w.outdoorsAccess += 3
      w.fitnessAccess += 1
      break
    case 'farmers-market':
      w.walkability += 1
      w.culturalDiversity += 1
      w.socialEnergy += 1
      break
    case 'sleeping-in':
      w.quietness += 2
      break
    case 'cultural-browse':
      w.walkability += 2
      w.culturalDiversity += 2
      w.socialEnergy += 1
      break
  }

  // Q7 — Neighbourhood energy
  switch (session.neighbourhoodEnergy) {
    case 'alive-buzzy':
      w.socialEnergy += 3
      w.quietness -= 2
      break
    case 'quiet-grounded':
      w.quietness += 3
      w.socialEnergy -= 1
      break
    case 'scene-community':
      w.socialEnergy += 2
      w.culturalDiversity += 1
      break
    case 'space-air':
      w.outdoorsAccess += 2
      w.quietness += 2
      w.socialEnergy -= 1
      break
    case 'edges-emerging':
      w.culturalDiversity += 2
      w.socialEnergy += 1
      break
    // 'other': no adjustment
  }

  // Q8 — Outdoors access
  switch (session.outdoorsAccess) {
    case 'essential':
      w.outdoorsAccess += 4
      break
    case 'important':
      w.outdoorsAccess += 2
      break
    case 'nice-to-have':
      w.outdoorsAccess += 1
      break
    case 'not-a-factor':
      w.outdoorsAccess -= 1
      break
  }

  // Q9 — Cultural community
  switch (session.culturalCommunity) {
    case 'yes':
      w.culturalDiversity += 3
      break
    case 'somewhat':
      w.culturalDiversity += 1
      break
    // 'not-a-priority': no adjustment
  }

  // Q10 — Comfort & safety
  switch (session.comfortPriority) {
    case 'personal-safety':
      w.safetyPerception += 3
      break
    case 'family':
      w.safetyPerception += 2
      w.quietness += 1
      w.outdoorsAccess += 1
      break
    case 'community-feel':
      w.culturalDiversity += 2
      w.socialEnergy += 1
      break
    case 'quiet-decompress':
      w.quietness += 3
      break
    case 'diversity-inclusion':
      w.culturalDiversity += 2
      w.safetyPerception += 1
      break
    case 'grit-character':
      w.safetyPerception -= 1
      w.culturalDiversity += 1
      w.socialEnergy += 1
      break
    case 'grit':
      w.safetyPerception -= 2
      w.socialEnergy += 1
      w.culturalDiversity += 1
      break
    // 'other': no adjustment
  }

  return w
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function computeRawScore(
  neighbourhood: Neighbourhood,
  weights: AttributeWeights
): number {
  const a = neighbourhood.attributes
  return (
    a.walkability       * weights.walkability       +
    a.transitScore      * weights.transitScore      +
    a.cyclingScore      * weights.cyclingScore      +
    a.outdoorsAccess    * weights.outdoorsAccess    +
    a.culturalDiversity * weights.culturalDiversity +
    a.safetyPerception  * weights.safetyPerception  +
    a.socialEnergy      * weights.socialEnergy      +
    a.fitnessAccess     * weights.fitnessAccess     +
    a.quietness         * weights.quietness
  )
}

function applyBudgetPenalty(
  neighbourhood: Neighbourhood,
  session: SessionState
): number {
  const budgetCaps: Partial<Record<string, number>> = {
    'under-1800': 1800,
    '1800-2500':  2500,
    '2500-3500':  3500,
  }

  const cap = session.budget ? budgetCaps[session.budget] : undefined
  if (cap === undefined) return 0

  const bedroomKey =
    session.bedrooms === 1 ? 'oneBed' :
    session.bedrooms === 2 ? 'twoBed' :
    session.bedrooms === 3 ? 'threeBed' : null

  if (!bedroomKey) return 0

  const medianRent = neighbourhood.medianRent[bedroomKey]
  return medianRent > cap ? -50 : 0
}

function applyRawBonuses(
  neighbourhood: Neighbourhood,
  session: SessionState
): number {
  let bonus = 0

  // Q7 edges-emerging: +10 to Strathcona, Chinatown, Surrey City Centre, and Maillardville
  if (session.neighbourhoodEnergy === 'edges-emerging') {
    if (
      neighbourhood.id === 'strathcona' ||
      neighbourhood.id === 'chinatown' ||
      neighbourhood.id === 'surrey-city-centre' ||
      neighbourhood.id === 'maillardville'
    ) {
      bonus += 10
    }
  }

  // Q10 diversity-inclusion: +10 to West End and Commercial Drive
  if (session.comfortPriority === 'diversity-inclusion') {
    if (neighbourhood.id === 'west-end' || neighbourhood.id === 'commercial-drive') {
      bonus += 10
    }
  }

  return bonus
}

// ─── Attribute labels (for match/gap pills) ───────────────────────────────────

const ATTRIBUTE_LABELS: Record<keyof NeighbourhoodAttributes, string> = {
  walkability:       'Walkable',
  transitScore:      'Great transit',
  cyclingScore:      'Cycling',
  outdoorsAccess:    'Nature access',
  culturalDiversity: 'Cultural diversity',
  safetyPerception:  'Safety',
  socialEnergy:      'Social energy',
  fitnessAccess:     'Fitness access',
  quietness:         'Quiet',
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the id of the highest-scoring neighbourhood.
 * Tie-breaking: first in the array wins (array order is authoritative).
 */
export function computeMatch(
  session: SessionState,
  neighbourhoods: Neighbourhood[]
): string {
  const weights = applyWeightAdjustments(session)

  const scores = neighbourhoods.map((n) => ({
    id:    n.id,
    score: computeRawScore(n, weights)
           + applyBudgetPenalty(n, session)
           + applyRawBonuses(n, session),
  }))

  const best = scores.reduce((a, b) => (b.score > a.score ? b : a))
  return best.id
}

/**
 * Returns display scores (0–100) for all neighbourhoods relative to the winner.
 * The winning neighbourhood always displays 100.
 */
export function computeDisplayScores(
  session: SessionState,
  neighbourhoods: Neighbourhood[]
): Record<string, number> {
  const weights = applyWeightAdjustments(session)

  const rawScores = neighbourhoods.map((n) => ({
    id:    n.id,
    score: computeRawScore(n, weights)
           + applyBudgetPenalty(n, session)
           + applyRawBonuses(n, session),
  }))

  // Theoretical max: every attribute at score 10 × its weight (no negatives)
  // theoreticalMax unused — kept as reference: Object.values(weights).reduce((sum, w) => sum + Math.max(w, 0) * 10, 0)

  const maxRaw = Math.max(...rawScores.map((s) => s.score), 1)
  return Object.fromEntries(
    rawScores.map(({ id, score }) => [
      id,
      Math.round(50 + (score / maxRaw) * 38),
    ])
  )
}

/**
 * Returns top N neighbourhoods ranked by score, with normalised display scores.
 * Winner always scores 100; others are relative to the winner.
 */
export function computeTopMatches(
  session: SessionState,
  neighbourhoods: Neighbourhood[],
  n = 3
): Array<{ neighbourhood: Neighbourhood; score: number }> {
  const weights = applyWeightAdjustments(session)

  const scored = neighbourhoods
    .map((neighbourhood) => ({
      neighbourhood,
      raw: computeRawScore(neighbourhood, weights)
           + applyBudgetPenalty(neighbourhood, session)
           + applyRawBonuses(neighbourhood, session),
    }))
    .sort((a, b) => b.raw - a.raw)

  // Theoretical max: every attribute at score 10 × its weight (no negatives)
  // theoreticalMax unused — kept as reference: Object.values(weights).reduce((sum, w) => sum + Math.max(w, 0) * 10, 0)
  const maxRaw = scored.length > 0 ? Math.max(scored[0].raw, 1) : 1
  return scored.slice(0, n).map(({ neighbourhood, raw }) => ({
    neighbourhood,
    score: Math.round(50 + (raw / maxRaw) * 38),
  }))
}

/**
 * Returns match and gap pill labels for a neighbourhood given the user's session.
 * Matches: dimensions the user weights highly (≥3) where the neighbourhood scores well (≥7).
 * Gaps:    dimensions the user weights highly (≥3) where the neighbourhood scores poorly (≤5).
 */
export function computeMatchSignals(
  session: SessionState,
  neighbourhood: Neighbourhood
): { matches: string[]; gaps: string[] } {
  const weights = applyWeightAdjustments(session)
  const attrs   = neighbourhood.attributes

  const sorted = (Object.keys(weights) as (keyof NeighbourhoodAttributes)[])
    .sort((a, b) => weights[b] - weights[a])

  const matches: string[] = []
  const gaps:    string[] = []

  for (const attr of sorted) {
    if (weights[attr] < 3) break
    const score = attrs[attr]
    if (score >= 7) {
      matches.push(ATTRIBUTE_LABELS[attr])
    } else if (score <= 5) {
      gaps.push(ATTRIBUTE_LABELS[attr])
    }
    if (matches.length >= 4 && gaps.length >= 3) break
  }

  return { matches: matches.slice(0, 4), gaps: gaps.slice(0, 3) }
}
