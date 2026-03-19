'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from '@/context/SessionContext'
import { QuizLayout } from '@/components/quiz/QuizLayout'
import { QuizQuestion } from '@/components/quiz/QuizQuestion'
import { SingleSelectOptions } from '@/components/quiz/SingleSelectOptions'
import { MultiSelectOptions } from '@/components/quiz/MultiSelectOptions'
import { TextInput } from '@/components/ui/TextInput'
import { TextArea } from '@/components/ui/TextArea'
import { en } from '@/locales/en'
import type { Household, Transport, Bedrooms } from '@/types'

// ─── Routing config ───────────────────────────────────────────────────────────
// 11 steps: Phase 1 = 1–5 (incl. transport) | Phase 2 = 6–10 | Phase 3 = 11
// Phase intro cards live at /quiz/phase/2 and /quiz/phase/3 (own pages).

// ─── Why we ask — pinned above Continue in QuizLayout ─────────────────────────

function getWhyWeAsk(step: number): string | undefined {
  const map: Partial<Record<number, string>> = {
    1:  en.quiz.q1.whyWeAsk,
    2:  en.quiz.q2.whyWeAsk,
    3:  en.quiz.q3.whyWeAsk,
    4:  en.quiz.q4.whyWeAsk,
    5:  en.quiz.q5.whyWeAsk,
    6:  en.quiz.q6.whyWeAsk,
    7:  en.quiz.q7.whyWeAsk,
    8:  en.quiz.q8.whyWeAsk,
    10: en.quiz.q10.whyWeAsk,
  }
  return map[step]
}

const STEP_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

function getPrev(step: number): string {
  if (step === 6)  return '/quiz/phase/2'   // back from first Phase 2 question
  if (step === 11) return '/quiz/phase/3'   // back from Phase 3 question
  const idx = STEP_ORDER.indexOf(step)
  if (idx <= 0) return '/'
  return `/quiz/${STEP_ORDER[idx - 1]}`
}

function getNext(step: number): string {
  if (step === 5)  return '/quiz/phase/2'   // after last Phase 1 question (transport), show intro
  if (step === 10) return '/quiz/phase/3'   // after last Phase 2 question, show intro
  const idx = STEP_ORDER.indexOf(step)
  if (idx < 0 || idx === STEP_ORDER.length - 1) return '/loading'
  return `/quiz/${STEP_ORDER[idx + 1]}`
}

// ─── Multi-select dominant-mode derivation ────────────────────────────────────

function dominantHousehold(values: string[]): Household | null {
  if (values.includes('me-and-children')) return 'me-and-children'
  if (values.includes('me-and-partner'))  return 'me-and-partner'
  if (values.includes('me-and-pet'))      return 'me-and-pet'
  if (values.includes('just-me'))         return 'just-me'
  if (values.includes('other'))           return 'other'
  return null
}

function dominantTransport(values: string[]): Transport | null {
  if (values.includes('walking')) return 'walking'
  if (values.includes('transit')) return 'transit'
  if (values.includes('cycling')) return 'cycling'
  if (values.includes('car'))     return 'car'
  if (values.includes('other'))   return 'other'
  return null
}

// ─── Options ──────────────────────────────────────────────────────────────────

function toOptions(obj: Record<string, string>) {
  return Object.entries(obj).map(([value, label]) => ({ value, label }))
}

