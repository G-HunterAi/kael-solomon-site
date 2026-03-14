'use client'

import type { OutlierResult } from '@/lib/acuity-scoring'

interface ArchetypeHeroProps {
  primary: string
  description: string
  signatures?: OutlierResult[]
  conflictNote?: string
}

export default function ArchetypeHero({
  primary,
  description,
  signatures,
  conflictNote,
}: ArchetypeHeroProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-[#e8e8e8] text-3xl md:text-4xl font-light tracking-wide uppercase">
        {primary}
      </h2>
      {signatures && signatures.length > 0 && (
        <p className="text-[#c9a84c] text-xl italic mt-2">
          /{' '}
          {signatures.map((s, i) => (
            <span key={s.dimension}>
              {i > 0 && ' \u00b7 '}
              {s.label}
            </span>
          ))}
        </p>
      )}
      <p className="text-[#888] text-base leading-relaxed max-w-2xl mx-auto mt-6">
        {description}
      </p>
      {conflictNote && (
        <p className="text-[#666] text-sm italic mt-4 max-w-xl mx-auto">{conflictNote}</p>
      )}
    </div>
  )
}
