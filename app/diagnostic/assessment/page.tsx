'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { AssessmentProvider, useAssessment } from '@/components/diagnostic/AssessmentContext'
import QuestionCard from '@/components/diagnostic/QuestionCard'
import ProgressHeader from '@/components/diagnostic/ProgressHeader'
import BreakScreen from '@/components/diagnostic/BreakScreen'
import SectionIntro from '@/components/diagnostic/SectionIntro'
import MemorySourceCard from '@/components/diagnostic/MemorySourceCard'
import ConstellationReveal from '@/components/diagnostic/ConstellationReveal'
import ResumeModal from '@/components/diagnostic/ResumeModal'
import { getQuestionById } from '@/data/acuity-questions'
import { calculateScores, calculateSectionScores, detectOutliers, detectGaps, assessValidity } from '@/lib/acuity-scoring'
import { assignArchetype } from '@/lib/acuity-archetypes'
import { generateNarrative } from '@/lib/acuity-narrative'
import type { AssessmentResult } from '@/lib/acuity-types'

function AssessmentFlow() {
  const router = useRouter()
  const {
    state,
    dispatch,
    currentScreen,
    getResponseFor,
    hasInProgressSession,
    restoreSession,
    startFresh,
  } = useAssessment()

  // Start question timer when a question screen appears
  useEffect(() => {
    if (currentScreen.type === 'question') {
      dispatch({ type: 'START_QUESTION_TIMER' })
    }
  }, [currentScreen, dispatch])

  const handleNext = useCallback(() => {
    dispatch({ type: 'NEXT_SCREEN' })
  }, [dispatch])

  const handlePrev = useCallback(() => {
    dispatch({ type: 'PREV_SCREEN' })
  }, [dispatch])

  const handleComplete = useCallback(() => {
    const scores = calculateScores(state.responses)
    const sectionScores = calculateSectionScores(scores)
    const outliers = detectOutliers(scores)
    const gaps = detectGaps(scores)
    const validity = assessValidity(state.responses)
    const archetype = assignArchetype(scores)
    const narrative = generateNarrative(scores, sectionScores.overall, archetype.primary, gaps)

    // Mark outliers in scores
    for (const outlier of outliers) {
      const s = scores[outlier.dimension]
      if (s) s.isOutlier = true
    }

    const resultId = nanoid(8)
    const now = new Date().toISOString()
    const startTime = new Date(state.startedAt).getTime()
    const timeTaken = Math.round((Date.now() - startTime) / 1000)

    const result: AssessmentResult = {
      id: resultId,
      startedAt: state.startedAt,
      completedAt: now,
      timeTakenSeconds: timeTaken,
      questionOrder: state.responses.map((r) => r.questionId),
      version: 'lite',
      appVersion: '1.0.0',
      responses: state.responses,
      scores,
      sectionScores,
      archetype: {
        primary: archetype.primary,
        description: archetype.description,
        signatures: outliers.length > 0 ? outliers : undefined,
      },
      narrative,
      gaps,
      validity,
    }

    // Save to localStorage
    localStorage.setItem(`acuity_result_${resultId}`, JSON.stringify(result))
    localStorage.setItem('acuity_latest_result_id', resultId)
    localStorage.removeItem('acuity_in_progress')

    // Increment completed counter
    const completedCount = parseInt(localStorage.getItem('acuity_sessions_completed') || '0', 10)
    localStorage.setItem('acuity_sessions_completed', String(completedCount + 1))

    router.push(`/diagnostic/results/${resultId}`)
  }, [state.responses, state.startedAt, router])

  // Show resume modal if there's an in-progress session
  if (hasInProgressSession) {
    const saved = localStorage.getItem('acuity_in_progress')
    const answeredCount = saved ? JSON.parse(saved).responses?.length ?? 0 : 0
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <ResumeModal
          answeredCount={answeredCount}
          onResume={restoreSession}
          onStartOver={startFresh}
        />
      </div>
    )
  }

  // Welcome screen
  if (currentScreen.type === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 animate-fade-in">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">
          Acuity Profile
        </p>
        <h1 className="text-[#e8e8e8] text-3xl md:text-4xl font-light text-center mb-6 max-w-lg">
          Capability Constellation Assessment
        </h1>
        <p className="text-[#888] text-center max-w-md mb-12 leading-relaxed">
          You&apos;ll answer 18 scenario-based questions. Take as long as you need on
          each. There are no trick questions. Answer based on what you&apos;d actually
          do.
        </p>
        <button
          onClick={() => {
            // Increment started counter
            const startedCount = parseInt(
              localStorage.getItem('acuity_sessions_started') || '0',
              10
            )
            localStorage.setItem('acuity_sessions_started', String(startedCount + 1))
            dispatch({ type: 'START' })
          }}
          className="bg-[#c9a84c] text-[#0a0a0a] px-8 py-4 text-sm font-medium hover:bg-[#d4b35a] transition-colors"
        >
          Begin Assessment
        </button>
      </div>
    )
  }

  // Section intros
  if (currentScreen.type === 'sectionIntro') {
    return (
      <SectionIntro
        section={currentScreen.section}
        number={currentScreen.number}
        onContinue={handleNext}
      />
    )
  }

  // Memory source
  if (currentScreen.type === 'memorySource') {
    return <MemorySourceCard onContinue={handleNext} />
  }

  // Break screens
  if (currentScreen.type === 'break') {
    return <BreakScreen quote={currentScreen.quote} onContinue={handleNext} />
  }

  // Submission / reveal
  if (currentScreen.type === 'submission') {
    const scores = calculateScores(state.responses)
    const archetype = assignArchetype(scores)
    return (
      <ConstellationReveal archetypeName={archetype.primary} onComplete={handleComplete} />
    )
  }

  // Question screen
  if (currentScreen.type === 'question') {
    const question = getQuestionById(currentScreen.questionId)
    if (!question) return null

    const existingResponse = getResponseFor(currentScreen.questionId)

    return (
      <div className="min-h-screen bg-[#0a0a0a] px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <ProgressHeader
            sectionLabel={currentScreen.sectionLabel}
            questionNumber={currentScreen.questionNumber}
            screenIndex={state.screenIndex}
          />
          <QuestionCard
            question={question}
            sessionSeed={state.sessionSeed}
            selectedOption={existingResponse?.selectedOption}
            onSelect={(option) => {
              dispatch({
                type: 'ANSWER',
                questionId: question.id,
                dimensionId: question.dimension,
                format: question.format,
                selectedOption: option.label,
                tier: option.tier,
              })
            }}
          />
          <div className="flex items-center justify-between mt-8 max-w-3xl mx-auto">
            <button
              onClick={handlePrev}
              className="text-[#666] text-sm hover:text-[#888] transition-colors"
            >
              &larr; Back
            </button>
            <button
              onClick={handleNext}
              disabled={!existingResponse && !getResponseFor(currentScreen.questionId)}
              className={`px-6 py-3 text-sm transition-colors ${
                existingResponse || getResponseFor(currentScreen.questionId)
                  ? 'bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#d4b35a]'
                  : 'bg-[#333] text-[#666] cursor-not-allowed'
              }`}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default function AssessmentPage() {
  return (
    <AssessmentProvider>
      <AssessmentFlow />
    </AssessmentProvider>
  )
}
