'use client'

interface SectionIntroProps {
  section: 'cognitive' | 'applied' | 'character'
  number: 1 | 2 | 3
  onContinue: () => void
}

const SECTION_DATA = {
  cognitive: {
    title: 'Cognitive Foundation',
    description: 'Memory, language, and logical reasoning \u2014 the architecture that supports everything else.',
    color: '#7c6fcd',
  },
  applied: {
    title: 'Applied Intelligence',
    description: 'How you judge situations, execute decisions, adapt to feedback, regulate under pressure, and navigate real-world complexity.',
    color: '#c9a84c',
  },
  character: {
    title: 'Character & Generative',
    description: 'Creative capacity, self-awareness accuracy, and values clarity \u2014 the dimensions that define who you are, not just what you can do.',
    color: '#4a9eff',
  },
}

export default function SectionIntro({ section, number, onContinue }: SectionIntroProps) {
  const data = SECTION_DATA[section]
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 animate-fade-in">
      <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: data.color }}>
        Section {number}
      </p>
      <h2 className="text-[#e8e8e8] text-3xl md:text-4xl font-light mb-4 text-center">
        {data.title}
      </h2>
      <p className="text-[#888] text-center max-w-lg mb-12 leading-relaxed">
        {data.description}
      </p>
      <button
        onClick={onContinue}
        className="border border-[#333] text-[#888] px-8 py-3 text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
