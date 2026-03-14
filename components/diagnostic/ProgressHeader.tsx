'use client'

import { LITE_SCREEN_SEQUENCE } from '@/lib/acuity-sequence'

interface ProgressHeaderProps {
  sectionLabel: string
  questionNumber: number
  screenIndex: number
}

export default function ProgressHeader({ sectionLabel, questionNumber, screenIndex }: ProgressHeaderProps) {
  // Time remaining: (18 - currentQ) * 72 + remaining non-question screens * 30 seconds
  const remainingScreens = LITE_SCREEN_SEQUENCE.slice(screenIndex + 1)
  const nonQuestionScreens = remainingScreens.filter(
    (s) => s.type !== 'question' && s.type !== 'submission'
  ).length
  const remainingQuestions = 18 - questionNumber
  const remainingSeconds = remainingQuestions * 72 + nonQuestionScreens * 30
  const remainingMinutes = Math.max(1, Math.round(remainingSeconds / 60))

  const progress = (questionNumber / 18) * 100

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[#666] tracking-wide">{sectionLabel}</span>
          <span className="text-[#888]">Question {questionNumber} of 18</span>
        </div>
        <span className="text-[#666]">~{remainingMinutes} min remaining</span>
      </div>
      <div className="w-full h-0.5 bg-[#222] rounded-full">
        <div
          className="h-full bg-[#c9a84c] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={questionNumber}
          aria-valuemin={0}
          aria-valuemax={18}
        />
      </div>
    </div>
  )
}
