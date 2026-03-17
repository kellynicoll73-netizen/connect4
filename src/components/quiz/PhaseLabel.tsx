import { en } from '@/locales/en'

const PHASE_FOR_STEP: Record<number, keyof typeof en.quiz.shared> = {
  1:  'phase1Label', 2:  'phase1Label', 3:  'phase1Label', 4:  'phase1Label', 5: 'phase1Label',
  6:  'phase2Label', 7:  'phase2Label', 8:  'phase2Label',
  9:  'phase2Label', 10: 'phase2Label', 11: 'phase2Label',
  12: 'phase3Label',
}

interface PhaseLabelProps {
  step: number // 1–12
}

export function PhaseLabel({ step }: PhaseLabelProps) {
  const key = PHASE_FOR_STEP[step] ?? 'phase1Label'
  const label = en.quiz.shared[key] as string

  return (
    <span className="inline-block bg-primary-500 text-white text-xs font-body font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm">
      {label}
    </span>
  )
}
