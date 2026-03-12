'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';

type Phase = 'intro' | 'questions' | 'results';

interface TempReading {
  id: string;
  label: string;
  element: string;
  subComponent: string;
  question: string;
  value: number | null;
}

const TEMP_READINGS: Omit<TempReading, 'value'>[] = [
  { id: 't1', label: 'Mental Clarity', element: 'clarity', subComponent: 'mental', question: 'How clear is your thinking right now?' },
  { id: 't2', label: 'Goal Clarity', element: 'clarity', subComponent: 'goals', question: 'How clear are you on what you\'re working toward?' },
  { id: 't3', label: 'Decision Confidence', element: 'authority', subComponent: 'decisions', question: 'How confident do you feel in your recent decisions?' },
  { id: 't4', label: 'Self-Trust', element: 'authority', subComponent: 'trust', question: 'How much do you trust your own judgment right now?' },
  { id: 't5', label: 'Emotional State', element: 'state', subComponent: 'emotional', question: 'How would you rate your emotional state?' },
  { id: 't6', label: 'Physical Energy', element: 'state', subComponent: 'physical', question: 'How is your physical energy level?' },
  { id: 't7', label: 'Available Bandwidth', element: 'capacity', subComponent: 'bandwidth', question: 'How much spare capacity do you have for new challenges?' },
  { id: 't8', label: 'Recovery Status', element: 'capacity', subComponent: 'recovery', question: 'How recovered do you feel from recent stressors?' },
  { id: 't9', label: 'Pattern Awareness', element: 'programming', subComponent: 'awareness', question: 'How aware are you of your default patterns and habits?' },
  { id: 't10', label: 'Growth Habits', element: 'repetition', subComponent: 'habits', question: 'How consistently are you practicing growth habits?' },
  { id: 't11', label: 'Feedback Flow', element: 'feedback', subComponent: 'flow', question: 'How much useful feedback are you getting right now?' },
  { id: 't12', label: 'Time Alignment', element: 'time', subComponent: 'alignment', question: 'How well does your time allocation match your priorities?' },
];

export default function TemperatureCheckPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [readings, setReadings] = useState<TempReading[]>(
    TEMP_READINGS.map((r) => ({ ...r, value: null }))
  );

  const answeredCount = readings.filter((r) => r.value !== null).length;
  const allAnswered = answeredCount === readings.length;

  const updateReading = (id: string, value: number) => {
    setReadings((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));
  };

  const computeElementAverages = () => {
    const elements: Record<string, { total: number; count: number }> = {};
    for (const r of readings) {
      if (r.value === null) continue;
      if (!elements[r.element]) elements[r.element] = { total: 0, count: 0 };
      elements[r.element].total += r.value;
      elements[r.element].count += 1;
    }
    return Object.entries(elements)
      .map(([element, data]) => ({
        element,
        score: Math.round((data.total / data.count) * 10) / 10,
      }))
      .sort((a, b) => a.score - b.score);
  };

  const getColor = (value: number) => {
    if (value >= 8) return 'text-emerald-600';
    if (value >= 6) return 'text-blue-600';
    if (value >= 4) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBarColor = (value: number) => {
    if (value >= 8) return 'bg-emerald-500';
    if (value >= 6) return 'bg-blue-500';
    if (value >= 4) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Temperature Check" subtitle="Granular sub-component readings" duration="~2 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            A quick, granular read on 12 sub-components across your foundational elements.
            Each reading is a simple 1–10 scale. Think of it as taking your system&apos;s temperature.
          </p>
          <p className="text-sm text-surface-500">
            This takes about 2 minutes. All ratings appear on one page — rate them in any order.
          </p>
          <button onClick={() => setPhase('questions')} className="btn-primary">
            Start Temperature Check
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const elementAverages = computeElementAverages();
    const overallTemp = readings.reduce((s, r) => s + (r.value ?? 0), 0) / readings.length;
    const coldSpots = readings.filter((r) => (r.value ?? 10) <= 4);
    const hotSpots = readings.filter((r) => (r.value ?? 0) >= 8);

    return (
      <ToolShell title="Temperature Check" subtitle="Your Readings">
        <div className="space-y-6">
          <div className="card text-center">
            <div className="text-xs text-surface-400 uppercase tracking-wider mb-2">System Temperature</div>
            <div className={`text-5xl font-semibold tabular-nums ${getColor(overallTemp)}`}>
              {Math.round(overallTemp * 10) / 10}
              <span className="text-xl text-surface-300">/10</span>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Element Averages</h3>
            <div className="space-y-3">
              {elementAverages.map(({ element, score }) => (
                <div key={element}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium capitalize text-surface-700">{element}</span>
                    <span className={`text-xs font-semibold tabular-nums ${getColor(score)}`}>{score}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                    <div className={`h-full rounded-full ${getBarColor(score)}`} style={{ width: `${(score / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {coldSpots.length > 0 && (
            <div className="card bg-rose-50 border-rose-200">
              <h3 className="text-sm font-medium text-rose-800 mb-2">Cold Spots (≤ 4)</h3>
              <ul className="space-y-1">
                {coldSpots.map((r) => (
                  <li key={r.id} className="text-xs text-rose-700">
                    <strong>{r.label}</strong> — {r.value}/10
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hotSpots.length > 0 && (
            <div className="card bg-emerald-50 border-emerald-200">
              <h3 className="text-sm font-medium text-emerald-800 mb-2">Hot Spots (≥ 8)</h3>
              <ul className="space-y-1">
                {hotSpots.map((r) => (
                  <li key={r.id} className="text-xs text-emerald-700">
                    <strong>{r.label}</strong> — {r.value}/10
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => { setReadings(TEMP_READINGS.map((r) => ({ ...r, value: null }))); setPhase('intro'); }} className="btn-secondary flex-1">
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

  // ── QUESTIONS (all on one page) ──
  return (
    <ToolShell title="Temperature Check" subtitle={`${answeredCount}/${readings.length} rated`}>
      <div className="space-y-4">
        {readings.map((reading) => (
          <div key={reading.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-surface-900">{reading.label}</span>
              <span className="text-xs text-surface-400 capitalize">{reading.element}</span>
            </div>
            <p className="text-xs text-surface-500">{reading.question}</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => updateReading(reading.id, v)}
                  className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                    reading.value === v
                      ? `${v >= 8 ? 'bg-emerald-600' : v >= 6 ? 'bg-blue-600' : v >= 4 ? 'bg-amber-500' : 'bg-rose-500'} text-white`
                      : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => setPhase('results')}
          disabled={!allAnswered}
          className="btn-primary w-full"
        >
          See Results
        </button>
      </div>
    </ToolShell>
  );
}
