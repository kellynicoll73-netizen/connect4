'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/TextInput'
import { TextArea } from '@/components/ui/TextArea'
import { Icon } from '@/components/ui/Icon'
import { AlertTriangle, CheckCircle, ArrowRight, X } from 'lucide-react'
import { NeighbourhoodMatchCard } from '@/components/result/NeighbourhoodMatchCard'
import { RentalListingCard } from '@/components/listing/RentalListingCard'
import { ScamFlagItem } from '@/components/listing/ScamFlagItem'
import { ScamShieldModal } from '@/components/modals/ScamShieldModal'
import { SaveBottomSheet } from '@/components/modals/SaveBottomSheet'
import type { Neighbourhood } from '@/types'
import neighbourhoodsData from '@/data/neighbourhoods.json'
import { ProgressBar } from '@/components/quiz/ProgressBar'
import { PhaseLabel } from '@/components/quiz/PhaseLabel'
import { QuizQuestion } from '@/components/quiz/QuizQuestion'
import { SingleSelectOptions } from '@/components/quiz/SingleSelectOptions'
import { MultiSelectOptions } from '@/components/quiz/MultiSelectOptions'
import { ContinueButton } from '@/components/quiz/ContinueButton'

const REASON_OPTIONS = [
  { value: 'work',            label: 'For work' },
  { value: 'school',          label: 'For school' },
  { value: 'family',          label: 'To be closer to family or a partner' },
  { value: 'chose-vancouver', label: 'I chose Vancouver — not the other way around' },
  { value: 'figuring-it-out', label: 'Still figuring it out' },
]

const TRANSPORT_OPTIONS = [
  { value: 'transit',  label: 'Public transit — SkyTrain or bus' },
  { value: 'walking',  label: 'Walking — I want to walk everywhere' },
  { value: 'cycling',  label: 'Cycling' },
  { value: 'car',      label: "I'll have a car" },
]

