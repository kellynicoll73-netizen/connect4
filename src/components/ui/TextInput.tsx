'use client'

interface TextInputProps {
  label:        string
  value:        string
  onChange:     (value: string) => void
  placeholder?: string
  optional?:    string   // label suffix, e.g. "(if you know it)"
  required?:    boolean
  className?:   string
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  optional,
  required = false,
  className = '',
}: TextInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="text-sm font-body font-semibold text-neutral-900">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-neutral-400">{optional}</span>
        )}
      </label>
      <input
        type="text"
        id={label.toLowerCase().replace(/\s+/g, '-')}
        name={label.toLowerCase().replace(/\s+/g, '-')}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-3 py-2.5 rounded-md border border-neutral-200
          bg-white text-neutral-900 font-body text-sm
          placeholder:text-neutral-400
          focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
          transition-colors duration-150
        "
      />
    </div>
  )
}
