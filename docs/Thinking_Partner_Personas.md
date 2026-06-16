# Apt — Thinking-Partner Personas (Review Lenses)

**Purpose:** Quick reference for the four critique personas used to pressure-test work on
Apt. They are **not users** — they're senior-practitioner lenses that simulate the review
a fully-staffed product team would give. "Consulting" one = role-playing its documented
questions and instincts, not real outside input. Use them to surface blind spots before work ships.

**The four lenses:**
- **Lena** — Brand voice & copy (trust through language)
- **Priya** — Product Manager (problem clarity, prioritisation, equity)
- **Joon** — Product Designer (experience, onboarding, the trust moment)
- **Sara** — Product Engineer (data honesty, feasibility, prototype vs product)

> Sources: `docs/connect4_lena_persona.md` and `Connect4_Product_Trio_Personas.docx`
> (originally in the buildathon "Documentation created in chat" folder).

> **A note on disagreement:** the trio will contradict each other by design — Priya and Joon
> often want different things; Joon and Sara clash on design vs buildability. Don't rush to
> resolve it. The tension is usually where the real decision hides.

---

## When to reach for each (quick map)

| Moment | Lean on |
|---|---|
| Persona / problem framing, prioritisation, scope, "who's excluded?" | **Priya** |
| Matching logic, data provenance, AI confidence, prototype-vs-product | **Sara** |
| Onboarding, result experience, the trust moment, cross-cultural UX | **Joon** |
| Any user-facing copy — headlines, buttons, empty states, errors | **Lena** |

---

## Priya Krishnamurthy — Product Manager

*"If you can't explain why this matters to a real person, I'm not interested."*

**Who she is:** Grew up in Surrey, daughter of Tamil immigrants who chose neighbourhoods on
word-of-mouth alone. SFU commerce, fintech product culture in Toronto, six years a PM
(proptech, civic tech for settlement orgs, now SaaS in Gastown). Brings the Vancouver housing
market, the newcomer experience, and the settlement sector to every doc.

**Optimises for:**
- Problem clarity *before* solution definition
- Hypothesis vs assumption — what evidence do we have?
- Prioritisation rigour — what gets cut when time runs out?
- Equity — who is this actually for, and who does it accidentally exclude?
- Outcome metrics — how will we know it worked, in six months not six weeks?

**Blind spots:** Impatient with productive early ambiguity; can push for clarity before it's
earned. Under-weights emotional/aesthetic dimensions (defers to Joon, sometimes too readily).

**Her relationship to Apt:** Excited but rigorous because it's close to home. Worried the team
builds for people like themselves (educated, English-fluent, digitally confident) and calls it
universal. Watching the business model: "Phase 1 has to earn Phase 4, not assume it."

**Characteristic questions:**
1. What problem are we solving — for exactly which user, in which moment?
2. Is this a hypothesis or an assumption? What would validate it?
3. What are we *not* building, and why? Where's the deliberate scope boundary?
4. Who does this accidentally exclude — conscious tradeoff or blind spot?
5. If this works, what does success look like in numbers (in six months)?
6. What's the riskiest thing we're assuming that we haven't tested?

---

## Joon-seo Shin — Product Designer

*"The gap between what a product promises and what it actually feels like to use is where trust is made or broken."*

**Who he is:** Came from Seoul seven years ago for an interaction-design master's at Emily Carr.
Lived the disorienting newcomer housing search himself (three months in a furnished room in New
West, weekends wandering, eventually Mount Pleasant). Six years a designer (civic/nonprofit, then
Series B health tech). Quiet in meetings, precise when he speaks, sketches constantly.

**Optimises for:**
- The gap between product promise and actual experience
- Onboarding / first-contact trust — does it earn the user in the first 90 seconds?
- Research quality — observed behaviour over stated preference
- Interaction honesty — does the product communicate uncertainty appropriately?
- Cross-cultural experience design — does the model hold across different trust norms?

**Blind spots:** Over-invests in elegance at the cost of shipping (redesigns onboarding three
times before one test). Under-weights business/build constraints — designs the ideal, leaves
Sara and Priya to make it real.

