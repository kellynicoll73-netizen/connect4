import type { ReactNode } from 'react'

interface QuizQuestionProps {
  headline: string
  subCopy?: string
  children: ReactNode
}

export function QuizQuestion({ headline, subCopy, children }: QuizQuestionProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 leading-snug">
          {headline}
        </h2>
        {subCopy && (
          <p className="mt-1 text-sm font-body text-neutral-600">{subCopy}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