const Q1_OPTS  = toOptions(en.quiz.q1.options  as Record<string, string>)
const Q2_OPTS  = toOptions(en.quiz.q2.options  as Record<string, string>)
const Q3_OPTS  = toOptions(en.quiz.q3.options  as Record<string, string>)
const Q3B_OPTS = toOptions(en.quiz.q3b.options as Record<string, string>)
const Q4_OPTS  = toOptions(en.quiz.q4.options  as Record<string, string>)
const Q5_OPTS  = toOptions(en.quiz.q5.options  as Record<string, string>)
const Q6_OPTS  = toOptions(en.quiz.q6.options  as Record<string, string>)
const Q7_OPTS  = toOptions(en.quiz.q7.options  as Record<string, string>)
const Q8_OPTS  = toOptions(en.quiz.q8.options  as Record<string, string>)
const Q9_OPTS  = toOptions(en.quiz.q9.options  as Record<string, string>)
const Q10_OPTS = toOptions(en.quiz.q10.options as Record<string, string>)

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuizStepPage() {
  const params    = useParams()
  const router    = useRouter()
  const { state, setAnswer, runMatching } = useSession()

  const step = Number(params.step)

  const [householdMulti, setHouseholdMulti] = useState<string[]>(() =>
    state.household ? [state.household] : []
  )
  const [transportMulti, setTransportMulti] = useState<string[]>(() =>
    state.transport ? [state.transport] : []
  )

  useEffect(() => {
    if (!STEP_ORDER.includes(step)) {
      router.replace('/quiz/1')
    }
  }, [step, router])

  if (!STEP_ORDER.includes(step)) return null

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleHouseholdChange(values: string[]) {
    setHouseholdMulti(values)
    setAnswer('household', dominantHousehold(values))
  }

  function handleTransportChange(values: string[]) {
    setTransportMulti(values)
    setAnswer('transport', dominantTransport(values))
  }

  async function handleContinue() {
    if (step === 11) {
      await runMatching()
      router.push('/loading')
    } else {
      router.push(getNext(step))
    }
  }

  // ─── Continue disabled ─────────────────────────────────────────────────────

  function isDisabled(): boolean {
    switch (step) {
      case 1:  return !state.reasonForMoving
      case 2:  return !state.timeline
      case 3:  return householdMulti.length === 0
      case 4:  return !state.budget || state.bedrooms === null   // combined step
      case 5:  return transportMulti.length === 0
      case 6:  return !state.freeDay
      case 7:  return !state.neighbourhoodEnergy
      case 8:  return !state.outdoorsAccess
      case 9:  return !state.culturalCommunity
      case 10: return !state.comfortPriority
      case 11: return false
      default: return false
    }
  }

  // ─── Screen content ────────────────────────────────────────────────────────

  function renderContent() {
    switch (step) {

      // ── Step 1: Why are you moving? ──────────────────────────────────────
      case 1:
        return (
          <QuizQuestion headline={en.quiz.q1.question}>
            <SingleSelectOptions
              options={Q1_OPTS}
              value={state.reasonForMoving}
              onChange={(v) => setAnswer('reasonForMoving', v)}
              escapeFreeText={state.reasonForMovingOther}
              onEscapeChange={(t) => setAnswer('reasonForMovingOther', t)}
            />
            {state.reasonForMoving === 'work' && (
              <div className="mt-4">
                <TextInput
                  label="Where will you be working? (area or neighbourhood)"
                  value={state.workLocation ?? ''}
                  onChange={(v) => setAnswer('workLocation', v || null)}
                  placeholder="e.g. Downtown, Yaletown, Burnaby..."
                />
              </div>
            )}
            {state.reasonForMoving === 'school' && (
              <div className="mt-4">
                <TextInput
                  label="Which school or campus?"
                  value={state.schoolLocation ?? ''}
                  onChange={(v) => setAnswer('schoolLocation', v || null)}
                  placeholder="e.g. UBC, SFU Burnaby, BCIT, Emily Carr..."
                />
              </div>
            )}
          </QuizQuestion>
        )

      // ── Step 2: Timeline ─────────────────────────────────────────────────
      case 2:
        return (
          <QuizQuestion headline={en.quiz.q2.question}>
            <SingleSelectOptions
              options={Q2_OPTS}
              value={state.timeline}
              onChange={(v) => setAnswer('timeline', v)}
              escapeFreeText={state.timelineOther}
              onEscapeChange={(t) => setAnswer('timelineOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 3: Household ────────────────────────────────────────────────
      case 3:
        return (
          <QuizQuestion
            headline={en.quiz.q3.question}
            subCopy={en.quiz.q3.subQuestion}
          >
            <MultiSelectOptions
              options={Q3_OPTS}
              value={householdMulti}
              onChange={handleHouseholdChange}
              showEscape={false}
            />
          </QuizQuestion>
        )

      // ── Step 4: Budget + Bedrooms (combined, budget first) ───────────────
      case 4:
        return (
          <div className="flex flex-col gap-8">
            <QuizQuestion headline={en.quiz.q4.question}>
              <SingleSelectOptions
                options={Q4_OPTS}
                value={state.budget}
                onChange={(v) => setAnswer('budget', v)}
                escapeFreeText={state.budgetOther}
                onEscapeChange={(t) => setAnswer('budgetOther', t)}
              />
            </QuizQuestion>

            <QuizQuestion headline={en.quiz.q3b.question}>
              <SingleSelectOptions
                options={Q3B_OPTS}
                value={state.bedrooms !== null ? String(state.bedrooms) : null}
                onChange={(v) => setAnswer('bedrooms', Number(v) as Bedrooms)}
                showEscape={false}
              />
            </QuizQuestion>
          </div>
        )

      // ── Step 5: Transport ────────────────────────────────────────────────
      case 5:
        return (
          <QuizQuestion
            headline={en.quiz.q5.question}
            subCopy={en.quiz.q5.subQuestion}
          >
            <MultiSelectOptions
              options={Q5_OPTS}
              value={transportMulti}
              onChange={handleTransportChange}
              escapeFreeText={state.transportOther}
              onEscapeChange={(t) => setAnswer('transportOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 6: Free day ─────────────────────────────────────────────────
      case 6:
        return (
          <QuizQuestion
            headline={en.quiz.q6.question}
            subCopy={en.quiz.q6.subCopy}
          >
            <SingleSelectOptions
              options={Q6_OPTS}
              value={state.freeDay}
              onChange={(v) => setAnswer('freeDay', v)}
              escapeFreeText={state.freeDayOther}
              onEscapeChange={(t) => setAnswer('freeDayOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 7: Neighbourhood energy ─────────────────────────────────────
      case 7:
        return (
          <QuizQuestion headline={en.quiz.q7.question}>
            <SingleSelectOptions
              options={Q7_OPTS}
              value={state.neighbourhoodEnergy}
              onChange={(v) => setAnswer('neighbourhoodEnergy', v)}
              escapeFreeText={state.neighbourhoodEnergyOther}
              onEscapeChange={(t) => setAnswer('neighbourhoodEnergyOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 8: Outdoors access ──────────────────────────────────────────
      case 8:
        return (
          <QuizQuestion headline={en.quiz.q8.question}>
            <SingleSelectOptions
              options={Q8_OPTS}
              value={state.outdoorsAccess}
              onChange={(v) => setAnswer('outdoorsAccess', v)}
              escapeFreeText={state.outdoorsAccessOther}
              onEscapeChange={(t) => setAnswer('outdoorsAccessOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 9: Cultural community ────────────────────────────────────────
      case 9:
        return (
          <QuizQuestion headline={en.quiz.q9.question}>
            <SingleSelectOptions
              options={Q9_OPTS}
              value={state.culturalCommunity}
              onChange={(v) => setAnswer('culturalCommunity', v)}
              showEscape={false}
            />
            {(state.culturalCommunity === 'yes' || state.culturalCommunity === 'somewhat') && (
              <div className="mt-4">
                <label className="font-body text-sm font-semibold text-neutral-700 block mb-2">
                  {en.quiz.q9.conditionalLabel}
                </label>
                <TextArea
                  value={state.culturalCommunityText ?? ''}
                  onChange={(v) => setAnswer('culturalCommunityText', v)}
                  placeholder={en.quiz.q9.conditionalPlaceholder}
                />
              </div>
            )}
          </QuizQuestion>
        )

      // ── Step 10: Comfort priority ────────────────────────────────────────
      case 10:
        return (
          <QuizQuestion headline={en.quiz.q10.question}>
            <SingleSelectOptions
              options={Q10_OPTS}
              value={state.comfortPriority}
              onChange={(v) => setAnswer('comfortPriority', v)}
              escapeFreeText={state.comfortPriorityOther}
              onEscapeChange={(t) => setAnswer('comfortPriorityOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 11: Loved neighbourhood (Phase 3) ───────────────────────────
      case 11:
        return (
          <QuizQuestion headline="Tell us about a neighbourhood that’s felt like home. Anywhere in the world — any point in your life.">
            <div className="space-y-4">
              <TextInput
                label="Neighbourhood"
                value={state.favouriteNeighbourhood ?? ''}
                onChange={(v) => setAnswer('favouriteNeighbourhood', v || null)}
                placeholder="e.g. Hackney, Williamsburg, Le Plateau..."
              />
              <TextInput
                label="City"
                value={state.favouriteCity ?? ''}
                onChange={(v) => setAnswer('favouriteCity', v || null)}
                placeholder="e.g. London, New York, Montreal..."
              />
              <TextInput
                label="Country (optional)"
                value={state.favouriteCountry ?? ''}
                onChange={(v) => setAnswer('favouriteCountry', v || null)}
                placeholder="e.g. UK, USA, Canada..."
              />
              <div>
                <label className="font-body text-sm font-semibold text-neutral-700 block mb-2">
                  What makes it feel right?
                </label>
                <TextArea
                  value={state.favouriteDescription ?? ''}
                  onChange={(v) => setAnswer('favouriteDescription', v || null)}
                  placeholder="The streets, the energy, the people, the pace..."
                />
              </div>
            </div>
          </QuizQuestion>
        )

      default:
        return null
    }
  }

  return (
    <QuizLayout
      step={step}
      pip={step}
      continueDisabled={isDisabled()}
      onContinue={handleContinue}
      onBack={() => router.push(getPrev(step))}
      whyWeAsk={getWhyWeAsk(step)}
    >
      {renderContent()}
    </QuizLayout>
  )
}
