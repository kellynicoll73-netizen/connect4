'use client'

import { useState, useRef, useEffect } from 'react'
import { en } from '@/locales/en'

interface WhyWeAskToggleProps {
  copy: string
}

export function WhyWeAskToggle({ copy }: WhyWeAskToggleProps) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open])

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-primary-500 text-sm font-body hover:text-primary-700 transition-colors"
        aria-expanded={open}
      >
        {open ? en.quiz.shared.whyWeAskOpen : en.quiz.shared.whyWeAskClosed}
      </button>
      <div
        style={{ height, overflow: 'hidden', transition: 'height 200ms ease' }}
        aria-hidden={!open}
      >
        <div ref={contentRef} className="pt-2 pb-1">
          <p className="text-sm font-body text-neutral-500 leading-relaxed">{copy}</p>
        </div>
      </div>
    </div>
  )
}
