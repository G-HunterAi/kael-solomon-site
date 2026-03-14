'use client'

import { DIMENSIONS } from '@/lib/acuity-types'
import type { DimensionId } from '@/lib/acuity-types'
import { GAP_ACTIONS } from '@/lib/acuity-gap-actions'

interface GapCardProps {
  dimensionId: DimensionId
  score: number
}

export default function GapCard({ dimensionId, score }: GapCardProps) {
  const dim = DIMENSIONS.find((d) => d.id === dimensionId)
  if (!dim) return null

  return (
    <div className="border border-[#222] rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#e8e8e8] text-base font-medium">{dim.fullLabel}</h3>
        <span className="text-[#666] text-xs">{score}/100</span>
      </div>
      <p className="text-[#888] text-sm leading-relaxed mb-4">
        This is a developing dimension \u2014 one where deliberate attention will produce measurable growth.
      </p>
      <div className="border-t border-[#222] pt-4">
        <p className="text-[#c9a84c] text-xs tracking-wider uppercase mb-2">
          This week&apos;s experiment
        </p>
        <p className="text-[#e8e8e8] text-sm leading-relaxed">
          {GAP_ACTIONS[dimensionId]}
        </p>
      </div>
    </div>
  )
}
