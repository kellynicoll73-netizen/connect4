'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/SessionContext'
import { SidePanelLayout } from '@/components/layout/SidePanelLayout'
import { AptLogoHorizontal } from '@/components/ui/AptLogoHorizontal'
import { en } from '@/locales/en'

const CHIPS = [
  en.loading.chips.step1,
  en.loading.chips.step2,
  en.loading.chips.step3,
  en.loading.chips.step4,
]

const CHIP_DELAYS = [0, 700, 1500, 2300]

export default function LoadingPage() {
  const router = useRouter()
  const { runMatching } = useSession()
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    runMatching()

    const timers: ReturnType<typeof setTimeout>[] = []

    CHIP_DELAYS.forEach((delay, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), delay))
    })

    timers.push(setTimeout(() => router.push('/result'), 3500))

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const main = (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-5">
      <div className="max-w-lg w-full">
        <div className="mb-8">
          <AptLogoHorizontal scheme="light" size="sm" />
        </div>
        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">
          {en.loading.headline}
        </h1>
        <p className="font-body text-sm text-neutral-400 mb-10">
          {en.loading.subCopy}
        </p>

        <div className="space-y-3">
          {CHIPS.map((chip, i) => (
            <div
              key={i}
              className={[
                'flex items-center gap-3 transition-all duration-500',
                i < visibleCount
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2',
              ].join(' ')}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
              <span className="font-body text-sm text-neutral-700">{chip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const side = (
    <div className="flex flex-col justify-center h-full px-10 py-12">
      <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-6">
        What we&apos;re doing
      </p>
      <div className="space-y-6">
        <div>
          <p className="font-display text-lg font-bold text-white mb-1">Reading what you wrote</p>
          <p className="font-body text-sm text-neutral-400 leading-relaxed">Your descriptions of where you live and what you love are compared against detailed profiles of each Vancouver neighbourhood.</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-white mb-1">Applying the hard limits</p>
          <p className="font-body text-sm text-neutral-400 leading-relaxed">Budget, bedrooms, transport, timeline — these cut the list down to what&apos;s actually viable before we look at fit.</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold text-white mb-1">Finding the match</p>
          <p className="font-body text-sm text-neutral-400 leading-relaxed">We look for a Vancouver neighbourhood with a similar feel to the places you described — not just similar amenities, but similar life.</p>
        </div>
      </div>
    </div>
  )

  return <SidePanelLayout main={main} side={side} />
}
