'use client'

import { DIMENSIONS, SECTION_COLORS } from '@/lib/acuity-types'
import type { DimensionId, DimensionScore } from '@/lib/acuity-types'

interface DimensionListFallbackProps {
  scores: Partial<Record<DimensionId, DimensionScore>>
}

export default function DimensionListFallback({ scores }: DimensionListFallbackProps) {
  return (
    <div className="w-full">
      <div className="space-y-2">
        {DIMENSIONS.map((dim) => {
          const score = scores[dim.id]?.normalized ?? 0
          const color = SECTION_COLORS[dim.section]
          return (
            <div key={dim.id} className="flex items-center gap-3">
              <span className="text-xs text-[#888] w-20 shrink-0">{dim.label}</span>
              <div className="flex-1 h-4 bg-[#222] rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{ width: `${score}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-xs text-[#888] w-8 text-right">{score}</span>
            </div>
          )
        })}
      </div>
      <p className="text-[#666] text-xs mt-4 text-center">
        View constellation on a larger screen for the full experience
      </p>
    </div>
  )
}
