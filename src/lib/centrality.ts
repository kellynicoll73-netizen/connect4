import type { SessionState, Neighbourhood } from '../types'

// ─── Centrality / commute ──────────────────────────────────────────────────────
// Scores each neighbourhood by distance to an "anchor" point:
//   • a workplace/campus the user named  → personalised commute
//   • otherwise Waterfront Station        → generic centrality
// Same mechanism, different anchor. MVP uses straight-line (haversine) distance
// from static neighbourhood centroids — real, objective data (unlike the
// editorial attribute scores). Transit-time fidelity is a later upgrade.

type Coord = { lat: number; lng: number }

// Static neighbourhood centroids (approximate centres). Real geographic data.
const COORDS: Record<string, Coord> = {
  'kitsilano':              { lat: 49.2690, lng: -123.1670 },
  'mount-pleasant':         { lat: 49.2625, lng: -123.1010 },
  'commercial-drive':       { lat: 49.2690, lng: -123.0700 },
  'yaletown':               { lat: 49.2750, lng: -123.1210 },
  'strathcona':             { lat: 49.2770, lng: -123.0880 },
  'west-end':               { lat: 49.2850, lng: -123.1340 },
  'riley-park':             { lat: 49.2440, lng: -123.1030 },
  'chinatown':              { lat: 49.2795, lng: -123.0990 },
  'kerrisdale':             { lat: 49.2340, lng: -123.1560 },
  'marpole':                { lat: 49.2110, lng: -123.1300 },
  'oakridge':               { lat: 49.2270, lng: -123.1170 },
  'renfrew-collingwood':    { lat: 49.2480, lng: -123.0380 },
  'dunbar':                 { lat: 49.2440, lng: -123.1850 },
  'lower-lonsdale':         { lat: 49.3100, lng: -123.0770 },
  'deep-cove':              { lat: 49.3290, lng: -122.9500 },
  'metrotown':              { lat: 49.2270, lng: -123.0010 },
  'burnaby-heights':        { lat: 49.2820, lng: -123.0150 },
  'rocky-point-port-moody': { lat: 49.2840, lng: -122.8480 },
  'maillardville':          { lat: 49.2440, lng: -122.8780 },
  'steveston':              { lat: 49.1250, lng: -123.1820 },
  'cloverdale':             { lat: 49.1050, lng: -122.7230 },
  'surrey-city-centre':     { lat: 49.1890, lng: -122.8480 },
  'sapperton':              { lat: 49.2270, lng: -122.8890 },
  'fort-langley':           { lat: 49.1670, lng: -122.5790 },
  'white-rock':             { lat: 49.0250, lng: -122.8030 },
}

const DOWNTOWN: Coord = { lat: 49.2855, lng: -123.1115 } // Waterfront Station — default anchor

// Known anchors, matched by keyword against free-text work/school location.
// Free-text geocoding of arbitrary addresses is the later upgrade.
const ANCHORS: Array<{ match: string[]; coord: Coord }> = [
  { match: ['ubc', 'university of british columbia', 'point grey campus'], coord: { lat: 49.2606, lng: -123.2460 } },
  { match: ['sfu', 'simon fraser'],                                        coord: { lat: 49.2781, lng: -122.9199 } },
  { match: ['surrey memorial', 'surrey hospital'],                         coord: { lat: 49.1766, lng: -122.8430 } },
  { match: ['vgh', 'vancouver general'],                                   coord: { lat: 49.2627, lng: -123.1230 } },
  { match: ['richmond hospital'],                                          coord: { lat: 49.1700, lng: -123.1360 } },
  { match: ['downtown', 'financial district', 'gastown', 'waterfront', 'bentall', 'central business'], coord: DOWNTOWN },
]

// Phrases that mean "no fixed destination" → fall back to mild centrality.
const NO_FIXED = ['flexible', 'hybrid', 'no fixed', 'remote', 'work from home', 'wfh', 'tbd', 'unsure', 'not sure']

function destinationText(s: SessionState): string {
  return (s.schoolLocation || s.workLocation || '').toLowerCase().trim()
}

/** Resolve the anchor point and whether it's a specific destination. */
export function resolveAnchor(s: SessionState): { coord: Coord; specific: boolean } {
  const t = destinationText(s)
  if (!t || NO_FIXED.some((k) => t.includes(k))) return { coord: DOWNTOWN, specific: false }
  for (const a of ANCHORS) if (a.match.some((k) => t.includes(k))) return { coord: a.coord, specific: true }
  // A destination was given but we couldn't place it — assume a downtown job (a
  // reasonable prior for Metro Vancouver). Runtime geocoding would resolve these.
  return { coord: DOWNTOWN, specific: true }
}

function haversineKm(a: Coord, b: Coord): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

// How much commute matters, by transport mode (walkers must be close; drivers tolerate distance).
const BY_MODE: Record<string, number> = { walking: 1.3, cycling: 1.1, transit: 1.0, car: 0.6 }

/**
 * Weight applied to the proximity score.
 * Only weighted when the user named a workplace/campus — then commute is a real
 * cost. With NO destination we return 0: we do not impose a downtown-centrality
 * bias, because central vs peripheral is a preference, not a universal good.
 * (Deriving that preference from lifestyle answers is the next step.)
 */
export function commuteWeight(s: SessionState): number {
  if (!resolveAnchor(s).specific) return 0
  const mode = s.transport ? (BY_MODE[s.transport] ?? 1.0) : 1.0
  return 3 * mode
}

// Straight-line distance (km) at which proximity decays to ~37% of its max.
// Smaller = far places fall off faster. An ABSOLUTE decay (not min-max
// normalisation) so "9km out" reads as genuinely far — rather than "close"
// just because some other option happens to be 40km away.
const COMMUTE_SCALE_KM = 6

/**
 * 0–10 proximity score via absolute exponential decay from the anchor:
 * ~10 at the anchor, falling toward 0 with distance. Far neighbourhoods simply
 * earn little (an opportunity cost) — they are never pushed negative, so this
 * never drops a neighbourhood "off a cliff"; it only rewards being close.
 */
export function proximityScore(s: SessionState, n: Neighbourhood): number {
  const c = COORDS[n.id]
  if (!c) return 0
  return 10 * Math.exp(-haversineKm(resolveAnchor(s).coord, c) / COMMUTE_SCALE_KM)
}

export function computeProximityScores(
  s: SessionState,
  neighbourhoods: Neighbourhood[]
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const n of neighbourhoods) out[n.id] = proximityScore(s, n)
  return out
}
