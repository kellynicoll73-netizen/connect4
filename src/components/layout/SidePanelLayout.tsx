import type { ReactNode } from 'react'

interface SidePanelLayoutProps {
  main: ReactNode
  side: ReactNode
  /** Extra classes for the side panel wrapper */
  sideClassName?: string
}

/**
 * Two-column layout for lg+ screens.
 * On mobile: renders only `main` (side is hidden).
 * On desktop: left = main, right = side panel.
 */
export function SidePanelLayout({ main, side, sideClassName }: SidePanelLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 lg:grid lg:grid-cols-2 lg:min-h-0">
      {/* Left — main content */}
      <div className="min-h-screen lg:min-h-screen lg:overflow-y-auto">
        {main}
      </div>

      {/* Right — side panel, hidden on mobile */}
      <div
        className={[
          'hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen',
          'bg-neutral-900 text-white overflow-hidden',
          sideClassName ?? '',
        ].join(' ')}
      >
        {side}
      </div>
    </div>
  )
}
