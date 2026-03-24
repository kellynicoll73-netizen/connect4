# ADR-003: Logo overlap fix on mobile viewports

**Status:** Accepted
**Date:** March 2026
**PR:** #7 — UX: pre-load results, expandable secondary matches, mobile logo fix

---

## Context

On mobile viewports (narrower than ~640px), the absolute-positioned back button in the quiz header overlapped the Apt logo lockup, obscuring the mark. The logo sits in the content column starting at `px-5`; the back button is positioned `absolute left-4`. On wider screens there is enough space for both to coexist. On narrow screens they collide.

## Options considered

| Option | Description |
|--------|-------------|
| **A** | **Add responsive left padding to the logo container on small screens** |
| B | Add right margin to the back button |
| C | Restructure the header to flex layout on mobile |

## Decision

**Option A** — add `pl-12 sm:pl-0` to the logo wrapper div in `QuizLayout.tsx`.

## Rationale

Least invasive fix. Tailwind's mobile-first responsive prefix means `pl-12` applies below 640px (the `sm` breakpoint) and `sm:pl-0` resets it to zero above. The 640px cutoff safely covers the widest common phones (iPhone Pro Max at 430px portrait, Samsung Ultra at 480px). No layout restructuring needed and no impact on tablet or desktop viewports.

Option B would affect the back button position at all screen sizes. Option C is the cleanest long-term solution but is disproportionate effort for a single-line fix.

## Consequences

- Logo no longer overlaps the back button on mobile ✅
- Zero impact on viewports wider than 640px ✅
- If the back button width ever changes significantly, the `pl-12` value may need revisiting ⚠️

## Files changed

- `src/components/quiz/QuizLayout.tsx` — `pl-12 sm:pl-0` added to logo wrapper div
