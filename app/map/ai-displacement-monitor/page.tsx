'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';

type Phase = 'intro' | 'profile' | 'assessment' | 'submitting' | 'results' | 'error';

interface DisplacementAssessment {
  jobTitle: string;
  yearsExperience: number;
  routineTasks: number | null;
  humanJudgment: number | null;
  creativeSolving: number | null;
  empathy: number | null;
  physicalPresence: number | null;
  aiAdvancement: number | null;
}

const ASSESSMENT_DIMENSIONS = [
  {
    id: 'routine',
    label: 'Routine & Repetitive Tasks',
    description: 'How much of your work involves routine tasks that follow predictable patterns?',
  },
  {
    id: 'judgment',
    label: 'Human Judgment & Nuance',
    description: 'How much requires human judgment, context sensitivity, and nuanced thinking?',
  },
  {
    id: 'creative',
    label: 'Creative & Novel Problem-Solving',
    description: 'How much involves creating original solutions or thinking outside the box?',
  },
  {
    id: 'empathy',
    label: 'Empathy & Human Relationships',
    description: 'How much involves understanding people\'s emotions and building relationships?',
  },
  {
    id: 'physical',
    label: 'Physical Presence & Dexterity',
    description: 'How much requires your physical presence or hands-on technical skill?',
  },
  {
    id: 'aiAdvance',
    label: 'AI Advancement in Your Field',
    description: 'How quickly is AI advancing in your specific domain?',
  },
];

