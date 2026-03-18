# Apt — Branch Changes Overview
**Branch:** `apt-product-review`
**Base:** `28b15de8` (Data: expand neighbourhood dataset)
**Date:** March 2026

---

## Visual & Brand Changes

### AptLogoHorizontal component (`src/components/ui/AptLogoHorizontal.tsx`)
- New reusable SVG logo lockup component combining the pin/heart mark with the "Apt" wordmark in a horizontal layout
- Three colour schemes: `light` (terracotta mark, dark wordmark — for cream/light backgrounds), `dark` (cream mark, cream wordmark — for dark backgrounds), `mono` (terracotta circle, cream heart, cream wordmark — for the terracotta phase intro cards)
- Two sizes: `sm` and `md`
- Used consistently across quiz pages, phase intro cards, and results page

### Quiz layout header (`src/components/quiz/QuizLayout.tsx`)
- Top bar: back button at far left, Apt logo left-aligned with content column — both on the same baseline row
- Progress indicator replaced with 11 individual question circles grouped into three phase clusters (5 + 5 + 1), separated by visual gaps
- Phase label rendered as a full-width terracotta pill spanning the window: `Phase X/4 — [Phase Name]`
- "Why We Ask" copy pinned to the footer above the Continue button (always visible, no toggle)
- Phase 2 uses a compass icon inline in the phase pill; Phase 3 uses a heart icon

### Phase intro cards (`src/app/quiz/phase/[num]/page.tsx`)
- New full-screen pages (terracotta background, `bg-primary-400`) inserted between quiz phases
- Large phase icon (no enclosing circle), cream colour, centred
- Cream monochrome Apt logo in the header
- Back button styled as a cream circle with a terracotta arrow
- Phase label displayed at content-column left alignment, no background pill

### Results page (`src/app/result/page.tsx`)
- Match score displayed in the same font weight and style as the main neighbourhood name section
- Secondary match cards ("Also Worth Exploring") use the same score typography treatment
- "How It Compares" and "From Someone Who Lives Here" blocks: white background removed, replaced with a `1px neutral-200` border; left accent bar retained
- Match signal pills updated with `1px` coloured borders (lime for matches, terracotta for gaps) to improve contrast
- Walkability score and median rent cards moved to directly under the match/gap pills
- "See what's available" CTA button repositioned to just above the "Also Worth Exploring" divider
- Personality description supports expand/collapse with a "Read more / Read less" toggle

---

## Functional & Design Changes

### Quiz flow restructure (`src/app/quiz/[step]/page.tsx`)
- Transport/commute question moved from Phase 2 into Phase 1 (Practicalities), reflecting its practical nature
- Budget and bedrooms combined into a single step (budget first)
- Phase boundaries updated across `ProgressBar` and `QuizLayout` to reflect the new grouping: steps 1–5 = Phase 1, steps 6–10 = Phase 2, step 11 = Phase 3
- Phase intro cards inserted into routing: quiz navigates through `/quiz/phase/2` and `/quiz/phase/3` at phase boundaries

### Place Memory step (step 11)
- Prompt rewritten to invite any neighbourhood the user has felt at home in — current location, past, or anywhere in the world
- Input fields: Neighbourhood name, City, Country (optional), and free-text description
- City and Country values flow into the analogous comparison logic on the results page

### Cultural community question (step 9)
- Free-text input for specifying cultural community now appears for both "Yes" and "Somewhat" answers (previously "Yes" only)

### "Why We Ask" (`src/components/quiz/WhyWeAskToggle.tsx`)
- Removed the expand/collapse toggle; copy is always visible
- Extracted from the question card and rendered in the layout footer so it appears at a consistent position across all steps
- Label rendered in bold uppercase

### Safety/comfort question options (`src/locales/en.ts`)
- Answer options for the safety/comfort question updated to be more meaningfully distinct

---

## Data Handling & Structural Changes

