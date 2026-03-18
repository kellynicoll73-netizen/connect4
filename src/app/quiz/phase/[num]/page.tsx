'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AptLogoHorizontal } from '@/components/ui/AptLogoHorizontal'
import { en } from '@/locales/en'

// ─── Icon components ──────────────────────────────────────────────────────────

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M600,37.55c-143.76,0-281.65,57.11-383.31,158.77-101.66,101.66-158.77,239.54-158.77,383.31s57.11,281.65,158.77,383.31c101.66,101.66,239.54,158.77,383.31,158.77s281.65-57.11,383.31-158.77c101.66-101.66,158.77-239.54,158.77-383.31,0-95.15-25.05-188.63-72.62-271.04-47.58-82.41-116.01-150.84-198.41-198.41-82.41-47.57-175.88-72.62-271.04-72.62h0ZM600,1049.42c-124.6,0-244.09-49.5-332.19-137.61-88.1-88.11-137.61-207.6-137.61-332.19s49.5-244.09,137.61-332.19c88.11-88.1,207.6-137.61,332.19-137.61s244.09,49.5,332.19,137.61c88.1,88.11,137.61,207.6,137.61,332.19s-49.5,244.09-137.61,332.19c-88.11,88.1-207.6,137.61-332.19,137.61ZM697.57,677.55c2.32-2.21,4.27-4.77,5.78-7.59l180.69-325.25c5.13-9.22,5.97-20.22,2.31-30.11-3.66-9.89-11.46-17.69-21.35-21.35-9.89-3.66-20.89-2.82-30.11,2.31l-325.25,180.69c-2.82,1.51-5.38,3.46-7.59,5.78-2.32,2.21-4.27,4.77-5.78,7.59l-180.69,325.25c-3.91,6.87-5.46,14.82-4.42,22.66,1.04,7.83,4.63,15.11,10.2,20.71,6.82,6.76,16.05,10.54,25.66,10.48,6.21-.02,12.31-1.64,17.71-4.7l325.25-180.69c2.82-1.51,5.38-3.46,7.59-5.78h0ZM663.97,592.63l-76.97-76.97,173.1-96.13-96.12,173.1ZM536.03,566.61l76.97,76.97-173.1,96.13,96.12-173.1ZM997.53,579.62c0,105.43-41.88,206.54-116.43,281.09-74.55,74.55-175.66,116.43-281.09,116.43-12.91,0-24.84-6.89-31.3-18.07-6.46-11.18-6.46-24.96,0-36.14,6.46-11.18,18.39-18.07,31.3-18.07,86.26,0,168.99-34.27,229.99-95.26,60.99-60.99,95.26-143.73,95.26-229.99,0-12.91,6.89-24.84,18.07-31.3,11.18-6.46,24.96-6.46,36.14,0,11.18,6.46,18.07,18.39,18.07,31.3h0ZM274.76,579.62c0,12.91-6.89,24.84-18.07,31.3-11.18,6.46-24.96,6.46-36.14,0-11.18-6.46-18.07-18.39-18.07-31.3,0-105.43,41.88-206.54,116.43-281.09,74.55-74.55,175.66-116.43,281.09-116.43,12.91,0,24.84,6.89,31.3,18.07,6.46,11.18,6.46,24.96,0,36.14s-18.39,18.07-31.3,18.07c-86.26,0-168.99,34.27-229.99,95.26-60.99,60.99-95.26,143.73-95.26,229.99h0Z" />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M496.8,1109.82c10.96,2.87,22.38,1.3,32.15-4.42,119.55-69.91,222.89-145.12,307.17-223.55,77.21-71.85,138.73-146.63,182.87-222.26,40.47-69.36,66.02-138.77,75.92-206.3,9.19-62.68,4.76-122.01-13.18-176.36-16.93-51.3-46.48-95.9-85.46-128.98-39-33.11-85.69-53.15-135.02-57.95-43.71-4.25-88.45,3.98-132.97,24.45-45.57,20.96-88.8,53.79-128.5,97.58l-7.53,8.31-7.8-8.06c-80.66-83.39-163.02-126-238.27-123.26l-1.15.05c-91.38,3.87-173.66,63.31-214.71,155.11-80.4,179.78-8.15,464.77,334.5,696.2,9.4,6.38,20.71,8.7,31.84,6.55,11.14-2.15,20.76-8.5,27.11-17.9,6.33-9.38,8.63-20.68,6.47-31.79-2.16-11.12-8.52-20.73-17.91-27.07-76.35-51.56-140.81-107.33-191.6-165.75-45.59-52.44-80.32-107.12-103.22-162.52-38.89-94.08-42.43-190-9.71-263.16,14.45-32.3,34.09-57.84,58.39-75.9,24.23-18,51.94-27.79,82.38-29.08,33.05-1.4,67.1,7.66,101.22,26.94,39.05,22.07,77.07,57.13,112.99,104.21,8.11,10.61,20.93,16.84,34.28,16.66,13.36-.18,26-6.75,33.82-17.59,35-48.61,73.37-84.28,114.05-106.01,30.3-16.19,61.02-24.35,91.54-24.35,5.52,0,11.04.27,16.54.8,33.18,3.23,64.1,16.35,89.43,37.96,26.44,22.56,46.19,53.21,58.69,91.09,13.5,40.91,16.48,89.23,8.62,139.75-8.95,57.56-31.4,117.23-66.72,177.35-39.91,67.94-95.86,135.53-166.3,200.87-78.97,73.26-176.74,144.17-290.6,210.75-9.78,5.72-16.74,14.9-19.61,25.86-2.87,10.96-1.3,22.37,4.42,32.14,5.72,9.78,14.9,16.75,25.86,19.62Z" />
    </svg>
  )
}

