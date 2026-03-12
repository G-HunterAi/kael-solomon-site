'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { ScaleInput } from '@/components/ui/scale-input';

type Phase = 'questions' | 'submitting' | 'done';

interface QuickQuestion {
  id: string;
  element: string;
  text: string;
  lowLabel: string;
  highLabel: string;
  color: string;
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  { id: 'qc_clarity', element: 'clarity', text: 'How clear is your thinking right now?', lowLabel: 'Foggy', highLabel: 'Sharp', color: 'text-blue-600' },
  { id: 'qc_state', element: 'state', text: 'Energy level?', lowLabel: 'Empty', highLabel: 'Full', color: 'text-amber-600' },
  { id: 'qc_capacity', element: 'capacity', text: 'Available bandwidth?', lowLabel: 'Maxed out', highLabel: 'Wide open', color: 'text-emerald-600' },
];

export default function QuickCheckinPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('questions');
  const [responses, setResponses] = useState<Record<string, number>>({});

  const allAnswered = QUICK_QUESTIONS.every((q) => responses[q.id] != null);

  const handleSubmit = useCallback(async () => {
    setPhase('submitting');

    try {
      await fetch('/api/v1/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: QUICK_QUESTIONS.map((q) => ({
            questionId: q.id,
            element: q.element,
            value: responses[q.id],
          })),
          toolName: 'quick-checkin',
        }),
      });
    } catch {
      // Silent fail
    }

    setPhase('done');
  }, [responses]);

  if (phase === 'submitting') {
    return (
      <ToolShell title="Quick Check-in" duration="~1 min">
        <div className="card text-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-surface-200 border-t-brand-600" />
        </div>
      </ToolShell>
    );
  }

  if (phase === 'done') {
    const avg = QUICK_QUESTIONS.reduce((sum, q) => sum + (responses[q.id] || 5), 0) / QUICK_QUESTIONS.length;

    return (
      <ToolShell title="Quick Check-in" duration="~1 min">
        <div className="card text-center space-y-4">
          <div className="text-4xl font-semibold text-surface-900 tabular-nums">
            {Math.round(avg * 10) / 10}<span className="text-lg text-surface-300">/10</span>
          </div>
          <p className="text-sm text-surface-500">
            {avg >= 7 ? 'You\'re running well today.' :
             avg >= 5 ? 'Moderate state — keep an eye on things.' :
             'Low readings — consider a full check-in later.'}
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => router.push('/map/daily-checkin')} className="btn-secondary flex-1">
              Full Check-in
            </button>
            <button onClick={() => router.push('/map')} className="btn-primary flex-1">
              Done
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  return (
    <ToolShell title="Quick Check-in" subtitle="3 questions, 1 minute" duration="~1 min">
      <div className="space-y-6">
        {QUICK_QUESTIONS.map((q) => (
          <div key={q.id} className="card space-y-3">
            <p className="text-sm font-medium text-surface-900">{q.text}</p>
            <ScaleInput
              value={responses[q.id] ?? null}
              onChange={(v) => setResponses((p) => ({ ...p, [q.id]: v }))}
              lowLabel={q.lowLabel}
              highLabel={q.highLabel}
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="btn-primary w-full"
        >
          Done
        </button>
      </div>
    </ToolShell>
  );
}
