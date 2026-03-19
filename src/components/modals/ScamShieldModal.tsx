'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle } from 'lucide-react'
import type { ListingObject } from '@/types'
import { Button } from '@/components/ui/Button'
import { ScamFlagItem } from '@/components/listing/ScamFlagItem'
import { en } from '@/locales/en'

interface ScamShieldModalProps {
  isOpen:  boolean
  onClose: () => void
  listing: ListingObject
}

const FLAG_LABELS: Record<string, string> = {
  belowMedian:          en.scamShield.flags.belowMedian,
  immediateAvailability: en.scamShield.flags.immediateAvailability,
  utilitiesIncluded:    en.scamShield.flags.utilitiesIncluded,
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function ScamShieldModal({ isOpen, onClose, listing }: ScamShieldModalProps) {
  const [email, setEmail]           = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const panelRef                    = useRef<HTMLDivElement>(null)
  const [mounted, setMounted]       = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Reset form on each open
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setSubmitted(false)
    }
  }, [isOpen])

  // Focus first focusable element on open
  useEffect(() => {
    if (!isOpen || !panelRef.current) return
    const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
  }, [isOpen])

  // Escape key + focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  const modal = (
    <div role="dialog" aria-modal="true" aria-label={en.modals.scamShieldAriaLabel}>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
        <div
          ref={panelRef}
          className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full mx-auto p-6 max-h-[90vh] overflow-y-auto pointer-events-auto"
        >
          {/* Warning icon + header */}
          <div className="flex flex-col items-center text-center mb-5">
            <AlertTriangle size={36} className="text-error-500 mb-3" />
            <h2 className="font-display text-xl font-bold text-neutral-900">
              {en.scamShield.header}
            </h2>
          </div>

          {/* Body paragraphs */}
          <div className="space-y-3 mb-5">
            <p className="font-body text-sm text-neutral-700">{en.scamShield.body1}</p>
            <p className="font-body text-sm text-neutral-700">{en.scamShield.body2}</p>
            <p className="font-body text-sm text-neutral-700">{en.scamShield.body3}</p>
          </div>

          {/* Named red flags */}
          <ul className="space-y-2 mb-5">
            {listing.scamFlags.map((flag) => (
              <ScamFlagItem key={flag} label={FLAG_LABELS[flag] ?? flag} />
            ))}
          </ul>

          <hr className="border-neutral-200 mb-5" />

          {/* Scam Shield pitch */}
          <div className="space-y-2 mb-5">
            <p className="font-body text-sm text-neutral-700">{en.scamShield.pitch1}</p>
            <p className="font-body text-sm text-neutral-700">{en.scamShield.pitch2}</p>
          </div>

          {/* Email form / confirmation */}
          {submitted ? (
            <p className="font-body text-sm text-success-500 text-center py-2">
              {en.scamShield.confirmation}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={en.scamShield.emailPlaceholder}
                className="w-full px-3 py-2.5 rounded-md border border-neutral-200 text-sm font-body focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                required
              />
              <Button variant="primary" fullWidth type="submit">
                {en.scamShield.emailCta}
              </Button>
            </form>
          )}

          {/* Dismiss */}
          <button
            type="button"
            onClick={onClose}
            className="block w-full text-center text-sm text-neutral-400 font-body mt-4 hover:text-neutral-600 transition-colors"
          >
            {en.scamShield.dismiss}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
