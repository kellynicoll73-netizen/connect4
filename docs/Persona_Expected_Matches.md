# Apt — Persona Expected Matches (The Local's Recommendations)

**Purpose:** The **test oracle** for the persona suite. For each of the nine personas in
`docs/Persona_Test_Suite.md`, this is what a knowledgeable Vancouver local — someone who knows all
25 neighbourhoods and has just had a real conversation with the person — would recommend.

**Method (deliberate):** These recommendations are made **from first principles**, based on the
persona's life and needs. They were written **before** deriving any quiz answers and **without**
reference to the matching code. This keeps the yardstick honest: later we run each persona through
the questionnaire, and compare the algorithm's output to *this*. Agreement = the matcher is working;
divergence = something to tune.

**Scope:** Recommendations drawn only from the **current 25** neighbourhoods. Where the ideal
answer is a neighbourhood we don't yet cover (e.g. West Point Grey for a UBC student, Richmond
Centre for a Chinese family), that's noted as a *coverage gap*, not a match.

**Honesty notes:**
- This is me role-playing a knowledgeable local. Some neighbourhood traits in our data are
  editorial (✍) — a real Vancouverite should sanity-check the calls, especially safety and
  community-composition claims.
- ⚠️ **Commute flag:** several personas are anchored on a workplace/campus the matcher currently
  ignores. Where a recommendation hinges on commute, it's flagged — those are exactly the cases
  where we *expect* the algorithm to diverge until a commute anchor exists.

**Legend:** ✅ recommend · 🟡 could work · 🚫 steer away

---

## 1. Dapo — Nigerian, single, downtown data job, no car, budget-conscious, wants culture + community

✅ **Commercial Drive** — diverse, lively, real street life and food, ~20 min transit to downtown. The most "you won't feel like a stranger" option.
✅ **Renfrew-Collingwood** — most affordable in the city proper, Millennium Line, genuinely multicultural food scene; more space for the money (less of an obvious hub).
✅ **Mount Pleasant** — Main Street energy, transit/bike to downtown, creative crowd — *if* he can stretch the budget.
🟡 **Metrotown** — diverse, international food, Expo Line ~25 min downtown, below-Vancouver rent; tower-dense but great value.
🟡 **Strathcona** — close to downtown, walkable, edgy and affordable-ish; the DTES-adjacent blocks are the caveat.
🚫 **Deep Cove, Fort Langley, White Rock, Cloverdale, Steveston** — car-dependent, remote, homogeneous, brutal downtown commute; the exact isolation he'd dread.
🚫 **Kerrisdale, Dunbar** — quiet, pricey, family-oriented, low diversity.

**Local's caveat:** downtown commute matters — the Drive/Mount Pleasant/Strathcona are short transit hops; suburbs are out. On his budget, the Drive or Renfrew-Collingwood are the realistic sweet spot.

---

## 2. Arjun — Indian, family + toddler, downtown tech job, 2BR, comfortable budget, torn Surrey-vs-downtown

✅ **Metrotown** — large South Asian + Asian community, family amenities, Expo Line ~25 min to a downtown office, better value than Vancouver. The strongest "community *and* sane commute" pick.
✅ **Renfrew-Collingwood** — affordable, family space, diverse, Millennium Line ~30 min downtown; quieter than the Drive.
🟡 **Surrey City Centre** — maximum community + affordability, SkyTrain — but a long downtown haul; the trade-off he's agonising over.
🟡 **Riley Park / Mount Pleasant** — lovely East-Side family life and short commute, but pricier for 2BR and less South Asian community.
🚫 **Deep Cove, Fort Langley, White Rock, Steveston, Cloverdale** — far, car-dependent, punishing downtown commute for a parent.
🚫 **Yaletown, West End** — expensive, small units, not toddler-friendly.
🚫 **Strathcona, Chinatown** — safety perception not ideal with a toddler.

