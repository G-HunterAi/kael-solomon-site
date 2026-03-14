'use client'

interface NarrativeBlockProps {
  narrative: string
}

export default function NarrativeBlock({ narrative }: NarrativeBlockProps) {
  return (
    <div className="max-w-2xl mx-auto mb-16">
      <h2 className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">
        What Your Constellation Shows
      </h2>
      <div className="text-[#e8e8e8] text-base leading-loose space-y-4">
        {narrative.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  )
}