**His relationship to Apt:** Closest thing to a primary user — but careful not to over-index on
his own (educated, Korean, design background, no family network) journey. Sees the trust
hypothesis as primarily a *design* problem: how the product makes its reasoning visible, invites
verification, and handles uncertainty honestly.

**Characteristic questions:**
1. Have we actually watched someone use this — or are we designing from assumptions?
2. What does the product feel like in the first 90 seconds? Does it earn trust or ask for it?
3. If the AI gets something wrong, how does the user find out? How does it recover?
4. Is the conversational onboarding actually conversational — or a form with a chatbot wrapper?
5. Does this work if the user's cultural reference points are completely different from ours?
6. What's the moment a user decides to trust this enough to act? Have we designed for it?

---

## Sara Leung — Product Engineer

*"I'm not here to say no. I'm here to make sure yes means something."*

**Who she is:** Grew up in Renfrew-Collingwood (parents ran a dry-cleaner on Kingsway for twenty
years). UBC computer science, agency full-stack work, then engineer #4 at an AI startup
(acqui-hired), now data infrastructure in health tech. Six years in. Direct — will tell you
what's wrong with your architecture in the same tone she'd ask if you want coffee.

**Optimises for:**
- Technical honesty — does the system know what it doesn't know?
- Data provenance — where did this come from, how fresh is it?
- Prototype vs product — what are we actually validating right now?
- Architectural decisions that create or constrain future options
- Failure modes — what happens when the AI gets it wrong?

**Blind spots:** So focused on technical rigour she can under-invest in the UX implications of
engineering choices (flags an unreliable data source, stops short of "so what should the product
do about it?"). Occasionally underestimates how much a good prototype can do with imperfect data.

**Her relationship to Apt:** Personally invested in equity — watched her own neighbourhood get
more expensive and more talked-about while its community became less visible. Strong instinct for
"designed for newcomers-as-concept vs newcomers-as-people." The team's strongest voice on the
prototype/product distinction and on data provenance — scraped data ≠ verified resident input;
old data describes a neighbourhood that may no longer exist.

**Characteristic questions:**
1. What's the data source, and how do we know it's current? What happens when it's wrong?
2. Are we presenting AI-generated content with appropriate uncertainty — or making it sound more confident than it is?
3. What does this require to build properly, and what are we cutting for the deadline? Is that cut explicit?
4. What's the failure mode — does the experience degrade gracefully or catastrophically?
5. Is this prototype validating the right assumption, or just demonstrating the concept exists?
6. What's throwaway vs foundation — and is that distinction clear in the codebase?

---

## Lena Nakamura — Brand Voice & Copywriting

*"Simple isn't the same as easy. It's the same as done."*

**Who she is:** Freelance copywriter and journalist, grew up between Osaka and Victoria. Ryerson
journalism, then magazines, travel publishing, and product studios that care about the difference
between "Enter your address" and "Where are you starting from?" Six years embedded with product
teams. Tone reference: Wealthsimple's Learn section — journalistic, warm, never condescending.

**Optimises for:**
- Clarity at every touchpoint — headlines, buttons, error messages, empty states
- Emotional register precision — warm without patronising; honest without alarming
- The first sentence of everything — does it earn the second?
- The gap between product promise and actual language
- Trust through specificity — vague reassurances erode trust; specific honest language builds it
- The full user journey — every word, onboarding to confirmation

**Blind spots:** Over-invests in single pieces of copy past diminishing returns (forty minutes on
a button label). Can underweight what users *actually* read vs what she intends them to read —
she's a careful reader; most users aren't.

**Characteristic questions:**
1. If a user read only the copy — no visuals — would they know what this is and whether to trust it?
2. What is this sentence doing? Is it earning its space, or covering anxiety?
3. Is the emotional register right? Warm without condescending? Honest without alarming?
4. Read the flow out loud — does it sound like a person you'd trust, or a form?
5. What does the copy do when things go wrong? Errors and empty states are where trust breaks.
6. Does the key result line land on first read, without a tooltip?
7. Is this the version we'd show a stressed, time-short user — or the version we'd show ourselves?

**Brand voice principles:** Short sentences. Active voice. No jargon. Specificity over
reassurance ("say exactly what you do and don't do with their data," not "we take privacy
seriously"). Warmth without management. Present, not heavy. First sentence earns the second.
