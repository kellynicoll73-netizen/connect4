/**
 * Persona evaluation harness (NOT a unit test — an eval).
 * Runs the 9 review personas through the matcher: structural / semantic / blended,
 * and writes a comparison table to docs/Persona_Results.md.
 *
 * Run explicitly:  npx vitest run src/lib/personas.eval.test.ts
 * Requires VOYAGE_API_KEY in .env.local for the semantic + blended columns.
 */
import { it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import type { SessionState, Neighbourhood } from '../types'
import { computeStructuralScores, computeFitTier } from './matching'
import neighbourhoodsData from '../data/neighbourhoods.json'

const neighbourhoods = neighbourhoodsData as unknown as Neighbourhood[]
const NAME = Object.fromEntries(neighbourhoods.map((n) => [n.id, n.name])) as Record<string, string>

// ── load Voyage key from .env.local (Vite doesn't expose unprefixed env vars) ──
function loadVoyageKey(): string | null {
  try {
    const env = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8')
    const m = env.match(/^VOYAGE_API_KEY=(.+)$/m)
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null
  } catch {
    return null
  }
}

function base(): SessionState {
  return {
    reasonForMoving: null, reasonForMovingOther: null, workLocation: null, schoolLocation: null,
    timeline: null, timelineOther: null, household: null, householdOther: null,
    bedrooms: null, budget: null, budgetOther: null, transport: null, transportOther: null,
    freeDay: null, freeDayOther: null, neighbourhoodEnergy: null, neighbourhoodEnergyOther: null,
    outdoorsAccess: null, outdoorsAccessOther: null, culturalCommunity: null, culturalCommunityText: null,
    comfortPriority: null, comfortPriorityOther: null,
    currentCity: null, currentNeighbourhood: null, currentDescription: null,
    favouriteNeighbourhood: null, favouriteCity: null, favouriteCountry: null, favouriteDescription: null,
    matchedNeighbourhoodId: null,
  }
}
const p = (o: Partial<SessionState>): SessionState => ({ ...base(), ...o })

// ── The nine personas (from docs/Persona_Quiz_Answers.md — blind-derived) ──
const PERSONAS: Array<{ name: string; s: SessionState }> = [
  { name: 'Dapo', s: p({
    reasonForMoving: 'work', workLocation: 'Downtown financial district', timeline: '1-2-months',
    household: 'just-me', bedrooms: 1, budget: '1800-2500', transport: 'transit',
    freeDay: 'cafe-walking', neighbourhoodEnergy: 'alive-buzzy', outdoorsAccess: 'nice-to-have',
    culturalCommunity: 'yes', culturalCommunityText: 'African and broadly diverse community, food, languages',
    comfortPriority: 'diversity-inclusion',
    currentCity: 'Lagos', currentNeighbourhood: 'Yaba',
    currentDescription: 'Loud and packed and alive at all hours, tech crowd everywhere, street food, music spilling out, never alone or bored.',
    favouriteCity: 'Lagos', favouriteNeighbourhood: 'Yaba', favouriteCountry: 'Nigeria',
    favouriteDescription: 'There is always life on the street and people around who get you. You can step out at any hour and find food and a buzz.',
  }) },
  { name: 'Arjun', s: p({
    reasonForMoving: 'work', workLocation: 'Downtown core, tech company', timeline: '1-2-months',
    household: 'me-and-children', bedrooms: 2, budget: '2500-3500', transport: 'transit',
    freeDay: 'farmers-market', neighbourhoodEnergy: 'quiet-grounded', outdoorsAccess: 'important',
    culturalCommunity: 'yes', culturalCommunityText: 'South Asian, Indian community: vegetarian food, groceries with the right spices, a temple, kid grows up around people like us',
    comfortPriority: 'family',
    currentCity: 'Bengaluru', currentNeighbourhood: 'Indiranagar',
    currentDescription: 'Leafy but busy, great cafes and restaurants everywhere, families and young professionals mixed, walkable but mad traffic.',
    favouriteCity: 'Bengaluru', favouriteNeighbourhood: 'Indiranagar', favouriteCountry: 'India',
    favouriteDescription: 'It has everything — food, parks, community, a real neighbourhood feel — without being soulless. People know each other.',
  }) },
  { name: 'Lin', s: p({
    reasonForMoving: 'chose-vancouver', timeline: '3-months-plus',
    household: 'me-and-children', bedrooms: 3, budget: 'over-3500', transport: 'car',
    freeDay: 'farmers-market', neighbourhoodEnergy: 'quiet-grounded', outdoorsAccess: 'important',
    culturalCommunity: 'yes', culturalCommunityText: 'Mandarin-speaking Chinese community, Chinese supermarkets, doctors and services in Mandarin, good schools with other Chinese families',
    comfortPriority: 'family',
    currentCity: 'Shanghai', currentNeighbourhood: 'Gubei',
    currentDescription: 'Very safe, clean and family-friendly, lots of international families, good international schools nearby, everything available in Mandarin.',
    favouriteCity: 'Shanghai', favouriteNeighbourhood: 'Gubei', favouriteCountry: 'China',
    favouriteDescription: 'Safe and organised, schools are excellent, and I could manage everything easily without the local language. Comfortable for the whole family.',
  }) },
  { name: 'Joanna', s: p({
    reasonForMoving: 'work', workLocation: 'Surrey Memorial Hospital, shift work', timeline: '1-2-months',
    household: 'just-me', bedrooms: 1, budget: '1800-2500', transport: 'transit',
    freeDay: 'farmers-market', neighbourhoodEnergy: 'quiet-grounded', outdoorsAccess: 'nice-to-have',
    culturalCommunity: 'yes', culturalCommunityText: 'Filipino community, my church, Filipino grocery stores and restaurants, support since family is back home',
    comfortPriority: 'community-feel',
    currentCity: 'Cebu City', currentNeighbourhood: 'Lahug',
    currentDescription: 'Busy and warm, lots of family and neighbours around, church close by, food everywhere, never lonely.',
    favouriteCity: 'Cebu', favouriteNeighbourhood: 'Lahug', favouriteCountry: 'Philippines',
    favouriteDescription: 'Community — everyone knows everyone, the church is the heart of it, always someone to lean on. I never felt alone there.',
  }) },
  { name: 'Nima', s: p({
    reasonForMoving: 'work', workLocation: 'Hybrid, flexible, no fixed location', timeline: 'flexible',
    household: 'just-me', bedrooms: 1, budget: '2500-3500', transport: 'car',
    freeDay: 'outdoors-active', neighbourhoodEnergy: 'space-air', outdoorsAccess: 'essential',
    culturalCommunity: 'somewhat', culturalCommunityText: 'Persian/Iranian community nice to have nearby — good Persian food and groceries, maybe meeting other Iranians — but not central',
    comfortPriority: 'quiet-decompress',
    currentCity: 'Tehran', currentNeighbourhood: 'Elahieh',
    currentDescription: 'Up in the north near the mountains, cooler and calmer than downtown, nice cafes, hiking in twenty minutes, greener and relaxed but still good city life.',
    favouriteCity: 'Tehran', favouriteNeighbourhood: 'Elahieh, northern districts near the Alborz mountains', favouriteCountry: 'Iran',
    favouriteDescription: 'You get the mountains and the city at once — trails right there, but cafes and culture too. That combination is rare and exactly what I want.',
  }) },
  { name: 'Megan', s: p({
    reasonForMoving: 'work', workLocation: 'City office, location TBD', timeline: '1-2-months',
    household: 'me-and-partner', bedrooms: 1, budget: '2500-3500', transport: 'walking',
    freeDay: 'cafe-walking', neighbourhoodEnergy: 'scene-community', outdoorsAccess: 'important',
    culturalCommunity: 'somewhat', culturalCommunityText: 'Not a specific cultural group — a real mix of people, independent businesses, a neighbourhood with character and locals who care about it',
    comfortPriority: 'community-feel',
    currentCity: 'Toronto', currentNeighbourhood: 'Leslieville',
    currentDescription: 'Walkable and a bit gritty in the best way — indie coffee shops, great restaurants, vintage stores, dog people everywhere, feels like a community rather than a bunch of condos.',
    favouriteCity: 'Toronto', favouriteNeighbourhood: 'Leslieville', favouriteCountry: 'Canada',
    favouriteDescription: 'Walkable with real character — independent shops instead of chains, good food, a bit of edge, people who actually know their neighbours. Lived-in, not built-for-Instagram.',
  }) },
  { name: 'Ananya', s: p({
    reasonForMoving: 'school', schoolLocation: 'UBC, Point Grey campus', timeline: 'under-4-weeks',
    household: 'just-me', bedrooms: 1, budget: 'under-1800', transport: 'transit',
    freeDay: 'cafe-walking', neighbourhoodEnergy: 'alive-buzzy', outdoorsAccess: 'nice-to-have',
    culturalCommunity: 'somewhat', culturalCommunityText: 'Some Indian community and food would be comforting, and meeting other students — mostly I just want to not feel completely alone',
    comfortPriority: 'personal-safety',
    currentCity: 'Pune', currentNeighbourhood: 'Kothrud',
    currentDescription: 'Busy, young and student-heavy, loads of cheap places to eat and hang out, easy to get around, always someone to meet up with.',
    favouriteCity: 'Pune', favouriteNeighbourhood: 'Kothrud', favouriteCountry: 'India',
    favouriteDescription: 'Affordable and full of students like me, always a buzz, you never feel alone, and everything you need is close and cheap.',
  }) },
  { name: 'Tom', s: p({
    reasonForMoving: 'work', workLocation: 'Downtown Vancouver office, wants to walk to work', timeline: 'under-4-weeks',
    household: 'me-and-partner', bedrooms: 1, budget: 'over-3500', transport: 'walking',
    freeDay: 'cafe-walking', neighbourhoodEnergy: 'alive-buzzy', outdoorsAccess: 'nice-to-have',
    culturalCommunity: 'not-a-priority',
    comfortPriority: 'community-feel',
    currentCity: 'London', currentNeighbourhood: 'Shoreditch',
    currentDescription: 'Right in the thick of it — bars, restaurants, markets, everything walkable, never quiet, always something on.',
    favouriteCity: 'London', favouriteNeighbourhood: 'Shoreditch', favouriteCountry: 'UK',
    favouriteDescription: 'Everything is on your doorstep — work, food, nightlife, culture, all walkable. Central and alive in a way the suburbs never are.',
  }) },
  { name: 'Sam', s: p({
    reasonForMoving: 'figuring-it-out', timeline: 'flexible',
    household: 'just-me', bedrooms: 1, budget: 'not-sure', transport: 'transit',
    freeDay: 'sleeping-in', neighbourhoodEnergy: 'quiet-grounded', outdoorsAccess: 'nice-to-have',
    culturalCommunity: 'not-a-priority', comfortPriority: 'personal-safety',
    // all free-text left null — minimal input
  }) },
]

// ── semantic layer (mirrors src/app/api/match/route.ts) ──
function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}
async function semanticScores(apiKey: string, userText: string): Promise<Record<string, number>> {
  if (!userText.trim()) return {}
  const entries = neighbourhoods.map((n) => [n.id, n.personalityDescription] as const)
  const inputs = [userText, ...entries.map(([, d]) => d)]
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'voyage-3', input: inputs }),
  })
  if (!res.ok) throw new Error(`Voyage ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as { data: Array<{ embedding: number[] }> }
  const emb = data.data.map((d) => d.embedding)
  const user = emb[0]
  const out: Record<string, number> = {}
  entries.forEach(([id], i) => { out[id] = Math.round(((cosine(user, emb[i + 1]) + 1) / 2) * 100) })
  return out
}

// mirrors SessionContext.runMatching assembly
function userTextFor(s: SessionState): string {
  return [s.favouriteDescription, s.favouriteNeighbourhood, s.favouriteCity, s.favouriteCountry, s.culturalCommunityText]
    .filter(Boolean).join('. ')
}

function topN(scores: Record<string, number>, n = 5): Array<[string, number]> {
  return Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, n)
}
const fmt = (rows: Array<[string, number]>) =>
  rows.map(([id, sc]) => `${NAME[id]} (${sc.toFixed(1)})`).join(' · ')

// Makes live Voyage API calls — skipped under plain `npm test`.
// Run explicitly:  npm run eval:personas   (or RUN_PERSONA_EVAL=1 vitest run …)
it.skipIf(!process.env.RUN_PERSONA_EVAL)('persona evaluation — structural / semantic / blended', async () => {
  // silence matching.ts debug logs
  const origLog = console.log
  console.log = () => {}

  const key = loadVoyageKey()
  const lines: string[] = []
  lines.push('# Apt — Persona Matching Results')
  lines.push('')
  lines.push(`_Generated by \`src/lib/personas.eval.test.ts\`. Semantic key: ${key ? 'present' : 'MISSING (structural only)'}._`)
  lines.push('')
  lines.push('Compare against the oracle in `docs/Persona_Expected_Matches.md`.')
  lines.push('')
  lines.push('- **Structural** = honest attribute + commute + budget scoring, normalised 0–100 (no floor/ceiling).')
  lines.push('- **Semantic** = Voyage embedding similarity, min-max normalised 0–100 for comparability.')
  lines.push('- **Blended** = 70% structural + 30% semantic, ranked. Tier = priorities hit (no fake %).')
  lines.push('')

  // min-max normalise to 0–100 so the 70/30 blend is meaningful (no compression).
  const norm = (m: Record<string, number>): Record<string, number> => {
    const v = Object.values(m)
    if (v.length === 0) return {}
    const lo = Math.min(...v), hi = Math.max(...v), span = hi - lo || 1
    return Object.fromEntries(Object.entries(m).map(([k, x]) => [k, ((x - lo) / span) * 100]))
  }

  for (const { name, s } of PERSONAS) {
    const structural = computeStructuralScores(s, neighbourhoods) // already 0–100
    let semanticRaw: Record<string, number> = {}
    if (key) {
      try { semanticRaw = await semanticScores(key, userTextFor(s)) } catch (e) { semanticRaw = {}; origLog(`[${name}] semantic error:`, (e as Error).message) }
    }
    const hasSem = Object.keys(semanticRaw).length > 0
    const semantic = norm(semanticRaw)
    const blended: Record<string, number> = {}
    for (const n of neighbourhoods) {
      blended[n.id] = hasSem
        ? (structural[n.id] ?? 0) * 0.7 + (semantic[n.id] ?? 50) * 0.3
        : (structural[n.id] ?? 0)
    }
    // Rank by priorities hit (the honest fit), tiebreak by blended score.
    // Order and tier label always agree.
    const ranked = neighbourhoods
      .map((n) => {
        const { tier, hits, priorities } = computeFitTier(s, n)
        return { id: n.id, tier, hits, priorities, blended: blended[n.id] ?? 0 }
      })
      .sort((a, b) => b.hits - a.hits || b.blended - a.blended)
    const showRanked = (n: number) =>
      ranked.slice(0, n).map((r) => `${NAME[r.id]} [${r.tier} ${r.hits}/${r.priorities}]`).join(' · ')

    lines.push(`## ${name}`)
    lines.push(`- **Structural top 5:** ${fmt(topN(structural))}`)
    lines.push(`- **Semantic top 5:** ${hasSem ? fmt(topN(semantic)) : '_(no free-text → structural only)_'}`)
    lines.push(`- **Ranked top 5 (priorities hit, tiebreak blended):** ${showRanked(5)}`)
    lines.push('')
    origLog(`${name.padEnd(8)} → ${showRanked(3)}`)
  }

  fs.writeFileSync(path.resolve(process.cwd(), 'docs/Persona_Results.md'), lines.join('\n'))
  console.log = origLog
  console.log('\nResults written to docs/Persona_Results.md')
}, 180000)
