/**
 * AptLogoHorizontal — small horizontal lockup.
 * scheme:
 *   'light' = dark text + colour icon (dark bg not needed)
 *   'dark'  = cream text + colour icon
 *   'mono'  = all-cream monochrome (for use on dark/coloured backgrounds)
 */

interface AptLogoHorizontalProps {
  size?:   'sm' | 'md'
  scheme?: 'light' | 'dark' | 'mono'
}

const SIZE = {
  sm: { iconH: 20, gap: 6, fontSize: 18 },
  md: { iconH: 28, gap: 8, fontSize: 24 },
}

export function AptLogoHorizontal({
  size   = 'sm',
  scheme = 'light',
}: AptLogoHorizontalProps) {
  const { iconH, gap, fontSize } = SIZE[size]
  const textColor =
    scheme === 'light' ? '#2A2318' :
    scheme === 'dark'  ? '#FAF7F0' :
    /* mono */           '#FAF7F0'

  const isMono = scheme === 'mono'

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap }}
      aria-label="Apt"
    >
      {/* Heart-pin icon */}
      <svg
        viewBox="0 0 117.24 164.74"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ height: iconH, width: 'auto', flexShrink: 0 }}
      >
        <circle
          fill={isMono ? '#A3614A' : '#7A3E28'}
          cx="58.75"
          cy="56.69"
          r="40.12"
        />
        <path
          fill={isMono ? '#FAF7F0' : '#A9B743'}
          d="M117.24,62.93c0,1.72,0,44.05-58.62,101.81C0,109.57,0,62.93,0,62.93v-4.31
             C0,26.25,26.25,0,58.62,0s58.62,26.25,58.62,58.62v4.31Z
             M76.57,33.43c-6.06-1.83-13.32,4.57-17.97,8.19-4.65-3.6-11.92-9.99-17.97-8.14
             -9.93,3.02-14.53,13.52-11.51,23.44.14.45.4,1.32.4,1.32,0,0,6.03,19.83,29.15,
             31.29,23.33-12.31,28.91-30.83,29.07-31.36,0,0,.26-.88.4-1.32,
             2.99-9.94-1.64-20.42-11.57-23.41Z"
        />
      </svg>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontWeight: 700,
          fontSize,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: textColor,
          opacity: isMono ? 0.9 : 1,
        }}
      >
        Apt
      </span>
    </div>
  )
}
