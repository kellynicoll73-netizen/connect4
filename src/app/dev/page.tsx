'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/context/SessionContext'
import { colors } from '@/tokens'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/TextInput'
import { TextArea } from '@/components/ui/TextArea'
import { Icon } from '@/components/ui/Icon'
import { AlertTriangle, CheckCircle, ArrowRight, X } from 'lucide-react'
import { NeighbourhoodMatchCard } from '@/components/result/NeighbourhoodMatchCard'
import { MatchSignalPills } from '@/components/result/MatchSignalPills'
import { AnalogousComparisonBlock } from '@/components/result/AnalogousComparisonBlock'
import { CommunityVoiceBlock } from '@/components/result/CommunityVoiceBlock'
import { SecondaryMatchCard } from '@/components/result/SecondaryMatchCard'
import { RentalListingCard } from '@/components/listing/RentalListingCard'
import { ScamFlagItem } from '@/components/listing/ScamFlagItem'
import { ScamShieldModal } from '@/components/modals/ScamShieldModal'
import { SaveBottomSheet } from '@/components/modals/SaveBottomSheet'
import type { Neighbourhood } from '@/types'
import neighbourhoodsData from '@/data/neighbourhoods.json'
import { ProgressBar } from '@/components/quiz/ProgressBar'
import { PhasePill } from '@/components/quiz/PhasePill'
import { QuizQuestion } from '@/components/quiz/QuizQuestion'
import { WhyWeAskToggle } from '@/components/quiz/WhyWeAskToggle'
import { SingleSelectOptions } from '@/components/quiz/SingleSelectOptions'
import { MultiSelectOptions } from '@/components/quiz/MultiSelectOptions'
import { ContinueButton } from '@/components/quiz/ContinueButton'
import { AptLogoHorizontal } from '@/components/ui/AptLogoHorizontal'

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
  { value: 'car',      label: "I\u2019ll have a car" },
]