export default function AIDisplacementMonitorPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [assessment, setAssessment] = useState<DisplacementAssessment>({
    jobTitle: '',
    yearsExperience: 0,
    routineTasks: null,
    humanJudgment: null,
    creativeSolving: null,
    empathy: null,
    physicalPresence: null,
    aiAdvancement: null,
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState<any>(null);

  const allProfileAnswered = assessment.jobTitle.trim().length > 0 && assessment.yearsExperience > 0;
  const allAssessmentAnswered =
    assessment.routineTasks != null &&
    assessment.humanJudgment != null &&
    assessment.creativeSolving != null &&
    assessment.empathy != null &&
    assessment.physicalPresence != null &&
    assessment.aiAdvancement != null;

  const currentDimension = ASSESSMENT_DIMENSIONS[stepIndex];

  const getValue = useCallback(
    (dimensionId: string): number | null => {
      const valueMap: Record<string, number | null> = {
        routine: assessment.routineTasks,
        judgment: assessment.humanJudgment,
        creative: assessment.creativeSolving,
        empathy: assessment.empathy,
        physical: assessment.physicalPresence,
        aiAdvance: assessment.aiAdvancement,
      };
      return valueMap[dimensionId];
    },
    [assessment]
  );

  const updateDimensionScore = useCallback((dimensionId: string, value: number) => {
    const updateMap: Record<string, (v: number) => DisplacementAssessment> = {
      routine: (v) => ({ ...assessment, routineTasks: v }),
      judgment: (v) => ({ ...assessment, humanJudgment: v }),
      creative: (v) => ({ ...assessment, creativeSolving: v }),
      empathy: (v) => ({ ...assessment, empathy: v }),
      physical: (v) => ({ ...assessment, physicalPresence: v }),
      aiAdvance: (v) => ({ ...assessment, aiAdvancement: v }),
    };
    setAssessment(updateMap[dimensionId](value));
  }, [assessment]);

  const computeResults = useCallback(() => {
    const riskScore = ((assessment.routineTasks || 0) + (assessment.aiAdvancement || 0)) / 2;
    const resilienceScore =
      ((assessment.humanJudgment || 0) +
        (assessment.creativeSolving || 0) +
        (assessment.empathy || 0) +
        (assessment.physicalPresence || 0)) /
      4;

    const netExposure = riskScore - resilienceScore;

    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    if (riskScore <= 3 && resilienceScore >= 7) {
      riskLevel = 'low';
    } else if (riskScore <= 5 && resilienceScore >= 5) {
      riskLevel = 'moderate';
    } else if (riskScore <= 7 && resilienceScore >= 3) {
      riskLevel = 'high';
    } else {
      riskLevel = 'critical';
    }

    return {
      riskScore,
      resilienceScore,
      netExposure,
      riskLevel,
    };
  }, [assessment]);

  const handleSubmit = useCallback(() => {
    setPhase('submitting');
    const computed = computeResults();
    setResults(computed);
    setPhase('results');
  }, [computeResults]);

  // -- INTRO --
  if (phase === 'intro') {
    return (
      <ToolShell title="AI Displacement Monitor" subtitle="Assess your career resilience" duration="~3 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            AI is transforming careers. Rather than panic, this tool helps you understand your specific exposure to
            displacement and identify skills that make you resilient.
          </p>
          <p className="text-sm text-surface-500">
            We&apos;ll assess how much of your role involves routine tasks (vulnerable to AI) versus human judgment and
            creativity (resilient to AI).
          </p>
          <button onClick={() => setPhase('profile')} className="btn-primary">
            Begin Assessment
          </button>
        </div>
      </ToolShell>
    );
  }

  // -- PROFILE --
  if (phase === 'profile') {
    return (
      <ToolShell
        title="AI Displacement Monitor"
        subtitle="Your Profile"
        showBackButton={false}
      >
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-900 mb-2">Current Job Title</label>
            <input
              type="text"
              value={assessment.jobTitle}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, jobTitle: e.target.value }))
              }
              className="input"
              placeholder="e.g., Software Engineer, Marketing Manager"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-900 mb-2">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="70"
              value={assessment.yearsExperience}
              onChange={(e) =>
                setAssessment((prev) => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))
              }
              className="input"
              placeholder="0"
            />
          </div>

          <button
            onClick={() => {
              if (allProfileAnswered) {
                setPhase('assessment');
              }
            }}
            disabled={!allProfileAnswered}
            className="btn-primary"
          >
            Continue to Assessment
          </button>
        </div>
      </ToolShell>
    );
  }

  // -- ASSESSMENT --
  if (phase === 'assessment') {
    const currentValue = getValue(currentDimension.id);
    const canProceed = currentValue != null;

    return (
      <ToolShell
        title="AI Displacement Monitor"
        subtitle={currentDimension?.label}
        currentStep={stepIndex}
        totalSteps={ASSESSMENT_DIMENSIONS.length}
        progress={Math.round(((stepIndex) / ASSESSMENT_DIMENSIONS.length) * 100)}
      >
        <div className="card space-y-6">
          <p className="text-sm text-surface-600">{currentDimension?.description}</p>

          <div>
            <p className="text-sm font-medium text-surface-900 mb-3">Rate this aspect (1-10)</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => updateDimensionScore(currentDimension!.id, v)}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-colors ${
                    currentValue === v
                      ? 'bg-cyan-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>Low</span>
              <span>High</span>
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
                if (stepIndex === ASSESSMENT_DIMENSIONS.length - 1 && allAssessmentAnswered) {
                  handleSubmit();
                } else {
                  setStepIndex(Math.min(ASSESSMENT_DIMENSIONS.length - 1, stepIndex + 1));
                }
              }}
              disabled={!canProceed}
              className="btn-primary flex-1"
            >
              {stepIndex === ASSESSMENT_DIMENSIONS.length - 1 ? 'Submit & See Results' : 'Next'}
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // -- SUBMITTING --
  if (phase === 'submitting') {
    return (
      <ToolShell title="AI Displacement Monitor" subtitle="Processing...">
        <div className="card text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-cyan-600" />
          <p className="mt-4 text-sm text-surface-500">Analyzing your resilience profile...</p>
        </div>
      </ToolShell>
    );
  }

  // -- ERROR --
  if (phase === 'error') {
    return (
      <ToolShell title="AI Displacement Monitor" subtitle="Error">
        <div className="card border border-rose-200 bg-rose-50 space-y-3">
          <div>
            <p className="text-sm font-medium text-rose-900">Something went wrong</p>
          </div>
          <button onClick={() => setPhase('intro')} className="btn-secondary">
            Try Again
          </button>
        </div>
      </ToolShell>
    );
  }

  // -- RESULTS --
  if (phase === 'results' && results) {
    const riskMeterColor =
      results.riskLevel === 'low'
        ? 'text-emerald-600'
        : results.riskLevel === 'moderate'
        ? 'text-amber-600'
        : results.riskLevel === 'high'
        ? 'text-orange-600'
        : 'text-rose-600';

    const riskMeterBg =
      results.riskLevel === 'low'
        ? 'bg-emerald-50 border-emerald-200'
        : results.riskLevel === 'moderate'
        ? 'bg-amber-50 border-amber-200'
        : results.riskLevel === 'high'
        ? 'bg-orange-50 border-orange-200'
        : 'bg-rose-50 border-rose-200';

    return (
      <ToolShell title="AI Displacement Monitor" subtitle="Your Results">
        <div className="space-y-6">
          {/* Risk meter */}
          <div className={`card border-2 ${riskMeterBg} py-6 text-center`}>
            <div className={`text-sm font-semibold uppercase tracking-wide ${riskMeterColor} mb-3`}>
              Risk Level: {results.riskLevel}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className={`text-2xl font-bold ${riskMeterColor}`}>{(results.riskScore * 10).toFixed(1)}</div>
                <div className="text-xs text-surface-600 mt-1">Displacement Risk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">{(results.resilienceScore * 10).toFixed(1)}</div>
                <div className="text-xs text-surface-600 mt-1">Resilience</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${riskMeterColor}`}>{(results.netExposure * 10).toFixed(1)}</div>
                <div className="text-xs text-surface-600 mt-1">Net Exposure</div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Routine Tasks + AI Advancement</span>
                  <span className={riskMeterColor}>{(results.riskScore * 10).toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      results.riskLevel === 'low'
                        ? 'bg-emerald-500'
                        : results.riskLevel === 'moderate'
                        ? 'bg-amber-500'
                        : results.riskLevel === 'high'
                        ? 'bg-orange-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${(results.riskScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Resilience Factors (Judgment + Creativity + Empathy + Physical)</span>
                  <span className="text-emerald-600">{(results.resilienceScore * 10).toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(results.resilienceScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card border border-surface-200 bg-surface-50">
            <h3 className="text-sm font-medium text-surface-900 mb-3">Recommendations</h3>
            <ul className="text-xs text-surface-600 space-y-2">
              {results.riskLevel === 'critical' && (
                <>
                  <li>
                    <strong>Urgent:</strong> Your role has high routine task content and your field is advancing rapidly
                    in AI.
                  </li>
                  <li>
                    <strong>Action:</strong> Start building skills in judgment-based work: strategic thinking, client
                    relationships, and problem-solving.
                  </li>
                  <li>
                    <strong>Transition:</strong> Consider a lateral move to a role that emphasizes your creative and
                    interpersonal strengths.
                  </li>
                </>
              )}
              {results.riskLevel === 'high' && (
                <>
                  <li>
                    <strong>Watch:</strong> Your exposure is significant but not imminent. You have time to build
                    resilience.
                  </li>
                  <li>
                    <strong>Action:</strong> Invest in areas where you scored lower (creativity, empathy, judgment).
                  </li>
                  <li>
                    <strong>Opportunity:</strong> AI can automate the routine parts — focus on the higher-value work.
                  </li>
                </>
              )}
              {results.riskLevel === 'moderate' && (
                <>
                  <li>
                    <strong>Balanced:</strong> Your role has resilience factors. Your mix of skills protects you.
                  </li>
                  <li>
                    <strong>Action:</strong> Continue developing judgment-based skills. AI is your tool, not your
                    replacement.
                  </li>
                  <li>
                    <strong>Advantage:</strong> You can use AI to amplify your unique strengths.
                  </li>
                </>
              )}
              {results.riskLevel === 'low' && (
                <>
                  <li>
                    <strong>Well-positioned:</strong> Your role involves significant human judgment, creativity, and
                    relationships.
                  </li>
                  <li>
                    <strong>Action:</strong> Stay ahead by learning to work with AI tools — they&apos;ll enhance your value.
                  </li>
                  <li>
                    <strong>Opportunity:</strong> You can help others transition as your field evolves.
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setAssessment({
                  jobTitle: '',
                  yearsExperience: 0,
                  routineTasks: null,
                  humanJudgment: null,
                  creativeSolving: null,
                  empathy: null,
                  physicalPresence: null,
                  aiAdvancement: null,
                });
                setStepIndex(0);
                setResults(null);
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