**Local's caveat:** ⚠️ this *is* the commute-vs-community decision. Surrey wins on community/cost; Metrotown/Renfrew win once you weight the downtown commute — which the app can't currently do.

---

## 3. Lin — Chinese, family + 2 school-age kids, drives, 3BR, mid-high budget, schools/safety/quiet/community

✅ **Kerrisdale** — excellent schools, very safe and quiet, established Chinese community, family-scaled. Top pick for her priorities.
✅ **Oakridge** — Canada Line, strong Chinese community, quiet and family-friendly (active redevelopment is the one downside).
✅ **Steveston** — safe, quiet, waterfront family life, space; farther from Richmond's Chinese-services core but close enough by car.
🟡 **Burnaby Heights** — quiet, leafy, family; smaller Chinese community than Richmond/West Side.
🚫 **Commercial Drive, Strathcona, Chinatown** — loud, transient, safety perception — wrong for young kids.
🚫 **Yaletown, West End, Mount Pleasant** — downtown/lively, small or costly for 3BR, not family-quiet.
🚫 **Deep Cove, Fort Langley** — space yes, but too remote from Chinese community and services.

**Local's caveat:** she drives, so commute is loose; schools + safety + community dominate. The true default — **Richmond Centre** — is a *coverage gap* (only Steveston represents Richmond in our 25).

---

## 4. Joanna — Filipino, single nurse, suburban hospital, shift work, moderate budget, community vs commute

*(Assume Surrey Memorial — the most common recruitment site; note the answer shifts with the hospital.)*
✅ **Surrey City Centre** — near the hospital (kind shift commute), Filipino community present, affordable, SkyTrain.
✅ **Metrotown** — Filipino community + bakeries, central reach to multiple hospitals, Expo Line, affordable-ish.
🟡 **Renfrew-Collingwood (Joyce-Collingwood)** — heart of the Filipino community and affordable, *but* a long, grinding commute to a Surrey hospital — lovely for belonging, hard for night shifts.
🚫 **Kitsilano, Kerrisdale, Dunbar** — expensive, low Filipino community, bad shift commute.
🚫 **Deep Cove, Fort Langley, White Rock, Steveston** — remote, car-dependent, isolating.

**Local's caveat:** ⚠️ commute + shift *timing* is the deciding factor (night-shift transit is thin), and it's exactly what the matcher ignores. The honest call flips with which hospital she's at.

---

## 5. Nima — Iranian, single engineer, hybrid/flexible, cultured + outdoorsy, comfortable budget, North-Shore-vs-urban

✅ **Lower Lonsdale** — almost tailor-made: mountains and trails at the back, Persian community on the North Shore, SeaBus to downtown, waterfront breweries and a real village feel.
✅ **Kitsilano** — the urban-but-outdoorsy balance: beach, seawall, West Side social life, near water and trails.
✅ **Mount Pleasant** — if he leans urban: walkable, creative, central, social.
🟡 **Rocky Point (Port Moody)** — strong if he leans nature: inlet, trails, breweries, SkyTrain.
🟡 **West End** — walkable, English Bay, Stanley Park, lively.
🚫 **Cloverdale, Fort Langley, White Rock, Surrey City Centre, Steveston** — suburban/remote, no outdoors-plus-urban combo, dull for a single professional.
🚫 **Deep Cove** — nature yes, but too remote and socially dead for someone still ambivalent.

**Local's caveat:** a genuinely close call between two good lives — the best test of how the algorithm handles competing priorities rather than one dominant signal. Lower Lonsdale resolves the tension best.

---

## 6. Megan — Toronto (Leslieville) transplant, with partner, no car habit, walkable/indie/food/grit, mid-high budget

✅ **Mount Pleasant** — the Main Street Leslieville analog: indie shops, breweries, walkable, creative, lived-in-but-trendy.
✅ **Commercial Drive** — diverse, indie, food-forward, a bit of grit and real community; the other strong Leslieville match.
🟡 **Strathcona** — heritage, artists, walkable, edgier grit — close if she wants it rawer.
🚫 **Yaletown** — the glass-tower district she explicitly came here *not* to live in.
🚫 **Kerrisdale, Dunbar** — quiet, suburban, car-oriented.
🚫 **Cloverdale, Fort Langley, White Rock, Deep Cove** — car-dependent, no street life.

