'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';

type Phase = 'intro' | 'questions' | 'results';

interface DecisionQuestion {
  id: string;
  text: string;
  lowEnd: string;
  highEnd: string;
  axis: 'speed' | 'confidence' | 'risk' | 'social' | 'thoroughness';
}

const DECISION_QUESTIONS: DecisionQuestion[] = [
  {
    id: 'd1',
    text: 'When facing a big decision, I prefer to...',
    lowEnd: 'Trust my gut feeling',
    highEnd: 'Do extensive research',
    axis: 'thoroughness',
  },
  {
    id: 'd2',
    text: 'I typically make decisions...',
    lowEnd: 'Quickly',
    highEnd: 'After long deliberation',
    axis: 'speed',
  },
  {
    id: 'd3',
    text: 'When others disagree with my choice...',
    lowEnd: 'I second-guess myself',
    highEnd: 'I stay confident',
    axis: 'confidence',
  },
  {
    id: 'd4',
    text: 'I handle risk in decisions by...',
    lowEnd: 'Avoiding it',
    highEnd: 'Embracing it',
    axis: 'risk',
  },
  {
    id: 'd5',
    text: 'Past mistakes affect my decisions...',
    lowEnd: 'A lot',
    highEnd: 'Very little',
    axis: 'confidence',
  },
  {
    id: 'd6',
    text: 'I involve others in my decisions...',
    lowEnd: 'Rarely',
    highEnd: 'Always',
    axis: 'social',
  },
  {
    id: 'd7',
    text: 'When information is incomplete...',
    lowEnd: 'I wait for more data',
    highEnd: 'I decide with what I have',
    axis: 'speed',
  },
  {
    id: 'd8',
    text: 'I consider long-term consequences...',
    lowEnd: 'Rarely',
    highEnd: 'Obsessively',
    axis: 'thoroughness',
  },
  {
    id: 'd9',
    text: 'Under time pressure, my decisions are...',
    lowEnd: 'Worse',
    highEnd: 'Better',
    axis: 'speed',
  },
  {
    id: 'd10',
    text: 'After deciding, I...',
    lowEnd: 'Revisit it often',
    highEnd: 'Move on quickly',
    axis: 'confidence',
  },
];

type DecisionStyle = 'analytical' | 'intuitive' | 'collaborative' | 'decisive' | 'balanced';

