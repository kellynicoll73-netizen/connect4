// Phase 1 = steps 1–5  (Practicalities — transport now included)
// Phase 2 = steps 6–10 (Your Lifestyle)
// Phase 3 = step 11    (Place Memory)

const PHASE_GROUPS = [
  [1, 2, 3, 4, 5],   // Phase 1
  [6, 7, 8, 9, 10],  // Phase 2
  [11],               // Phase 3
]

interface ProgressBarProps {
  currentStep: number // 1–11
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div
      className="flex items-center gap-3"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={11}
    >
      {PHASE_GROUPS.map((group, gi) => (
        <div key={gi} className="flex items-center gap-1">
          {group.map((step) => {
            const isDone    = step < currentStep
            const isCurrent = step === currentStep

            return (
              <div
                key={step}
                className={[
                  'rounded-full transition-all duration-200',
                  isCurrent
                    ? 'w-3 h-3 bg-primary-500'
                    : isDone
                    ? 'w-2.5 h-2.5 bg-primary-500'
                    : 'w-2.5 h-2.5 border-2 border-neutral-300 bg-transparent',
                ].join(' ')}
                aria-hidden="true"
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