// ─── Phase card content ───────────────────────────────────────────────────────

const PHASE_CONTENT: Record<string, {
  phase:    string
  Icon:     React.ComponentType<{ className?: string }>
  title:    string
  body:     string
  next:     string
  back:     string
}> = {
  '2': {
    phase: 'Phase 2 of 4',
    Icon:  CompassIcon,
    title: 'Now the interesting part.',
    body:  'The practical stuff is sorted. These next questions are about how you actually live — the things that make a neighbourhood feel like yours, or wrong from the first week.',
    next:  '/quiz/6',
    back:  '/quiz/5',
  },
  '3': {
    phase: 'Phase 3 of 4',
    Icon:  HeartIcon,
    title: 'One more — and it\'s the good part.',
    body:  "Think of a neighbourhood you love. It might be where you live right now — or somewhere you've always carried with you. Tell us what made it feel right. We'll use it to find your match in Vancouver.",
    next:  '/quiz/11',
    back:  '/quiz/10',
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PhaseIntroPage() {
  const params  = useParams()
  const router  = useRouter()
  const num     = String(params.num)
  const content = PHASE_CONTENT[num]

  useEffect(() => {
    if (!content) router.replace('/quiz/1')
  }, [content, router])

  if (!content) return null

  const { Icon } = content

  return (
    <div className="min-h-screen bg-primary-400 flex flex-col">
      {/* Row 1: cream circle back button (left) + mono logo at content-column left — same as quiz pages */}
      <div className="relative w-full pt-5 pb-3">
        <div className="max-w-lg w-full mx-auto px-5">
          <AptLogoHorizontal scheme="mono" size="sm" />
        </div>
        <button
          type="button"
          onClick={() => router.push(content.back)}
          aria-label={en.quiz.shared.backAriaLabel}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-apt-cream flex items-center justify-center hover:bg-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7L9 12" stroke="#A3614A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Phase label — same vertical position as pill on quiz pages, no background */}
      <div className="max-w-lg w-full mx-auto px-5 pb-3">
        <span
          className="text-xs uppercase tracking-widest text-apt-cream/70"
          style={{ fontWeight: 800 }}
        >
          {content.phase}
        </span>
      </div>

      {/* Content — vertically centred */}
      <div className="flex-1 flex flex-col justify-center px-5 py-12 max-w-lg w-full mx-auto">
        <Icon className="w-20 h-20 text-apt-cream mb-8" />
        <h2 className="font-display text-4xl font-semibold text-white leading-tight mb-4">
          {content.title}
        </h2>
        <p className="font-body text-lg text-white/80 leading-relaxed">
          {content.body}
        </p>
      </div>

      {/* Continue */}
      <div className="px-5 pb-10 max-w-lg w-full mx-auto">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push(content.next)}
          className="!bg-apt-cream !text-apt-dark !border-0 hover:!bg-white"
        >
          Continue →
        </Button>
      </div>
    </div>
  )
}
