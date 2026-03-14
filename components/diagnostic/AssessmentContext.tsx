'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { AssessmentResponse, DimensionId, QuestionFormat, Tier } from '@/lib/acuity-types'
import { LITE_SCREEN_SEQUENCE } from '@/lib/acuity-sequence'

interface SessionState {
  screenIndex: number
  responses: AssessmentResponse[]
  startedAt: string
  version: 'lite'
  questionStartTime: number | null
  sessionSeed: string
}

type Action =
  | { type: 'RESTORE_SESSION'; state: SessionState }
  | { type: 'START' }
  | { type: 'NEXT_SCREEN' }
  | { type: 'PREV_SCREEN' }
  | { type: 'ANSWER'; questionId: string; dimensionId: DimensionId; format: QuestionFormat; selectedOption: 'a' | 'b' | 'c' | 'd'; tier: Tier }
  | { type: 'START_QUESTION_TIMER' }
  | { type: 'RESET' }

function generateSeed(): string {
  return Math.random().toString(36).substring(2, 10)
}

const initialState: SessionState = {
  screenIndex: 0,
  responses: [],
  startedAt: '',
  version: 'lite',
  questionStartTime: null,
  sessionSeed: generateSeed(),
}

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'RESTORE_SESSION':
      return { ...action.state, questionStartTime: null }
    case 'START':
      return {
        ...state,
        startedAt: new Date().toISOString(),
        screenIndex: 1,
      }
    case 'NEXT_SCREEN':
      return {
        ...state,
        screenIndex: Math.min(state.screenIndex + 1, LITE_SCREEN_SEQUENCE.length - 1),
        questionStartTime: null,
      }
    case 'PREV_SCREEN':
      return {
        ...state,
        screenIndex: Math.max(state.screenIndex - 1, 0),
        questionStartTime: null,
      }
    case 'ANSWER': {
      const now = Date.now()
      const elapsed = state.questionStartTime
        ? Math.round((now - state.questionStartTime) / 1000)
        : 0

      const existing = state.responses.findIndex((r) => r.questionId === action.questionId)
      const response: AssessmentResponse = {
        questionId: action.questionId,
        dimensionId: action.dimensionId,
        format: action.format,
        selectedOption: action.selectedOption,
        tier: action.tier,
        scored: true,
        responseTimeSeconds: elapsed,
      }
      const newResponses = [...state.responses]
      if (existing >= 0) {
        newResponses[existing] = response
      } else {
        newResponses.push(response)
      }
      return { ...state, responses: newResponses }
    }
    case 'START_QUESTION_TIMER':
      return { ...state, questionStartTime: Date.now() }
    case 'RESET':
      return { ...initialState, sessionSeed: generateSeed() }
    default:
      return state
  }
}

interface AssessmentContextType {
  state: SessionState
  dispatch: React.Dispatch<Action>
  currentScreen: (typeof LITE_SCREEN_SEQUENCE)[number]
  getResponseFor: (questionId: string) => AssessmentResponse | undefined
  hasInProgressSession: boolean
  restoreSession: () => void
  startFresh: () => void
}

const AssessmentContext = createContext<AssessmentContextType | null>(null)

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [hasInProgressSession, setHasInProgressSession] = React.useState(false)
  const [initialized, setInitialized] = React.useState(false)

  // Check for in-progress session on mount
  useEffect(() => {
    const saved = localStorage.getItem('acuity_in_progress')
    if (saved) {
      try {
        const session = JSON.parse(saved) as SessionState
        if (session.responses && session.responses.length > 0) {
          setHasInProgressSession(true)
        }
      } catch {
        localStorage.removeItem('acuity_in_progress')
      }
    }
    setInitialized(true)
  }, [])

  // Persist to localStorage on every answer
  useEffect(() => {
    if (!initialized || state.responses.length === 0) return
    localStorage.setItem(
      'acuity_in_progress',
      JSON.stringify({
        screenIndex: state.screenIndex,
        responses: state.responses,
        startedAt: state.startedAt,
        version: state.version,
        sessionSeed: state.sessionSeed,
      })
    )
  }, [state.responses, state.screenIndex, state.startedAt, state.version, state.sessionSeed, initialized])

  const restoreSession = useCallback(() => {
    const saved = localStorage.getItem('acuity_in_progress')
    if (saved) {
      try {
        const session = JSON.parse(saved)
        dispatch({ type: 'RESTORE_SESSION', state: session })
        setHasInProgressSession(false)
      } catch {
        localStorage.removeItem('acuity_in_progress')
      }
    }
  }, [])

  const startFresh = useCallback(() => {
    localStorage.removeItem('acuity_in_progress')
    dispatch({ type: 'RESET' })
    setHasInProgressSession(false)
  }, [])

  const currentScreen = LITE_SCREEN_SEQUENCE[state.screenIndex]

  const getResponseFor = useCallback(
    (questionId: string) => state.responses.find((r) => r.questionId === questionId),
    [state.responses]
  )

  const contextValue = React.useMemo(
    () => ({
      state,
      dispatch,
      currentScreen,
      getResponseFor,
      hasInProgressSession,
      restoreSession,
      startFresh,
    }),
    [state, currentScreen, getResponseFor, hasInProgressSession, restoreSession, startFresh]
  )

  if (!initialized) return null

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext)
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider')
  return ctx
}
