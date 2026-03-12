'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';

type Phase = 'intro' | 'questions' | 'review' | 'results';

interface Aspiration {
  id: string;
  text: string;
  importance: number | null;
  currentAlignment: number | null;
}

const ASPIRATION_PROMPTS = [
  'Career growth and professional advancement',
  'Financial security and wealth building',
  'Work-life balance and personal time',
  'Creative expression and originality',
  'Making a positive impact on others',
  'Learning, mastery, and intellectual growth',
  'Leadership and influence',
  'Health, energy, and physical wellbeing',
  'Meaningful relationships and community',
  'Freedom, autonomy, and independence',
];

export default function AspirationAuditPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [aspirations, setAspirations] = useState<Aspiration[]>(
    ASPIRATION_PROMPTS.map((text, i) => ({
      id: `asp-${i}`,
      text,
      importance: null,
      currentAlignment: null,
    }))
  );
  const [stepIndex, setStepIndex] = useState(0);

  const current = aspirations[stepIndex];
  const allAnswered = aspirations.every((a) => a.importance !== null && a.currentAlignment !== null);

  const updateAspiration = useCallback((field: 'importance' | 'currentAlignment', value: number) => {
    setAspirations((prev) =>
      prev.map((a) => (a.id === current.id ? { ...a, [field]: value } : a))
    );
  }, [current]);

  const canProceed = current?.importance !== null && current?.currentAlignment !== null;

  const computeResults = useCallback(() => {
    return aspirations
      .filter((a) => a.importance !== null && a.currentAlignment !== null)
      .map((a) => ({
        ...a,
        gap: (a.importance ?? 0) - (a.currentAlignment ?? 0),
        gapSeverity:
          (a.importance ?? 0) - (a.currentAlignment ?? 0) >= 5
            ? 'critical'
            : (a.importance ?? 0) - (a.currentAlignment ?? 0) >= 3
            ? 'moderate'
            : 'aligned',
      }))
      .sort((a, b) => b.gap - a.gap);
  }, [aspirations]);

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Aspiration Audit" subtitle="Evaluate your aspirations against reality" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            For each life aspiration, you&apos;ll rate two things: how <strong>important</strong> it is to you (1–10),
            and how <strong>aligned</strong> your current life is with that aspiration (1–10).
          </p>
          <p className="text-sm text-surface-500">
            The gap between importance and alignment reveals where to focus your energy.
          </p>
          <button onClick={() => setPhase('questions')} className="btn-primary">
            Begin Audit
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const results = computeResults();
    const overallAlignment = aspirations.reduce((sum, a) => sum + (a.currentAlignment ?? 0), 0) / aspirations.length;
    const overallImportance = aspirations.reduce((sum, a) => sum + (a.importance ?? 0), 0) / aspirations.length;

    return (
      <ToolShell title="Aspiration Audit" subtitle="Your Results">
        <div className="space-y-6">
          <div className="card text-center">
            <div className="text-xs text-surface-400 uppercase tracking-wider mb-2">Alignment Score</div>
            <div className="text-5xl font-semibold text-surface-900 tabular-nums">
              {Math.round(overallAlignment * 10) / 10}
              <span className="text-xl text-surface-300">/{Math.round(overallImportance * 10) / 10}</span>
            </div>
            <div className="mt-2 text-sm text-surface-500">
              {overallAlignment >= overallImportance * 0.8
                ? 'Your life is well-aligned with your aspirations.'
                : overallAlignment >= overallImportance * 0.6
                ? 'Some gaps between what you want and where you are.'
                : 'Significant misalignment — focus on the gaps below.'}
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Gap Analysis</h3>
            <div className="space-y-3">
              {results.map((r) => (
                <div key={r.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-surface-700">{r.text}</span>
                    <span className={`text-xs font-semibold ${
                      r.gapSeverity === 'critical' ? 'text-rose-600' :
                      r.gapSeverity === 'moderate' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {r.gap > 0 ? `Gap: ${r.gap}` : 'Aligned'}
                    </span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div className="flex-1 rounded-full bg-surface-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${((r.importance ?? 0) / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 rounded-full bg-surface-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          r.gapSeverity === 'critical' ? 'bg-rose-400' :
                          r.gapSeverity === 'moderate' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${((r.currentAlignment ?? 0) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-surface-400">
                    <span>Importance: {r.importance}</span>
                    <span>Alignment: {r.currentAlignment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setAspirations(ASPIRATION_PROMPTS.map((text, i) => ({
                  id: `asp-${i}`, text, importance: null, currentAlignment: null,
                })));
                setStepIndex(0);
                setPhase('intro');
              }}
              className="btn-secondary flex-1"
            >
              Retake
            </button>
            <button onClick={() => router.push('/map')} className="btn-primary flex-1">
              Back to Tools
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // ── QUESTIONS ──
  return (
    <ToolShell
      title="Aspiration Audit"
      subtitle={current.text}
      currentStep={stepIndex}
      totalSteps={aspirations.length}
      progress={Math.round(((stepIndex) / aspirations.length) * 100)}
    >
      <div className="card space-y-6">
        <div>
          <p className="text-sm font-medium text-surface-900 mb-3">
            How important is this to you?
          </p>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <button
                key={v}
                onClick={() => updateAspiration('importance', v)}
                className={`flex-1 h-10 rounded-lg text-xs font-medium transition-colors ${
                  current.importance === v
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-surface-400 mt-1">
            <span>Not important</span>
            <span>Essential</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-surface-900 mb-3">
            How aligned is your current life with this?
          </p>
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <button
                key={v}
                onClick={() => updateAspiration('currentAlignment', v)}
                className={`flex-1 h-10 rounded-lg text-xs font-medium transition-colors ${
                  current.currentAlignment === v
                    ? 'bg-emerald-600 text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-surface-400 mt-1">
            <span>Not at all</span>
            <span>Perfectly aligned</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <button
            onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
            disabled={stepIndex === 0}
            className="btn-secondary flex-1"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (stepIndex === aspirations.length - 1 && allAnswered) {
                setPhase('results');
              } else {
                setStepIndex(Math.min(aspirations.length - 1, stepIndex + 1));
              }
            }}
            disabled={!canProceed}
            className="btn-primary flex-1"
          >
            {stepIndex === aspirations.length - 1 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
