'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { ScaleInput } from '@/components/ui/scale-input';
import {
  RDTE_DIMENSION_BLOCKS,
  type LanguageLevel,
} from '@/lib/assessment/rdte-questions';
import {
  scoreCareerFamilies,
  FAMILY_DESCRIPTIONS,
  getBlendProfile,
  type CareerFamily,
} from '@/lib/career/scoring';

type Phase = 'intro' | 'questions' | 'results' | 'error';

interface DimensionResponse {
  [componentId: string]: number;
}

export default function CareerFamilyAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [blockIndex, setBlockIndex] = useState(0);
  const [responses, setResponses] = useState<DimensionResponse>({});
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel>('professional');
  const [results, setResults] = useState<ReturnType<typeof scoreCareerFamilies> | null>(null);

  const currentBlock = RDTE_DIMENSION_BLOCKS[blockIndex];
  const totalBlocks = RDTE_DIMENSION_BLOCKS.length;

  const setResponse = useCallback((componentId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [componentId]: value,
    }));
  }, []);

  const canProceed = useCallback(() => {
    if (!currentBlock) return false;
    return currentBlock.questions.every((q) => responses[q.component] != null);
  }, [currentBlock, responses]);

  const handleNext = useCallback(() => {
    if (blockIndex < totalBlocks - 1) {
      setBlockIndex((i) => i + 1);
    } else {
      // Calculate scores and show results
      const scores = scoreCareerFamilies(responses);
      setResults(scores);
      setPhase('results');
    }
  }, [blockIndex, totalBlocks, responses]);

  const handlePrev = useCallback(() => {
    if (blockIndex > 0) {
      setBlockIndex((i) => i - 1);
    }
  }, [blockIndex]);

  // ── INTRO PHASE ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Career Family Assessment" subtitle="Discover your career DNA" duration="~10 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            This assessment identifies which of the 8 career families align best with your natural
            strengths, personality, and work preferences. By answering questions across 6 key
            dimensions, you'll discover your career profile and learn which roles maximize your
            potential.
          </p>
          <p className="text-sm text-surface-500">
            The 8 career families are: Builder, Strategist, Explorer, Optimizer, Teacher,
            Connector, Guardian, and Healer. Most people are a blend of 2 primary families.
          </p>

          <div className="card bg-surface-50 border border-surface-200 space-y-3">
            <p className="text-xs font-medium text-surface-700">Language Level</p>
            <div className="flex gap-2">
              {(['simple', 'standard', 'professional'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setLanguageLevel(level)}
                  className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                    languageLevel === level
                      ? 'bg-brand-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

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
  if (phase === 'results' && results) {
    const primaryDesc = FAMILY_DESCRIPTIONS[results.primary];
    const secondaryDesc = FAMILY_DESCRIPTIONS[results.secondary];
    const blendProfile = getBlendProfile(results.primary, results.secondary);

    const sortedFamilies = Object.entries(results.scores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([family]) => family as CareerFamily);

    return (
      <ToolShell title="Career Family Assessment" subtitle="Your Results">
        <div className="space-y-6">
          {/* Primary family */}
          <div className="card bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{primaryDesc.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Primary Career Family</p>
                <h2 className="text-2xl font-bold text-surface-900">{results.primary}</h2>
                <p className="text-sm text-surface-700 mt-1">{primaryDesc.tagline}</p>
                <p className="text-xs text-surface-600 mt-2">{primaryDesc.core}</p>
              </div>
            </div>
          </div>

          {/* Blend profile */}
          <div className="card bg-surface-50">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Secondary Family</p>
                <p className="text-lg font-semibold text-surface-900 flex items-center gap-2">
                  <span>{secondaryDesc.icon}</span>
                  {results.secondary}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Blend Profile</p>
                <p className="text-lg font-semibold text-surface-900">{blendProfile.name}</p>
              </div>
            </div>
            {blendProfile.sweetSpot.length > 0 && (
              <div className="pt-3 border-t border-surface-200">
                <p className="text-xs font-medium text-surface-700 mb-2">Sweet Spot Roles</p>
                <ul className="space-y-1">
                  {blendProfile.sweetSpot.map((role, i) => (
                    <li key={i} className="text-sm text-surface-700 flex items-start gap-2">
                      <span className="text-brand-600 font-bold">•</span>
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* All families breakdown */}
          <div className="card">
            <h3 className="text-sm font-medium text-surface-900 mb-4">All Career Families</h3>
            <div className="space-y-3">
              {sortedFamilies.map((family) => {
                const score = results.scores[family];
                const desc = FAMILY_DESCRIPTIONS[family];
                const barColor =
                  family === results.primary
                    ? 'bg-brand-600'
                    : family === results.secondary
                    ? 'bg-brand-400'
                    : 'bg-surface-300';

                return (
                  <div key={family}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-surface-900 flex items-center gap-2">
                        <span>{desc.icon}</span>
                        {family}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-surface-700">
                        {Math.round(score * 10) / 10}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anti-family warning */}
          <div className="card bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700 uppercase tracking-wider font-medium mb-2">Career Caution</p>
            <p className="text-sm text-amber-900">
              Your lowest-fit family is <strong>{results.antiFamily}</strong>. This doesn't mean you
              can't succeed in {results.antiFamily} roles, but you may find them less naturally energizing
              than {results.primary} or {results.secondary} aligned positions.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResponses({});
                setBlockIndex(0);
                setResults(null);
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
      title={currentBlock.label}
      subtitle={currentBlock.description[languageLevel]}
      currentStep={blockIndex}
      totalSteps={totalBlocks}
    >
      <div className="card space-y-6">
        {currentBlock.questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <p className="text-sm font-medium text-surface-900 leading-relaxed">
              {question.text[languageLevel]}
            </p>
            {question.subtext && (
              <p className="text-xs text-surface-400">{question.subtext[languageLevel]}</p>
            )}

            {question.type === 'scale' && question.scaleMin != null && question.scaleMax != null && (
              <ScaleInput
                value={responses[question.component] ?? null}
                onChange={(value) => setResponse(question.component, value)}
                min={question.scaleMin}
                max={question.scaleMax}
                lowLabel={question.lowLabel?.[languageLevel] || ''}
                highLabel={question.highLabel?.[languageLevel] || ''}
              />
            )}
          </div>
        ))}

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-surface-100">
          <button
            onClick={handlePrev}
            disabled={blockIndex === 0}
            className="btn-secondary flex-1"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary flex-1"
          >
            {blockIndex === totalBlocks - 1 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
