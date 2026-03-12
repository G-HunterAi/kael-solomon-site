'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { ScaleInput } from '@/components/ui/scale-input';
import {
  detectFluxState,
  FLUX_DESCRIPTIONS,
  type FluxState,
} from '@/lib/career/scoring';

type Phase = 'intro' | 'questions' | 'results' | 'error';

interface FluxResponses {
  clarity: number | null;
  authority: number | null;
  state: number | null;
  capacity: number | null;
  repetition: number | null;
  recentJobChange: boolean | null;
  recentDecisionCount: number | null;
}

const QUESTIONS = [
  {
    id: 'clarity',
    text: 'How clear are you about what you want in your career right now?',
    subtext: '1 = Completely unclear, 10 = Crystal clear about my direction',
    type: 'scale' as const,
  },
  {
    id: 'authority',
    text: 'How much control do you feel you have over your career trajectory?',
    subtext: '1 = No control (driven by circumstances), 10 = Full control (driving my own path)',
    type: 'scale' as const,
  },
  {
    id: 'state',
    text: 'Overall, how would you rate your current state of well-being and alignment?',
    subtext: '1 = Misaligned and stressed, 10 = Perfectly aligned and thriving',
    type: 'scale' as const,
  },
  {
    id: 'capacity',
    text: 'How much capacity do you have to take action on career changes right now?',
    subtext: '1 = No capacity (too constrained), 10 = Full capacity (ready to move)',
    type: 'scale' as const,
  },
  {
    id: 'repetition',
    text: 'How often do you find yourself in the same difficult patterns or loops?',
    subtext: '1 = Always stuck in loops, 10 = Breaking patterns and progressing',
    type: 'scale' as const,
  },
  {
    id: 'recentJobChange',
    text: 'Have you experienced a recent job change, layoff, or major external disruption?',
    subtext: 'In the last 6 months',
    type: 'toggle' as const,
  },
  {
    id: 'recentDecisionCount',
    text: 'How many significant career decisions or explorations have you made recently?',
    subtext: '(0 = None, 1-2 = Few, 3+ = Many)',
    type: 'scale' as const,
  },
];

