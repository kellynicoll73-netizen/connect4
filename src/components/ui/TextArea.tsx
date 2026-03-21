'use client'

interface TextAreaProps {
  label?:       string
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  rows?:        number
  className?:   string
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  className = '',
}: TextAreaProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="text-sm font-body font-semibold text-neutral-900">
          {label}
        </label>
      )}
      <textarea
        id={label ? label.toLowerCase().replace(/\s+/g, '-') : 'textarea'}
        name={label ? label.toLowerCase().replace(/\s+/g, '-') : 'textarea'}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-3 py-2.5 rounded-md border border-neutral-200
          bg-white text-neutral-900 font-body text-sm
          placeholder:text-neutral-400 resize-none
          focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
          transition-colors duration-150
        "
      />
    </div>
  )
}
