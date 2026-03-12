'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';

type Phase = 'intro' | 'fix-questions' | 'leave-questions' | 'results';

interface Question {
  id: string;
  text: string;
}

const FIX_QUESTIONS: Question[] = [
  { id: 'fix-1', text: 'Is the problem structural or personal?' },
  { id: 'fix-2', text: 'Can you influence the key factors driving this problem?' },
  { id: 'fix-3', text: 'Have you tried fixing this before? Did anything help?' },
  { id: 'fix-4', text: 'Do you have allies or support to help you fix this?' },
  { id: 'fix-5', text: 'Is there a realistic timeline for things to improve?' },
];

const LEAVE_QUESTIONS: Question[] = [
  { id: 'leave-1', text: 'What\'s the opportunity cost of staying?' },
  { id: 'leave-2', text: 'Are you financially ready to make this transition?' },
  { id: 'leave-3', text: 'How strong is your network in your target field?' },
  { id: 'leave-4', text: 'Do you have the energy for a major career change right now?' },
  { id: 'leave-5', text: 'How clear are you on your alternative path?' },
];

const SCALE_LABELS = {
  fix: {
    low: 'No / Not at all',
    high: 'Yes / Definitely',
  },
  leave: {
    low: 'Not ready',
    high: 'Very ready',
  },
};

