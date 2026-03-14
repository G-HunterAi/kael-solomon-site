'use client'

interface BreakScreenProps {
  quote: string
  onContinue: () => void
}

export default function BreakScreen({ quote, onContinue }: BreakScreenProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 animate-fade-in">
      <p className="text-[#c9a84c] text-xl md:text-2xl font-light italic text-center max-w-xl leading-relaxed mb-8">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="text-[#666] text-sm mb-12">Take a breath. No time pressure here.</p>
      <button
        onClick={onContinue}
        className="border border-[#333] text-[#888] px-8 py-3 text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
