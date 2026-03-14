'use client'

import { getQuestionById } from '@/data/acuity-questions'

interface MemorySourceCardProps {
  onContinue: () => void
}

export default function MemorySourceCard({ onContinue }: MemorySourceCardProps) {
  const source = getQuestionById('C1-source')

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="max-w-2xl w-full">
        <p className="text-[#666] text-xs tracking-[0.2em] uppercase mb-6">
          Background: the following came across your desk this morning.
        </p>
        <div className="border border-[#333] rounded-lg p-6 md:p-8 bg-[#111]">
          <p className="text-[#e8e8e8] text-base md:text-lg leading-loose">
            {source?.scenario}
          </p>
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={onContinue}
            className="bg-[#c9a84c] text-[#0a0a0a] px-6 py-3 text-sm font-medium hover:bg-[#d4b35a] transition-colors"
          >
            Continue &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
