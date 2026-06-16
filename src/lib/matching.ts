import type { SessionState, Neighbourhood, NeighbourhoodAttributes } from '@/types'
import { computeProximityScores, commuteWeight, proximityScore } from './centrality'

// ─── Weight table ─────────────────────────────────────────────────────────────

type AttributeWeights = Record<keyof NeighbourhoodAttributes, number>

// Base weight for every attribute before quiz answers adjust it.
// Kept at 1: it regularises toward well-rounded fit. Lowering it (tested 0 and
// 0.5 against the persona suite) surfaces remote single-axis extremes
// (Deep Cove, White Rock) for quiet/outdoors personas — worse, not better.
// The real magnitude-bias fix is per-attribute normalisation (with penalty
// rescaling), and the bigger lever is a missing centrality/commute dimension.
const BASE_WEIGHT = 1.5

function baseWeights(): AttributeWeights {
  return {
    walkability:       BASE_WEIGHT,
    transitScore:      BASE_WEIGHT,
    cyclingScore:      BASE_WEIGHT,
    outdoorsAccess:    BASE_WEIGHT,
    culturalDiversity: BASE_WEIGHT,
    safetyPerception:  BASE_WEIGHT,
    socialEnergy:      BASE_WEIGHT,
    fitnessAccess:     BASE_WEIGHT,
    quietness:         BASE_WEIGHT,
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
  if (medianRent <= cap) return 0
  // Graduated penalty: scales with how far over budget, capped at -40.
  // Replaces a flat -50 "cliff" that collapsed all over-budget options equally.
  const overFraction = (medianRent - cap) / cap
  return -Math.min(40, Math.round(overFraction * 100))
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
  const proximity = computeProximityScores(session, neighbourhoods)
  const cWeight = commuteWeight(session)

  const scores = neighbourhoods.map((n) => ({
    id:    n.id,
    score: computeRawScore(n, weights)
           + applyBudgetPenalty(n, session)
           + applyRawBonuses(n, session)
           + (proximity[n.id] ?? 0) * cWeight,
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
  const proximity = computeProximityScores(session, neighbourhoods)
  const cWeight = commuteWeight(session)

  console.log(
    '[Matching] Answers → Q3:', session.household,
    '| Q5:', session.transport,
    '| Q6:', session.freeDay,
    '| Q7:', session.neighbourhoodEnergy,
    '| Q8:', session.outdoorsAccess,
    '| Q9:', session.culturalCommunity,
    '| Q10:', session.comfortPriority,
  )
  console.log(
    '[Matching] Weights (base 1):',
    Object.entries(weights).map(([k, v]) => `${k}:${v}`).join(' | ')
  )

  const rawScores = neighbourhoods.map((n) => ({
    id:    n.id,
    score: computeRawScore(n, weights)
           + applyBudgetPenalty(n, session)
           + applyRawBonuses(n, session)
           + (proximity[n.id] ?? 0) * cWeight,
  }))

  const top5raw = [...rawScores].sort((a, b) => b.score - a.score).slice(0, 5)
  console.log(
    '[Matching] Top 5 raw scores:',
    top5raw.map(({ id, score }) => `${id}:${score}`).join(' | ')
  )

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
  const proximity = computeProximityScores(session, neighbourhoods)
  const cWeight = commuteWeight(session)

  const scored = neighbourhoods
    .map((neighbourhood) => ({
      neighbourhood,
      raw: computeRawScore(neighbourhood, weights)
           + applyBudgetPenalty(neighbourhood, session)
           + applyRawBonuses(neighbourhood, session)
           + (proximity[neighbourhood.id] ?? 0) * cWeight,
    }))
    .sort((a, b) => b.raw - a.raw)

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

// ─── Honest scoring (no display compression) ───────────────────────────────────

/**
 * Structural scores normalised 0–100 across the set — for ranking and blending,
 * NOT a user-facing percentage. Min-max with no artificial floor/ceiling, so
 * strong signals (commute, budget) keep their full spread and influence.
 * (Replaces computeDisplayScores's 50–88 transform in the ranking pipeline.)
 */
export function computeStructuralScores(
  session: SessionState,
  neighbourhoods: Neighbourhood[]
): Record<string, number> {
  const weights = applyWeightAdjustments(session)
  const proximity = computeProximityScores(session, neighbourhoods)
  const cWeight = commuteWeight(session)

  const raw = neighbourhoods.map((n) => ({
    id:    n.id,
    score: computeRawScore(n, weights)
           + applyBudgetPenalty(n, session)
           + applyRawBonuses(n, session)
           + (proximity[n.id] ?? 0) * cWeight,
  }))

  const vals = raw.map((r) => r.score)
  const min  = Math.min(...vals)
  const max  = Math.max(...vals)
  const span = max - min || 1
  return Object.fromEntries(raw.map((r) => [r.id, ((r.score - min) / span) * 100]))
}

export type FitTier = 'strong' | 'good' | 'stretch'

/**
 * Honest confidence: how many of the user's priorities this neighbourhood hits.
 * Priorities = attributes the user weighted highly (≥3), plus commute when a
 * workplace/campus was named. No normalisation — just "x of y", which doubles
 * as the explanation ("strong fit — matches 5 of the 6 things you cared about").
 */
export function computeFitTier(
  session: SessionState,
  neighbourhood: Neighbourhood
): { tier: FitTier; hits: number; priorities: number } {
  const weights = applyWeightAdjustments(session)
  const attrs   = neighbourhood.attributes

  let priorities = 0
  let hits = 0
  for (const k of Object.keys(weights) as (keyof NeighbourhoodAttributes)[]) {
    if (weights[k] >= 3) {
      priorities++
      if (attrs[k] >= 7) hits++
    }
  }
  // Commute counts as a priority only when a workplace/campus was named.
  if (commuteWeight(session) > 0) {
    priorities++
    if (proximityScore(session, neighbourhood) >= 5) hits++
  }

  const ratio = priorities > 0 ? hits / priorities : 0
  const tier: FitTier =
    priorities === 0 ? 'stretch' :
    ratio >= 0.6     ? 'strong'  :
    ratio >= 0.34    ? 'good'    : 'stretch'

  return { tier, hits, priorities }
}
