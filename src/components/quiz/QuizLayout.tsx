'use client'

import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'
import { ContinueButton } from './ContinueButton'
import { WhyWeAskToggle } from './WhyWeAskToggle'
import { AptLogoHorizontal } from '@/components/ui/AptLogoHorizontal'
import { en } from '@/locales/en'
import { CoffeeCupIconSmall, NewCompassIconSmall, StarIconSmall } from '@/components/icons/PhaseIcons'

// ─── Layout ───────────────────────────────────────────────────────────────────

interface QuizLayoutProps {
  step:             number
  pip:              number
  continueDisabled: boolean
  onContinue:       () => void
  onBack:           () => void
  children:         ReactNode
  whyWeAsk?:        string
}

export function QuizLayout({
  step, pip, continueDisabled, onContinue, onBack, children, whyWeAsk,
}: QuizLayoutProps) {
  // Transport now in Phase 1: Phase 1 = 1–5, Phase 2 = 6–10, Phase 3 = 11
  const currentPhase: 1 | 2 | 3 = pip <= 5 ? 1 : pip <= 10 ? 2 : 3
  const phaseLabel = { 1: en.quiz.shared.phase1Label, 2: en.quiz.shared.phase2Label, 3: en.quiz.shared.phase3Label }[currentPhase]
  const PhaseIcon = { 1: CoffeeCupIconSmall, 2: NewCompassIconSmall, 3: StarIconSmall }[currentPhase]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar: flex row — back button in flow, logo clears it naturally at all viewport widths */}
      <div className="w-full pt-5 pb-3">
        <div className="max-w-lg md:max-w-xl w-full mx-auto px-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={en.quiz.shared.backAriaLabel}
            className="shrink-0 w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-500 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7L9 12" stroke="#FAF7F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <AptLogoHorizontal scheme="light" size="sm" />
        </div>
      </div>

      {/* Progress pips, left-aligned with content */}
      <div className="px-5 pb-3 max-w-lg md:max-w-xl w-full mx-auto">
        <ProgressBar currentStep={pip} />
      </div>

      {/* Phase pill — full width of window, terracotta, icon + text aligned with content column */}
      <div className="w-full bg-primary-400 py-1.5 mb-3">
        <div className="max-w-lg md:max-w-xl w-full mx-auto px-5 flex items-center gap-2">
          <PhaseIcon className="text-apt-cream h-4 w-4 shrink-0" />
          <span
            className="text-xs uppercase tracking-widest text-apt-cream"
            style={{ fontWeight: 800 }}
          >
            Phase {currentPhase}/3 — {phaseLabel}
          </span>
        </div>
      </div>

      {/* Content + Why we ask + Continue button */}
      <div className="px-5 pt-4 pb-8 max-w-lg md:max-w-xl w-full mx-auto">
        <div className="mb-6">
          {children}
        </div>
        {whyWeAsk && (
          <div className="mb-4">
            <WhyWeAskToggle copy={whyWeAsk} />
          </div>
        )}
        <ContinueButton
          step={step}
          disabled={continueDisabled}
          onClick={onContinue}
        />
      </div>
    </div>
  )
}
