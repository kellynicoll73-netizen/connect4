'use client'

import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'
import { PhaseLabel } from './PhaseLabel'
import { ContinueButton } from './ContinueButton'
import { SidePanelLayout } from '@/components/layout/SidePanelLayout'
import { en } from '@/locales/en'

interface QuizLayoutProps {
  step:              number
  pip:               number    // which pip to show active (may differ from step for multi-Q screens)
  continueDisabled:  boolean
  onContinue:        () => void
  onBack:            () => void
  children:          ReactNode
}

const PHASE_CONTEXT: Record<number, { headline: string; body: string }> = {
  1:  { headline: "Why you're here matters", body: "Your reason for moving shapes what a neighbourhood needs to offer. Someone arriving for work needs different things than someone choosing Vancouver for the lifestyle." },
  2:  { headline: "Practicalities first", body: "Timeline, household, bedrooms, and budget are the hard constraints. We use these to filter out neighbourhoods that simply won't work before we get to fit." },
  4:  { headline: "Practicalities first", body: "Vancouver has significant rent variation by neighbourhood. Budget helps us filter out places where the median rent would stretch you past your comfort zone." },
  6:  { headline: "How you move shapes where you live", body: "Transport mode fundamentally changes which neighbourhoods work. SkyTrain proximity is critical for transit users. Walkers need density. Car owners have more flexibility." },
  7:  { headline: "Your lifestyle, not your commute", body: "How you spend a free day tells us more about neighbourhood fit than where you work. The texture of daily life is the thing that's hardest to change once you're settled." },
  8:  { headline: "The energy you come home to", body: "This is one of our highest-signal questions. The energy of a neighbourhood is the thing that's hardest to change and easiest to get wrong. We weight your answer heavily." },
  10: { headline: "What comfort actually means", body: "For some it's personal safety, for others it's knowing your neighbours, for others it's feeling seen. Your answer adjusts how we weight safety, quietness, and cultural diversity." },
  11: { headline: "Where you're from tells us a lot", body: "The neighbourhood you know shapes what feels normal and what feels like home. We use this to find analogues — Vancouver places with a similar texture to where you've lived." },
  12: { headline: "Describe it honestly", body: "Don't hold back. The detail is what helps us find a match. Texture, feel, energy — these matter more than amenity lists." },
  13: { headline: "A place that just felt right", body: "Your favourite neighbourhood anywhere in the world is a strong signal. We're looking for what it has that other places don't — and finding that in Vancouver." },
  14: { headline: "What makes it yours", body: "Energy, texture, the kind of people. The thing that's hard to put into words is exactly what we're trying to find." },
}

function QuizSidePanel({ pip }: { pip: number }) {
  const ctx = PHASE_CONTEXT[pip] ?? PHASE_CONTEXT[1]
  return (
    <div className="flex flex-col justify-between h-full px-10 py-12">
      <div>
        <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-8">
          Why we ask
        </p>
        <h2 className="font-display text-2xl font-bold text-white leading-snug mb-4">
          {ctx.headline}
        </h2>
        <p className="font-body text-sm text-neutral-300 leading-relaxed">
          {ctx.body}
        </p>
      </div>

      <div className="border-t border-neutral-700 pt-8">
        <div className="flex gap-1 flex-wrap">
          {[1,2,3,4].map((phase) => {
            const active =
              (phase === 1 && pip <= 5) ||
              (phase === 2 && pip >= 6 && pip <= 10) ||
              (phase === 3 && pip >= 11 && pip <= 12) ||
              (phase === 4 && pip >= 13)
            return (
              <span
                key={phase}
                className={[
                  'font-body text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm',
                  active ? 'bg-primary-500 text-white' : 'bg-neutral-700 text-neutral-400',
                ].join(' ')}
              >
                Phase {phase}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function QuizMain({
  step, pip, continueDisabled, onContinue, onBack, children,
}: QuizLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-body text-neutral-500 hover:text-neutral-800 transition-colors"
            aria-label={en.quiz.shared.backAriaLabel}
          >
            {en.quiz.shared.back}
          </button>
        </div>
        <ProgressBar currentStep={pip} />
        <PhaseLabel step={pip} />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 max-w-lg w-full mx-auto">
        {children}
      </div>

      {/* Continue button */}
      <div className="px-5 pb-8 max-w-lg w-full mx-auto">
        <ContinueButton
          step={step}
          disabled={continueDisabled}
          onClick={onContinue}
        />
      </div>
    </div>
  )
}

export function QuizLayout(props: QuizLayoutProps) {
  return (
    <SidePanelLayout
      main={<QuizMain {...props} />}
      side={<QuizSidePanel pip={props.pip} />}
    />
  )
}
