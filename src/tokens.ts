/**
 * Apt design tokens — single source of truth.
 * Imported by tailwind.config.ts AND src/app/dev/page.tsx.
 * Update here → Tailwind classes + dev page swatches stay in sync automatically.
 */

export const colors = {
  primary: {
    50:  '#F4E8E0',
    100: '#F4E8E0',
    400: '#A3614A',
    500: '#7A3E28',
    700: '#5B3020',
  },
  neutral: {
    50:  '#FAF7F0',
    100: '#F0EAE3',
    200: '#E0D5C8',
    300: '#BFB0A3',
    400: '#8C7E73',
    500: '#6B5F52',
    600: '#5B5348',
    700: '#3A2E24',
    900: '#2A2318',
  },
  apt: {
    lime:        '#A9B743',
    'lime-tint': '#F4F8E8',
    terra:       '#7A3E28',
    'terra-tint':'#F4E8E0',
    dark:        '#2A2318',
    mid:         '#5B5348',
    cream:       '#FAF7F0',
  },
  success: { 500: '#3a7d44' },
  error:   { 500: '#c0392b' },
} as const

export const fontFamily: Record<string, string[]> = {
  display: ['var(--font-display)', 'Georgia', 'serif'],
  body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
  mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
}

export const borderRadius = {
  sm: '6px',
  md: '10px',
  lg: '16px',
} as const

export const boxShadow = {
  sm: '0 1px 3px rgba(0,0,0,0.08)',
  md: '0 4px 12px rgba(0,0,0,0.1)',
  lg: '0 8px 24px rgba(0,0,0,0.14)',
} as const
