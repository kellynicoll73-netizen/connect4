// Phase groups: Phase 1 = pips 1–5, Phase 2 = 6–11, Phase 3 = 12
const PHASES = [
  { label: 'Phase 1', pips: [1, 2, 3, 4, 5] },
  { label: 'Phase 2', pips: [6, 7, 8, 9, 10, 11] },
  { label: 'Phase 3', pips: [12] },
]

interface ProgressBarProps {
  currentStep: number // 1–12
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={12}>
      {PHASES.map((phase, phaseIndex) => (
        <div key={phaseIndex} className="flex items-center gap-1">
          {phase.pips.map((pip) => (
            <div
              key={pip}
              className={[
                'w-2 h-2 rounded-sm transition-colors duration-200',
                pip <= currentStep ? 'bg-primary-500' : 'bg-neutral-200',
              ].join(' ')}
              aria-hidden="true"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
