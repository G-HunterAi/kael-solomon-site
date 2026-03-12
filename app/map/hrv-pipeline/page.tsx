'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';

type Phase = 'intro' | 'questions' | 'results';

interface HrvResponse {
  restingHeartRate: number | null;
  sleepQuality: number | null;
  sleepHours: number | null;
  exerciseFrequency: number | null;
  stressLevel: number | null;
  recoveryQuality: number | null;
}

const METRIC_DEFINITIONS = {
  restingHeartRate: {
    label: 'Resting heart rate',
    description: 'Your typical heart rate when sitting quietly (beats per minute)',
    min: 40,
    max: 120,
    unit: 'bpm',
  },
  sleepQuality: {
    label: 'Sleep quality',
    description: 'How well you sleep on a typical night',
    min: 1,
    max: 10,
    unit: '',
  },
  sleepHours: {
    label: 'Sleep hours',
    description: 'Average hours of sleep per night',
    min: 3,
    max: 12,
    unit: 'hours',
  },
  exerciseFrequency: {
    label: 'Exercise frequency',
    description: 'How many days per week do you exercise?',
    min: 0,
    max: 7,
    unit: 'days/week',
  },
  stressLevel: {
    label: 'Current stress level',
    description: 'Your perceived stress right now',
    min: 1,
    max: 10,
    unit: '',
  },
  recoveryQuality: {
    label: 'Recovery quality',
    description: 'How well you recover between workouts or stressful events',
    min: 1,
    max: 10,
    unit: '',
  },
};

function calculatePhysiologicalBalance(responses: HrvResponse): {
  score: number;
  details: Record<string, { score: number; status: string; color: string }>;
} {
  const details: Record<string, { score: number; status: string; color: string }> = {};

  // HRV score (lower resting HR is generally better, optimal 50-70)
  let hrvScore = 0;
  if (responses.restingHeartRate !== null) {
    const rhr = responses.restingHeartRate;
    if (rhr < 50) {
      hrvScore = 9 + (50 - rhr) * 0.1;
    } else if (rhr <= 70) {
      hrvScore = 9 + (70 - rhr) * 0.05;
    } else if (rhr <= 90) {
      hrvScore = 8 - (rhr - 70) * 0.05;
    } else {
      hrvScore = 7 - (rhr - 90) * 0.05;
    }
  }
  details.hrv = {
    score: Math.max(1, Math.min(10, Math.round(hrvScore * 10) / 10)),
    status: responses.restingHeartRate && responses.restingHeartRate <= 70 ? 'optimal' : 'monitor',
    color: responses.restingHeartRate && responses.restingHeartRate <= 70 ? 'bg-emerald-500' : 'bg-amber-500',
  };

  // Sleep quality score
  details.sleepQuality = {
    score: responses.sleepQuality ?? 5,
    status: (responses.sleepQuality ?? 0) >= 7 ? 'good' : 'needs-work',
    color: (responses.sleepQuality ?? 0) >= 7 ? 'bg-emerald-500' : 'bg-rose-500',
  };

  // Sleep duration score (optimal 7-9 hours)
  let sleepDurationScore = 0;
  if (responses.sleepHours !== null) {
    if (responses.sleepHours >= 7 && responses.sleepHours <= 9) {
      sleepDurationScore = 9;
    } else if (responses.sleepHours >= 6 && responses.sleepHours < 10) {
      sleepDurationScore = 8;
    } else if (responses.sleepHours >= 5 && responses.sleepHours < 11) {
      sleepDurationScore = 6;
    } else {
      sleepDurationScore = 4;
    }
  }
  details.sleepDuration = {
    score: sleepDurationScore || 5,
    status: sleepDurationScore >= 8 ? 'optimal' : sleepDurationScore >= 6 ? 'adequate' : 'insufficient',
    color: sleepDurationScore >= 8 ? 'bg-emerald-500' : sleepDurationScore >= 6 ? 'bg-blue-500' : 'bg-rose-500',
  };

  // Exercise frequency score (3-5 days/week is optimal)
  let exerciseScore = 0;
  if (responses.exerciseFrequency !== null) {
    const freq = responses.exerciseFrequency;
    if (freq >= 3 && freq <= 5) {
      exerciseScore = 9;
    } else if (freq >= 2 && freq <= 6) {
      exerciseScore = 7;
    } else if (freq >= 1 && freq <= 7) {
      exerciseScore = 5;
    } else {
      exerciseScore = 3;
    }
  }
  details.exercise = {
    score: exerciseScore || 5,
    status: exerciseScore >= 8 ? 'optimal' : exerciseScore >= 6 ? 'good' : 'below-target',
    color: exerciseScore >= 8 ? 'bg-emerald-500' : exerciseScore >= 6 ? 'bg-blue-500' : 'bg-amber-500',
  };

  // Stress level score (inverse: lower stress is better)
  let stressScore = 0;
  if (responses.stressLevel !== null) {
    stressScore = Math.round((10 - responses.stressLevel) * 1.11);
  }
  details.stress = {
    score: Math.max(1, Math.min(10, stressScore || 5)),
    status: (responses.stressLevel ?? 5) <= 4 ? 'low' : (responses.stressLevel ?? 5) <= 7 ? 'moderate' : 'high',
    color: (responses.stressLevel ?? 5) <= 4 ? 'bg-emerald-500' : (responses.stressLevel ?? 5) <= 7 ? 'bg-blue-500' : 'bg-rose-500',
  };

  // Recovery quality score
  details.recovery = {
    score: responses.recoveryQuality ?? 5,
    status: (responses.recoveryQuality ?? 0) >= 7 ? 'strong' : 'needs-work',
    color: (responses.recoveryQuality ?? 0) >= 7 ? 'bg-emerald-500' : 'bg-amber-500',
  };

  // Overall physiological balance score
  const scores = Object.values(details).map((d) => d.score);
  const overallScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;

  return { score: overallScore, details };
}

