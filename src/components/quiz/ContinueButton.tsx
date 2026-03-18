'use client'

import { Button } from '@/components/ui/Button'

interface ContinueButtonProps {
  step:     number
  disabled: boolean
  onClick:  () => void
}

export function ContinueButton({ step, disabled, onClick }: ContinueButtonProps) {
  const label = step === 11 ? 'See my match →' : 'Continue →'

  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </Button>
  )
}