export default function DevPage() {
  const [inputVal, setInputVal] = useState('')
  const [textareaVal, setTextareaVal] = useState('')
  const [pipStep, setPipStep] = useState(1)
  const [singleVal, setSingleVal] = useState<string | null>(null)
  const [singleEscape, setSingleEscape] = useState('')
  const [multiVal, setMultiVal] = useState<string[]>([])
  const [multiEscape, setMultiEscape] = useState('')
  const [cardVersion, setCardVersion]       = useState<'A' | 'B' | 'C'>('C')
  const [scamModalOpen, setScamModalOpen]   = useState(false)
  const [saveSheetOpen, setSaveSheetOpen]   = useState(false)

  const mountPleasant = (neighbourhoodsData as unknown as Neighbourhood[]).find(
    (n) => n.id === 'mount-pleasant'
  )!
  const westEnd = (neighbourhoodsData as unknown as Neighbourhood[]).find(
    (n) => n.id === 'west-end'
  )!

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-lg mx-auto space-y-12">

        {/* ── Phase 8: Modals ───────────────────────────────────────────── */}
        <section className="space-y-4 pb-8 border-b border-neutral-200">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Phase 8 — Modals
          </h2>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setScamModalOpen(true)}>
              Open ScamShield Modal
            </Button>
            <Button variant="secondary" onClick={() => setSaveSheetOpen(true)}>
              Open Save Bottom Sheet
            </Button>
          </div>
          <p className="text-xs text-neutral-400 font-body">
            Tab cycles within each modal. Escape closes. Re-opening resets the form.
          </p>
        </section>

        <ScamShieldModal
          isOpen={scamModalOpen}
          onClose={() => setScamModalOpen(false)}
          listing={mountPleasant.listings.oneBed}
        />
        <SaveBottomSheet
          isOpen={saveSheetOpen}
          onClose={() => setSaveSheetOpen(false)}
        />

        {/* ── Phase 7: Listing components ───────────────────────────────── */}
        <section className="space-y-6 pb-8 border-b border-neutral-200">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Phase 7 — Listing components
          </h2>

          <div>
            <p className="text-xs text-neutral-400 font-body mb-3">ScamFlagItem</p>
            <ul className="space-y-2">
              <ScamFlagItem label="Price 10% below the neighbourhood median" />
              <ScamFlagItem label='"Available immediately — or sooner for the right person"' />
              <ScamFlagItem label="Utilities included (uncommon at this price point in this area)" />
            </ul>
          </div>

          <div>
            <p className="text-xs text-neutral-400 font-body mb-3">RentalListingCard — Mount Pleasant 1BR</p>
            <RentalListingCard
              listing={mountPleasant.listings.oneBed}
              neighbourhoodName={mountPleasant.name}
              onReply={() => alert('ScamShieldModal would open here')}
            />
          </div>
        </section>

        {/* ── Phase 6: Result components ────────────────────────────────── */}
        <section className="space-y-6 pb-8 border-b border-neutral-200">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Phase 6 — Result components
          </h2>

          <div className="flex gap-2">
            {(['A', 'B', 'C'] as const).map((v) => (
              <button key={v} onClick={() => setCardVersion(v)}
                className={`px-4 py-2 rounded font-mono text-sm border ${cardVersion === v ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white border-neutral-200 text-neutral-600'}`}>
                Version {v}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-xs text-neutral-400 font-body mb-4">
              Mount Pleasant — has community quote
            </p>
            <NeighbourhoodMatchCard
              neighbourhood={mountPleasant}
              score={100}
              version={cardVersion}
              analogousText={mountPleasant.analogousComparisons['Dublin_The Liberties'] ?? mountPleasant.analogousComparisons['default']}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-xs text-neutral-400 font-body mb-4">
              West End — has community quote
            </p>
            <NeighbourhoodMatchCard
              neighbourhood={westEnd}
              score={87}
              version={cardVersion}
              analogousText={westEnd.analogousComparisons['default']}
            />
          </div>
        </section>

        {/* ── Phase 5: Quiz components ──────────────────────────────────── */}
        <section className="space-y-6 pb-8 border-b border-neutral-200">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Phase 5 — Quiz components
          </h2>

          {/* ProgressBar */}
          <div className="space-y-3">
            <p className="text-xs text-neutral-400 font-body">ProgressBar — drag step</p>
            <ProgressBar currentStep={pipStep} />
            <input
              type="range" min={1} max={14} value={pipStep}
              onChange={(e) => setPipStep(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex gap-2 flex-wrap">
              {[1, 5, 6, 10, 11, 12, 13, 14].map((s) => (
                <button key={s} onClick={() => setPipStep(s)}
                  className="text-xs px-2 py-1 rounded bg-neutral-100 font-mono hover:bg-neutral-200">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* PhaseLabel */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">PhaseLabel — tracks step above</p>
            <PhaseLabel step={pipStep} />
          </div>

          {/* QuizQuestion with WhyWeAskToggle */}
          <QuizQuestion
            headline="What's bringing you to Vancouver?"
          >
            <SingleSelectOptions
              options={REASON_OPTIONS}
              value={singleVal}
              onChange={setSingleVal}
              escapeFreeText={singleEscape}
              onEscapeChange={setSingleEscape}
            />
          </QuizQuestion>

          {/* MultiSelect */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">MultiSelectOptions</p>
            <MultiSelectOptions
              options={TRANSPORT_OPTIONS}
              value={multiVal}
              onChange={setMultiVal}
              showEscape={false}
            />
          </div>

          {/* ContinueButton states */}
          <div className="space-y-3">
            <p className="text-xs text-neutral-400 font-body">ContinueButton</p>
            <ContinueButton step={1} disabled={singleVal === null} onClick={() => {}} />
            <ContinueButton step={14} disabled={false} onClick={() => {}} />
          </div>
        </section>

        <header>
          <p className="text-xs font-body tracking-widest text-neutral-400 uppercase mb-1">
            DEV ONLY · COMPONENT SHOWCASE
          </p>
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            Phase 4 primitives
          </h1>
        </header>

        {/* ── Colour tokens ─────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Colour tokens
          </h2>
          <div className="grid grid-cols-5 gap-2">
            <div className="h-12 rounded-md bg-primary-500" title="primary-500 #c87800" />
            <div className="h-12 rounded-md bg-primary-700" title="primary-700 #8a5200" />
            <div className="h-12 rounded-md bg-neutral-50 border border-neutral-200" title="neutral-50" />
            <div className="h-12 rounded-md bg-neutral-200" title="neutral-200" />
            <div className="h-12 rounded-md bg-neutral-900" title="neutral-900" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 rounded-md bg-success-500" title="success-500 #3a7d44" />
            <div className="h-8 rounded-md bg-error-500" title="error-500 #c0392b" />
          </div>
        </section>

        {/* ── Typography ────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Typography
          </h2>
          <p className="font-display text-4xl font-bold">Display bold — Palatino</p>
          <p className="font-display text-4xl font-bold italic">Display bold italic</p>
          <p className="font-display text-2xl">Display regular</p>
          <p className="font-body text-base">Body regular — Source Sans 3</p>
          <p className="font-body text-sm font-semibold">Body semibold</p>
          <p className="font-body text-xs text-neutral-400 tracking-widest uppercase">
            Label / caption style
          </p>
          <p className="font-mono text-3xl">100% — mono</p>
        </section>

        {/* ── Button variants ───────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Button variants
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" disabled>Disabled primary</Button>
            <Button variant="secondary" disabled>Disabled secondary</Button>
          </div>
          <Button variant="primary" fullWidth>
            Full width — Start →
          </Button>
          <Button variant="primary" fullWidth>
            Full width — See my match →
          </Button>
        </section>

        {/* ── Icons ─────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Icons (Lucide)
          </h2>
          <div className="flex gap-4 items-center">
            <Icon icon={AlertTriangle} className="text-error-500" size={24} />
            <Icon icon={CheckCircle} className="text-success-500" size={24} />
            <Icon icon={ArrowRight} className="text-primary-500" size={24} />
            <Icon icon={X} className="text-neutral-600" size={24} />
          </div>
        </section>

        {/* ── TextInput ─────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            TextInput
          </h2>
          <TextInput
            label="City"
            value={inputVal}
            onChange={setInputVal}
            placeholder="e.g. Dublin, Toronto, Mumbai..."
          />
          <TextInput
            label="Neighbourhood"
            value=""
            onChange={() => {}}
            placeholder="e.g. The Liberties, Kensington..."
            optional="(if you know it)"
          />
        </section>

        {/* ── TextArea ──────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            TextArea
          </h2>
          <TextArea
            value={textareaVal}
            onChange={setTextareaVal}
            placeholder="e.g. It's loud and a bit chaotic but in a good way. Old buildings, cheap food, artists moving in..."
          />
        </section>

      </div>
    </div>
  )
}
