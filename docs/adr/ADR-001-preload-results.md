# ADR-001: Pre-load Claude personalisation during the loading screen

**Status:** Accepted
**Date:** March 2026
**PR:** #7 — UX: pre-load results, expandable secondary matches, mobile logo fix

---

## Context

The results page was firing the Claude `/api/personalise` call after the page rendered. This caused a visible flash — static fallback text appeared briefly before the personalised comparison text replaced it. The flash undermined the sense that the result was thoughtfully prepared, and made the experience feel unfinished.

## Options considered

| Option | Description |
|--------|-------------|
| A | Show a skeleton shimmer in the comparison block while Claude loads |
| B | Hide the comparison block entirely until Claude responds |
| C | Show a Lena-voice placeholder line ("Finding the connection...") while loading |
| **D** | **Pre-load the Claude call during the loading screen — results render complete** |

## Decision

**Option D** — fire both the Voyage semantic call and the Claude personalisation call in parallel during the loading screen, so the results page renders fully formed on first paint.

## Rationale

The loading screen already exists as a deliberate pause between quiz completion and results. It is the honest moment where the app is "thinking." Using that window to pre-load both API calls means the results page renders complete — no flash, no swap.

Options A–C all involve the user watching something load on what should be a finished screen. Option D moves the wait to where it already belongs.

## Consequences

- Results page renders complete on first paint — no static-to-dynamic flash ✅
- Loading screen may run slightly longer on slow connections — acceptable given the context ✅
- If Claude fails, the static fallback is set during the loading window — results page always has something to show ✅
- Both API calls must complete (or fail gracefully) before the user reaches results — adds ~2–3s to loading time in the worst case ⚠️

## Files changed

- `src/app/loading/page.tsx` — fires both calls in parallel, waits for both before navigating
- `src/context/SessionContext.tsx` — `runMatching()` extended to include personalisation call; `personalText` added to session state
- `src/app/result/page.tsx` — reads `personalText` from context; removed `useEffect` API call on mount
