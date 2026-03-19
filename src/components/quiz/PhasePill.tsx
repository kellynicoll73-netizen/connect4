import { en } from '@/locales/en'
import { CoffeeCupIconSmall, NewCompassIconSmall, StarIconSmall } from '@/components/icons/PhaseIcons'
import type { ComponentType } from 'react'

interface PhasePillProps {
  phase: 1 | 2 | 3
}

const PHASE_LABELS: Record<1 | 2 | 3, string> = {
  1: en.quiz.shared.phase1Label as string,
  2: en.quiz.shared.phase2Label as string,
  3: en.quiz.shared.phase3Label as string,
}

const PHASE_ICONS: Record<1 | 2 | 3, ComponentType<{ className?: string }>> = {
  1: CoffeeCupIconSmall,
  2: NewCompassIconSmall,
  3: StarIconSmall,
}

export function PhasePill({ phase }: PhasePillProps) {
  const label = PHASE_LABELS[phase]
  const Icon  = PHASE_ICONS[phase]
  return (
    <div className="w-full bg-primary-400 py-1.5">
      <div className="max-w-lg w-full mx-auto px-5 flex items-center gap-2">
        <Icon className="w-5 h-5 text-apt-cream flex-shrink-0" />
        <span
          className="text-xs uppercase tracking-widest text-apt-cream"
          style={{ fontWeight: 800 }}
        >
          Phase {phase}/3 — {label}
        </span>
      </div>
    </div>
  )
}
