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
      <p
        className="text-xs uppercase tracking-widest text-neutral-700 mb-1.5"
        style={{ fontWeight: 800 }}
      >
        Why we ask
      </p>
      <p className="text-sm font-medium text-neutral-600 leading-relaxed">{content}</p>
    </div>
  )
}
