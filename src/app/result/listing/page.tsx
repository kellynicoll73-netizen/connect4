'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/SessionContext'
import { RentalListingCard } from '@/components/listing/RentalListingCard'
import { ScamShieldModal } from '@/components/modals/ScamShieldModal'
import { SidePanelLayout } from '@/components/layout/SidePanelLayout'
import { en } from '@/locales/en'

export default function ListingPage() {
  const router = useRouter()
  const { matchedNeighbourhood, selectedListing } = useSession()
  const [scamOpen, setScamOpen] = useState(false)

  if (!matchedNeighbourhood || !selectedListing) {
    if (typeof window !== 'undefined') router.replace('/result')
    return null
  }

  const main = (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-lg mx-auto px-5 py-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-body text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-6 block"
        >
          {en.listing.backLink}
        </button>

        <RentalListingCard
          listing={selectedListing}
          neighbourhoodName={matchedNeighbourhood.name}
          onReply={() => setScamOpen(true)}
        />
      </div>
    </div>
  )

  const side = (
    <div className="flex flex-col justify-between h-full px-10 py-12">
      <div>
        <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-3">
          Your match
        </p>
        <h2 className="font-display text-3xl font-bold text-white leading-tight mb-6">
          {matchedNeighbourhood.name}
        </h2>

        <div className="space-y-4">
          <div className="bg-neutral-800 rounded-lg px-5 py-4">
            <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-1">
              Listing
            </p>
            <p className="font-body text-sm font-semibold text-white">
              ${selectedListing.price.toLocaleString('en-CA')}/month · {selectedListing.bedroomCount} bed
            </p>
            <p className="font-body text-xs text-neutral-400 mt-0.5">
              {selectedListing.headline}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-8">
        <p className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-3">
          Before you reply
        </p>
        <p className="font-body text-sm text-neutral-300 leading-relaxed mb-4">
          Listings priced below market, available immediately, and described as renovated are the most common pattern in phantom rental scams targeting newcomers.
        </p>
        <button
          type="button"
          onClick={() => setScamOpen(true)}
          className="font-body text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
        >
          Check this listing for red flags →
        </button>
      </div>
    </div>
  )

  return (
    <>
      <SidePanelLayout main={main} side={side} />
      <ScamShieldModal
        isOpen={scamOpen}
        onClose={() => setScamOpen(false)}
        listing={selectedListing}
      />
    </>
  )
}
