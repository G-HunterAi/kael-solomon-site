'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { ResultsDisplay } from '@/components/diagnostics/results-display';
import { ScaleInput } from '@/components/ui/scale-input';
import { PercentageInput } from '@/components/ui/percentage-input';
import { SelectInput } from '@/components/ui/select-input';

type Phase = 'intro' | 'questions' | 'submitting' | 'results';

interface CheckinQuestion {
  id: string;
  element: string;
  text: string;
  type: 'scale' | 'percentage' | 'select';
  lowLabel?: string;
  highLabel?: string;
  options?: { value: string; label: string; score: number }[];
  color: string;
  dotColor: string;
}

const CHECKIN_QUESTIONS: CheckinQuestion[] = [
  {
    id: 'clarity_daily', element: 'clarity',
    text: 'How clearly are you seeing your situation today?',
    type: 'scale', lowLabel: 'Foggy', highLabel: 'Crystal clear',
    color: 'text-blue-600', dotColor: 'bg-blue-500',
  },
  {
    id: 'authority_daily', element: 'authority',
    text: 'How strong is your sense of self-authority today?',
    type: 'scale', lowLabel: 'Seeking approval', highLabel: 'Fully authorized',
    color: 'text-violet-600', dotColor: 'bg-violet-500',
  },
  {
    id: 'state_daily', element: 'state',
    text: 'How is your overall energy and state?',
    type: 'scale', lowLabel: 'Running on empty', highLabel: 'Fully charged',
    color: 'text-amber-600', dotColor: 'bg-amber-500',
  },
  {
    id: 'capacity_daily', element: 'capacity',
    text: 'How much available capacity do you have today?',
    type: 'percentage',
    color: 'text-emerald-600', dotColor: 'bg-emerald-500',
  },
  {
    id: 'programming_daily', element: 'programming',
    text: 'How much are old patterns running the show today?',
    type: 'scale', lowLabel: 'Barely active', highLabel: 'Running the show',
    color: 'text-red-600', dotColor: 'bg-red-500',
  },
  {
    id: 'repetition_daily', element: 'repetition',
    text: 'Did you practice your new behavior today?',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes, I did it', score: 9 },
      { value: 'partial', label: 'Partially', score: 6 },
      { value: 'no', label: 'No, I missed it', score: 3 },
      { value: 'na', label: 'Not applicable today', score: 5 },
    ],
    color: 'text-cyan-600', dotColor: 'bg-cyan-500',
  },
  {
    id: 'feedback_daily', element: 'feedback',
    text: 'How well are you processing feedback and outcomes today?',
    type: 'scale', lowLabel: 'Ignoring signals', highLabel: 'Learning actively',
    color: 'text-orange-600', dotColor: 'bg-orange-500',
  },
  {
    id: 'time_daily', element: 'time',
    text: 'How is your relationship with pace today?',
    type: 'scale', lowLabel: 'Rushed / stuck', highLabel: 'Right pace',
    color: 'text-indigo-600', dotColor: 'bg-indigo-500',
  },
];

export default function DailyCheckinPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number | string>>({});
  const [checkinResults, setCheckinResults] = useState<{ element: string; score: number }[]>([]);

  const currentQ = CHECKIN_QUESTIONS[stepIndex];
  const totalSteps = CHECKIN_QUESTIONS.length;

  const handleNext = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  }, [stepIndex, totalSteps]);

  const handleSubmit = useCallback(async () => {
    setPhase('submitting');

    // Compute scores
    const scores = CHECKIN_QUESTIONS.map((q) => {
      const raw = responses[q.id];
      let score: number;

      if (q.type === 'percentage') {
        score = Math.max(1, Math.min(10, (raw as number) / 10));
      } else if (q.type === 'select') {
        const opt = q.options?.find((o) => o.value === raw);
        score = opt?.score ?? 5;
      } else {
        score = (raw as number) ?? 5;
        // Invert programming
        if (q.element === 'programming') score = 11 - score;
      }

      return { element: q.element, score: Math.round(score * 10) / 10 };
    });

    // Try API submission
    try {
      await fetch('/api/v1/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: CHECKIN_QUESTIONS.map((q) => ({
            questionId: q.id,
            element: q.element,
            ...(q.type === 'scale' ? { value: responses[q.id] } : {}),
            ...(q.type === 'percentage' ? { value: responses[q.id] } : {}),
            ...(q.type === 'select' ? { selectedValue: responses[q.id] } : {}),
          })),
          toolName: 'daily-checkin',
        }),
      });
    } catch {
      // Silent fail — we still show client-side results
    }

    setCheckinResults(scores);
    setPhase('results');
  }, [responses]);

  if (phase === 'intro') {
    return (
      <ToolShell title="Daily Check-in" subtitle="Quick 8-element pulse check" duration="~3 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Rate each foundational element for today. This takes about 3 minutes and helps you
            track patterns over time.
          </p>
          <button onClick={() => setPhase('questions')} className="btn-primary">
            Start Check-in
          </button>
        </div>
      </ToolShell>
    );
  }

  if (phase === 'submitting') {
    return (
      <ToolShell title="Daily Check-in">
        <div className="card text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-brand-600" />
          <p className="mt-4 text-sm text-surface-500">Saving your check-in...</p>
        </div>
      </ToolShell>
    );
  }

  if (phase === 'results') {
    const scores = checkinResults.length > 0 ? checkinResults : CHECKIN_QUESTIONS.map((q) => {
      const raw = responses[q.id];
      let score = typeof raw === 'number' ? raw : 5;
      if (q.type === 'percentage') score = Math.max(1, Math.min(10, score / 10));
      if (q.element === 'programming' && q.type === 'scale') score = 11 - score;
      return { element: q.element, score: Math.round(score * 10) / 10 };
    });

    return (
      <ToolShell title="Daily Check-in" subtitle="Today's Results">
        <ResultsDisplay
          scores={scores}
          onRetake={() => {
            setResponses({});
            setCheckinResults([]);
            setStepIndex(0);
            setPhase('intro');
          }}
          onDone={() => router.push('/map')}
        />
      </ToolShell>
    );
  }

  // ── QUESTIONS ──
  const hasAnswer = responses[currentQ.id] != null;

  return (
    <ToolShell
      title="Daily Check-in"
      currentStep={stepIndex}
      totalSteps={totalSteps}
    >
      <div className="card space-y-6">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${currentQ.dotColor}`} />
          <span className={`text-xs font-medium uppercase tracking-wider ${currentQ.color}`}>
            {currentQ.element}
          </span>
        </div>

        <p className="text-sm font-medium text-surface-900 leading-relaxed">
          {currentQ.text}
        </p>

        {currentQ.type === 'scale' && (
          <ScaleInput
            value={(responses[currentQ.id] as number) ?? null}
            onChange={(v) => setResponses((p) => ({ ...p, [currentQ.id]: v }))}
            lowLabel={currentQ.lowLabel || ''}
            highLabel={currentQ.highLabel || ''}
          />
        )}

        {currentQ.type === 'percentage' && (
          <PercentageInput
            value={(responses[currentQ.id] as number) ?? null}
            onChange={(v) => setResponses((p) => ({ ...p, [currentQ.id]: v }))}
          />
        )}

        {currentQ.type === 'select' && currentQ.options && (
          <SelectInput
            value={(responses[currentQ.id] as string) ?? null}
            onChange={(v) => setResponses((p) => ({ ...p, [currentQ.id]: v }))}
            options={currentQ.options}
          />
        )}

        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <button
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="btn-secondary flex-1"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="btn-primary flex-1"
          >
            {stepIndex === totalSteps - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
