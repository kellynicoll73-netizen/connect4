# Apt — Persona Test Suite (Profiles for Review)

**Purpose:** Nine user personas used to test and tune the neighbourhood matching algorithm.
Each is a believable newcomer grounded in real Metro Vancouver demographics. They are the
*ground truth* — the humans. We'll use them to judge whether the algorithm puts the right kind
of place near the top and keeps obviously-wrong ones out.

**Process (order updated June 2026 — expected matches now come before quiz answers):**
1. **Profiles (this doc)** — who they are.
2. **Expected matches** (`docs/Persona_Expected_Matches.md`) — what a knowledgeable local would
   recommend, from first principles, *before* seeing any quiz answers. This is the test oracle.
3. **Answers (next)** — how each persona would answer Apt's quiz, derived from first principles
   (NOT from the matching code), plus notes on friction / missing fields.
4. **Run + compare** — push answers through the matcher, compare to the oracle, tune the divergences.

**Status:** Draft for Kelly's review (June 2026). Demographics grounded in
`docs/Neighbourhood_Coverage_Roadmap.md` research and 2021 census / 2024 IRCC data.

**Spread check** — the nine vary deliberately across: source (Nigeria, India ×2, China,
Philippines, Iran, interprovincial Canada, UK), household (single / couple / family / student),
budget (tight → cost-no-object), transport (transit / walking / cycling / car), network
(enclave-supported vs flying-blind), and location anchor (downtown / suburban hospital / UBC / none).

