'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { YOUTH_ACTIVITIES, getYouthActivities, type YouthActivity } from '@/lib/signal/youth-tools';

type Phase = 'intro' | 'sort' | 'results';
type EnergyLevel = 'energizes' | 'neutral' | 'drains';

interface SortResponse {
  [activityId: number]: EnergyLevel;
}

const DIMENSION_LABELS: Record<string, { name: string; description: string; color: string }> = {
  N1: { name: 'People', description: 'Energy from working with, leading, or helping others', color: 'bg-blue-500' },
  N2: { name: 'Problems', description: 'Energy from solving difficult, ambiguous challenges', color: 'bg-violet-500' },
  N3: { name: 'Completion', description: 'Energy from finishing tasks and closing loops', color: 'bg-emerald-500' },
  N4: { name: 'Mastery', description: 'Energy from deep learning and building expertise', color: 'bg-amber-500' },
  N5: { name: 'Helping', description: 'Energy from supporting, nurturing, and serving others', color: 'bg-rose-500' },
  N6: { name: 'Building', description: 'Energy from creating tangible things from scratch', color: 'bg-cyan-500' },
  N7: { name: 'Complexity', description: 'Energy from working with multi-variable systems', color: 'bg-indigo-500' },
};

export default function YouthEnergyAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [responses, setResponses] = useState<SortResponse>({});
  const [results, setResults] = useState<Record<string, number>>({});

  // Get activities for youth age group
  const activities = getYouthActivities('youth');
  const sortedIds = Object.keys(responses).map(Number);
  const currentIndex = sortedIds.length;
  const currentActivity = activities[currentIndex];
  const progress = activities.length > 0 ? Math.round((currentIndex / activities.length) * 100) : 0;

  const handleSort = useCallback((level: EnergyLevel) => {
    if (!currentActivity) return;
    setResponses((prev) => ({ ...prev, [currentActivity.id]: level }));

    if (currentIndex + 1 >= activities.length) {
      // All sorted — calculate results
      const newResponses = { ...responses, [currentActivity.id]: level };
      const dimensionScores: Record<string, { total: number; count: number }> = {};

      for (const act of activities) {
        const resp = newResponses[act.id];
        if (!resp) continue;
        const score = resp === 'energizes' ? 10 : resp === 'neutral' ? 5 : 1;
        for (const dim of act.dimensions) {
          if (!dimensionScores[dim]) dimensionScores[dim] = { total: 0, count: 0 };
          dimensionScores[dim].total += score;
          dimensionScores[dim].count += 1;
        }
      }

      const finalScores: Record<string, number> = {};
      for (const [dim, data] of Object.entries(dimensionScores)) {
        finalScores[dim] = Math.round((data.total / data.count) * 10) / 10;
      }
      setResults(finalScores);
      setPhase('results');
    }
  }, [currentActivity, currentIndex, activities, responses]);

  const handleUndo = useCallback(() => {
    if (currentIndex === 0) return;
    const lastId = activities[currentIndex - 1].id;
    setResponses((prev) => {
      const next = { ...prev };
      delete next[lastId];
      return next;
    });
  }, [currentIndex, activities]);

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Youth Energy Assessment" subtitle="Discover what energizes and drains you" duration="~8 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            You'll sort school and extracurricular activities into three buckets: things that <strong className="text-emerald-600">energize</strong> you,
            things that feel <strong className="text-surface-500">neutral</strong>, and things that <strong className="text-rose-600">drain</strong> you.
          </p>
          <p className="text-sm text-surface-500">
            Go with your gut reaction — don't overthink it. The results map to your 7 energy dimensions (N1–N7).
          </p>
          <button onClick={() => setPhase('sort')} className="btn-primary">
            Start Energy Sort
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const sortedDimensions = Object.entries(results).sort((a, b) => b[1] - a[1]);
    const topEnergy = sortedDimensions[0];
    const lowEnergy = sortedDimensions[sortedDimensions.length - 1];

    return (
      <ToolShell title="Youth Energy Assessment" subtitle="Your Energy Map">
        <div className="space-y-6">
          <div className="card text-center">
            <div className="text-xs text-surface-400 uppercase tracking-wider mb-2">Strongest Energy</div>
            <div className="text-3xl font-semibold text-surface-900">
              {topEnergy ? DIMENSION_LABELS[topEnergy[0]]?.name : '—'}
            </div>
            <p className="mt-1 text-sm text-surface-500">
              {topEnergy ? DIMENSION_LABELS[topEnergy[0]]?.description : ''}
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">All 7 Energy Dimensions</h3>
            <div className="space-y-3">
              {sortedDimensions.map(([dim, score]) => {
                const info = DIMENSION_LABELS[dim];
                if (!info) return null;
                return (
                  <div key={dim}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-surface-700">{info.name} ({dim})</span>
                      <span className="text-xs font-semibold tabular-nums text-surface-700">
                        {score}/10
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${info.color}`}
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-surface-400">{info.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {lowEnergy && (
            <div className="card bg-amber-50 border-amber-200">
              <h3 className="text-sm font-medium text-amber-800 mb-1">Watch out for</h3>
              <p className="text-xs text-amber-700">
                <strong>{DIMENSION_LABELS[lowEnergy[0]]?.name}</strong> scored lowest ({lowEnergy[1]}/10).
                Activities in this area may drain you — try to minimize or delegate them when possible.
              </p>
            </div>
          )}

          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">What next?</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Look for clubs, classes, or activities that match your top energy dimensions</li>
              <li>• Think about future careers that let you do more of what energizes you</li>
              <li>• If you have to do things that drain you, balance them with energizing activities</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setResponses({}); setResults({}); setPhase('intro'); }}
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

  // ── SORT PHASE ──
  if (!currentActivity) return null;

  return (
    <ToolShell
      title="Youth Energy Assessment"
      subtitle={`Sort each activity: energizes, neutral, or drains`}
      currentStep={currentIndex}
      totalSteps={activities.length}
      progress={progress}
    >
      <div className="card space-y-6">
        <div className="text-center py-4">
          <p className="text-base font-medium text-surface-900 leading-relaxed">
            {currentActivity.text}
          </p>
          <p className="mt-2 text-xs text-surface-400">
            {currentIndex + 1} of {activities.length}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSort('energizes')}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
          >
            <span className="text-2xl">⚡</span>
            <span className="text-xs font-medium text-emerald-700">Energizes</span>
          </button>
          <button
            onClick={() => handleSort('neutral')}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-surface-200 bg-surface-50 p-4 hover:bg-surface-100 hover:border-surface-300 transition-colors"
          >
            <span className="text-2xl">😐</span>
            <span className="text-xs font-medium text-surface-600">Neutral</span>
          </button>
          <button
            onClick={() => handleSort('drains')}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 p-4 hover:bg-rose-100 hover:border-rose-300 transition-colors"
          >
            <span className="text-2xl">🔋</span>
            <span className="text-xs font-medium text-rose-700">Drains</span>
          </button>
        </div>

        {currentIndex > 0 && (
          <button onClick={handleUndo} className="text-xs text-surface-400 hover:text-surface-600 transition-colors">
            ← Undo last
          </button>
        )}
      </div>
    </ToolShell>
  );
}