export default function FluxStateAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<FluxResponses>({
    clarity: null,
    authority: null,
    state: null,
    capacity: null,
    repetition: null,
    recentJobChange: null,
    recentDecisionCount: null,
  });
  const [result, setResult] = useState<{
    state: FluxState;
    confidence: number;
    reasoning: string;
  } | null>(null);

  const currentQuestion = QUESTIONS[questionIndex];
  const totalQuestions = QUESTIONS.length;

  const setResponse = useCallback((questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const canProceed = useCallback(() => {
    if (!currentQuestion) return false;
    const resp = responses[currentQuestion.id as keyof FluxResponses];
    return resp != null;
  }, [currentQuestion, responses]);

  const handleNext = useCallback(() => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      // Calculate flux state
      const elements = {
        clarity: responses.clarity || 5,
        authority: responses.authority || 5,
        state: responses.state || 5,
        capacity: responses.capacity || 5,
        repetition: responses.repetition || 5,
      };

      const detection = detectFluxState(
        elements,
        responses.recentDecisionCount || 0,
        responses.recentJobChange || false
      );

      setResult(detection);
      setPhase('results');
    }
  }, [questionIndex, totalQuestions, responses]);

  const handlePrev = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    }
  }, [questionIndex]);

  // ── INTRO PHASE ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Flux State Assessment" subtitle="Identify your career transition state" duration="~2 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Your flux state describes where you are in your career transition journey. Are you
            stalled, forced into change, actively seeking, pivoting with purpose, scaling up,
            disrupted by external forces, or stable and aligned?
          </p>
          <p className="text-sm text-surface-500">
            Understanding your current flux state helps you recognize what type of support and
            resources you need most right now.
          </p>
          <div className="pt-2">
            <button onClick={() => setPhase('questions')} className="btn-primary">
              Begin Assessment
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // ── RESULTS PHASE ──
  if (phase === 'results' && result) {
    const stateDesc = FLUX_DESCRIPTIONS[result.state];

    return (
      <ToolShell title="Flux State Assessment" subtitle="Your Current State">
        <div className="space-y-6">
          {/* Primary flux state */}
          <div
            className="card border-l-4 p-6"
            style={{ borderColor: stateDesc.color, backgroundColor: `${stateDesc.color}15` }}
          >
            <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">Your Flux State</p>
            <h2 className="text-3xl font-bold text-surface-900 mb-2">{stateDesc.label}</h2>
            <p className="text-sm text-surface-700 mb-4">{stateDesc.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: stateDesc.color }}
              />
              <span className="text-surface-600">
                Confidence: <strong>{Math.round(result.confidence * 100)}%</strong>
              </span>
            </div>
          </div>

          {/* Reasoning */}
          <div className="card bg-surface-50">
            <p className="text-sm font-medium text-surface-900 mb-2">How We Got Here</p>
            <p className="text-sm text-surface-700">{result.reasoning}</p>
          </div>

          {/* State Descriptions */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-900 mb-4">All Flux States</h3>
            <div className="space-y-3">
              {Object.entries(FLUX_DESCRIPTIONS).map(([key, desc]) => (
                <div
                  key={key}
                  className={`p-3 rounded border transition-colors ${
                    key === result.state
                      ? 'bg-brand-50 border-brand-300'
                      : 'bg-surface-50 border-surface-200'
                  }`}
                >
                  <p className="text-sm font-medium text-surface-900 flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: desc.color }}
                    />
                    {desc.label}
                  </p>
                  <p className="text-xs text-surface-600 mt-1">{desc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="card bg-emerald-50 border border-emerald-200">
            <p className="text-sm font-medium text-emerald-900 mb-2">What This Means</p>
            <p className="text-sm text-emerald-800">
              Your {stateDesc.label} state suggests you should focus on activities that address your
              current bottleneck. Whether that's clarifying direction, building capacity, or taking
              decisive action depends on where you are.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResponses({
                  clarity: null,
                  authority: null,
                  state: null,
                  capacity: null,
                  repetition: null,
                  recentJobChange: null,
                  recentDecisionCount: null,
                });
                setQuestionIndex(0);
                setResult(null);
                setPhase('intro');
              }}
              className="btn-secondary flex-1"
            >
              Retake Assessment
            </button>
            <button onClick={() => router.push('/map')} className="btn-primary flex-1">
              Back to Tools
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // ── QUESTIONS PHASE ──
  return (
    <ToolShell
      title={currentQuestion.text}
      subtitle="Flux State Assessment"
      currentStep={questionIndex}
      totalSteps={totalQuestions}
    >
      <div className="card space-y-6">
        <div className="space-y-3">
          {currentQuestion.subtext && (
            <p className="text-xs text-surface-400">{currentQuestion.subtext}</p>
          )}

          {currentQuestion.type === 'scale' && (
            <ScaleInput
              value={(responses[currentQuestion.id as keyof FluxResponses] as number | null) ?? null}
              onChange={(value) => setResponse(currentQuestion.id, value)}
              min={1}
              max={10}
              lowLabel="Not at all"
              highLabel="Completely"
            />
          )}

          {currentQuestion.type === 'toggle' && (
            <div className="flex gap-3">
              <button
                onClick={() => setResponse(currentQuestion.id, true)}
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                  responses[currentQuestion.id as keyof FluxResponses] === true
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setResponse(currentQuestion.id, false)}
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                  responses[currentQuestion.id as keyof FluxResponses] === false
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                No
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <button
            onClick={handlePrev}
            disabled={questionIndex === 0}
            className="btn-secondary flex-1"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary flex-1"
          >
            {questionIndex === totalQuestions - 1 ? 'Get Results' : 'Next'}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
