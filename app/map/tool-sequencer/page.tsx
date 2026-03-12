// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import {
  buildToolSequence,
  type ToolSequence,
} from '@/lib/career/tool-sequencing';
import {
  DOMAIN_DEFINITIONS,
  type DecisionDomain,
} from '@/lib/career/decision-domains';

type Phase = 'intro' | 'questions' | 'results';

interface Answers {
  selectedDomain: string | null;
  age: number | null;
}

export default function ToolSequencerPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Answers>({
    selectedDomain: null,
    age: null,
  });
  const [completedTools, setCompletedTools] = useState<Set<string>>(new Set());
  const [sequence, setSequence] = useState<ToolSequence | null>(null);

  const selectedDomain = useMemo(() => {
    if (!answers.selectedDomain) return null;
    return DOMAIN_DEFINITIONS.find((d) => d.id === answers.selectedDomain);
  }, [answers.selectedDomain]);

  const handleStartQuestions = () => {
    setPhase('questions');
  };

  const handleSubmitAnswers = () => {
    if (!answers.selectedDomain || !answers.age) {
      alert('Please select a domain and enter your age');
      return;
    }

    const toolSequence = buildToolSequence(
      answers.selectedDomain,
      answers.age
    );

    setSequence(toolSequence);
    setPhase('results');
  };

  const handleToggleCompleted = (toolId: string) => {
    const newCompleted = new Set(completedTools);
    if (newCompleted.has(toolId)) {
      newCompleted.delete(toolId);
    } else {
      newCompleted.add(toolId);
    }
    setCompletedTools(newCompleted);
  };

  const handleNavigateToTool = (toolId: string) => {
    router.push(`/map/${toolId}`);
  };

  const handleRetake = () => {
    setAnswers({
      selectedDomain: null,
      age: null,
    });
    setCompletedTools(new Set());
    setSequence(null);
    setPhase('intro');
  };

  const handleBackToDashboard = () => {
    router.push('/map');
  };

  // Calculate progress
  const progress = useMemo(() => {
    if (!sequence) return 0;
    const total = sequence.tools.length;
    const completed = completedTools.size;
    return Math.round((completed / total) * 100);
  }, [sequence, completedTools]);

  const totalTimeMinutes = useMemo(() => {
    if (!sequence) return 0;
    return sequence.tools.reduce((sum, tool) => sum + (tool.estimatedMinutes || 5), 0);
  }, [sequence]);

  return (
    <ToolShell
      title="Tool Sequencer"
      description="Get a recommended order for completing diagnostic tools tailored to your domain and profile"
      estimatedTime="1 min"
    >
      {phase === 'intro' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900">
              The Tool Sequencer creates a personalized pathway through the diagnostic tools based on your selected domain and age. This ensures you work through tools in the most effective order.
            </p>
          </div>
          <button
            onClick={handleStartQuestions}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg transition"
          >
            Create My Tool Sequence
          </button>
        </div>
      )}

      {phase === 'questions' && (
        <div className="space-y-8">
          {/* Domain Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Which decision domain do you want to focus on?
            </label>
            <div className="space-y-2">
              {DOMAIN_DEFINITIONS.map((domain) => (
                <label
                  key={domain.id}
                  className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition"
                >
                  <input
                    type="radio"
                    name="domain"
                    value={domain.id}
                    checked={answers.selectedDomain === domain.id}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        selectedDomain: e.target.value,
                      })
                    }
                    className="w-4 h-4 text-amber-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {domain.icon} {domain.name}
                    </p>
                    <p className="text-xs text-gray-600">{domain.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Age Input */}
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              What is your age?
            </label>
            <input
              id="age"
              type="number"
              min="16"
              max="100"
              value={answers.age || ''}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  age: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your age"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitAnswers}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-lg transition"
          >
            Generate My Sequence
          </button>
        </div>
      )}

      {phase === 'results' && sequence && selectedDomain && (
        <div className="space-y-8">
          {/* Header with Domain and Time Estimate */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Recommended Sequence for</p>
              <h3 className="text-2xl font-bold text-amber-900">
                {selectedDomain.icon} {selectedDomain.name}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Total Tools</p>
                <p className="text-2xl font-bold text-amber-700">{sequence.tools.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Estimated Time</p>
                <p className="text-2xl font-bold text-amber-700">~{totalTimeMinutes} min</p>
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-900">Your Progress</p>
              <span className="text-sm font-semibold text-gray-600">
                {completedTools.size} of {sequence.tools.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-amber-600 h-4 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && (
                  <span className="text-xs font-bold text-white">{progress}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Nudge Message */}
          {sequence.nudge && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm">{sequence.nudge}</p>
            </div>
          )}

          {/* Tool Sequence List */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-gray-900">Tool Sequence</h4>
            <div className="space-y-2">
              {sequence.tools.map((tool, index) => {
                const isCompleted = completedTools.has(tool.toolId);
                return (
                  <div
                    key={tool.toolId}
                    className={`border rounded-lg overflow-hidden transition ${
                      isCompleted
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-amber-400'
                    }`}
                  >
                    <div className="p-4 space-y-3">
                      {/* Tool Header */}
                      <div className="flex items-start gap-4">
                        {/* Step Number/Checkbox */}
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => handleToggleCompleted(tool.toolId)}
                            className="w-5 h-5 rounded cursor-pointer text-green-600"
                          />
                        </div>

                        {/* Tool Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-600 text-white rounded-full text-xs font-bold">
                              {index + 1}
                            </span>
                            <h5
                              className={`text-base font-semibold ${
                                isCompleted
                                  ? 'text-gray-500 line-through'
                                  : 'text-gray-900'
                              }`}
                            >
                              {tool.toolId.replace(/-/g, ' ').toUpperCase()}
                            </h5>
                          </div>
                          {tool.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {tool.description}
                            </p>
                          )}
                        </div>

                        {/* Time Estimate */}
                        <div className="text-right text-xs text-gray-600 font-medium flex-shrink-0">
                          ~{tool.estimatedMinutes || 5} min
                        </div>
                      </div>

                      {/* Open Tool Button */}
                      <button
                        onClick={() => handleNavigateToTool(tool.toolId)}
                        disabled={isCompleted}
                        className={`w-full py-2 px-3 rounded font-medium text-sm transition ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : `Open ${tool.toolId.split('-')[0].charAt(0).toUpperCase() + tool.toolId.split('-')[0].slice(1)}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completion Summary */}
          {progress === 100 && (
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-green-900">Congratulations!</p>
              <p className="text-sm text-green-700">
                You've completed all the tools in the {selectedDomain.name} sequence. Great work on your career development!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleRetake}
              className="flex-1 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
            >
              Create New Sequence
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
