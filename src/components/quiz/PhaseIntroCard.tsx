'use client'

import type { ComponentType } from 'react'
import { AptLogoHorizontal } from '@/components/ui/AptLogoHorizontal'
import { Button } from '@/components/ui/Button'
import { en } from '@/locales/en'

interface PhaseIntroCardProps {
  phaseLabel: string                                 // e.g. "Phase 2 of 3"
  Icon:       ComponentType<{ className?: string }>
  title:      string
  body:       string
  onBack:     () => void
  onContinue: () => void
}

export function PhaseIntroCard({
  phaseLabel,
  Icon,
  title,
  body,
  onBack,
  onContinue,
}: PhaseIntroCardProps) {
  return (
    <div className="min-h-screen bg-primary-400 flex flex-col">

      {/* Row 1: flex row — back button in flow, logo clears it naturally at all viewport widths */}
      <div className="w-full pt-5 pb-3">
        <div className="max-w-lg w-full mx-auto px-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={en.quiz.shared.backAriaLabel}
            className="shrink-0 w-8 h-8 rounded-full bg-apt-cream flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M9 2L4 7L9 12"
                stroke="#A3614A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <AptLogoHorizontal scheme="mono" size="sm" />
        </div>
      </div>

      {/* Phase label — no background, matches pill vertical position on quiz pages */}
      <div className="max-w-lg w-full mx-auto px-5 pb-3">
        <span
          className="text-xs uppercase tracking-widest text-apt-cream/70"
          style={{ fontWeight: 800 }}
        >
          {phaseLabel}
        </span>
      </div>

      {/* Main content — vertically centred */}
      <div className="flex-1 flex flex-col justify-center px-5 py-12 max-w-lg w-full mx-auto">
        <Icon className="w-[184px] h-[184px] text-apt-cream mb-8" />
        <h2 className="font-display text-4xl font-semibold text-white leading-tight mb-4">
          {title}
        </h2>
        <p className="font-body text-lg text-white/80 leading-relaxed">
          {body}
        </p>
      </div>

      {/* Continue */}
      <div className="px-5 pb-10 max-w-lg w-full mx-auto">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onContinue}
          className="!bg-apt-cream !text-apt-dark !border-0 hover:!bg-white"
        >
          Continue →
        </Button>
      </div>

    </div>
  )
}