export default function FixVsLeavePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [fixScores, setFixScores] = useState<Record<string, number>>({});
  const [leaveScores, setLeaveScores] = useState<Record<string, number>>({});
  const [stepIndex, setStepIndex] = useState(0);

  const allFixAnswered = FIX_QUESTIONS.every((q) => fixScores[q.id] != null);
  const allLeaveAnswered = LEAVE_QUESTIONS.every((q) => leaveScores[q.id] != null);

  const currentQuestion = FIX_QUESTIONS[stepIndex];
  const currentValue = fixScores[currentQuestion?.id];

  const updateFixScore = useCallback((questionId: string, value: number) => {
    setFixScores((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const updateLeaveScore = useCallback((questionId: string, value: number) => {
    setLeaveScores((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const computeResults = useCallback(() => {
    const fixAvg =
      Object.values(fixScores).reduce((a, b) => a + b, 0) / FIX_QUESTIONS.length;
    const leaveAvg =
      Object.values(leaveScores).reduce((a, b) => a + b, 0) / LEAVE_QUESTIONS.length;

    const diff = fixAvg - leaveAvg;
    let recommendation: 'fix' | 'leave' | 'ambiguous';
    if (diff > 2) {
      recommendation = 'fix';
    } else if (diff < -2) {
      recommendation = 'leave';
    } else {
      recommendation = 'ambiguous';
    }

    return {
      fixScore: fixAvg,
      leaveScore: leaveAvg,
      diff,
      recommendation,
      fixQuestions: FIX_QUESTIONS.map((q) => ({
        ...q,
        score: fixScores[q.id],
      })),
      leaveQuestions: LEAVE_QUESTIONS.map((q) => ({
        ...q,
        score: leaveScores[q.id],
      })),
    };
  }, [fixScores, leaveScores]);

  // -- INTRO --
  if (phase === 'intro') {
    return (
      <ToolShell title="Fix vs Leave" subtitle="Should you fix or should you go?" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            Facing a tough career decision? This framework helps you systematically evaluate whether to fix your
            current situation or move on to something new.
          </p>
          <p className="text-sm text-surface-500">
            You&apos;ll assess how fixable your situation is, then evaluate how ready you are to leave. The results will
            guide your decision.
          </p>
          <button onClick={() => setPhase('fix-questions')} className="btn-primary">
            Begin Assessment
          </button>
        </div>
      </ToolShell>
    );
  }

  // -- FIX QUESTIONS --
  if (phase === 'fix-questions') {
    const canProceed = currentValue != null;

    return (
      <ToolShell
        title="Can You Fix It?"
        subtitle={currentQuestion?.text}
        currentStep={stepIndex}
        totalSteps={FIX_QUESTIONS.length}
        progress={Math.round(((stepIndex) / FIX_QUESTIONS.length) * 100)}
      >
        <div className="card space-y-6">
          <div>
            <p className="text-sm font-medium text-surface-900 mb-3">Rate your answer (1-10)</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => updateFixScore(currentQuestion!.id, v)}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-colors ${
                    currentValue === v
                      ? 'bg-blue-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>{SCALE_LABELS.fix.low}</span>
              <span>{SCALE_LABELS.fix.high}</span>
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
                if (stepIndex === FIX_QUESTIONS.length - 1 && allFixAnswered) {
                  setStepIndex(0);
                  setPhase('leave-questions');
                } else {
                  setStepIndex(Math.min(FIX_QUESTIONS.length - 1, stepIndex + 1));
                }
              }}
              disabled={!canProceed}
              className="btn-primary flex-1"
            >
              {stepIndex === FIX_QUESTIONS.length - 1 ? 'Continue to "Leave"' : 'Next'}
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // -- LEAVE QUESTIONS --
  if (phase === 'leave-questions') {
    const currentLeaveQuestion = LEAVE_QUESTIONS[stepIndex];
    const currentLeaveValue = leaveScores[currentLeaveQuestion?.id];
    const canProceed = currentLeaveValue != null;

    return (
      <ToolShell
        title="Are You Ready to Leave?"
        subtitle={currentLeaveQuestion?.text}
        currentStep={stepIndex}
        totalSteps={LEAVE_QUESTIONS.length}
        progress={Math.round(((stepIndex) / LEAVE_QUESTIONS.length) * 100)}
      >
        <div className="card space-y-6">
          <div>
            <p className="text-sm font-medium text-surface-900 mb-3">Rate your answer (1-10)</p>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  onClick={() => updateLeaveScore(currentLeaveQuestion!.id, v)}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-colors ${
                    currentLeaveValue === v
                      ? 'bg-rose-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-surface-400 mt-1">
              <span>{SCALE_LABELS.leave.low}</span>
              <span>{SCALE_LABELS.leave.high}</span>
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
                if (stepIndex === LEAVE_QUESTIONS.length - 1 && allLeaveAnswered) {
                  setPhase('results');
                } else {
                  setStepIndex(Math.min(LEAVE_QUESTIONS.length - 1, stepIndex + 1));
                }
              }}
              disabled={!canProceed}
              className="btn-primary flex-1"
            >
              {stepIndex === LEAVE_QUESTIONS.length - 1 ? 'See Results' : 'Next'}
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // -- RESULTS --
  if (phase === 'results') {
    const results = computeResults();

    return (
      <ToolShell title="Fix vs Leave" subtitle="Your Results">
        <div className="space-y-6">
          {/* Main recommendation */}
          <div
            className={`card border-2 text-center py-6 ${
              results.recommendation === 'fix'
                ? 'border-blue-200 bg-blue-50'
                : results.recommendation === 'leave'
                ? 'border-rose-200 bg-rose-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div
              className={`text-sm font-semibold uppercase tracking-wide mb-2 ${
                results.recommendation === 'fix'
                  ? 'text-blue-700'
                  : results.recommendation === 'leave'
                  ? 'text-rose-700'
                  : 'text-amber-700'
              }`}
            >
              {results.recommendation === 'fix'
                ? 'Recommendation: FIX'
                : results.recommendation === 'leave'
                ? 'Recommendation: LEAVE'
                : 'It\'s Ambiguous'}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-3xl font-bold text-blue-600">{(results.fixScore * 10).toFixed(1)}</div>
                <div className="text-xs text-blue-700">Fix Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600">{(results.leaveScore * 10).toFixed(1)}</div>
                <div className="text-xs text-rose-700">Leave Score</div>
              </div>
            </div>
          </div>

          {/* Scores visualization */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Score Comparison</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Fix Potential</span>
                  <span>{(results.fixScore * 10).toFixed(1)}</span>
                </div>
                <div className="h-3 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${(results.fixScore / 10) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-surface-700 mb-1">
                  <span>Leave Readiness</span>
                  <span>{(results.leaveScore * 10).toFixed(1)}</span>
                </div>
                <div className="h-3 rounded-full bg-surface-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-500"
                    style={{ width: `${(results.leaveScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key factors */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-700 mb-4">Key Factors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-blue-700">Fix Factors</div>
                <ul className="space-y-2">
                  {results.fixQuestions.slice(0, 3).map((q) => (
                    <li key={q.id} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-400" />
                      <div className="text-xs text-surface-600">
                        <span className="font-medium block">{q.text}</span>
                        <span className="text-surface-400">Score: {q.score}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-rose-700">Leave Factors</div>
                <ul className="space-y-2">
                  {results.leaveQuestions.slice(0, 3).map((q) => (
                    <li key={q.id} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-400" />
                      <div className="text-xs text-surface-600">
                        <span className="font-medium block">{q.text}</span>
                        <span className="text-surface-400">Score: {q.score}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="card border border-surface-200 bg-surface-50">
            <h3 className="text-sm font-medium text-surface-900 mb-2">Next Steps</h3>
            {results.recommendation === 'fix' && (
              <p className="text-xs text-surface-600">
                Your situation appears fixable. Focus on the factors you rated highest and build a concrete action plan.
                Talk to mentors or trusted colleagues about execution strategies.
              </p>
            )}
            {results.recommendation === 'leave' && (
              <p className="text-xs text-surface-600">
                You seem ready for a change. Use the scores below to prioritize what matters for your next role. Start
                exploring aligned opportunities.
              </p>
            )}
            {results.recommendation === 'ambiguous' && (
              <p className="text-xs text-surface-600">
                Your scores are close — this is a genuine dilemma. Give yourself time to experiment before deciding. Try
                small fixes first; if they don&apos;t help, lean toward leaving.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setFixScores({});
                setLeaveScores({});
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
