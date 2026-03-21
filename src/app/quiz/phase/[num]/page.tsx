'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PhaseIntroCard } from '@/components/quiz/PhaseIntroCard'
import { NewCompassIcon, StarIcon } from '@/components/icons/PhaseIcons'

// ─── Phase card content ───────────────────────────────────────────────────────

const PHASE_CONTENT: Record<string, {
  phaseLabel: string
  Icon:       React.ComponentType<{ className?: string }>
  title:      string
  body:       string
  next:       string
  back:       string
}> = {
  '2': {
    phaseLabel: 'Phase 2 of 3',
    Icon:       NewCompassIcon,
    title:      'Now, let\u2019s get to know you!',
    body:       'The practical stuff is sorted. These next questions are about how you actually live \u2014 the things that make a neighbourhood feel like yours, or wrong from the first week.',
    next:       '/quiz/6',
    back:       '/quiz/5',
  },
  '3': {
    phaseLabel: 'Phase 3 of 3',
    Icon:       StarIcon,
    title:      'This last one\u2019s our favourite.',
    body:       'Think of a neighbourhood you love. It might be where you live right now \u2014 or somewhere you\u2019ve always carried with you. Tell us what made it feel right. We\u2019ll use it to find your match in Vancouver.',
    next:       '/quiz/11',
    back:       '/quiz/10',
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

  return (
    <PhaseIntroCard
      phaseLabel={content.phaseLabel}
      Icon={content.Icon}
      title={content.title}
      body={content.body}
      onBack={() => router.push(content.back)}
      onContinue={() => router.push(content.next)}
    />
  )
}