> **Two cross-cutting flags surfaced while drafting (Sara's lens):**
> - **Commute anchor is missing.** The quiz captures `workLocation` / `schoolLocation`, but the
>   matcher ignores them. Personas anchored on a workplace or campus (Arjun, Joanna, Ananya, Tom)
>   are *expected to be poorly served today* — they're regression markers for a future commute feature.
> - **Data confidence varies.** Some "good match" judgements lean on neighbourhood scores that are
>   editorial guesses (✍) rather than verified data. Flagged per persona.

---

## 1. Dapo Adeyemi — transit-first, community-seeking, flying blind

**Grounding:** Nigeria is a fast-growing source country to BC; arrives *without* a large
established enclave to fall back on — the core "flying blind" case Apt serves best.

**Who he is:** 28, from Lagos, arrived via Express Entry for a junior data-analyst role with a
firm **downtown**. Sharp, digitally confident, but knows almost no one in the city. Used to a
dense, transit-rich metropolis; has no car and no intention of getting one.

**Situation:** First year is about settling affordably and *not feeling like a stranger*. Renting
a 1-bed solo. Budget-conscious. No family or community network to guide him.

**Looking for:** Good food, cultural diversity, some life on the street, an easy transit trip to
a downtown office, a place where he won't feel isolated.

**Would dread:** A quiet, car-dependent, homogeneous suburb where he'd feel invisible and stuck.

**Why he's in the set:** Tests whether *transit + culture + community* signals steer the result,
rather than generically "nice" expensive neighbourhoods winning by default. Also the cleanest
flying-blind case. *(Location anchor: downtown office — currently ignored.)*

---

## 2. Arjun Mehta — Indian skilled-tech worker, the Surrey-or-downtown question

**Grounding:** India is the #1 source to BC (~20% of recent immigrants), heavy in skilled-tech
streams. Has the *option* of an established South Asian community in Surrey — which is exactly the
interesting tension.

**Who he is:** 32, from Bengaluru, Express Entry, software engineer at a **downtown** tech company.
Wife and a toddler relocating with him. Financially comfortable but not wealthy.

**Situation:** Could default to Surrey (extended community, familiar food, cultural comfort, more
space for the money) — but that's a long commute to a downtown office, and part of him wants to
*choose* rather than default. Genuinely torn. Needs 2 bedrooms.

**Looking for:** A balance — enough space and safety for the family, cultural community within
reach, and a commute that doesn't eat his life. Weighing belonging against practicality.

**Would dread:** Either extreme — total isolation from community, *or* a 90-minute each-way
commute that means he never sees his kid awake.

**Why he's in the set:** The enclave-vs-flying-blind tension Priya flagged, made concrete. Also a
*family* profile (space, safety) with a real commute conflict. *(Location anchor: downtown — ignored.)*

---

## 3. Lin Chen — Chinese economic immigrant, family, Richmond-or-elsewhere

**Grounding:** China is the #2 source to BC (~16%). Established communities in Richmond, Burnaby,
West Side — so, like Arjun, she has an enclave option.

**Who she is:** 38, from Shanghai, came through an economic stream with her husband and two
school-age children. Husband works flexibly; she manages the household's settling. Drives.

**Situation:** Schools, safety, and language-accessible services dominate. Richmond is the obvious,
comfortable default (Mandarin services, family networks, familiar food). Weighing whether somewhere
else might suit the kids better. Needs 3 bedrooms. Budget mid-to-high.

**Looking for:** Safe, quiet, good schools, family-friendly, established community, space.

**Would dread:** Somewhere loud, transient, or unsafe-feeling for the kids; being cut off from
in-language services.

**Why she's in the set:** A *family with children* profile that should pull hard toward quiet,
safety, and space — the opposite end from Dapo/Tom. Tests the family/safety scoring branch.

🔬 *Data confidence:* safety + school-adjacent signals lean on ✍ editorial scores.

---

## 4. Joanna Reyes — Filipino healthcare worker, community vs commute

**Grounding:** Philippines is the #3 source to BC (~11%), strongly represented in healthcare.
Established communities (Joyce-Collingwood, Burnaby, Surrey).

**Who she is:** 34, from Cebu, registered nurse recruited to a **hospital in the suburbs** (e.g.,
Surrey Memorial or a Burnaby/Richmond hospital). Single, sends money home, values community deeply.
Works shifts, so commute timing matters more than distance alone.

**Situation:** Torn between living near the **Filipino community** (belonging, support, familiar
food, church) and living near the **hospital** (shorter shift commutes, especially night shifts
when transit is thin). Budget moderate. May or may not have a car.

**Looking for:** Community and belonging, affordability, and a realistic shift commute.

**Would dread:** Isolation from community, *or* an unsafe/unreliable late-night commute.

**Why she's in the set:** A shift-worker whose *commute* and *community* pull in different
directions — another clean illustration of the missing commute anchor, plus the affordability +
community signals. *(Location anchor: suburban hospital — ignored.)*

---

## 5. Nima Hosseini — Iranian professional, single, no local anchor

**Grounding:** Iran is a significant second-tier source, with a large community on the North Shore
and in Coquitlam ("North Van" Persian community). But Nima arrives ahead of his network.

**Who he is:** 31, from Tehran, mechanical engineer, single, arrived for work that's flexible on
location (hybrid). Cultured, outdoorsy, financially comfortable.

**Situation:** Pulled between the North Shore (mountains, trails, the Persian community, calm) and
a more central, urban life (social scene, walkability, nightlife). Hasn't decided who he wants to
be in this city yet. 1-bed, mid-to-high budget.

**Looking for:** Outdoors access *and* some urban culture; would value the Persian community but
won't organise his whole life around it.

**Would dread:** Feeling stranded far from everything, or a soulless commuter-belt condo.

**Why he's in the set:** A genuinely *ambivalent* profile (outdoors vs urban) that should produce a
close, contested ranking — good for testing how the algorithm handles competing priorities rather
than one dominant signal.

🔬 *Data confidence:* outdoors + social scores are ✍ editorial throughout.

---

## 6. Megan Sinclair — interprovincial mover from Toronto, English-fluent, no network

**Grounding:** Ontario is a top *gross* source of movers to Vancouver (even as BC loses net to
Alberta/Ontario). English-fluent, digitally confident — but just as "flying blind" on Vancouver's
geography as any newcomer.

**Who she is:** 34, from Toronto (lived in Leslieville), moving with her partner for her job. No
car habit — used to streetcars and walkable neighbourhoods. No family or friends in Vancouver.

**Situation:** Knows exactly what she liked about her Toronto neighbourhood (walkable, indie shops,
good food, a bit of grit, community feel) and wants to find its Vancouver equivalent — but has no
idea where that is. 1-bed, mid-to-high budget.

**Looking for:** A walkable, characterful neighbourhood that *feels like* what she loved back home —
the "analogous comparison" use case the product is built around.

**Would dread:** A generic glass-tower district with no street life, or a car-dependent suburb.

**Why she's in the set:** The interprovincial case (real, sizable, often overlooked), and the
purest test of the **place-memory / semantic** matching the team cares about — she has a vivid
"home" reference to match against.

---

## 7. Ananya Joshi — international student, off-campus near UBC

**Grounding:** India and China dominate international-student inflows. Off-campus housing is a real
adjacent market.

**Who she is:** 23, from Pune, one-year master's at **UBC**. Cost-conscious (would share to make
budget work), no car, knows no one.

