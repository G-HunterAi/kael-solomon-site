'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { DIMENSIONS, SECTION_COLORS } from '@/lib/acuity-types'
import type { DimensionId, DimensionScore, Section } from '@/lib/acuity-types'

interface ConstellationChartProps {
  scores: Partial<Record<DimensionId, DimensionScore>>
  size?: number
}

function CustomTick({
  x,
  y,
  payload,
}: {
  x: number
  y: number
  payload: { value: string }
}) {
  const dim = DIMENSIONS.find((d) => d.label === payload.value)
  const color = dim ? SECTION_COLORS[dim.section] : '#888'
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={11}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {payload.value}
    </text>
  )
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: { fullLabel: string; score: number; section: Section } }>
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-[#111] border border-[#333] rounded px-3 py-2 text-xs">
      <p className="text-[#e8e8e8] font-medium">{data.fullLabel}</p>
      <p style={{ color: SECTION_COLORS[data.section] }}>{data.score}/100</p>
    </div>
  )
}

export default function ConstellationChart({ scores, size }: ConstellationChartProps) {
  const data = DIMENSIONS.map((dim) => ({
    label: dim.label,
    fullLabel: dim.fullLabel,
    score: scores[dim.id]?.normalized ?? 0,
    section: dim.section,
  }))

  const chartSize = size ?? 500

  return (
    <div className="w-full" style={{ maxWidth: chartSize }}>
      <ResponsiveContainer width="100%" aspect={1}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#222" />
          <PolarAngleAxis dataKey="label" tick={CustomTick as never} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#c9a84c"
            fill="#c9a84c"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTION_COLORS.cognitive }} />
          Cognitive Foundation
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTION_COLORS.applied }} />
          Applied Intelligence
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTION_COLORS.character }} />
          Character & Generative
        </span>
      </div>
    </div>
  )
}
