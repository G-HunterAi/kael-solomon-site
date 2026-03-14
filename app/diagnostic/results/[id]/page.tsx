'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { AssessmentResult, DimensionId, DimensionScore } from '@/lib/acuity-types'
import { SECTION_COLORS } from '@/lib/acuity-types'
import ArchetypeHero from '@/components/diagnostic/ArchetypeHero'
import NarrativeBlock from '@/components/diagnostic/NarrativeBlock'
import DimensionAccordion from '@/components/diagnostic/DimensionAccordion'
import GapCard from '@/components/diagnostic/GapCard'
import SaveShareBlock from '@/components/diagnostic/SaveShareBlock'
import DimensionListFallback from '@/components/diagnostic/DimensionListFallback'

const ConstellationChart = dynamic(
  () => import('@/components/diagnostic/ConstellationChart'),
  { ssr: false }
)

function useWindowWidth() {
  const [width, setWidth] = useState(1024)
  useEffect(() => {
    setWidth(window.innerWidth)
    function handle() { setWidth(window.innerWidth) }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return width
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(true)
  const width = useWindowWidth()

  useEffect(() => {
    const stored = localStorage.getItem(`acuity_result_${params.id}`)
    setResult(stored ? JSON.parse(stored) : null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase animate-pulse">
          Loading constellation...
        </p>
      </div>
    )
  }

  // Fallback for shared URLs where localStorage is empty
  if (!result) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">
          Results Not Found
        </p>
        <h1 className="text-[#e8e8e8] text-2xl font-light mb-4 text-center">
          These results aren&apos;t available on this device
        </h1>
        <p className="text-[#888] text-center max-w-md mb-8">
          ACUITY results are stored locally in your browser. If you opened this link on
          a different device, or your browser data was cleared, the results can&apos;t be
          retrieved.
        </p>
        <Link
          href="/diagnostic/assessment"
          className="border border-[#c9a84c] text-[#c9a84c] px-6 py-3 text-sm hover:bg-[#c9a84c]/10 transition-colors"
        >
          Take the assessment &rarr;
        </Link>
      </div>
    )
  }

  const completedDate = new Date(result.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const resultUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/diagnostic/results/${result.id}`
    : ''

  const gapsToShow = result.gaps.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">
            Acuity Profile
          </p>
          <h1 className="text-[#e8e8e8] text-3xl md:text-5xl font-light mb-3">
            Your Capability Constellation
          </h1>
          <p className="text-[#666] text-sm">
            {completedDate} &middot; Lite Assessment
          </p>
          <div className="w-16 h-px bg-[#c9a84c] mx-auto mt-6" />
        </div>

        {/* Archetype */}
        <ArchetypeHero
          primary={result.archetype.primary}
          description={result.archetype.description}
          signatures={result.archetype.signatures}
          conflictNote={result.archetype.conflictNote}
        />

        {/* Constellation Chart */}
        <div className="flex justify-center mb-12">
          {width >= 500 ? (
            <ConstellationChart
              scores={result.scores as Record<DimensionId, DimensionScore>}
            />
          ) : (
            <DimensionListFallback
              scores={result.scores as Record<DimensionId, DimensionScore>}
            />
          )}
        </div>

        {/* Section Score Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {([
            { label: 'Cognitive Foundation', score: result.sectionScores.cognitive, color: SECTION_COLORS.cognitive },
            { label: 'Applied Intelligence', score: result.sectionScores.applied, color: SECTION_COLORS.applied },
            { label: 'Character & Generative', score: result.sectionScores.character, color: SECTION_COLORS.character },
          ]).map((card) => (
            <div key={card.label} className="border border-[#222] rounded-lg p-5 text-center">
              <p className="text-xs tracking-wider mb-2" style={{ color: card.color }}>
                {card.label}
              </p>
              <p className="text-[#e8e8e8] text-2xl font-light mb-2">{card.score}</p>
              <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${card.score}%`, backgroundColor: card.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Narrative */}
        <NarrativeBlock narrative={result.narrative} />

        {/* Dimension Breakdown */}
        <DimensionAccordion
          scores={result.scores as Record<DimensionId, DimensionScore>}
        />

        {/* Gap Cards */}
        {gapsToShow.length > 0 && (
          <div className="mb-16">
            <h2 className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6 max-w-2xl mx-auto">
              Where to Develop Next
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {gapsToShow.map((dimId) => (
                <GapCard
                  key={dimId}
                  dimensionId={dimId}
                  score={result.scores[dimId]?.normalized ?? 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* myOS CTA */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="border border-[#c9a84c]/30 rounded-lg p-6 text-center">
            <p className="text-[#e8e8e8] text-lg font-light mb-2">
              This is a snapshot. myOS turns it into a signal.
            </p>
            <p className="text-[#888] text-sm leading-relaxed mb-4">
              Track your constellation over time. Correlate your scores with sleep,
              stress, and routine data. See what actually moves your dimensions.
            </p>
            <span className="text-[#c9a84c] text-sm">
              Explore myOS &rarr;
            </span>
          </div>
        </div>

        {/* Save & Share */}
        <SaveShareBlock archetypeName={result.archetype.primary} resultUrl={resultUrl} />

        {/* Retake CTA */}
        <div className="text-center pb-12">
          <p className="text-[#888] text-sm mb-2">
            Retake in 90 days to track your growth
          </p>
          <p className="text-[#666] text-xs">
            Your constellation will expand as you develop your gaps
          </p>
          <Link
            href="/diagnostic"
            className="inline-block mt-6 text-[#c9a84c] text-sm hover:underline"
          >
            &larr; Back to ACUITY
          </Link>
        </div>
      </div>
    </div>
  )
}
