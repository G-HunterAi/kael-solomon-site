'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';

type Phase = 'intro' | 'parent-questions' | 'child-questions' | 'results';

interface EnergyDimension {
  id: string;
  label: string;
  description: string;
}

const ENERGY_DIMENSIONS: EnergyDimension[] = [
  { id: 'e1', label: 'Analytical Energy', description: 'Solving problems through logic and data' },
  { id: 'e2', label: 'Creative Energy', description: 'Generating new ideas and original solutions' },
  { id: 'e3', label: 'People Energy', description: 'Building relationships and helping others' },
  { id: 'e4', label: 'Leadership Energy', description: 'Taking charge and influencing direction' },
  { id: 'e5', label: 'Building Energy', description: 'Creating tangible things or systems' },
  { id: 'e6', label: 'Impact Energy', description: 'Making a difference in the world' },
  { id: 'e7', label: 'Freedom Energy', description: 'Autonomy and independence in work' },
];

export default function ParentProfilePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [parentEnergy, setParentEnergy] = useState<Record<string, number>>({});
  const [childEnergy, setChildEnergy] = useState<Record<string, number>>({});
  const [stepIndex, setStepIndex] = useState(0);

  const allParentAnswered = ENERGY_DIMENSIONS.every((d) => parentEnergy[d.id] != null);
  const allChildAnswered = ENERGY_DIMENSIONS.every((d) => childEnergy[d.id] != null);
  const currentDimension = ENERGY_DIMENSIONS[stepIndex];

  const updateParentEnergy = useCallback((dimensionId: string, value: number) => {
    setParentEnergy((prev) => ({ ...prev, [dimensionId]: value }));
  }, []);

  const updateChildEnergy = useCallback((dimensionId: string, value: number) => {
    setChildEnergy((prev) => ({ ...prev, [dimensionId]: value }));
  }, []);

  const computeResults = useCallback(() => {
    const mismatches = ENERGY_DIMENSIONS.map((d) => {
      const pScore = parentEnergy[d.id] || 0;
      const cScore = childEnergy[d.id] || 0;
      const gap = pScore - cScore;
      return {
        ...d,
        parentScore: pScore,
        childScore: cScore,
        gap,
        isProjectionZone: pScore >= 7 && cScore <= 4,
      };
    })
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

    return mismatches;
  }, [parentEnergy, childEnergy]);

  // -- INTRO --
  if (phase === 'intro') {
    return (
      <ToolShell title="Parent Profile" subtitle="Understand your energy patterns" duration="~10 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            This tool helps you understand your own career energy patterns so you can better support your child&apos;s
            career exploration <strong>without projecting your own preferences</strong>.
          </p>
          <p className="text-sm text-surface-500">
            You&apos;ll rate yourself on 7 energy dimensions, then rate how you perceive your child&apos;s energy on the same
            dimensions. We&apos;ll compare the patterns to highlight areas where you might unconsciously project.
          </p>
          <button onClick={() => setPhase('parent-questions')} className="btn-primary">
            Begin Profile
          </button>
        </div>
      </ToolShell>
    );
  }

  // -- PARENT QUESTIONS --
  if (phase === 'parent-questions') {
    const canProceed = currentDimension && parentEnergy[currentDimension.id] != null;

    return (
      <ToolShell
        title="Your Energy Pattern"
        subtitle={currentDimension?.label}
        currentStep={stepIndex}
        totalSteps={ENERGY_DIMENSIONS.length}
        progress={Math.round(((stepIndex) / ENERGY_DIMENSIONS.length) * 100)}
      >
        <div className="card space-y-6">
          <div>
            <p className="text-sm text-surface-600 mb-2">{currentDimension?.description}</p>
            <p className="text-sm font-medium text-surface-900 mb-3">How much energy do you have for this?</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => updateParentEnergy(currentDimension!.id, v)}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-colors ${
                    parentEnergy[currentDimension!.id] === v
                      ? 'bg-orange-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>Low energy</span>
              <span>High energy</span>
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
                if (stepIndex === ENERGY_DIMENSIONS.length - 1 && allParentAnswered) {
                  setStepIndex(0);
                  setPhase('child-questions');
                } else {
                  setStepIndex(Math.min(ENERGY_DIMENSIONS.length - 1, stepIndex + 1));
                }
              }}
              disabled={!canProceed}
              className="btn-primary flex-1"
            >
              {stepIndex === ENERGY_DIMENSIONS.length - 1 ? 'Continue to Child Profile' : 'Next'}
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // -- CHILD QUESTIONS --
  if (phase === 'child-questions') {
    const canProceed = currentDimension && childEnergy[currentDimension.id] != null;

    return (
      <ToolShell
        title="Child's Energy Pattern"
        subtitle={currentDimension?.label}
        currentStep={stepIndex}
        totalSteps={ENERGY_DIMENSIONS.length}
        progress={Math.round(((stepIndex) / ENERGY_DIMENSIONS.length) * 100)}
      >
        <div className="card space-y-6">
          <div>
            <p className="text-sm text-surface-600 mb-2">{currentDimension?.description}</p>
            <p className="text-sm font-medium text-surface-900 mb-3">How much energy does your child have for this?</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => updateChildEnergy(currentDimension!.id, v)}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-colors ${
                    childEnergy[currentDimension!.id] === v
                      ? 'bg-amber-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>Low energy</span>
              <span>High energy</span>
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
                if (stepIndex === ENERGY_DIMENSIONS.length - 1 && allChildAnswered) {
                  setPhase('results');
                } else {
                  setStepIndex(Math.min(ENERGY_DIMENSIONS.length - 1, stepIndex + 1));
                }
              }}
              disabled={!canProceed}
              className="btn-primary flex-1"
            >
              {stepIndex === ENERGY_DIMENSIONS.length - 1 ? 'See Comparison' : 'Next'}
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // -- RESULTS --
  if (phase === 'results') {
    const results = computeResults();
    const projectionZones = results.filter((r) => r.isProjectionZone);
    const avgParentScore = Object.values(parentEnergy).reduce((a, b) => a + b, 0) / ENERGY_DIMENSIONS.length;
    const avgChildScore = Object.values(childEnergy).reduce((a, b) => a + b, 0) / ENERGY_DIMENSIONS.length;

    return (
      <ToolShell title="Parent Profile" subtitle="Your Results">
        <div className="space-y-6">
          {/* Alignment overview */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Energy Pattern Comparison</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-orange-600">{Math.round(avgParentScore * 10) / 10}</div>
                <div className="text-xs text-surface-500">Your avg energy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-amber-600">{Math.round(avgChildScore * 10) / 10}</div>
                <div className="text-xs text-surface-500">Child&apos;s avg energy</div>
              </div>
            </div>
          </div>

          {/* Projection zones */}
          {projectionZones.length > 0 && (
            <div className="card border border-orange-200 bg-orange-50">
              <h3 className="text-sm font-medium text-orange-900 mb-3">Potential Projection Zones</h3>
              <p className="text-xs text-orange-700 mb-3">
                These are areas where you have high energy but your child has lower energy. Be mindful not to push
                these directions.
              </p>
              <div className="space-y-2">
                {projectionZones.map((r) => (
                  <div key={r.id} className="text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-orange-900">{r.label}</span>
                      <span className="text-xs text-orange-600">
                        You: {r.parentScore} &rarr; Child: {r.childScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full comparison table */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Detailed Comparison</h3>
            <div className="space-y-3">
              {results.map((r) => (
                <div key={r.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-surface-700">{r.label}</span>
                    <span className={`text-xs font-semibold ${r.gap > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                      {r.gap > 0 ? `+${r.gap}` : r.gap}
                    </span>
                  </div>
                  <div className="flex gap-2 h-2">
                    <div className="flex-1 rounded-full bg-surface-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-400"
                        style={{ width: `${((r.parentScore) / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 rounded-full bg-surface-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${((r.childScore) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-surface-400">
                    <span>You: {r.parentScore}</span>
                    <span>Child: {r.childScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidance */}
          <div className="card border border-surface-200 bg-surface-50">
            <h3 className="text-sm font-medium text-surface-900 mb-2">Supporting vs. Projecting</h3>
            <ul className="text-xs text-surface-600 space-y-2">
              <li>
                <strong>Support:</strong> Help your child explore their own high-energy areas, even if they differ from yours.
              </li>
              <li>
                <strong>Project:</strong> Pushing your high-energy areas on your child, especially if they don&apos;t naturally resonate.
              </li>
              <li>
                <strong>Alignment:</strong> Where your energies match, you can guide with enthusiasm and authentic experience.
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setParentEnergy({});
                setChildEnergy({});
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
}
