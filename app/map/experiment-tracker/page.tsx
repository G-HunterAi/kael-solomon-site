'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { X } from 'lucide-react';

type Phase = 'intro' | 'add-experiment' | 'results';

interface Experiment {
  id: string;
  hypothesis: string;
  experimentType: 'informational-interview' | 'job-shadow' | 'side-project' | 'course' | 'volunteer' | 'other';
  duration: '1-day' | '1-week' | '1-month';
  energyBefore: number | null;
  energyAfter: number | null;
  insight: string;
}

const EXPERIMENT_TYPES = [
  { value: 'informational-interview', label: 'Informational Interview' },
  { value: 'job-shadow', label: 'Job Shadow' },
  { value: 'side-project', label: 'Side Project' },
  { value: 'course', label: 'Course/Class' },
  { value: 'volunteer', label: 'Volunteer Work' },
  { value: 'other', label: 'Other' },
];

const DURATION_OPTIONS = [
  { value: '1-day', label: '1 Day' },
  { value: '1-week', label: '1 Week' },
  { value: '1-month', label: '1 Month' },
];

export default function ExperimentTrackerPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [currentExperiment, setCurrentExperiment] = useState<Partial<Experiment>>({
    experimentType: 'informational-interview',
    duration: '1-week',
  });

  const canAddExperiment =
    currentExperiment.hypothesis?.trim() &&
    currentExperiment.experimentType &&
    currentExperiment.duration &&
    currentExperiment.energyBefore != null &&
    currentExperiment.energyAfter != null &&
    currentExperiment.insight?.trim();

  const resetExperimentForm = useCallback(() => {
    setCurrentExperiment({
      experimentType: 'informational-interview',
      duration: '1-week',
    });
  }, []);

  const addExperiment = useCallback(() => {
    if (!canAddExperiment) return;
    const newExperiment: Experiment = {
      id: `exp-${Date.now()}`,
      hypothesis: currentExperiment.hypothesis || '',
      experimentType: currentExperiment.experimentType as Experiment['experimentType'],
      duration: currentExperiment.duration as Experiment['duration'],
      energyBefore: currentExperiment.energyBefore || 0,
      energyAfter: currentExperiment.energyAfter || 0,
      insight: currentExperiment.insight || '',
    };
    setExperiments((prev) => [...prev, newExperiment]);
    resetExperimentForm();
  }, [canAddExperiment, currentExperiment, resetExperimentForm]);

  const removeExperiment = useCallback((id: string) => {
    setExperiments((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const computeResults = useCallback(() => {
    if (experiments.length === 0) return { experiments: [], avgDelta: 0, bestExperiments: [] };

    const avgDelta = experiments.reduce((sum, e) => sum + (e.energyAfter! - e.energyBefore!), 0) / experiments.length;
    const bestExperiments = [...experiments]
      .sort((a, b) => (b.energyAfter! - b.energyBefore!) - (a.energyAfter! - a.energyBefore!))
      .slice(0, 3);

    return { experiments, avgDelta, bestExperiments };
  }, [experiments]);

  // -- INTRO --
  if (phase === 'intro') {
    return (
      <ToolShell title="Experiment Tracker" subtitle="Log micro-experiments to test career hypotheses" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Career exploration is best done through experimentation. This tool lets you log structured experiments
            testing your career hypotheses, track your energy before and after, and identify patterns in what energizes
            you.
          </p>
          <p className="text-sm text-surface-500">
            Add up to 10 experiments, then we&apos;ll show you which directions consistently boost your energy.
          </p>
          <button onClick={() => setPhase('add-experiment')} className="btn-primary">
            Start Tracking
          </button>
        </div>
      </ToolShell>
    );
  }

  // -- ADD EXPERIMENT --
  if (phase === 'add-experiment') {
    return (
      <ToolShell
        title="Experiment Tracker"
        subtitle={`Logged: ${experiments.length} / 10 experiments`}
        showBackButton={false}
      >
        <div className="space-y-6">
          {/* Experiment form */}
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">
                What&apos;s your hypothesis?
              </label>
              <textarea
                value={currentExperiment.hypothesis || ''}
                onChange={(e) =>
                  setCurrentExperiment((prev) => ({ ...prev, hypothesis: e.target.value }))
                }
                className="input min-h-[80px] resize-y"
                placeholder="e.g., 'Product management energizes me more than pure coding'"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-900 mb-2">Experiment Type</label>
                <select
                  value={currentExperiment.experimentType || ''}
                  onChange={(e) =>
                    setCurrentExperiment((prev) => ({
                      ...prev,
                      experimentType: e.target.value as Experiment['experimentType'],
                    }))
                  }
                  className="input"
                >
                  {EXPERIMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-900 mb-2">Duration</label>
                <select
                  value={currentExperiment.duration || ''}
                  onChange={(e) =>
                    setCurrentExperiment((prev) => ({
                      ...prev,
                      duration: e.target.value as Experiment['duration'],
                    }))
                  }
                  className="input"
                >
                  {DURATION_OPTIONS.map((dur) => (
                    <option key={dur.value} value={dur.value}>
                      {dur.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-900 mb-2">Energy Before (1-10)</label>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                    <button
                      key={v}
                      onClick={() =>
                        setCurrentExperiment((prev) => ({ ...prev, energyBefore: v }))
                      }
                      className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                        currentExperiment.energyBefore === v
                          ? 'bg-violet-600 text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-900 mb-2">Energy After (1-10)</label>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                    <button
                      key={v}
                      onClick={() =>
                        setCurrentExperiment((prev) => ({ ...prev, energyAfter: v }))
                      }
                      className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${
                        currentExperiment.energyAfter === v
                          ? 'bg-violet-600 text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">Key Insight</label>
              <textarea
                value={currentExperiment.insight || ''}
                onChange={(e) =>
                  setCurrentExperiment((prev) => ({ ...prev, insight: e.target.value }))
                }
                className="input min-h-[80px] resize-y"
                placeholder="What did you learn from this experiment?"
              />
            </div>

            <div className="flex gap-3 pt-2 border-t border-surface-100">
              <button
                onClick={addExperiment}
                disabled={!canAddExperiment || experiments.length >= 10}
                className="btn-primary flex-1"
              >
                {experiments.length >= 10 ? 'Max Experiments Reached' : 'Add Experiment'}
              </button>
            </div>
          </div>

          {/* Logged experiments list */}
          {experiments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-surface-900">Logged Experiments</h3>
              {experiments.map((exp, idx) => {
                const delta = exp.energyAfter! - exp.energyBefore!;
                return (
                  <div key={exp.id} className="card border border-surface-200 p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-surface-900 mb-1">{idx + 1}. {exp.hypothesis}</div>
                        <div className="flex gap-2 flex-wrap text-xs text-surface-500">
                          <span>{EXPERIMENT_TYPES.find((t) => t.value === exp.experimentType)?.label}</span>
                          <span>&bull;</span>
                          <span>{DURATION_OPTIONS.find((d) => d.value === exp.duration)?.label}</span>
                          <span>&bull;</span>
                          <span
                            className={`font-semibold ${
                              delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-surface-500'
                            }`}
                          >
                            {delta > 0 ? `+${delta}` : delta} energy
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeExperiment(exp.id)}
                        className="flex-shrink-0 text-surface-400 hover:text-surface-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2 border-t border-surface-100">
            <button
              onClick={() => setPhase('results')}
              disabled={experiments.length === 0}
              className="btn-primary flex-1"
            >
              View Results
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // -- RESULTS --
  if (phase === 'results') {
    const { experiments: exps, avgDelta, bestExperiments } = computeResults();

    return (
      <ToolShell title="Experiment Tracker" subtitle="Your Results">
        <div className="space-y-6">
          {/* Summary */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-semibold text-violet-600">{exps.length}</div>
                <div className="text-xs text-surface-500">Experiments</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-semibold ${avgDelta > 0 ? 'text-emerald-600' : avgDelta < 0 ? 'text-rose-600' : 'text-surface-600'}`}>
                  {avgDelta > 0 ? '+' : ''}{(avgDelta * 10).toFixed(1)}
                </div>
                <div className="text-xs text-surface-500">Avg energy delta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-emerald-600">{bestExperiments.length}</div>
                <div className="text-xs text-surface-500">High-energy exps</div>
              </div>
            </div>
          </div>

          {/* Best experiments */}
          {bestExperiments.length > 0 && (
            <div className="card border border-emerald-200 bg-emerald-50">
              <h3 className="text-sm font-medium text-emerald-900 mb-3">Directions That Energize You Most</h3>
              <div className="space-y-3">
                {bestExperiments.map((exp) => {
                  const delta = exp.energyAfter! - exp.energyBefore!;
                  return (
                    <div key={exp.id} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-emerald-900">{exp.hypothesis}</span>
                        <span className="text-xs font-semibold text-emerald-600">+{delta}</span>
                      </div>
                      <p className="text-xs text-emerald-700">{exp.insight}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All experiments */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">All Experiments</h3>
            <div className="space-y-3">
              {exps.map((exp) => {
                const delta = exp.energyAfter! - exp.energyBefore!;
                return (
                  <div key={exp.id} className="space-y-2 pb-3 border-b border-surface-100 last:pb-0 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-surface-900">{exp.hypothesis}</span>
                      <span
                        className={`text-xs font-semibold ${
                          delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-surface-500'
                        }`}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 h-2">
                      <span className="text-xs text-surface-500">{exp.energyBefore}</span>
                      <div className="flex-1 rounded-full bg-surface-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            exp.energyAfter! > exp.energyBefore!
                              ? 'bg-emerald-400'
                              : exp.energyAfter! < exp.energyBefore!
                              ? 'bg-rose-400'
                              : 'bg-surface-300'
                          }`}
                          style={{ width: `${((exp.energyAfter!) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-surface-500">{exp.energyAfter}</span>
                    </div>
                    <p className="text-xs text-surface-600 italic">{exp.insight}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div className="card border border-surface-200 bg-surface-50">
            <h3 className="text-sm font-medium text-surface-900 mb-2">Next Steps</h3>
            <p className="text-xs text-surface-600">
              {avgDelta > 1
                ? 'You\'re learning a lot through these experiments! Keep testing hypotheses and double down on areas that energize you.'
                : avgDelta > 0
                ? 'Mixed results suggest you need more targeted experiments. Focus on specific aspects of each direction.'
                : 'These experiments are revealing what doesn\'t work — equally valuable. Use these insights to refine your next hypotheses.'}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setExperiments([]);
                resetExperimentForm();
                setPhase('add-experiment');
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
}
