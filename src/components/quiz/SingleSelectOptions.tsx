'use client'

import { EscapeHatch } from './EscapeHatch'

interface Option {
  value: string
  label: string
}

interface SingleSelectOptionsProps {
  options:          Option[]
  value:            string | null
  onChange:         (value: string) => void
  showEscape?:      boolean
  escapeFreeText?:  string | null
  onEscapeChange?:  (text: string) => void
}

export function SingleSelectOptions({
  options,
  value,
  onChange,
  showEscape = false,
  escapeFreeText = null,
  onEscapeChange,
}: SingleSelectOptionsProps) {
  const escapeActive = value === 'other'

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    // If escape was active, clear the free text via parent
    if (escapeActive && onEscapeChange) {
      onEscapeChange('')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleOptionClick(option.value)}
            className={[
              'w-full py-3 px-4 rounded-md border text-sm font-body text-left transition-colors duration-150',
              selected
                ? 'bg-neutral-900 border-neutral-900 text-white'
                : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50',
            ].join(' ')}
            aria-pressed={selected}
          >
            {option.label}
          </button>
        )
      })}

      {showEscape && (
        <EscapeHatch
          active={escapeActive}
          onActivate={() => onChange('other')}
          value={escapeFreeText ?? ''}
          onChange={onEscapeChange ?? (() => {})}
        />
      )}
    </div>
  )
}