export default function DecisionProfilePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [stepIndex, setStepIndex] = useState(0);

  const currentQuestion = DECISION_QUESTIONS[stepIndex];
  const currentValue = responses[currentQuestion?.id];
  const allAnswered = DECISION_QUESTIONS.every((q) => responses[q.id] != null);

  const updateResponse = useCallback((questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const computeResults = useCallback(() => {
    const axes: Record<string, number[]> = {
      speed: [],
      confidence: [],
      risk: [],
      social: [],
      thoroughness: [],
    };

    DECISION_QUESTIONS.forEach((q) => {
      const value = responses[q.id] || 5;
      axes[q.axis].push(value);
    });

    const scores: Record<string, number> = {};
    Object.entries(axes).forEach(([axis, values]) => {
      scores[axis] = values.reduce((a, b) => a + b, 0) / values.length;
    });

    let style: DecisionStyle = 'balanced';
    const analyticalScore = scores.thoroughness + (10 - scores.speed);
    const intuitiveScore = scores.speed + (10 - scores.thoroughness);
    const collaborativeScore = scores.social + scores.confidence;
    const decisiveScore = scores.confidence + scores.risk;
    const balancedScore = 10 - Math.abs(scores.thoroughness - 5) - Math.abs(scores.speed - 5);

    const styleScores = {
      analytical: analyticalScore,
      intuitive: intuitiveScore,
      collaborative: collaborativeScore,
      decisive: decisiveScore,
      balanced: balancedScore,
    };

    const maxStyle = Object.entries(styleScores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    );
    style = maxStyle[0] as DecisionStyle;

    return { scores, style };
  }, [responses]);

  const getStyleDescription = (style: DecisionStyle) => {
    const descriptions: Record<DecisionStyle, { strength: string; watchout: string }> = {
      analytical: {
        strength: 'You excel at thorough research and long-term planning. You make informed decisions backed by data.',
        watchout: 'Risk analysis paralysis — you may deliberate so long that opportunities pass.',
      },
      intuitive: {
        strength: 'You trust your gut and move fast. You can spot patterns and opportunities quickly.',
        watchout: 'You might miss critical details or make impulsive choices without adequate thought.',
      },
      collaborative: {
        strength: 'You build consensus and value input from others. Great at team decisions and stakeholder alignment.',
        watchout: 'You may struggle to make unpopular decisions or defer too much to others\' opinions.',
      },
      decisive: {
        strength: 'You act confidently and embrace uncertainty. You take calculated risks and move boldly.',
        watchout: 'You might overlook risks or alienate people by not seeking their input.',
      },
      balanced: {
        strength: 'You adapt your approach based on context. You know when to move fast and when to deliberate.',
        watchout: 'Sometimes "balanced" means you lack a strong conviction — be clear about your principles.',
      },
    };
    return descriptions[style];
  };

  // -- INTRO --
  if (phase === 'intro') {
    return (
      <ToolShell title="Decision Profile" subtitle="Understand your decision-making style" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Everyone makes decisions differently. Some of us dive deep into data; others trust our instincts. Some
            build consensus; others act boldly alone.
          </p>
          <p className="text-sm text-surface-500">
            This assessment reveals your personal decision-making style across 5 dimensions. Understanding your style
            helps you leverage your strengths and mitigate your weaknesses.
          </p>
          <button onClick={() => setPhase('questions')} className="btn-primary">
            Begin Assessment
          </button>
        </div>
      </ToolShell>
    );
  }

  // -- QUESTIONS --
  if (phase === 'questions') {
    const canProceed = currentValue != null;

    return (
      <ToolShell
        title="Decision Profile"
        subtitle={currentQuestion?.text}
        currentStep={stepIndex}
        totalSteps={DECISION_QUESTIONS.length}
        progress={Math.round(((stepIndex) / DECISION_QUESTIONS.length) * 100)}
      >
        <div className="card space-y-6">
          <div>
            <p className="text-sm text-surface-900 font-medium mb-4">Where do you fall on this spectrum?</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => updateResponse(currentQuestion!.id, v)}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-colors ${
                    currentValue === v
                      ? 'bg-indigo-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-surface-400 mt-2">
              <span>{currentQuestion?.lowEnd}</span>
              <span>{currentQuestion?.highEnd}</span>
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
                if (stepIndex === DECISION_QUESTIONS.length - 1 && allAnswered) {
                  setPhase('results');
                } else {
                  setStepIndex(Math.min(DECISION_QUESTIONS.length - 1, stepIndex + 1));
                }
              }}
              disabled={!canProceed}
              className="btn-primary flex-1"
            >
              {stepIndex === DECISION_QUESTIONS.length - 1 ? 'See Results' : 'Next'}
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // -- RESULTS --
  if (phase === 'results') {
    const { scores, style } = computeResults();
    const description = getStyleDescription(style);

    const styleColors: Record<DecisionStyle, { bg: string; text: string; border: string }> = {
      analytical: { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200' },
      intuitive: { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200' },
      collaborative: { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200' },
      decisive: { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-200' },
      balanced: { bg: 'bg-teal-50', text: 'text-teal-900', border: 'border-teal-200' },
    };

    const colors = styleColors[style];

    return (
      <ToolShell title="Decision Profile" subtitle="Your Results">
        <div className="space-y-6">
          {/* Primary style */}
          <div className={`card border-2 ${colors.border} ${colors.bg}`}>
            <div className={`text-sm font-semibold uppercase tracking-wider ${colors.text} mb-2`}>
              Your Decision Style
            </div>
            <div className={`text-3xl font-bold ${colors.text} capitalize`}>{style}</div>
            <p className={`text-sm ${colors.text} mt-3 leading-relaxed`}>{description.strength}</p>
            <p className={`text-sm ${colors.text} opacity-80 mt-2 italic`}>Watch out: {description.watchout}</p>
          </div>

          {/* Five axes */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Your Scores Across 5 Dimensions</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Speed (Fast &larr; &rarr; Deliberate)</span>
                  <span className="text-indigo-600">{(scores.speed * 10).toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(scores.speed / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Confidence (Doubtful &larr; &rarr; Certain)</span>
                  <span className="text-indigo-600">{(scores.confidence * 10).toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(scores.confidence / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Risk Tolerance (Cautious &larr; &rarr; Bold)</span>
                  <span className="text-indigo-600">{(scores.risk * 10).toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(scores.risk / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Social Input (Solo &larr; &rarr; Collaborative)</span>
                  <span className="text-indigo-600">{(scores.social * 10).toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(scores.social / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Thoroughness (Quick &larr; &rarr; Deep)</span>
                  <span className="text-indigo-600">{(scores.thoroughness * 10).toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(scores.thoroughness / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guidance */}
          <div className="card border border-surface-200 bg-surface-50">
            <h3 className="text-sm font-medium text-surface-900 mb-3">Making Better Decisions</h3>
            <ul className="text-xs text-surface-600 space-y-2">
              {style === 'analytical' && (
                <>
                  <li>Set decision deadlines to avoid endless analysis.</li>
                  <li>Practice making decisions with 70% of the information.</li>
                  <li>Pair with intuitive collaborators for speed.</li>
                </>
              )}
              {style === 'intuitive' && (
                <>
                  <li>Slow down on high-stakes decisions — create a checklist.</li>
                  <li>Ask one other person to stress-test your choice before committing.</li>
                  <li>Document your reasoning so you can learn from outcomes.</li>
                </>
              )}
              {style === 'collaborative' && (
                <>
                  <li>Remember: consensus-seeking can slow decisions. Know when to decide solo.</li>
                  <li>Build trust so you can make unpopular choices when needed.</li>
                  <li>Create clear decision criteria upfront.</li>
                </>
              )}
              {style === 'decisive' && (
                <>
                  <li>Pause before acting — explicitly consider 2-3 alternatives.</li>
                  <li>Involve others early to catch blind spots.</li>
                  <li>Build contingency plans for your bold moves.</li>
                </>
              )}
              {style === 'balanced' && (
                <>
                  <li>Your flexibility is a strength — but clarify your core principles.</li>
                  <li>Know your decision rules for different contexts.</li>
                  <li>Use your balance to bridge teams with different styles.</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setResponses({});
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
