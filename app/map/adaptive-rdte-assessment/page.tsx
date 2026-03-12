// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
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

type Phase = 'intro' | 'age-input' | 'questions' | 'results';

interface Question {
  id: string;
  dimensionBlock: string;
  dimension: string;
  simpleText: string;
  standardText: string;
  professionalText: string;
}

interface QuestionScore {
  questionId: string;
  score: number;
}

interface ScoringResult {
  primaryFamily: CareerFamily;
  secondaryFamily: CareerFamily;
  blendProfile: string;
  allFamilies: Array<{
    family: CareerFamily;
    score: number;
  }>;
  dimensionAverages: Record<string, number>;
}

export default function AdaptiveRdteAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [age, setAge] = useState<number | null>(null);
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel>('standard');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [result, setResult] = useState<ScoringResult | null>(null);

  // Flatten all questions from dimension blocks
  const allQuestions = useMemo(() => {
    return RDTE_DIMENSION_BLOCKS.flatMap((block) =>
      block.questions.map((q) => ({
        ...q,
        dimensionBlock: block.name,
      }))
    );
  }, []);

  const totalQuestions = allQuestions.length;
  const questionsPerBlock = Math.ceil(totalQuestions / RDTE_DIMENSION_BLOCKS.length);

  // Get questions for current block
  const currentBlockQuestions = useMemo(() => {
    const start = currentBlockIndex * questionsPerBlock;
    const end = Math.min(start + questionsPerBlock, totalQuestions);
    return allQuestions.slice(start, end);
  }, [currentBlockIndex, allQuestions, questionsPerBlock]);

  const progressPercentage = useMemo(() => {
    return Math.round(((answers.size / totalQuestions) * 100));
  }, [answers.size, totalQuestions]);

  const handleAgeSubmit = () => {
    if (age === null || age < 16 || age > 100) {
      alert('Please enter a valid age between 16 and 100');
      return;
    }

    // Determine language level based on age
    let level: LanguageLevel;
    if (age < 18) {
      level = 'simple';
    } else if (age < 25) {
      level = 'standard';
    } else {
      level = 'professional';
    }

    setLanguageLevel(level);
    setPhase('questions');
  };

  const handleAnswerQuestion = (questionId: string, score: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, score);
    setAnswers(newAnswers);
  };

  const handleNextBlock = () => {
    if (currentBlockIndex < RDTE_DIMENSION_BLOCKS.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handlePreviousBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  const handleSubmitAssessment = () => {
    if (answers.size !== totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions before submitting`);
      return;
    }

    // Convert answers to array format for scoring
    const scoreArray = Array.from(answers.entries()).map(([questionId, score]) => ({
      questionId,
      score,
    }));

    // Score the assessment
    const scoringResult = scoreCareerFamilies(scoreArray);
    const blendProfile = getBlendProfile(scoringResult);

    // Group dimension averages
    const dimensionAverages: Record<string, number> = {};
    const dimensionCounts: Record<string, number> = {};

    RDTE_DIMENSION_BLOCKS.forEach((block) => {
      block.questions.forEach((question) => {
        const score = answers.get(question.id);
        if (score !== undefined) {
          if (!dimensionAverages[question.dimension]) {
            dimensionAverages[question.dimension] = 0;
            dimensionCounts[question.dimension] = 0;
          }
          dimensionAverages[question.dimension] += score;
          dimensionCounts[question.dimension]++;
        }
      });
    });

    // Calculate averages
    Object.keys(dimensionAverages).forEach((dim) => {
      dimensionAverages[dim] = dimensionAverages[dim] / dimensionCounts[dim];
    });

    setResult({
      primaryFamily: scoringResult.primaryFamily,
      secondaryFamily: scoringResult.secondaryFamily,
      blendProfile,
      allFamilies: scoringResult.allFamilies,
      dimensionAverages,
    });

    setPhase('results');
  };

  const handleRetake = () => {
    setAge(null);
    setLanguageLevel('standard');
    setCurrentBlockIndex(0);
    setAnswers(new Map());
    setResult(null);
    setPhase('intro');
  };

  const handleBackToDashboard = () => {
    router.push('/map');
  };

  const getQuestionText = (question: Question): string => {
    switch (languageLevel) {
      case 'simple':
        return question.simpleText;
      case 'standard':
        return question.standardText;
      case 'professional':
        return question.professionalText;
      default:
        return question.standardText;
    }
  };

  return (
    <ToolShell
      title="Adaptive RDTE Assessment"
      description="A comprehensive 28-question assessment across 6 dimensions to identify your career family and blend profile"
      estimatedTime="10-15 min"
    >
      {phase === 'intro' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-indigo-900">
              This comprehensive assessment uses 28 questions across 6 key dimensions to identify your career family and personal blend profile. The questions will adapt based on your age to ensure relevance.
            </p>
          </div>
          <button
            onClick={() => setPhase('age-input')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
          >
            Start Assessment
          </button>
        </div>
      )}

      {phase === 'age-input' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              What is your current age?
            </label>
            <p className="text-xs text-gray-500">
              Your age helps us adapt the assessment questions to your career stage.
            </p>
            <input
              id="age"
              type="number"
              min="16"
              max="100"
              value={age || ''}
              onChange={(e) =>
                setAge(e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your age"
            />
          </div>
          <button
            onClick={handleAgeSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
          >
            Continue to Assessment
          </button>
        </div>
      )}

      {phase === 'questions' && (
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Progress</span>
              <span className="text-gray-600">
                {answers.size} of {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Block Indicator */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900">
              Block {currentBlockIndex + 1} of {RDTE_DIMENSION_BLOCKS.length}: {RDTE_DIMENSION_BLOCKS[currentBlockIndex]?.name}
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentBlockQuestions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <p className="font-medium text-gray-900">{getQuestionText(question)}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-600">Strongly Disagree</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        onClick={() => handleAnswerQuestion(question.id, score)}
                        className={`w-8 h-8 rounded-lg font-semibold text-xs transition ${
                          answers.get(question.id) === score
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">Strongly Agree</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handlePreviousBlock}
              disabled={currentBlockIndex === 0}
              className="flex-1 px-4 py-3 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
            >
              ← Previous Block
            </button>
            {currentBlockIndex < RDTE_DIMENSION_BLOCKS.length - 1 ? (
              <button
                onClick={handleNextBlock}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
              >
                Next Block →
              </button>
            ) : (
              <button
                onClick={handleSubmitAssessment}
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'results' && result && (
        <div className="space-y-8">
          {/* Primary Family */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-indigo-900">Your Primary Career Family</h3>
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-indigo-900">{result.primaryFamily}</h4>
              <p className="text-indigo-700">
                {FAMILY_DESCRIPTIONS[result.primaryFamily]}
              </p>
            </div>
          </div>

          {/* Blend Profile */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-2">
            <p className="text-sm font-semibold text-gray-600">Your Blend Profile</p>
            <p className="text-2xl font-bold text-purple-900">{result.blendProfile}</p>
            <p className="text-sm text-purple-700">
              This profile combines your primary and secondary career families into a unique career identity.
            </p>
          </div>

          {/* Secondary Family */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-600">Secondary Career Family</p>
            <p className="text-lg font-semibold text-gray-900">{result.secondaryFamily}</p>
            <p className="text-sm text-gray-600">
              {FAMILY_DESCRIPTIONS[result.secondaryFamily]}
            </p>
          </div>

          {/* All Families with Scores */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">All Career Families</h4>
            <div className="space-y-3">
              {result.allFamilies.map(({ family, score }) => {
                const maxScore = 280; // 28 questions × 10 points
                const percentage = Math.round((score / maxScore) * 100);
                return (
                  <div key={family} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">{family}</span>
                      <span className="text-gray-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">Dimension Breakdown</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(result.dimensionAverages).map(([dimension, average]) => (
                <div key={dimension} className="bg-white border border-gray-200 rounded-lg p-3 space-y-1">
                  <p className="text-sm font-medium text-gray-700">{dimension}</p>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(average / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {average.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleRetake}
              className="flex-1 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
            >
              Retake Assessment
            </button>
            <button
              onClick={handleBackToDashboard}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
            >
              Back to Tools
            </button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
