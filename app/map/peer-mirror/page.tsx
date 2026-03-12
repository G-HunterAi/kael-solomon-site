'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { SelectInput } from '@/components/ui/select-input';

type Phase = 'intro' | 'questions' | 'results';

interface PeerMirrorResponse {
  age: number | null;
  careerStage: string | null;
  careerFamily: string | null;
  energyDimensions: string[];
}

const CAREER_STAGES = [
  { value: 'student', label: 'Student' },
  { value: 'early-career', label: 'Early Career (0-5 years)' },
  { value: 'mid-career', label: 'Mid Career (5-15 years)' },
  { value: 'senior', label: 'Senior (15+ years)' },
];

const CAREER_FAMILIES = [
  { value: 'builder', label: 'Builder — Creating & Making' },
  { value: 'strategist', label: 'Strategist — Systems & Planning' },
  { value: 'explorer', label: 'Explorer — Discovery & Learning' },
  { value: 'optimizer', label: 'Optimizer — Improvement & Efficiency' },
  { value: 'teacher', label: 'Teacher — Development & Coaching' },
  { value: 'connector', label: 'Connector — People & Networks' },
  { value: 'guardian', label: 'Guardian — Protection & Reliability' },
  { value: 'healer', label: 'Healer — Support & Restoration' },
];

const ENERGY_DIMENSIONS = [
  { value: 'N1', label: 'N1 — People' },
  { value: 'N2', label: 'N2 — Problems' },
  { value: 'N3', label: 'N3 — Completion' },
  { value: 'N4', label: 'N4 — Mastery' },
  { value: 'N5', label: 'N5 — Helping' },
  { value: 'N6', label: 'N6 — Building' },
  { value: 'N7', label: 'N7 — Complexity' },
];

// Mock peer comparison data (since we don't have real aggregated data yet)
const PEER_BENCHMARKS: Record<string, Record<string, number>> = {
  'N1': { 'student': 6.2, 'early-career': 6.8, 'mid-career': 6.5, 'senior': 7.1 },
  'N2': { 'student': 5.9, 'early-career': 7.2, 'mid-career': 7.4, 'senior': 6.9 },
  'N3': { 'student': 6.5, 'early-career': 6.8, 'mid-career': 7.3, 'senior': 7.5 },
  'N4': { 'student': 7.1, 'early-career': 6.7, 'mid-career': 6.4, 'senior': 6.2 },
  'N5': { 'student': 5.8, 'early-career': 5.6, 'mid-career': 6.1, 'senior': 6.8 },
  'N6': { 'student': 6.4, 'early-career': 6.9, 'mid-career': 6.5, 'senior': 5.8 },
  'N7': { 'student': 5.5, 'early-career': 6.3, 'mid-career': 7.0, 'senior': 7.4 },
};

const DIMENSION_LABELS: Record<string, { name: string; color: string }> = {
  N1: { name: 'People', color: 'bg-blue-500' },
  N2: { name: 'Problems', color: 'bg-violet-500' },
  N3: { name: 'Completion', color: 'bg-emerald-500' },
  N4: { name: 'Mastery', color: 'bg-amber-500' },
  N5: { name: 'Helping', color: 'bg-rose-500' },
  N6: { name: 'Building', color: 'bg-cyan-500' },
  N7: { name: 'Complexity', color: 'bg-indigo-500' },
};

