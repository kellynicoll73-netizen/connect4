import type { ReactNode } from 'react'
import { WhyWeAskToggle } from './WhyWeAskToggle'

interface QuizQuestionProps {
  headline:     string
  subCopy?:     string
  whyWeAsk?:    string
  showWhyWeAsk?: boolean // default true
  children:     ReactNode
}

export function QuizQuestion({
  headline,
  subCopy,
  whyWeAsk,
  showWhyWeAsk = true,
  children,
}: QuizQuestionProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 leading-snug">
          {headline}
        </h2>
        {subCopy && (
          <p className="mt-1 text-sm font-body text-neutral-600 italic">{subCopy}</p>
        )}
        {showWhyWeAsk && whyWeAsk && (
          <WhyWeAskToggle copy={whyWeAsk} />
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