export default function DevPage() {
  const router = useRouter()
  const { setAnswer } = useSession()
  const [inputVal, setInputVal] = useState('')
  const [textareaVal, setTextareaVal] = useState('')
  const [pipStep, setPipStep] = useState(1)
  const [singleVal, setSingleVal] = useState<string | null>(null)
  const [singleEscape, setSingleEscape] = useState('')
  const [multiVal, setMultiVal] = useState<string[]>([])
const [scamModalOpen, setScamModalOpen]   = useState(false)
  const [saveSheetOpen, setSaveSheetOpen]   = useState(false)

  const mountPleasant = (neighbourhoodsData as unknown as Neighbourhood[]).find(
    (n) => n.id === 'mount-pleasant'
  )!
  const westEnd = (neighbourhoodsData as unknown as Neighbourhood[]).find(
    (n) => n.id === 'west-end'
  )!

  function jumpToResults(neighbourhoodId: string) {
    setAnswer('reasonForMoving', 'work')
    setAnswer('timeline', '3-6mo')
    setAnswer('household', 'solo')
    setAnswer('bedrooms', 1)
    setAnswer('budget', '2000-2500')
    setAnswer('transport', 'transit')
    setAnswer('freeDay', 'explore')
    setAnswer('neighbourhoodEnergy', 'mixed')
    setAnswer('outdoorsAccess', 'nice-to-have')
    setAnswer('culturalCommunity', 'somewhat')
    setAnswer('comfortPriority', 'diversity-inclusion')
    setAnswer('matchedNeighbourhoodId', neighbourhoodId)
    router.push('/result')
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-lg mx-auto space-y-12">

        {/* ── DEV SHORTCUT ──────────────────────────────────────────────── */}
        <section className="space-y-4 pb-8 border-b-2 border-primary-400 bg-primary-50 rounded-lg p-4">
          <h2 className="font-body text-xs font-semibold tracking-widest text-primary-600 uppercase">
            Dev shortcuts
          </h2>

          {/* Jump to quiz step */}
          <div>
            <p className="font-body text-xs text-primary-500 mb-2">Jump to quiz step</p>
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6,7,8,9,10,11].map((step) => (
                <button
                  key={step}
                  onClick={() => router.push(`/quiz/${step}`)}
                  className="text-xs px-3 py-1.5 rounded bg-white border border-primary-400 text-primary-600 font-body font-semibold hover:bg-primary-100"
                >
                  Q{step}
                </button>
              ))}
              {[2,3].map((num) => (
                <button
                  key={`phase-${num}`}
                  onClick={() => router.push(`/quiz/phase/${num}`)}
                  className="text-xs px-3 py-1.5 rounded bg-white border border-primary-400 text-primary-600 font-body font-semibold hover:bg-primary-100"
                >
                  Phase {num}
                </button>
              ))}
            </div>
          </div>

          {/* Jump to results */}
          <div>
            <p className="font-body text-xs text-primary-500 mb-2">Jump to results</p>
            <div className="flex flex-wrap gap-2">
              {['chinatown', 'mount-pleasant', 'west-end', 'commercial-drive', 'kitsilano'].map((id) => (
                <button
                  key={id}
                  onClick={() => jumpToResults(id)}
                  className="text-xs px-3 py-1.5 rounded bg-primary-500 text-white font-body font-semibold hover:bg-primary-600"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </section>

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

        {/* ── Result components ─────────────────────────────────────────── */}
        <section className="space-y-6 pb-8 border-b border-neutral-200">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Result components
          </h2>
          <p className="text-xs text-neutral-400 font-body -mt-4">
            Use the &quot;Jump to results&quot; shortcuts above to see the full results page.
          </p>

          {/* Full match card */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">NeighbourhoodMatchCard — full card</p>
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-5">
              <NeighbourhoodMatchCard
                neighbourhood={mountPleasant}
                score={94}
                matches={['Walkable', 'Social energy', 'Cultural diversity']}
                gaps={['Quiet streets']}
                analogousText={mountPleasant.analogousComparisons['Dublin_The Liberties'] ?? mountPleasant.analogousComparisons['default']}
                bedroomKey="oneBed"
                onCta={() => alert('→ /result/listing')}
              />
            </div>
          </div>

          {/* Individual sub-components */}
          {/* MatchSignalPills */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">MatchSignalPills</p>
            <MatchSignalPills
              matches={['Walkable', 'Social energy', 'Cultural diversity']}
              gaps={['Nature access']}
            />
          </div>

          {/* AnalogousComparisonBlock */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">AnalogousComparisonBlock</p>
            <AnalogousComparisonBlock text="If you loved The Liberties in Dublin — the mix of old pubs, new studios, and a street that still remembers what it used to be — Mount Pleasant will feel like a version of that. Less grit, more coffee, but the same sense that the neighbourhood is still in the middle of becoming something." />
          </div>

          {/* CommunityVoiceBlock */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">CommunityVoiceBlock</p>
            <CommunityVoiceBlock quote="I moved here thinking I’d stay a year. That was seven years ago. The street still surprises me." />
          </div>

          {/* SecondaryMatchCard */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">SecondaryMatchCard</p>
            <SecondaryMatchCard
              neighbourhood={westEnd}
              score={87}
              matches={['Walkable', 'Social energy']}
              gaps={['Quiet streets']}
            />
          </div>
        </section>

        {/* ── Quiz components ────────────────────────────────────────────── */}
        <section className="space-y-6 pb-8 border-b border-neutral-200">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Quiz components
          </h2>

          {/* AptLogoHorizontal */}
          <div className="space-y-3">
            <p className="text-xs text-neutral-400 font-body">AptLogoHorizontal — scheme variants</p>
            <div className="flex flex-col gap-3">
              <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                <p className="text-[10px] text-neutral-400 font-body mb-2">light (on cream)</p>
                <AptLogoHorizontal scheme="light" size="sm" />
              </div>
              <div className="bg-neutral-900 p-3 rounded-md">
                <p className="text-[10px] text-neutral-400 font-body mb-2">dark (on dark)</p>
                <AptLogoHorizontal scheme="dark" size="sm" />
              </div>
              <div className="bg-primary-400 p-3 rounded-md">
                <p className="text-[10px] text-apt-cream font-body mb-2">mono (on terracotta phase card)</p>
                <AptLogoHorizontal scheme="mono" size="sm" />
              </div>
            </div>
          </div>

          {/* ProgressBar */}
          <div className="space-y-3">
            <p className="text-xs text-neutral-400 font-body">ProgressBar — 11 questions in 3 phase groups (5 + 5 + 1)</p>
            <ProgressBar currentStep={pipStep} />
            <input
              type="range" min={1} max={11} value={pipStep}
              onChange={(e) => setPipStep(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex gap-2 flex-wrap">
              {[1, 5, 6, 10, 11].map((s) => (
                <button key={s} onClick={() => setPipStep(s)}
                  className="text-xs px-2 py-1 rounded bg-neutral-100 font-mono hover:bg-neutral-200">
                  Q{s}
                </button>
              ))}
            </div>
          </div>

          {/* Phase pill — rendered via PhasePill component (same as QuizLayout) */}
          <div className="space-y-3">
            <p className="text-xs text-neutral-400 font-body">PhasePill — auto-synced from component</p>
            {([1, 2, 3] as const).map((phase) => (
              <PhasePill key={phase} phase={phase} />
            ))}
          </div>

          {/* QuizQuestion */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">QuizQuestion</p>
            <QuizQuestion headline="What&apos;s bringing you to Vancouver?">
              <SingleSelectOptions
                options={REASON_OPTIONS}
                value={singleVal}
                onChange={setSingleVal}
                escapeFreeText={singleEscape}
                onEscapeChange={setSingleEscape}
              />
            </QuizQuestion>
          </div>

          {/* WhyWeAskToggle */}
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 font-body">WhyWeAskToggle — pinned above Continue in QuizLayout footer</p>
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
              <WhyWeAskToggle text="Where you live shapes everything from your commute to your social life. This helps us weight the neighbourhoods that actually fit how you move through the city." />
            </div>
          </div>

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

          {/* ContinueButton */}
          <div className="space-y-3">
            <p className="text-xs text-neutral-400 font-body">ContinueButton — disabled / enabled / last step</p>
            <ContinueButton step={1} disabled={true} onClick={() => {}} />
            <ContinueButton step={1} disabled={false} onClick={() => {}} />
            <ContinueButton step={11} disabled={false} onClick={() => {}} />
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

        {/* ── Colour tokens — auto-synced from src/tokens.ts ────────────── */}
        <section className="space-y-4">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Colour tokens <span className="normal-case font-normal">(from src/tokens.ts)</span>
          </h2>
          {(Object.entries(colors) as [string, Record<string, string>][]).map(([group, shades]) => (
            <div key={group}>
              <p className="font-body text-xs text-neutral-400 mb-1.5">{group}</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(shades).map(([shade, hex]) => (
                  <div key={shade} className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-md border border-neutral-200"
                      style={{ backgroundColor: hex }}
                      title={`${group}-${shade}: ${hex}`}
                    />
                    <span className="font-mono text-[10px] text-neutral-400">{shade}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── Typography ────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-body text-xs font-semibold tracking-widest text-neutral-400 uppercase">
            Typography
          </h2>
          <p className="font-display text-4xl font-bold">Display bold — Lora</p>
          <p className="font-display text-4xl font-bold italic">Display bold italic — Lora</p>
          <p className="font-display text-2xl">Display regular — Lora</p>
          <p className="font-body text-base">Body regular — Figtree</p>
          <p className="font-body text-sm font-semibold">Body semibold — Figtree</p>
          <p className="font-body text-xs text-neutral-400 tracking-widest uppercase">
            Label / caption style — Figtree
          </p>
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
            placeholder="e.g. It’s loud and a bit chaotic but in a good way. Old buildings, cheap food, artists moving in…"
          />
        </section>

      </div>
    </div>
  )
}