export default function PeerMirrorPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [responses, setResponses] = useState<PeerMirrorResponse>({
    age: null,
    careerStage: null,
    careerFamily: null,
    energyDimensions: [],
  });

  const canProceed = useCallback(() => {
    return (
      responses.age !== null &&
      responses.careerStage !== null &&
      responses.careerFamily !== null &&
      responses.energyDimensions.length === 3
    );
  }, [responses]);

  const handleEnergyToggle = useCallback((dimension: string) => {
    setResponses((prev) => {
      const current = [...prev.energyDimensions];
      const index = current.indexOf(dimension);
      if (index >= 0) {
        current.splice(index, 1);
      } else if (current.length < 3) {
        current.push(dimension);
      }
      return { ...prev, energyDimensions: current };
    });
  }, []);

  const generateYourScores = (): Record<string, number> => {
    const scores: Record<string, number> = {};
    for (const dim of ENERGY_DIMENSIONS.map((e) => e.value)) {
      if (responses.energyDimensions.includes(dim)) {
        scores[dim] = 7 + Math.random() * 2.5; // 7-9.5 for selected
      } else {
        scores[dim] = 4 + Math.random() * 3; // 4-7 for others
      }
      scores[dim] = Math.round(scores[dim] * 10) / 10;
    }
    return scores;
  };

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Peer Mirror" subtitle="Compare yourself against similar career cohorts" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            How do you compare to people in your career stage and family? This tool helps you see your energy patterns
            relative to peer benchmarks—which can reveal blind spots or confirm your strengths.
          </p>
          <p className="text-sm text-surface-500">
            We'll ask about your career stage, primary career family, and top 3 energy dimensions. Then you'll see how
            you stack up against the cohort.
          </p>
          <button onClick={() => setPhase('questions')} className="btn-primary">
            Start Peer Comparison
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── QUESTIONS ──
  if (phase === 'questions') {
    return (
      <ToolShell title="Peer Mirror" subtitle="Tell us about yourself" currentStep={0} totalSteps={1}>
        <div className="card space-y-6">
          {/* Age */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              What is your age?
            </label>
            <input
              type="number"
              min="16"
              max="120"
              value={responses.age ?? ''}
              onChange={(e) =>
                setResponses((prev) => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : null }))
              }
              className="input w-full"
              placeholder="e.g., 32"
            />
          </div>

          {/* Career Stage */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              Career stage
            </label>
            <SelectInput
              value={responses.careerStage}
              onChange={(value) => setResponses((prev) => ({ ...prev, careerStage: value }))}
              options={CAREER_STAGES}
            />
          </div>

          {/* Career Family */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              Primary career family
            </label>
            <SelectInput
              value={responses.careerFamily}
              onChange={(value) => setResponses((prev) => ({ ...prev, careerFamily: value }))}
              options={CAREER_FAMILIES}
            />
          </div>

          {/* Energy Dimensions */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              Your top 3 energy dimensions
            </label>
            <p className="text-xs text-surface-500 mb-3">Select exactly 3 dimensions that energize you most.</p>
            <div className="space-y-2">
              {ENERGY_DIMENSIONS.map((dim) => (
                <button
                  key={dim.value}
                  onClick={() => handleEnergyToggle(dim.value)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    responses.energyDimensions.includes(dim.value)
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-surface-200 bg-surface-50 hover:border-surface-300'
                  }`}
                >
                  <span className="text-sm font-medium text-surface-900">{dim.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-surface-400 mt-2">
              Selected: {responses.energyDimensions.length}/3
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={() => setPhase('results')}
            disabled={!canProceed()}
            className="btn-primary w-full"
          >
            See Peer Comparison
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const yourScores = generateYourScores();
    const careerStageLabel = CAREER_STAGES.find((s) => s.value === responses.careerStage)?.label || responses.careerStage;
    const careerFamilyLabel = CAREER_FAMILIES.find((f) => f.value === responses.careerFamily)?.label || responses.careerFamily;

    return (
      <ToolShell title="Peer Mirror" subtitle="Your Peer Comparison">
        <div className="space-y-6">
          {/* Context */}
          <div className="card bg-blue-50 border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Your cohort:</strong> {careerStageLabel}, {careerFamilyLabel}
            </p>
          </div>

          {/* Comparison Bars */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Energy Dimension Comparison</h3>
            <div className="space-y-4">
              {ENERGY_DIMENSIONS.map((dim) => {
                const yourScore = yourScores[dim.value];
                const peerAvg = PEER_BENCHMARKS[dim.value]?.[responses.careerStage || 'early-career'] || 6.5;
                const info = DIMENSION_LABELS[dim.value];

                return (
                  <div key={dim.value} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-surface-700">{info.name}</span>
                      <span className="text-xs text-surface-400">You: {yourScore}/10 | Peers: {Math.round(peerAvg * 10) / 10}/10</span>
                    </div>
                    <div className="flex gap-2">
                      {/* Your score */}
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${info.color}`}
                            style={{ width: `${(yourScore / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      {/* Peer avg */}
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full opacity-40 ${info.color}`}
                            style={{ width: `${(peerAvg / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-surface-500">
              <strong>Legend:</strong> Left bar = your score, right bar (faded) = peer average
            </p>
          </div>

          {/* Note about data maturity */}
          <div className="card bg-amber-50 border-amber-200">
            <h3 className="text-sm font-medium text-amber-800 mb-1">Data grows with participation</h3>
            <p className="text-xs text-amber-700">
              These peer benchmarks become more accurate as more people in your cohort complete assessments. Right now
              they're estimates based on early data. Check back later to see how the comparisons evolve.
            </p>
          </div>

          {/* Insights */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-2">What this means</h3>
            <ul className="text-xs text-surface-600 space-y-2">
              <li>• Scores significantly higher than peers suggest a rare strength for your cohort</li>
              <li>• Scores below peer average might reveal an area where you could lean into growth</li>
              <li>• Your top 3 dimensions should be noticeably higher than the rest</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResponses({ age: null, careerStage: null, careerFamily: null, energyDimensions: [] });
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

  return null;
}
