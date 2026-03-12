'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import {
  YOUTH_FSI_ITEMS,
  YOUTH_FSI_LABELS,
  YOUTH_FLUX_GUIDANCE,
  scoreYouthFsi,
  type YouthFsiItem,
} from '@/lib/signal/youth-tools';

type Phase = 'intro' | 'questions' | 'results';

interface FsiResponse {
  itemId: number;
  score: number;
}

const FLUX_STATE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  exploring: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  drifting: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  pressured: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  committed: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  mismatched: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
};

const FLUX_STATE_ICONS: Record<string, string> = {
  exploring: '🧭',
  drifting: '🌫️',
  pressured: '⚠️',
  committed: '🎯',
  mismatched: '❌',
};

export default function YouthFluxStateAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [pageIndex, setPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [scoringResult, setScoringResult] = useState<ReturnType<typeof scoreYouthFsi> | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(YOUTH_FSI_ITEMS.length / itemsPerPage);
  const currentPageItems = YOUTH_FSI_ITEMS.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);
  const answeredOnPage = currentPageItems.filter((item) => responses[item.id] !== undefined).length;
  const canProceedPage = answeredOnPage === itemsPerPage;

  const setResponse = useCallback((itemId: number, score: number) => {
    setResponses((prev) => ({ ...prev, [itemId]: score }));
  }, []);

  const handleNextPage = useCallback(() => {
    if (pageIndex < totalPages - 1) {
      setPageIndex((i) => i + 1);
    } else {
      // All pages complete — score
      const fsiResponses = Object.entries(responses).map(([itemId, score]) => ({
        itemId: parseInt(itemId),
        score,
      }));
      const result = scoreYouthFsi(fsiResponses);
      setScoringResult(result);
      setPhase('results');
    }
  }, [pageIndex, totalPages, responses]);

  const handlePrevPage = useCallback(() => {
    if (pageIndex > 0) {
      setPageIndex((i) => i - 1);
    }
  }, [pageIndex]);

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Youth Flux State Assessment" subtitle="Where are you in your career journey?" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            There are five states people move through when figuring out their career: <strong>Exploring</strong>,
            <strong> Drifting</strong>, <strong>Pressured</strong>, <strong>Committed</strong>, and <strong>Mismatched</strong>.
          </p>
          <p className="text-sm text-surface-500">
            You'll answer 25 questions about where you are right now. There are no "right" answers — this is about being honest
            with yourself. The results will help you understand what you need to do next.
          </p>
          <button onClick={() => setPhase('questions')} className="btn-primary">
            Start Assessment
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── RESULTS ──
  if (phase === 'results' && scoringResult) {
    const guidance = YOUTH_FLUX_GUIDANCE[scoringResult.primary];
    const allStates = scoringResult.all.sort((a, b) => b.normalized - a.normalized);
    const colors = FLUX_STATE_COLORS[scoringResult.primary] || FLUX_STATE_COLORS.exploring;

    return (
      <ToolShell title="Youth Flux State Assessment" subtitle="Your Results">
        <div className="space-y-6">
          {/* Primary State */}
          <div className={`card ${colors.bg} border-2 ${colors.border}`}>
            <div className="text-center">
              <div className="text-5xl mb-2">{FLUX_STATE_ICONS[scoringResult.primary]}</div>
              <h2 className={`text-2xl font-semibold ${colors.text} capitalize`}>
                {scoringResult.primary}
              </h2>
              <p className={`mt-2 text-sm ${colors.text}`}>
                {guidance?.what}
              </p>
            </div>
          </div>

          {/* Risk & Guidance */}
          {guidance && (
            <>
              <div className="card bg-amber-50 border-amber-200">
                <h3 className="text-sm font-medium text-amber-800 mb-2">Watch out for</h3>
                <p className="text-xs text-amber-700">{guidance.risk}</p>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-surface-700 mb-3">What to do next</h3>
                <ul className="text-xs text-surface-600 space-y-2">
                  {guidance.doNext.map((action, i) => (
                    <li key={i}>• {action}</li>
                  ))}
                </ul>
              </div>

              <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Remember</h3>
                <p className="text-xs text-blue-700 italic">{guidance.rule}</p>
              </div>
            </>
          )}

          {/* All States */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">All 5 States</h3>
            <div className="space-y-3">
              {allStates.map(({ state, normalized }) => {
                const stateColors = FLUX_STATE_COLORS[state] || FLUX_STATE_COLORS.exploring;
                return (
                  <div key={state}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-surface-700 capitalize">
                        {FLUX_STATE_ICONS[state]} {state}
                      </span>
                      <span className="text-xs font-semibold text-surface-700">{normalized}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stateColors.bg.replace('bg-', 'bg-').split('-')[0]}-500`}
                        style={{
                          width: `${normalized}%`,
                          backgroundColor:
                            state === 'exploring'
                              ? '#3b82f6'
                              : state === 'drifting'
                                ? '#f59e0b'
                                : state === 'pressured'
                                  ? '#ef4444'
                                  : state === 'committed'
                                    ? '#10b981'
                                    : '#8b5cf6',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResponses({});
                setScoringResult(null);
                setPageIndex(0);
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
      title="Youth Flux State Assessment"
      subtitle={`Page ${pageIndex + 1} of ${totalPages}`}
      currentStep={pageIndex}
      totalSteps={totalPages}
      progress={Math.round(((pageIndex + 1) / totalPages) * 100)}
    >
      <div className="card space-y-6">
        <div className="space-y-4">
          {currentPageItems.map((item) => (
            <div key={item.id} className="space-y-3">
              <p className="text-sm font-medium text-surface-900">{item.text}</p>
              <div className="flex gap-1">
                {YOUTH_FSI_LABELS.map((label, i) => {
                  const score = i + 1;
                  return (
                    <button
                      key={score}
                      onClick={() => setResponse(item.id, score)}
                      className={`flex-1 py-2 px-1 rounded text-xs font-medium transition-colors ${
                        responses[item.id] === score
                          ? 'bg-brand-600 text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                      title={label}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-surface-400 flex justify-between px-1">
                <span>{YOUTH_FSI_LABELS[0]}</span>
                <span>{YOUTH_FSI_LABELS[YOUTH_FSI_LABELS.length - 1]}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <button onClick={handlePrevPage} disabled={pageIndex === 0} className="btn-secondary flex-1">
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!canProceedPage}
            className="btn-primary flex-1"
          >
            {pageIndex === totalPages - 1 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
