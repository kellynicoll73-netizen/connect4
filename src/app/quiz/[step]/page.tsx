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

const STEP_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const STEP_PIP: Record<number, number> = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
  6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11,
  12: 12, 13: 13,
  14: 14, 15: 15,
}

function getPrev(step: number): string {
  const idx = STEP_ORDER.indexOf(step)
  if (idx <= 0) return '/'
  return `/quiz/${STEP_ORDER[idx - 1]}`
}

function getNext(step: number): string {
  const idx = STEP_ORDER.indexOf(step)
  if (idx < 0 || idx === STEP_ORDER.length - 1) return '/loading'
  return `/quiz/${STEP_ORDER[idx + 1]}`
}

// ─── Multi-select dominant-mode derivation ────────────────────────────────────

function dominantHousehold(values: string[]): Household | null {
  if (values.includes('me-and-children')) return 'me-and-children'
  if (values.includes('me-and-partner')) return 'me-and-partner'
  if (values.includes('me-and-pet')) return 'me-and-pet'
  if (values.includes('just-me')) return 'just-me'
  if (values.includes('other')) return 'other'
  return null
}

function dominantTransport(values: string[]): Transport | null {
  if (values.includes('walking')) return 'walking'
  if (values.includes('transit')) return 'transit'
  if (values.includes('cycling')) return 'cycling'
  if (values.includes('car')) return 'car'
  if (values.includes('other')) return 'other'
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

// ─── Phase intro card ─────────────────────────────────────────────────────────

function PhaseIntroCard({ text }: { text: string }) {
  return (
    <div className="border-l-4 border-primary-500 bg-primary-50 px-4 py-3 mb-6 rounded-sm">
      <p className="font-body text-sm text-neutral-700">{text}</p>
    </div>
  )
}

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

  const pip = STEP_PIP[step] ?? 1

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleHouseholdChange(values: string[]) {
    setHouseholdMulti(values)
    setAnswer('household', dominantHousehold(values))
  }

  function handleTransportChange(values: string[]) {
    setTransportMulti(values)
    setAnswer('transport', dominantTransport(values))
  }

  function handleContinue() {
    if (step === 15) {
      runMatching()
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
      case 4:  return !state.bedrooms
      case 5:  return !state.budget
      case 6:  return transportMulti.length === 0
      case 7:  return !state.freeDay
      case 8:  return !state.neighbourhoodEnergy
      case 9:  return !state.outdoorsAccess
      case 10: return !state.culturalCommunity
      case 11: return !state.comfortPriority
      case 12: return !state.currentCity?.trim()
      case 13: return !state.currentDescription?.trim()
      case 14:
      case 15: return false
      default: return false
    }
  }

  // ─── Screen content ────────────────────────────────────────────────────────

  function renderContent() {
    switch (step) {

      // ── Step 1: Why are you moving? ──────────────────────────────────────
      case 1:
        return (
          <QuizQuestion
            headline={en.quiz.q1.question}
            whyWeAsk={en.quiz.q1.whyWeAsk}
          >
            <SingleSelectOptions
              options={Q1_OPTS}
              value={state.reasonForMoving}
              onChange={(v) => setAnswer('reasonForMoving', v)}
              escapeFreeText={state.reasonForMovingOther}
              onEscapeChange={(t) => setAnswer('reasonForMovingOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 2: Timeline ─────────────────────────────────────────────────
      case 2:
        return (
          <QuizQuestion
            headline={en.quiz.q2.question}
            whyWeAsk={en.quiz.q2.whyWeAsk}
          >
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
            whyWeAsk={en.quiz.q3.whyWeAsk}
          >
            <MultiSelectOptions
              options={Q3_OPTS}
              value={householdMulti}
              onChange={handleHouseholdChange}
              showEscape={false}
            />
          </QuizQuestion>
        )

      // ── Step 4: Bedrooms ─────────────────────────────────────────────────
      case 4:
        return (
          <QuizQuestion headline={en.quiz.q3b.question}>
            <SingleSelectOptions
              options={Q3B_OPTS}
              value={state.bedrooms !== null ? String(state.bedrooms) : null}
              onChange={(v) => setAnswer('bedrooms', Number(v) as Bedrooms)}
              showEscape={false}
            />
          </QuizQuestion>
        )

      // ── Step 5: Budget ───────────────────────────────────────────────────
      case 5:
        return (
          <QuizQuestion
            headline={en.quiz.q4.question}
            whyWeAsk={en.quiz.q4.whyWeAsk}
          >
            <SingleSelectOptions
              options={Q4_OPTS}
              value={state.budget}
              onChange={(v) => setAnswer('budget', v)}
              escapeFreeText={state.budgetOther}
              onEscapeChange={(t) => setAnswer('budgetOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 6: Transport ────────────────────────────────────────────────
      case 6:
        return (
          <>
            <PhaseIntroCard text={en.quiz.q5.phase2Card} />
            <QuizQuestion
              headline={en.quiz.q5.question}
              subCopy={en.quiz.q5.subQuestion}
              whyWeAsk={en.quiz.q5.whyWeAsk}
            >
              <MultiSelectOptions
                options={Q5_OPTS}
                value={transportMulti}
                onChange={handleTransportChange}
                escapeFreeText={state.transportOther}
                onEscapeChange={(t) => setAnswer('transportOther', t)}
              />
            </QuizQuestion>
          </>
        )

      // ── Step 7: Free day ─────────────────────────────────────────────────
      case 7:
        return (
          <QuizQuestion
            headline={en.quiz.q6.question}
            subCopy={en.quiz.q6.subCopy}
            whyWeAsk={en.quiz.q6.whyWeAsk}
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

      // ── Step 8: Neighbourhood energy ─────────────────────────────────────
      case 8:
        return (
          <QuizQuestion
            headline={en.quiz.q7.question}
            whyWeAsk={en.quiz.q7.whyWeAsk}
          >
            <SingleSelectOptions
              options={Q7_OPTS}
              value={state.neighbourhoodEnergy}
              onChange={(v) => setAnswer('neighbourhoodEnergy', v)}
              escapeFreeText={state.neighbourhoodEnergyOther}
              onEscapeChange={(t) => setAnswer('neighbourhoodEnergyOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 9: Outdoors access ──────────────────────────────────────────
      case 9:
        return (
          <QuizQuestion
            headline={en.quiz.q8.question}
            whyWeAsk={en.quiz.q8.whyWeAsk}
          >
            <SingleSelectOptions
              options={Q8_OPTS}
              value={state.outdoorsAccess}
              onChange={(v) => setAnswer('outdoorsAccess', v)}
              escapeFreeText={state.outdoorsAccessOther}
              onEscapeChange={(t) => setAnswer('outdoorsAccessOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 10: Cultural community ──────────────────────────────────────
      case 10:
        return (
          <QuizQuestion headline={en.quiz.q9.question}>
            <SingleSelectOptions
              options={Q9_OPTS}
              value={state.culturalCommunity}
              onChange={(v) => setAnswer('culturalCommunity', v)}
              showEscape={false}
            />
            {state.culturalCommunity === 'yes' && (
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

      // ── Step 11: Comfort priority ────────────────────────────────────────
      case 11:
        return (
          <QuizQuestion
            headline={en.quiz.q10.question}
            whyWeAsk={en.quiz.q10.whyWeAsk}
          >
            <SingleSelectOptions
              options={Q10_OPTS}
              value={state.comfortPriority}
              onChange={(v) => setAnswer('comfortPriority', v)}
              escapeFreeText={state.comfortPriorityOther}
              onEscapeChange={(t) => setAnswer('comfortPriorityOther', t)}
            />
          </QuizQuestion>
        )

      // ── Step 12: Current location ────────────────────────────────────────
      case 12:
        return (
          <>
            <PhaseIntroCard text={en.quiz.q11.phase3Card} />
            <QuizQuestion
              headline={en.quiz.q11.question}
              subCopy={en.quiz.q11.subCopy}
            >
              <div className="space-y-4">
                <TextInput
                  label={en.quiz.q11.cityLabel}
                  value={state.currentCity ?? ''}
                  onChange={(v) => setAnswer('currentCity', v || null)}
                  placeholder={en.quiz.q11.cityPlaceholder}
                />
                <TextInput
                  label={en.quiz.q11.neighbourhoodLabel}
                  value={state.currentNeighbourhood ?? ''}
                  onChange={(v) => setAnswer('currentNeighbourhood', v || null)}
                  placeholder={en.quiz.q11.neighbourhoodPlaceholder}
                  optional={en.quiz.q11.neighbourhoodOptional}
                />
              </div>
            </QuizQuestion>
          </>
        )

      // ── Step 13: Describe current neighbourhood ──────────────────────────
      case 13: {
        const headline = state.currentNeighbourhood
          ? en.quiz.q12.headlineWithNeighbourhood.replace('{neighbourhood}', state.currentNeighbourhood)
          : en.quiz.q12.headlineWithCity.replace('{city}', state.currentCity ?? 'where you are')
        return (
          <QuizQuestion headline={headline} subCopy={en.quiz.q12.subCopy}>
            <TextArea
              value={state.currentDescription ?? ''}
              onChange={(v) => setAnswer('currentDescription', v || null)}
              placeholder={en.quiz.q12.placeholder}
            />
          </QuizQuestion>
        )
      }

      // ── Step 14: Favourite place ─────────────────────────────────────────
      case 14:
        return (
          <>
            <PhaseIntroCard text={en.quiz.q13.phase4Card} />
            <QuizQuestion headline={en.quiz.q13.question}>
              <div className="space-y-4">
                <TextInput
                  label={en.quiz.q13.cityLabel}
                  value={state.favouriteCity ?? ''}
                  onChange={(v) => setAnswer('favouriteCity', v || null)}
                  placeholder={en.quiz.q13.cityPlaceholder}
                  optional={en.quiz.q13.cityOptional}
                />
                <TextInput
                  label={en.quiz.q13.neighbourhoodLabel}
                  value={state.favouriteNeighbourhood ?? ''}
                  onChange={(v) => setAnswer('favouriteNeighbourhood', v || null)}
                  placeholder={en.quiz.q13.neighbourhoodPlaceholder}
                  optional={en.quiz.q13.neighbourhoodOptional}
                />
              </div>
              <p className="font-body text-xs text-neutral-400 mt-3">
                {en.quiz.q13.skipNote}
              </p>
            </QuizQuestion>
          </>
        )

      // ── Step 15: Describe favourite ──────────────────────────────────────
      case 15:
        return (
          <QuizQuestion headline={en.quiz.q14.question}>
            <TextArea
              value={state.favouriteDescription ?? ''}
              onChange={(v) => setAnswer('favouriteDescription', v || null)}
              placeholder={en.quiz.q14.placeholder}
            />
          </QuizQuestion>
        )

      default:
        return null
    }
  }

  return (
    <QuizLayout
      step={step}
      pip={pip}
      continueDisabled={isDisabled()}
      onContinue={handleContinue}
      onBack={() => router.push(getPrev(step))}
    >
      {renderContent()}
    </QuizLayout>
  )
}
