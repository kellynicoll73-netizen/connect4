'use client'

import { EscapeHatch } from './EscapeHatch'

interface Option {
  value: string
  label: string
}

interface MultiSelectOptionsProps {
  options:          Option[]
  value:            string[]
  onChange:         (values: string[]) => void
  showEscape?:      boolean
  escapeFreeText?:  string | null
  onEscapeChange?:  (text: string) => void
}

export function MultiSelectOptions({
  options,
  value,
  onChange,
  showEscape = false,
  escapeFreeText = null,
  onEscapeChange,
}: MultiSelectOptionsProps) {
  const escapeActive = value.includes('other')

  const handleOptionClick = (optionValue: string) => {
    // If escape was active, clear it
    const withoutOther = value.filter((v) => v !== 'other')
    if (onEscapeChange && escapeActive) onEscapeChange('')

    if (withoutOther.includes(optionValue)) {
      onChange(withoutOther.filter((v) => v !== optionValue))
    } else {
      onChange([...withoutOther, optionValue])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const selected = value.includes(option.value)
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
          onActivate={() => onChange([...value.filter((v) => v !== 'other'), 'other'])}
          value={escapeFreeText ?? ''}
          onChange={onEscapeChange ?? (() => {})}
        />
      )}
    </div>
  )
}
