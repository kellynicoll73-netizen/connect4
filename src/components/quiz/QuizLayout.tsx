'use client'

import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'
import { PhasePill } from './PhasePill'
import { ContinueButton } from './ContinueButton'
import { WhyWeAskToggle } from './WhyWeAskToggle'
import { AptLogoHorizontal } from '@/components/ui/AptLogoHorizontal'
import { en } from '@/locales/en'

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

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top bar: back button at far left, logo left-aligned with content column — same row */}
      <div className="relative w-full pt-5 pb-3">
        {/* Logo: content-column left edge — on mobile, pad left to clear the back button */}
        <div className="max-w-lg w-full mx-auto px-5 pl-12 sm:pl-5">
          <AptLogoHorizontal scheme="light" size="sm" />
        </div>
        {/* Back button: vertically centered on the logo row, pinned to left edge */}
        <button
          type="button"
          onClick={onBack}
          aria-label={en.quiz.shared.backAriaLabel}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center hover:bg-primary-500 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7L9 12" stroke="#FAF7F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Progress pips, left-aligned with content */}
      <div className="px-5 pb-3 max-w-lg w-full mx-auto">
        <ProgressBar currentStep={pip} />
      </div>

      {/* Phase pill */}
      <div className="mb-3">
        <PhasePill phase={currentPhase} />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 max-w-lg w-full mx-auto">
        {children}
      </div>

      {/* Why we ask + Continue button */}
      <div className="px-5 pb-8 max-w-lg w-full mx-auto">
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
