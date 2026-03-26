import { en } from '@/locales/en'

interface AnalogousComparisonBlockProps {
  text: string
}

export function AnalogousComparisonBlock({ text }: AnalogousComparisonBlockProps) {
  return (
    <div className="border-l-4 border-primary-500 border border-neutral-200 px-4 py-3 rounded-sm">
      <p className="text-xs font-body font-semibold tracking-widest text-neutral-400 uppercase mb-2">
        {en.result.howItCompares}
      </p>
      <p className="font-body text-sm text-neutral-900">{text}</p>
    </div>
  )
}
