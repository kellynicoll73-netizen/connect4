'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { en } from '@/locales/en'

export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center px-6 py-16">
      <div className="max-w-sm mx-auto w-full">

        {/* Eyebrow */}
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-8">
          Neighbourhood Fit Tool · Vancouver
        </p>

        {/*
         * Stacked logo lockup — brand guide section 4, exact geometry.
         *
         * font-size on wrapper is the single scale knob — all em values below
         * are relative to it. clamp() makes the lockup responsive:
         *   320px phone → ~128px base → "Apt" fills ~80% of content width
         *   375px phone → ~150px base → "Apt" fills ~85% of content width
         *   max cap at 180px for wider viewports / desktop
         *
         * Symbol: position absolute, top 0, left 0.583em (centres over 'p')
         * pw wrapper: padding-top 0.731em seats symbol above cap height
         *             margin-bottom 0.26em gaps symbol from wordmark
         */}
        <div style={{ fontSize: 'clamp(88px, 35vw, 144px)' }} className="mb-10">
          {/* .pw wrapper */}
          <div style={{ position: 'relative', paddingTop: '0.731em', marginBottom: '0.26em' }}>
            {/* Symbol SVG — dark-ground colourway: pin=lime, heart=terra */}
            <svg
              viewBox="0 0 117.24 164.74"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: '0.583em',
                width: '0.648em',
                height: 'auto',
              }}
            >
              <circle fill="#7A3E28" cx="58.75" cy="56.69" r="40.12"/>
              <path
                fill="#A9B743"
                d="M117.24,62.93c0,1.72,0,44.05-58.62,101.81C0,109.57,0,62.93,0,62.93v-4.31
                   C0,26.25,26.25,0,58.62,0s58.62,26.25,58.62,58.62v4.31Z
                   M76.57,33.43c-6.06-1.83-13.32,4.57-17.97,8.19-4.65-3.6-11.92-9.99-17.97-8.14
                   -9.93,3.02-14.53,13.52-11.51,23.44.14.45.4,1.32.4,1.32,0,0,6.03,19.83,29.15,
                   31.29,23.33-12.31,28.91-30.83,29.07-31.36,0,0,.26-.88.4-1.32,
                   2.99-9.94-1.64-20.42-11.57-23.41Z"
              />
            </svg>

            {/* Wordmark — Lora 700, cream on dark, exact tracking */}
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display), Georgia, serif',
                fontWeight: 700,
                fontSize: '1em',
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                color: '#FAF7F0',
              }}
            >
              Apt
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p className="font-display text-2xl text-neutral-200 leading-snug mb-6">
          Find the neighbourhood<br />that fits who you are.
        </p>

        {/* Body */}
        <p className="font-body text-base text-neutral-400 leading-relaxed mb-2">
          {en.landing.body}
        </p>
        <p className="font-body text-sm text-neutral-500 mb-10">
          {en.landing.subBody}
        </p>

        {/* CTA — lime bg / dark text per brand guide section 6: "On dark ground" */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push('/quiz/1')}
          className="!bg-apt-lime !text-apt-dark !border-0 hover:!opacity-90"
        >
          {en.landing.cta}
        </Button>

        {/* Supporting copy */}
        <p className="font-body text-xs text-neutral-600 mt-10 max-w-xs leading-relaxed">
          {en.landing.supportingCopy}
        </p>

        <p className="font-body text-xs text-neutral-600 mt-3">
          {en.landing.privacyNote}
        </p>

      </div>
    </div>
  )
}
