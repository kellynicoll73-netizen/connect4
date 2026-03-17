'use client'

interface WhyWeAskToggleProps {
  text?: string
  copy?: string // legacy alias
}

export function WhyWeAskToggle({ text, copy }: WhyWeAskToggleProps) {
  const content = text ?? copy
  if (!content) return null

  return (
    <div className="mt-6 pt-4 border-t border-neutral-200">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Why we ask</p>
      <p className="text-sm text-neutral-500 leading-relaxed">{content}</p>
    </div>
  )
}
