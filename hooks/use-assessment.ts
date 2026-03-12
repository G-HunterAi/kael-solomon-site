'use client';

import { useState, useCallback } from 'react';

export type AssessmentPhase = 'intro' | 'questions' | 'review' | 'submitting' | 'results' | 'error';

export interface AssessmentResponse {
  questionId: string;
  element: string;
  value?: number;
  subValues?: Record<string, number>;
  textValue?: string;
  selectedValue?: string;
}

export interface ElementScore {
  element: string;
  score: number;
  notes?: string;
}

export interface AssessmentState {
  phase: AssessmentPhase;
  stepIndex: number;
  responses: Record<string, AssessmentResponse>;
  results: ElementScore[] | null;
  error: string | null;
  loading: boolean;
}

interface UseAssessmentOptions {
  totalSteps: number;
  apiEndpoint: string;
  toolName: string;
}

export function useAssessment({ totalSteps, apiEndpoint, toolName }: UseAssessmentOptions) {
  const [state, setState] = useState<AssessmentState>({
    phase: 'intro',
    stepIndex: 0,
    responses: {},
    results: null,
    error: null,
    loading: false,
  });

  const setPhase = useCallback((phase: AssessmentPhase) => {
    setState((s) => ({ ...s, phase, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    setState((s) => {
      const next = s.stepIndex + 1;
      if (next >= totalSteps) {
        return { ...s, phase: 'review' };
      }
      return { ...s, stepIndex: next };
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setState((s) => ({
      ...s,
      stepIndex: Math.max(0, s.stepIndex - 1),
    }));
  }, []);

  const goToStep = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      stepIndex: Math.max(0, Math.min(totalSteps - 1, index)),
      phase: 'questions',
    }));
  }, [totalSteps]);

  const setResponse = useCallback((questionId: string, response: Omit<AssessmentResponse, 'questionId'>) => {
    setState((s) => ({
      ...s,
      responses: {
        ...s.responses,
        [questionId]: { questionId, ...response },
      },
    }));
  }, []);

  const submit = useCallback(async () => {
    setState((s) => ({ ...s, phase: 'submitting', loading: true, error: null }));

    try {
      const responses = Object.values(state.responses);
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses, toolName }),
      });

      const data = await res.json();

      if (!data.ok) {
        setState((s) => ({
          ...s,
          phase: 'error',
          loading: false,
          error: data.error?.message || 'Submission failed',
        }));
        return;
      }

      setState((s) => ({
        ...s,
        phase: 'results',
        loading: false,
        results: data.data?.scores || data.data?.results || [],
      }));
    } catch {
      setState((s) => ({
        ...s,
        phase: 'error',
        loading: false,
        error: 'Something went wrong. Please try again.',
      }));
    }
  }, [state.responses, apiEndpoint, toolName]);

  const reset = useCallback(() => {
    setState({
      phase: 'intro',
      stepIndex: 0,
      responses: {},
      results: null,
      error: null,
      loading: false,
    });
  }, []);

  const completedSteps = Object.keys(state.responses).length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return {
    ...state,
    setPhase,
    nextStep,
    prevStep,
    goToStep,
    setResponse,
    submit,
    reset,
    completedSteps,
    progress,
    totalSteps,
  };
}
