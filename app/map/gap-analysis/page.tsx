'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { ScaleInput } from '@/components/ui/scale-input';
import {
  GAP_TYPES,
  GAP_DESCRIPTIONS,
  computeGapPriority,
  type GapType,
} from '@/lib/career/scoring';

type Phase = 'intro' | 'questions' | 'results' | 'error';

interface GapResponse {
  width: number | null;
  criticality: number | null;
  closeability: number | null;
}

type GapResponses = {
  [key in GapType]: GapResponse;
};

export default function GapAnalysisPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [gapIndex, setGapIndex] = useState(0);
  const [responses, setResponses] = useState<GapResponses>({
    skill: { width: null, criticality: null, closeability: null },
    experience: { width: null, criticality: null, closeability: null },
    credential: { width: null, criticality: null, closeability: null },
    network: { width: null, criticality: null, closeability: null },
    financial: { width: null, criticality: null, closeability: null },
    structural: { width: null, criticality: null, closeability: null },
    ai_displacement: { width: null, criticality: null, closeability: null },
  });
  const [results, setResults] = useState<
    Array<{
      type: GapType;
      width: number;
      criticality: number;
      closeability: number;
      priority: number;
    }>
  >([]);

  const currentGapType = GAP_TYPES[gapIndex];
  const currentGapDesc = GAP_DESCRIPTIONS[currentGapType];
  const currentResponse = responses[currentGapType];
  const totalGaps = GAP_TYPES.length;

  const setGapResponse = useCallback(
    (metric: 'width' | 'criticality' | 'closeability', value: number) => {
      setResponses((prev) => ({
        ...prev,
        [currentGapType]: {
          ...prev[currentGapType],
          [metric]: value,
        },
      }));
    },
    [currentGapType]
  );

  const canProceed = useCallback(() => {
    return (
      currentResponse.width != null &&
      currentResponse.criticality != null &&
      currentResponse.closeability != null
    );
  }, [currentResponse]);

  const handleNext = useCallback(() => {
    if (gapIndex < totalGaps - 1) {
      setGapIndex((i) => i + 1);
    } else {
      // Calculate gap priorities
      const gapResults = GAP_TYPES.map((gapType) => {
        const resp = responses[gapType];
        const priority = computeGapPriority(
          resp.width || 0,
          resp.criticality || 0,
          resp.closeability || 0
        );
        return {
          type: gapType,
          width: resp.width || 0,
          criticality: resp.criticality || 0,
          closeability: resp.closeability || 0,
          priority,
        };
      }).sort((a, b) => b.priority - a.priority);

      setResults(gapResults);
      setPhase('results');
    }
  }, [gapIndex, totalGaps, responses]);

  const handlePrev = useCallback(() => {
    if (gapIndex > 0) {
      setGapIndex((i) => i - 1);
    }
  }, [gapIndex]);

  // ── INTRO PHASE ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Gap Analysis" subtitle="Identify and prioritize your gaps" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Gap analysis identifies the gaps between your current state and your target role or goal.
            We assess 7 types of gaps: skills, experience, credentials, network, financial, structural,
            and AI displacement risk.
          </p>
          <p className="text-sm text-surface-500">
            For each gap type, you'll rate three dimensions: how wide the gap is, how critical it is
            for your target role, and how easily you can close it. This helps prioritize which gaps
            deserve your attention first.
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
  if (phase === 'results' && results.length > 0) {
    const getPriorityColor = (priority: number) => {
      if (priority > 30) return { bg: 'bg-red-50', border: 'border-red-300', label: 'text-red-700' };
      if (priority > 15) return { bg: 'bg-amber-50', border: 'border-amber-300', label: 'text-amber-700' };
      return { bg: 'bg-green-50', border: 'border-green-300', label: 'text-green-700' };
    };

    return (
      <ToolShell title="Gap Analysis" subtitle="Your Gap Priorities">
        <div className="space-y-6">
          {/* Priority ranking */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-900 mb-4">Gaps by Priority (Highest First)</h3>
            <div className="space-y-3">
              {results.map((gap, index) => {
                const colors = getPriorityColor(gap.priority);
                const desc = GAP_DESCRIPTIONS[gap.type];

                return (
                  <div key={gap.type} className={`p-4 rounded border ${colors.bg} ${colors.border}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-surface-900 mb-1">
                          {index + 1}. {desc.label}
                        </p>
                        <p className="text-xs text-surface-600 mb-2">{desc.description}</p>
                        <p className="text-xs text-surface-500">Examples: {desc.examples}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-lg font-bold ${colors.label}`}>
                          {Math.round(gap.priority * 10) / 10}
                        </p>
                        <p className="text-xs text-surface-500">Priority</p>
                      </div>
                    </div>

                    {/* Score breakdown */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white/50 rounded p-2">
                        <p className="font-medium text-surface-700">Width: {gap.width}/10</p>
                      </div>
                      <div className="bg-white/50 rounded p-2">
                        <p className="font-medium text-surface-700">Criticality: {gap.criticality}/10</p>
                      </div>
                      <div className="bg-white/50 rounded p-2">
                        <p className="font-medium text-surface-700">Closeability: {gap.closeability}/10</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interpretation */}
          <div className="card bg-surface-50">
            <p className="text-sm font-medium text-surface-900 mb-2">How to Read This</p>
            <ul className="space-y-2 text-sm text-surface-700">
              <li className="flex gap-2">
                <span className="text-red-600 font-bold">🔴</span>
                <span>
                  <strong>High Priority (30+):</strong> Address these first. They're wide, critical,
                  and moderately closeable.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold">🟠</span>
                <span>
                  <strong>Moderate Priority (15-30):</strong> Important to address but not as urgent.
                  Plan how to close these.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">🟢</span>
                <span>
                  <strong>Low Priority (&lt;15):</strong> These are either narrow, less critical,
                  or highly closeable. Less urgent.
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResponses({
                  skill: { width: null, criticality: null, closeability: null },
                  experience: { width: null, criticality: null, closeability: null },
                  credential: { width: null, criticality: null, closeability: null },
                  network: { width: null, criticality: null, closeability: null },
                  financial: { width: null, criticality: null, closeability: null },
                  structural: { width: null, criticality: null, closeability: null },
                  ai_displacement: { width: null, criticality: null, closeability: null },
                });
                setGapIndex(0);
                setResults([]);
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
      title={currentGapDesc.label}
      subtitle={currentGapDesc.description}
      currentStep={gapIndex}
      totalSteps={totalGaps}
    >
      <div className="card space-y-6">
        <div className="bg-surface-50 p-4 rounded-lg mb-2">
          <p className="text-xs font-medium text-surface-700 mb-1">Examples:</p>
          <p className="text-sm text-surface-600">{currentGapDesc.examples}</p>
        </div>

        {/* Width question */}
        <div className="space-y-3">
          <label className="block">
            <p className="text-sm font-medium text-surface-900 mb-1">
              How wide is this gap?
            </p>
            <p className="text-xs text-surface-500 mb-2">
              1 = Minimal gap, 10 = Enormous gap
            </p>
          </label>
          <ScaleInput
            value={currentResponse.width}
            onChange={(value) => setGapResponse('width', value)}
            min={1}
            max={10}
            lowLabel="Small gap"
            highLabel="Huge gap"
          />
        </div>

        {/* Criticality question */}
        <div className="space-y-3">
          <label className="block">
            <p className="text-sm font-medium text-surface-900 mb-1">
              How critical is it for your target role?
            </p>
            <p className="text-xs text-surface-500 mb-2">
              1 = Nice to have, 10 = Absolute requirement
            </p>
          </label>
          <ScaleInput
            value={currentResponse.criticality}
            onChange={(value) => setGapResponse('criticality', value)}
            min={1}
            max={10}
            lowLabel="Optional"
            highLabel="Essential"
          />
        </div>

        {/* Closeability question */}
        <div className="space-y-3">
          <label className="block">
            <p className="text-sm font-medium text-surface-900 mb-1">
              How easily can you close this gap?
            </p>
            <p className="text-xs text-surface-500 mb-2">
              1 = Very difficult, 10 = Very easy
            </p>
          </label>
          <ScaleInput
            value={currentResponse.closeability}
            onChange={(value) => setGapResponse('closeability', value)}
            min={1}
            max={10}
            lowLabel="Very hard"
            highLabel="Very easy"
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <button
            onClick={handlePrev}
            disabled={gapIndex === 0}
            className="btn-secondary flex-1"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary flex-1"
          >
            {gapIndex === totalGaps - 1 ? 'Get Priority' : 'Next Gap'}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
