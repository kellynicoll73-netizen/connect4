'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { en } from '@/locales/en'

export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-16 max-w-lg mx-auto w-full">

        <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-6">
          {en.landing.productLabel}
        </p>

        <h1 className="font-display text-4xl font-bold text-neutral-900 leading-tight mb-5">
          {en.landing.headline1}
          <br />
          {en.landing.headline2}
        </h1>

        <p className="font-body text-base text-neutral-600 mb-2">
          {en.landing.body}
        </p>

        <p className="font-body text-sm text-neutral-400 mb-8">
          {en.landing.subBody}
        </p>

        <p className="font-body text-sm text-neutral-500 leading-relaxed mb-10 border-l-2 border-neutral-200 pl-4">
          {en.landing.supportingCopy}
        </p>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push('/quiz/1')}
        >
          {en.landing.cta}
        </Button>

        <p className="font-body text-xs text-neutral-400 text-center mt-4">
          {en.landing.privacyNote}
        </p>

      </div>
    </div>
  )
}