**Local's caveat:** this is the place-memory / "find me my old neighbourhood's twin" case — the recommendation rests on matching the *feel* of Leslieville, which is precisely the semantic layer's job to capture.

---

## 7. Ananya — Indian, grad student at UBC, cost-conscious (would share), no car, transit, social, safe

✅ **Kitsilano** — closest lively option to UBC, frequent buses, student social scene, beach; works on a budget via sharing.
✅ **Marpole** — cheaper West Side, 98 B-Line + buses, reasonable UBC access; less student-y but kinder on the wallet.
🟡 **Dunbar** — right beside UBC and Pacific Spirit (easiest campus access), but quiet/residential and pricey for a 23-year-old.
🟡 **Kerrisdale** — safe, bus access, near-ish; quiet.
🚫 **Commercial Drive, Strathcona, Chinatown, Surrey City Centre, Maillardville, North Shore, Deep Cove, Fort Langley, White Rock, Sapperton, Steveston** — all a 60–90 min trek to UBC; wrong regardless of vibe.

**Local's caveat:** ⚠️ campus location *is* the decision. The ideal — **West Point Grey** (walk to UBC) — is a *coverage gap*. Expect the matcher to fail this one until a commute anchor exists.

---

## 8. Tom — UK consulting secondee, downtown office, with partner, walk-to-work, urban, cost-no-object, 18 months

✅ **Yaletown** — walk to the downtown core, upscale, turnkey, lively; ideal for a well-funded short stay.
✅ **West End** — walkable downtown, Davie/Robson energy, English Bay and Stanley Park; the other genuine walk-to-work urban pick.
🟡 **Mount Pleasant** — hip and close, but not truly walk-to-downtown.
🚫 **Metrotown** — *the trap*: highly walkable, but in Burnaby — walkable ≠ walkable-to-his-office.
🚫 **Surrey, Cloverdale, Fort Langley, White Rock, Steveston, Deep Cove, Maillardville, Rocky Point, Sapperton** — suburban/remote; absurd for a downtown walk-to-work secondee.

**Local's caveat:** ⚠️ the signal is walkability *to a downtown office*, not walkability in general — so Metrotown is the false positive to watch for when the matcher ignores `workLocation`.

---

## 9. "Sam" — minimal input, overwhelmed, gives little signal

✅ **Mount Pleasant / Kitsilano / Commercial Drive** — central, transit-connected, broadly liveable, "something for most people" defaults. A local with little to go on would offer one of these *and say plainly it's a starting point*.
🚫 **Deep Cove, Fort Langley, White Rock, Steveston** — remote/extreme picks no one should be steered toward on zero signal.
🚫 **Yaletown, Surrey City Centre** — too specific/committing for someone who told us almost nothing.

**Local's caveat:** the "right answer" here isn't a neighbourhood — it's *behaviour*: a sensible central default **plus honest low confidence**. A confidently specific pick is the failure mode (and the fake 88–100% score makes that worse).

---

## What this oracle enables

Once you approve these calls, the test loop is:
1. **Derive** each persona's quiz answers from first principles (next step).
2. **Run** them through the matcher.
3. **Compare** the algorithm's top results to the ✅/🚫 lists above.
4. **Tune** where they diverge — especially the commute-anchored cases (Arjun, Joanna, Ananya, Tom),
   which we already expect to fail and which make the case for a commute feature.

Patterns worth watching for in advance: the **budget cliff** (does a tight budget collapse everyone to
Surrey/Cloverdale?), **"nice-by-default" bias** (do expensive all-rounders win regardless of fit?), and
the **commute blind spot** (does walkable-Metrotown beat walkable-downtown for Tom?).