**Situation:** Needs an easy trip to campus, some student social life, and to feel safe and part of
something in a new city. Budget tight even when sharing.

**Looking for:** Affordable, near/easy-to-UBC, social, safe.

**Would dread:** A long daily commute to campus; isolation; anything she can't afford.

**Why she's in the set:** Off-campus student case + the strongest **commute-anchor** test (campus
location dominates her real preference but the matcher ignores it).

🎯 *Priya flag:* students sit **outside** the OST's economic-PR scope. Included as a *deliberate*
adjacent-market expansion, not accidental scope creep.
⚠️ *Expected to be poorly served today* until a commute anchor exists.

---

## 8. Tom Hartley — UK consulting secondee, downtown office

**Grounding:** UK is a steady source; corporate secondees are a small but real, high-budget,
short-stay newcomer type.

**Who he is:** 31, from London, seconded by his consulting firm to the **downtown Vancouver
office** for 18 months. Partner relocating with him. Firm subsidises housing, so cost is secondary.

**Situation:** Wants to *walk to work*, live in the thick of the city, won't buy a car for an
18-month stint, doesn't know Vancouver at all.

**Looking for:** Central, walkable, urban, lively, turnkey — minimal friction for a short stay.

**Would dread:** Anything requiring a commute; suburban quiet; feeling far from the action.

**Why he's in the set:** Exercises the *cost-no-object* budget branch and a strong walkability +
urban-energy signal — and a downtown **commute anchor** that, ignored, risks a false positive like
Metrotown (walkable, but in Burnaby). *(Location anchor: downtown — ignored.)*

🔬 *Data confidence:* walkability scores for the relevant central neighbourhoods are ✓ verified.

---

## 9. "Sam" — the minimal-input / overwhelmed user

**Grounding:** Not a demographic — a *behaviour*. Plenty of real users start the quiz tired,
rushed, or unsure, and answer as little as possible.

**Who they are:** Could be any newcomer. Stressed, short on time, skips optional questions, picks
"not sure" / vague options, leaves free-text blank, may not finish thinking each answer through.

**Situation:** Gives the algorithm very little to work with.

**Looking for:** *Something* reasonable and non-embarrassing, despite minimal input.

**Would dread:** A confidently wrong, oddly specific result that ignores how little they said.

**Why they're in the set:** Sara's **graceful-degradation** test. With almost no signal, does the
algorithm fail safely (a sensible, central, broadly-liveable default + honest low confidence) or
catastrophically (a bizarre, overconfident pick)? Also stress-tests the fake 88–100% score display.

---

## For your review

Please check for:
- **Realism** — do these read like real Vancouver newcomers?
- **Completeness** — is any major newcomer type missing, or any persona thin?
- **Spread** — good variety across budget, household, transport, network, location?
- **Anything to merge, cut, or add.**

Next (now done): the local's recommendations in `docs/Persona_Expected_Matches.md` — the test
oracle, built from first principles before any quiz answers. After that: derive each persona's quiz
answers (ignoring the matching code), with notes on where each would hesitate, want more guidance,
or wish for a field that doesn't exist.
