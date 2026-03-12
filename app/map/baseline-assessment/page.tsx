'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { ResultsDisplay } from '@/components/diagnostics/results-display';
import { ScaleInput } from '@/components/ui/scale-input';
import { PercentageInput } from '@/components/ui/percentage-input';
import { SelectInput } from '@/components/ui/select-input';
import {
  ASSESSMENT_STEPS,
  computeBaselineScores,
  type AssessmentResponse,
  type ElementBaseline,
} from '@/lib/assessment/questions';

type Phase = 'intro' | 'questions' | 'review' | 'submitting' | 'results' | 'error';

export default function BaselineAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, AssessmentResponse>>({});
  const [results, setResults] = useState<ElementBaseline[]>([]);
  const [error, setError] = useState('');

  const currentStep = ASSESSMENT_STEPS[stepIndex];
  const totalSteps = ASSESSMENT_STEPS.length;

  const setResponse = useCallback((questionId: string, response: Omit<AssessmentResponse, 'questionId'>) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { questionId, ...response },
    }));
  }, []);

  const canProceed = useCallback(() => {
    if (!currentStep) return false;
    return currentStep.questions.every((q) => {
      const r = responses[q.id];
      if (!r) return false;
      switch (q.type) {
        case 'scale': return r.value != null;
        case 'percentage': return r.value != null;
        case 'multi_scale': return r.subValues && Object.keys(r.subValues).length === (q.subQuestions?.length || 0);
        case 'text': return r.textValue && r.textValue.trim().length > 0;
        case 'select': return r.selectedValue != null;
        default: return false;
      }
    });
  }, [currentStep, responses]);

  const handleNext = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setPhase('review');
    }
  }, [stepIndex, totalSteps]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  }, [stepIndex]);

  const handleSubmit = useCallback(async () => {
    setPhase('submitting');
    setError('');

    try {
      // Compute scores client-side first
      const allResponses = Object.values(responses);
      const scores = computeBaselineScores(allResponses);

      // Submit to API
      const res = await fetch('/api/v1/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: allResponses }),
      });

      const data = await res.json();

      if (data.ok) {
        setResults(data.data?.scores || scores);
      } else {
        // Use client-side scores as fallback
        setResults(scores);
      }
      setPhase('results');
    } catch {
      // Fallback to client-side scoring
      const allResponses = Object.values(responses);
      const scores = computeBaselineScores(allResponses);
      setResults(scores);
      setPhase('results');
    }
  }, [responses]);

  // ── INTRO PHASE ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Baseline Assessment" subtitle="Measure your foundational elements" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            This assessment measures your 8 foundational elements: Clarity, Authority, State, Capacity,
            Programming, Repetition, Feedback, and Time. Each element represents a different dimension
            of your personal operating system.
          </p>
          <p className="text-sm text-surface-500">
            Answer honestly — there are no right or wrong answers. This is about reading your own code,
            not performing for anyone else.
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
  if (phase === 'results') {
    const displayScores = results.map((r) => ({
      element: r.element,
      score: r.score,
      notes: r.notes,
    }));

    return (
      <ToolShell title="Baseline Assessment" subtitle="Your Results">
        <ResultsDisplay
          scores={displayScores}
          recommendations={['experiment-tracker']}
          onRetake={() => {
            setResponses({});
            setStepIndex(0);
            setResults([]);
            setPhase('intro');
          }}
          onDone={() => router.push('/map')}
        />
      </ToolShell>
    );
  }

  // ── SUBMITTING PHASE ──
  if (phase === 'submitting') {
    return (
      <ToolShell title="Baseline Assessment" subtitle="Processing...">
        <div className="card text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-brand-600" />
          <p className="mt-4 text-sm text-surface-500">Calculating your scores...</p>
        </div>
      </ToolShell>
    );
  }

  // ── REVIEW PHASE ──
  if (phase === 'review') {
    return (
      <ToolShell title="Baseline Assessment" subtitle="Review your answers">
        <div className="space-y-4">
          {ASSESSMENT_STEPS.map((step, i) => {
            const hasResponse = step.questions.every((q) => responses[q.id]);
            return (
              <button
                key={step.element}
                onClick={() => { setStepIndex(i); setPhase('questions'); }}
                className="card w-full text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${step.dotColor}`} />
                    <span className="text-sm font-medium text-surface-900">{step.title}</span>
                  </div>
                  <span className={`text-xs ${hasResponse ? 'text-emerald-600' : 'text-surface-400'}`}>
                    {hasResponse ? 'Completed' : 'Incomplete'}
                  </span>
                </div>
              </button>
            );
          })}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setStepIndex(totalSteps - 1); setPhase('questions'); }}
              className="btn-secondary flex-1"
            >
              Back to Questions
            </button>
            <button onClick={handleSubmit} className="btn-primary flex-1">
              Submit Assessment
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // ── QUESTIONS PHASE ──
  return (
    <ToolShell
      title={currentStep.title}
      subtitle={currentStep.description}
      currentStep={stepIndex}
      totalSteps={totalSteps}
    >
      <div className="card space-y-6">
        {currentStep.questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <p className="text-sm font-medium text-surface-900 leading-relaxed">
              {question.text}
            </p>
            {question.subtext && (
              <p className="text-xs text-surface-400">{question.subtext}</p>
            )}

            {/* Scale input */}
            {question.type === 'scale' && (
              <ScaleInput
                value={responses[question.id]?.value ?? null}
                onChange={(value) =>
                  setResponse(question.id, { element: question.element, value })
                }
                min={question.scaleMin}
                max={question.scaleMax}
                lowLabel={question.lowLabel || ''}
                highLabel={question.highLabel || ''}
              />
            )}

            {/* Percentage input */}
            {question.type === 'percentage' && (
              <PercentageInput
                value={responses[question.id]?.value ?? null}
                onChange={(value) =>
                  setResponse(question.id, { element: question.element, value })
                }
              />
            )}

            {/* Multi-scale (State) */}
            {question.type === 'multi_scale' && question.subQuestions && (
              <div className="space-y-4">
                {question.subQuestions.map((sub) => (
                  <div key={sub.id} className="space-y-2">
                    <p className="text-xs font-medium text-surface-600">{sub.text}</p>
                    <ScaleInput
                      value={responses[question.id]?.subValues?.[sub.id] ?? null}
                      onChange={(value) => {
                        const current = responses[question.id]?.subValues || {};
                        setResponse(question.id, {
                          element: question.element,
                          subValues: { ...current, [sub.id]: value },
                        });
                      }}
                      lowLabel={sub.lowLabel}
                      highLabel={sub.highLabel}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Text input */}
            {question.type === 'text' && (
              <textarea
                value={responses[question.id]?.textValue || ''}
                onChange={(e) =>
                  setResponse(question.id, { element: question.element, textValue: e.target.value })
                }
                className="input min-h-[100px] resize-y"
                placeholder="Type your response..."
              />
            )}

            {/* Select input */}
            {question.type === 'select' && question.options && (
              <SelectInput
                value={responses[question.id]?.selectedValue ?? null}
                onChange={(value) =>
                  setResponse(question.id, { element: question.element, selectedValue: value })
                }
                options={question.options}
              />
            )}
          </div>
        ))}

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <button
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="btn-secondary flex-1"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary flex-1"
          >
            {stepIndex === totalSteps - 1 ? 'Review' : 'Next'}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
