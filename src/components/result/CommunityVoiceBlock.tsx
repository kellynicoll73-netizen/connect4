import type { CommunityQuote } from '@/types'
import { en } from '@/locales/en'

interface CommunityVoiceBlockProps {
  quote: CommunityQuote | string | null
}

export function CommunityVoiceBlock({ quote }: CommunityVoiceBlockProps) {
  if (!quote) return null

  // Handle plain string (the full quote including attribution after em dash)
  if (typeof quote === 'string') {
    const parts = quote.split(/\s*—\s*/)
    const text = parts[0].trim()
    const attribution = parts.slice(1).join(' — ').trim()
    return (
      <div className="border-l-4 border-primary-500 border border-neutral-200 px-4 py-3 rounded-sm">
        <p className="text-xs font-body font-semibold tracking-widest text-neutral-400 uppercase mb-3">
          {en.result.communityVoice}
        </p>
        <p className="font-display italic text-neutral-900 text-sm leading-relaxed">
          {text}
        </p>
        {attribution && (
          <p className="text-xs text-neutral-400 font-body mt-2">— {attribution}</p>
        )}
      </div>
    )
  }

  return (
    <div className="border-l-4 border-primary-500 border border-neutral-200 px-4 py-3 rounded-sm">
      <p className="text-xs font-body font-semibold tracking-widest text-neutral-400 uppercase mb-3">
        {en.result.communityVoice}
      </p>
      <p className="font-display italic text-neutral-900 text-base leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-xs text-neutral-400 font-body mt-2">{quote.attribution}</p>
    </div>
  )
}
