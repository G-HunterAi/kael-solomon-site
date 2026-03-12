'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { ScaleInput } from '@/components/ui/scale-input';

type Phase = 'intro' | 'context' | 'options' | 'choose' | 'summary' | 'submitting' | 'error';

interface DecisionOption {
  id: string;
  title: string;
  pros: string[];
  cons: string[];
}

interface DecisionCapture {
  decision: string;
  urgency: number | null;
  stakes: number | null;
  options: DecisionOption[];
  chosenOptionId: string | null;
  rationale: string;
}

export default function DecisionCapturePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [data, setData] = useState<DecisionCapture>({
    decision: '',
    urgency: null,
    stakes: null,
    options: [],
    chosenOptionId: null,
    rationale: '',
  });
  const [error, setError] = useState('');
  const [optionInProgress, setOptionInProgress] = useState<Partial<DecisionOption> | null>(null);

  // ── Context phase helpers ──
  const canProceedFromContext = useCallback(() => {
    return (
      data.decision.trim().length > 0 &&
      data.urgency != null &&
      data.stakes != null
    );
  }, [data.decision, data.urgency, data.stakes]);

  // ── Options phase helpers ──
  const addOption = useCallback(() => {
    if (
      optionInProgress?.title?.trim() &&
      (optionInProgress?.pros?.length ?? 0) > 0 &&
      (optionInProgress?.cons?.length ?? 0) > 0
    ) {
      const newOption: DecisionOption = {
        id: `option-${Date.now()}`,
        title: optionInProgress!.title,
        pros: (optionInProgress!.pros ?? []).filter((p: string) => p.trim()),
        cons: (optionInProgress!.cons ?? []).filter((c: string) => c.trim()),
      };

      setData((prev) => ({
        ...prev,
        options: [...prev.options, newOption],
      }));

      setOptionInProgress(null);
    }
  }, [optionInProgress]);

  const removeOption = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
      chosenOptionId:
        prev.chosenOptionId === id ? null : prev.chosenOptionId,
    }));
  }, []);

  const canProceedFromOptions = useCallback(() => {
    return data.options.length >= 2 && data.options.length <= 5;
  }, [data.options]);

  const canProceedFromChoose = useCallback(() => {
    return data.chosenOptionId != null && data.rationale.trim().length > 0;
  }, [data.chosenOptionId, data.rationale]);

  // ── Submit ──
  const handleSubmit = useCallback(async () => {
    setPhase('submitting');
    setError('');

    try {
      const res = await fetch('/api/v1/career/paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: data.decision,
          urgency: data.urgency,
          stakes: data.stakes,
          options: data.options,
          selectedOptionId: data.chosenOptionId,
          rationale: data.rationale,
        }),
      });

      if (res.ok) {
        setPhase('summary');
      } else {
        setError('Failed to submit decision record. Please try again.');
        setPhase('choose');
      }
    } catch (err) {
      setError('An error occurred while submitting. Your decision has been captured locally.');
      // Still show summary as fallback
      setPhase('summary');
    }
  }, [data]);

  // ── INTRO PHASE ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Decision Capture" subtitle="Document your decision journey" duration="~3 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            This tool helps you document a significant career decision. You'll capture the decision
            context, explore multiple options with their pros and cons, choose your preferred path,
            and record your reasoning.
          </p>
          <p className="text-sm text-surface-500">
            This decision record becomes part of your career journal and helps you reflect on
            decisions over time.
          </p>
          <div className="pt-2">
            <button onClick={() => setPhase('context')} className="btn-primary">
              Begin
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // ── CONTEXT PHASE ──
  if (phase === 'context') {
    return (
      <ToolShell title="Decision Capture" subtitle="Step 1: Context">
        <div className="card space-y-6">
          {/* Decision */}
          <div className="space-y-3">
            <label className="block">
              <p className="text-sm font-medium text-surface-900 mb-1">
                What decision are you making?
              </p>
              <p className="text-xs text-surface-500 mb-2">
                Be specific. Example: "Should I take the job offer at Company X or stay in my current role?"
              </p>
            </label>
            <textarea
              value={data.decision}
              onChange={(e) => setData((prev) => ({ ...prev, decision: e.target.value }))}
              className="input min-h-[80px] resize-none"
              placeholder="Describe your decision..."
            />
          </div>

          {/* Urgency */}
          <div className="space-y-3">
            <label className="block">
              <p className="text-sm font-medium text-surface-900 mb-1">
                How urgent is this decision?
              </p>
              <p className="text-xs text-surface-500 mb-2">
                1 = Can wait indefinitely, 10 = Must decide immediately
              </p>
            </label>
            <ScaleInput
              value={data.urgency}
              onChange={(value) => setData((prev) => ({ ...prev, urgency: value }))}
              min={1}
              max={10}
              lowLabel="Low urgency"
              highLabel="Highly urgent"
            />
          </div>

          {/* Stakes */}
          <div className="space-y-3">
            <label className="block">
              <p className="text-sm font-medium text-surface-900 mb-1">
                What are the stakes?
              </p>
              <p className="text-xs text-surface-500 mb-2">
                1 = Low impact, 10 = Life-changing decision
              </p>
            </label>
            <ScaleInput
              value={data.stakes}
              onChange={(value) => setData((prev) => ({ ...prev, stakes: value }))}
              min={1}
              max={10}
              lowLabel="Low stakes"
              highLabel="High stakes"
            />
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-surface-100">
            <button
              onClick={() => setPhase('intro')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setPhase('options')}
              disabled={!canProceedFromContext()}
              className="btn-primary flex-1"
            >
              Next: Add Options
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // ── OPTIONS PHASE ──
  if (phase === 'options') {
    return (
      <ToolShell title="Decision Capture" subtitle="Step 2: Options (2-5 required)">
        <div className="card space-y-6">
          {/* Current options list */}
          {data.options.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-surface-900">Added Options ({data.options.length}/5)</p>
              {data.options.map((option) => (
                <div key={option.id} className="p-3 bg-surface-50 rounded border border-surface-200 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-surface-900">{option.title}</p>
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="font-medium text-surface-700 mb-1">Pros:</p>
                      <ul className="space-y-1">
                        {option.pros.map((pro, i) => (
                          <li key={i} className="text-surface-600">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-surface-700 mb-1">Cons:</p>
                      <ul className="space-y-1">
                        {option.cons.map((con, i) => (
                          <li key={i} className="text-surface-600">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Option form */}
          {data.options.length < 5 && (
            <div className="border border-dashed border-surface-300 rounded-lg p-4 space-y-3 bg-surface-50">
              <p className="text-sm font-medium text-surface-900">Add an Option</p>

              <div>
                <p className="text-xs font-medium text-surface-700 mb-1">Option Title</p>
                <input
                  type="text"
                  value={optionInProgress?.title || ''}
                  onChange={(e) =>
                    setOptionInProgress((prev) => ({
                      ...prev,
                      title: e.target.value,
                      pros: prev?.pros || [],
                      cons: prev?.cons || [],
                    }))
                  }
                  className="input text-sm"
                  placeholder="e.g., Take the job offer"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-surface-700 mb-1">Pros (one per line)</p>
                <textarea
                  value={(optionInProgress?.pros || []).join('\n')}
                  onChange={(e) =>
                    setOptionInProgress((prev) => ({
                      ...prev,
                      title: prev?.title || '',
                      pros: e.target.value.split('\n'),
                      cons: prev?.cons || [],
                    }))
                  }
                  className="input text-sm min-h-[60px] resize-none"
                  placeholder="Better salary&#10;New opportunities&#10;..."
                />
              </div>

              <div>
                <p className="text-xs font-medium text-surface-700 mb-1">Cons (one per line)</p>
                <textarea
                  value={(optionInProgress?.cons || []).join('\n')}
                  onChange={(e) =>
                    setOptionInProgress((prev) => ({
                      ...prev,
                      title: prev?.title || '',
                      pros: prev?.pros || [],
                      cons: e.target.value.split('\n'),
                    }))
                  }
                  className="input text-sm min-h-[60px] resize-none"
                  placeholder="Longer commute&#10;Different industry&#10;..."
                />
              </div>

              <button
                onClick={addOption}
                className="btn-secondary w-full text-sm"
              >
                Add Option
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-surface-100">
            <button
              onClick={() => setPhase('context')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setPhase('choose')}
              disabled={!canProceedFromOptions()}
              className="btn-primary flex-1"
            >
              Next: Choose
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // ── CHOOSE PHASE ──
  if (phase === 'choose') {
    const chosenOption = data.options.find((opt) => opt.id === data.chosenOptionId);

    return (
      <ToolShell title="Decision Capture" subtitle="Step 3: Choose & Explain">
        <div className="card space-y-6">
          {/* Option selector */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-surface-900">Which option are you leaning toward?</p>
            <div className="space-y-2">
              {data.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setData((prev) => ({ ...prev, chosenOptionId: option.id }))}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    data.chosenOptionId === option.id
                      ? 'bg-brand-50 border-brand-300'
                      : 'bg-surface-50 border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <p className="text-sm font-medium text-surface-900">{option.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Rationale */}
          <div className="space-y-3">
            <label className="block">
              <p className="text-sm font-medium text-surface-900 mb-1">
                Why this option?
              </p>
              <p className="text-xs text-surface-500 mb-2">
                Explain your reasoning. What convinced you?
              </p>
            </label>
            <textarea
              value={data.rationale}
              onChange={(e) => setData((prev) => ({ ...prev, rationale: e.target.value }))}
              className="input min-h-[100px] resize-none"
              placeholder="My reasoning is..."
            />
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-surface-100">
            <button
              onClick={() => setPhase('options')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canProceedFromChoose()}
              className="btn-primary flex-1"
            >
              Submit Decision
            </button>
          </div>
        </div>
      </ToolShell>
    );
  }

  // ── SUBMITTING PHASE ──
  if (phase === 'submitting') {
    return (
      <ToolShell title="Decision Capture" subtitle="Submitting...">
        <div className="card text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-brand-600" />
          <p className="mt-4 text-sm text-surface-500">Recording your decision...</p>
        </div>
      </ToolShell>
    );
  }

  // ── SUMMARY PHASE ──
  if (phase === 'summary') {
    const chosenOption = data.options.find((opt) => opt.id === data.chosenOptionId);

    return (
      <ToolShell title="Decision Capture" subtitle="Decision Recorded">
        <div className="space-y-6">
          {error && (
            <div className="card bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-900">{error}</p>
            </div>
          )}

          {/* Summary card */}
          <div className="card bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200">
            <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">Decision Summary</p>
            <h2 className="text-xl font-bold text-surface-900 mb-4">{data.decision}</h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-surface-700 mb-1">Urgency</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${((data.urgency || 0) / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-surface-700">{data.urgency}/10</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-surface-700 mb-1">Stakes</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${((data.stakes || 0) / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-surface-700">{data.stakes}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chosen option */}
          {chosenOption && (
            <div className="card">
              <p className="text-sm font-medium text-surface-900 mb-3">Selected Option</p>
              <p className="text-lg font-bold text-brand-600 mb-3">{chosenOption.title}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs font-medium text-green-700 mb-2">Pros</p>
                  <ul className="space-y-1">
                    {chosenOption.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-green-600">✓ {pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs font-medium text-red-700 mb-2">Cons</p>
                  <ul className="space-y-1">
                    {chosenOption.cons.map((con, i) => (
                      <li key={i} className="text-xs text-red-600">✗ {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-surface-50 p-3 rounded border border-surface-200">
                <p className="text-xs font-medium text-surface-700 mb-1">Rationale</p>
                <p className="text-sm text-surface-700">{data.rationale}</p>
              </div>
            </div>
          )}

          {/* Reflection prompt */}
          <div className="card bg-blue-50 border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">Remember to Reflect</p>
            <p className="text-sm text-blue-800">
              Come back in 3-6 months to reflect on how this decision turned out. Did your chosen option
              deliver what you expected? What did you learn?
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setData({
                  decision: '',
                  urgency: null,
                  stakes: null,
                  options: [],
                  chosenOptionId: null,
                  rationale: '',
                });
                setPhase('intro');
              }}
              className="btn-secondary flex-1"
            >
              New Decision
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
