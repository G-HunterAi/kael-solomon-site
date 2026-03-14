'use client'

import { useState } from 'react'
import { DIMENSIONS, SECTION_COLORS } from '@/lib/acuity-types'
import type { DimensionId, DimensionScore } from '@/lib/acuity-types'

interface DimensionAccordionProps {
  scores: Partial<Record<DimensionId, DimensionScore>>
}

function getTierLabel(normalized: number): string {
  if (normalized >= 67) return 'HIGH'
  if (normalized >= 34) return 'STRONG'
  return 'DEVELOPING'
}

function getTierColor(normalized: number): string {
  if (normalized >= 67) return '#c9a84c'
  if (normalized >= 34) return '#888'
  return '#666'
}

export default function DimensionAccordion({ scores }: DimensionAccordionProps) {
  const [expanded, setExpanded] = useState<DimensionId | null>(null)

  return (
    <div className="max-w-2xl mx-auto mb-16">
      <h2 className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">
        Dimension Breakdown
      </h2>
      <div className="space-y-1">
        {DIMENSIONS.map((dim) => {
          const score = scores[dim.id]
          const normalized = score?.normalized ?? 0
          const isExpanded = expanded === dim.id
          const color = SECTION_COLORS[dim.section]

          return (
            <div key={dim.id} className="border border-[#222] rounded">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setExpanded(isExpanded ? null : dim.id)}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-[#e8e8e8] text-sm">{dim.fullLabel}</span>
                  <span
                    className="text-xs tracking-wider"
                    style={{ color: getTierColor(normalized) }}
                  >
                    {getTierLabel(normalized)}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 h-1.5 bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${normalized}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-[#888] text-xs w-6 text-right">{normalized}</span>
                  <span className="text-[#666] text-xs">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 text-[#888] text-sm leading-relaxed">
                  {normalized >= 67
                    ? `${dim.fullLabel} is one of your genuine strengths \u2014 it operates reliably and gives you an advantage in situations where others lose ground.`
                    : normalized >= 34
                    ? `${dim.fullLabel} is functional \u2014 neither a clear strength nor a significant gap. Deliberate attention here could move it from adequate to genuinely strong.`
                    : `${dim.fullLabel} is in early development. This isn\u2019t a deficiency \u2014 it\u2019s an area where deliberate focus will produce visible growth relatively quickly.`}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
