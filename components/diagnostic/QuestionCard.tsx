'use client'

import { useMemo } from 'react'
import type { Question, Option } from '@/lib/acuity-types'
import OptionCard from './OptionCard'

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  for (let i = result.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash + i) | 0
    const j = Math.abs(hash) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

interface QuestionCardProps {
  question: Question
  sessionSeed: string
  selectedOption?: 'a' | 'b' | 'c' | 'd'
  onSelect: (option: Option) => void
}

export default function QuestionCard({
  question,
  sessionSeed,
  selectedOption,
  onSelect,
}: QuestionCardProps) {
  const shuffledOptions = useMemo(() => {
    if (!question.options) return []
    const seed = question.id + sessionSeed
    return seededShuffle(question.options, seed)
  }, [question.id, question.options, sessionSeed])

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <p className="text-[#e8e8e8] text-base md:text-lg leading-loose mb-2 whitespace-pre-line">
        {question.scenario}
      </p>
      {question.prompt && (
        <p className="text-[#c9a84c] text-base md:text-lg leading-relaxed mb-6 mt-4 font-medium">
          {question.prompt}
        </p>
      )}
      <div className="space-y-3 mt-6">
        {shuffledOptions.map((opt, i) => {
          const displayLabel = String.fromCharCode(97 + i) // a, b, c, d
          return (
            <OptionCard
              key={opt.label}
              label={displayLabel}
              text={opt.text}
              selected={selectedOption === opt.label}
              onClick={() => onSelect(opt)}
            />
          )
        })}
      </div>
    </div>
  )
}