export default function HrvPipelinePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [responses, setResponses] = useState<HrvResponse>({
    restingHeartRate: null,
    sleepQuality: null,
    sleepHours: null,
    exerciseFrequency: null,
    stressLevel: null,
    recoveryQuality: null,
  });

  const canProceed = useCallback(() => {
    return Object.values(responses).every((v) => v !== null);
  }, [responses]);

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <ToolShell title="HRV Pipeline" subtitle="Physiological balance score from self-reported data" duration="~3 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Heart rate variability (HRV) is a key marker of physiological health and stress recovery. This assessment
            estimates your HRV-related balance based on sleep quality, resting heart rate, exercise, stress, and recovery.
          </p>
          <p className="text-sm text-surface-500">
            We can't read your actual HRV data yet, but these self-reported inputs give us a good picture of your
            physiological state. Answer quickly based on what's typical for you right now.
          </p>
          <button onClick={() => setPhase('questions')} className="btn-primary">
            Start Assessment
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── QUESTIONS ──
  if (phase === 'questions') {
    return (
      <ToolShell title="HRV Pipeline" subtitle="Tell us about your physiology" currentStep={0} totalSteps={1}>
        <div className="card space-y-6">
          {/* Resting Heart Rate */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              {METRIC_DEFINITIONS.restingHeartRate.label}
            </label>
            <p className="text-xs text-surface-500">{METRIC_DEFINITIONS.restingHeartRate.description}</p>
            <div className="flex gap-2">
              <input
                type="number"
                min={METRIC_DEFINITIONS.restingHeartRate.min}
                max={METRIC_DEFINITIONS.restingHeartRate.max}
                value={responses.restingHeartRate ?? ''}
                onChange={(e) =>
                  setResponses((prev) => ({ ...prev, restingHeartRate: e.target.value ? parseInt(e.target.value) : null }))
                }
                className="input flex-1"
                placeholder="e.g., 65"
              />
              <span className="flex items-center text-xs text-surface-500">{METRIC_DEFINITIONS.restingHeartRate.unit}</span>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              {METRIC_DEFINITIONS.sleepQuality.label}
            </label>
            <p className="text-xs text-surface-500">{METRIC_DEFINITIONS.sleepQuality.description}</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => setResponses((prev) => ({ ...prev, sleepQuality: v }))}
                  className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                    responses.sleepQuality === v
                      ? 'bg-blue-600 text-white'
                      : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Hours */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              {METRIC_DEFINITIONS.sleepHours.label}
            </label>
            <p className="text-xs text-surface-500">{METRIC_DEFINITIONS.sleepHours.description}</p>
            <div className="flex gap-2">
              <input
                type="number"
                min={METRIC_DEFINITIONS.sleepHours.min}
                max={METRIC_DEFINITIONS.sleepHours.max}
                step="0.5"
                value={responses.sleepHours ?? ''}
                onChange={(e) =>
                  setResponses((prev) => ({ ...prev, sleepHours: e.target.value ? parseFloat(e.target.value) : null }))
                }
                className="input flex-1"
                placeholder="e.g., 7.5"
              />
              <span className="flex items-center text-xs text-surface-500">{METRIC_DEFINITIONS.sleepHours.unit}</span>
            </div>
          </div>

          {/* Exercise Frequency */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              {METRIC_DEFINITIONS.exerciseFrequency.label}
            </label>
            <p className="text-xs text-surface-500">{METRIC_DEFINITIONS.exerciseFrequency.description}</p>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => i).map((v) => (
                <button
                  key={v}
                  onClick={() => setResponses((prev) => ({ ...prev, exerciseFrequency: v }))}
                  className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                    responses.exerciseFrequency === v
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              {METRIC_DEFINITIONS.stressLevel.label}
            </label>
            <p className="text-xs text-surface-500">{METRIC_DEFINITIONS.stressLevel.description}</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => setResponses((prev) => ({ ...prev, stressLevel: v }))}
                  className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                    responses.stressLevel === v
                      ? v <= 3
                        ? 'bg-emerald-600 text-white'
                        : v <= 6
                          ? 'bg-blue-600 text-white'
                          : 'bg-rose-600 text-white'
                      : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Recovery Quality */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-surface-900">
              {METRIC_DEFINITIONS.recoveryQuality.label}
            </label>
            <p className="text-xs text-surface-500">{METRIC_DEFINITIONS.recoveryQuality.description}</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => setResponses((prev) => ({ ...prev, recoveryQuality: v }))}
                  className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                    responses.recoveryQuality === v
                      ? 'bg-indigo-600 text-white'
                      : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button onClick={() => setPhase('results')} disabled={!canProceed()} className="btn-primary w-full">
            Calculate Physiological Balance
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const { score, details } = calculatePhysiologicalBalance(responses);

    return (
      <ToolShell title="HRV Pipeline" subtitle="Your Physiological Balance Score">
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card text-center">
            <div className="text-xs text-surface-400 uppercase tracking-wider mb-2">Physiological Balance</div>
            <div
              className={`text-5xl font-semibold tabular-nums ${
                score >= 8 ? 'text-emerald-600' : score >= 6 ? 'text-blue-600' : score >= 4 ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {score}
              <span className="text-xl text-surface-300">/10</span>
            </div>
            <p className="mt-3 text-xs text-surface-500">
              {score >= 8
                ? 'Excellent recovery capacity and physiological health'
                : score >= 6
                  ? 'Good baseline, some areas for optimization'
                  : score >= 4
                    ? 'Moderate — focus on sleep and stress'
                    : 'Below optimal — recovery may be challenged'}
            </p>
          </div>

          {/* Metric Breakdown */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Metric Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(details).map(([key, detail]) => {
                const labels: Record<string, string> = {
                  hrv: 'Heart Rate Variability',
                  sleepQuality: 'Sleep Quality',
                  sleepDuration: 'Sleep Duration',
                  exercise: 'Exercise Frequency',
                  stress: 'Stress Level',
                  recovery: 'Recovery Quality',
                };

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-surface-700">{labels[key]}</span>
                      <span className="text-xs font-semibold text-surface-700">{detail.score}/10</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                      <div className={`h-full rounded-full ${detail.color}`} style={{ width: `${(detail.score / 10) * 100}%` }} />
                    </div>
                    <p className="mt-0.5 text-xs text-surface-400 capitalize">{detail.status.replace('-', ' ')}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-3">Recommendations</h3>
            <ul className="text-xs text-surface-600 space-y-2">
              {details.sleepQuality.score < 7 && <li>• Prioritize sleep quality — establish a consistent bedtime routine</li>}
              {details.sleepDuration.score < 7 && <li>• Aim for 7–9 hours per night. You're currently below target.</li>}
              {details.exercise.score < 7 && <li>• Increase exercise to 3–5 days per week for optimal HRV recovery</li>}
              {details.stress.score < 7 && <li>• Your stress is elevated. Consider stress management techniques like meditation or breathwork.</li>}
              {details.recovery.score < 7 && <li>• Improve recovery: allow rest days between intense workouts, prioritize sleep</li>}
              {score >= 8 && <li>• Maintain your current practices — your physiology is in excellent shape</li>}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResponses({
                  restingHeartRate: null,
                  sleepQuality: null,
                  sleepHours: null,
                  exerciseFrequency: null,
                  stressLevel: null,
                  recoveryQuality: null,
                });
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