### Neighbourhood dataset (`src/data/neighbourhoods.json`)
- Full personality descriptions, taglines, analogous comparisons, community quotes, scoring attributes, median rent (1/2/3 bed), and walkability scores added for all 25 neighbourhoods
- Covers Metro Vancouver neighbourhoods across Vancouver, Burnaby, Richmond, New Westminster, North Shore, and the Tri-Cities
- Review document (`NEIGHBOURHOOD-REVIEW.md`) added documenting the research and editorial decisions behind each entry

### Semantic matching API (`src/app/api/match/route.ts`)
- Match route updated to pull `personalityDescription` dynamically from all 25 neighbourhoods in `neighbourhoods.json`
- Removes previous hardcoded subset; ready to activate with an `OPENAI_API_KEY` in `.env.local`

### Session state (`src/context/SessionContext.tsx`, `src/types/index.ts`)
- Added `favouriteCity`, `favouriteCountry`, and `culturalCommunityText` fields to session state
- Semantic match user text string now includes: favourite description, neighbourhood, city, country, and cultural community text

### Results deduplication (`src/app/result/page.tsx`)
- Secondary match list now explicitly filters out the primary winner before slicing, preventing the top match from appearing in both sections

### Tooling
- `scripts/update_descriptions.py` — utility script for batch-updating neighbourhood descriptions in the JSON data file
- `.eslintrc.json` — ESLint configuration added to the project root

---

## Matching Architecture — Current & Planned

### How matching works today (structural scoring)

The current match is driven entirely by a weighted dot-product in `src/lib/matching.ts`. Each neighbourhood has nine scored attributes (walkability, transit, cycling, outdoors access, cultural diversity, safety perception, social energy, fitness access, quietness — all rated 1–10). Quiz answers dynamically raise or lower the weight for each attribute: for example, answering "I get around by transit" bumps `transitScore` weight by +3.

The final score for each neighbourhood is:

```
score = Σ (attribute_value × attribute_weight)
      + budget_penalty   (−50 if median rent exceeds the user's cap)
      + raw_bonuses      (neighbourhood-specific boosts for certain answer combinations)
```

All 25 neighbourhoods are scored, sorted, and the top result is surfaced as the primary match. Display percentages are normalised so the winner always shows 88–100% (reflecting a realistic confidence range rather than a literal percentage match).

Match signal pills on the results page derive from the same weights: attributes where the user's weight is ≥ 3 and the neighbourhood scores ≥ 7 appear as green "Where it matches" pills; the same threshold with a score ≤ 5 produces terracotta "Where it doesn't quite fit" pills.

### Blended scoring — semantic layer (scaffolded, not yet active)

The API route at `src/app/api/match/route.ts` adds a semantic similarity layer using OpenAI embeddings (`text-embedding-3-small`). When activated, it works as follows:

1. **User text is assembled** from the Place Memory step: the neighbourhood they love, the city, the country, and their free-text description — plus any cultural community text entered in step 9. This is the most expressive, unstructured signal the user provides.

2. **Embeddings are generated** in parallel for the user's text and for all 25 neighbourhood `personalityDescription` fields (the editorial prose descriptions in `neighbourhoods.json`).

3. **Cosine similarity** is computed between the user vector and each neighbourhood vector, producing a 0–100 semantic score per neighbourhood.

4. **Blended final score** combines structural and semantic signals:
   - Structural score: **70% weight**
   - Semantic score: **30% weight**
   - The blend rewards neighbourhoods that match both the user's stated preferences *and* the feel of a place they already love

**To activate:** add `OPENAI_API_KEY=<key>` to `.env.local`. The UI and API wiring are already in place; the structural-only fallback remains active when no key is present.

### Why this approach

Structural scoring is deterministic, fast, and debuggable — it directly maps quiz answers to neighbourhood attributes. Semantic scoring adds a qualitative layer that structural weights cannot capture: someone who describes loving a specific neighbourhood in another city carries implicit preference signals (density, character, social mix) that don't map cleanly to nine numeric attributes. The 70/30 blend is a starting point and can be tuned based on feedback from real users.
