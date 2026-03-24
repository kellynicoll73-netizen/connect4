# ADR-002: Expandable secondary matches with lazy Claude personalisation

**Status:** Accepted
**Date:** March 2026
**PR:** #7 — UX: pre-load results, expandable secondary matches, mobile logo fix

---

## Context

Secondary match scores are often within 5–10% of the primary match. Users naturally want to compare — understanding why they got their top result means understanding how the alternatives differ. The previous design showed secondary matches as collapsed cards with a neighbourhood name and score only, giving users no way to explore the reasoning behind a close alternative.

## Options considered

| Option | Description |
|--------|-------------|
| A | Accordion expand in place — full card detail loads on click |
| B | Modal/drawer — secondary match opens as a full-screen overlay |
| C | Dedicated comparison page — side-by-side view of top 3 |
| **D** | **A + lazy personalisation — accordion, Claude text only fetched on expand** |

## Decision

**Option D** — accordion expansion with lazy Claude personalisation triggered on expand.

## Rationale

The accordion keeps the user on the results page without navigation overhead, making it easy to expand, compare, and collapse without losing their place. Lazy personalisation means Claude is only called for secondary matches the user actually wants to explore — avoiding unnecessary API calls and Anthropic credit usage for results nobody looks at.

The Lena-voice placeholder ("Finding the connection...") during the Claude call makes the short wait feel intentional and on-brand, consistent with the editorial voice throughout the app. This is preferable to a blank space or a generic spinner.

Options B and C both require navigation away from the primary result, adding friction to what should be a lightweight comparison.

## Consequences

- Users can explore close alternatives without leaving the results page ✅
- Claude is only called when a user actively expands — no wasted API calls ✅
- Slight latency on expand (~2–3s for Claude) — acceptable, placeholder manages expectation ✅
- Each expansion is a separate Claude call — repeated expand/collapse refires the call ⚠️ (could be cached in local state in a future iteration)

## Files changed

- `src/app/result/page.tsx` — expand toggle on secondary match cards, lazy Claude call on expand
- `src/components/result/SecondaryMatchCard.tsx` — updated to support expanded state and personalised comparison text
- `src/app/api/personalise/route.ts` — unchanged; reused for secondary match calls
