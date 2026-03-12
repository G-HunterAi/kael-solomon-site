// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import {
  DOMAIN_DEFINITIONS,
  AGE_GROUP_DEFINITIONS,
  routeToDecisionDomains,
  classifyAgeGroup,
  type DecisionDomain,
  type RoutingContext,
} from '@/lib/career/decision-domains';

type Phase = 'intro' | 'questions' | 'results';

interface Answers {
  age: number | null;
  primaryConcern: string;
  lifeEvent: string;
  hasCareerProfile: string;
}

export default function DecisionDomainRouterPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Answers>({
    age: null,
    primaryConcern: '',
    lifeEvent: 'none',
    hasCareerProfile: '',
  });
  const [result, setResult] = useState<{
    primaryDomain: DecisionDomain;
    secondaryDomains: DecisionDomain[];
    ageGroupClassification: string;
  } | null>(null);

  const handleStartQuestions = () => {
    setPhase('questions');
  };

  const handleSubmitAnswers = () => {
    if (!answers.age || !answers.primaryConcern || !answers.hasCareerProfile) {
      alert('Please answer all questions');
      return;
    }

    const context: RoutingContext = {
      age: answers.age,
      primaryConcern: answers.primaryConcern,
      lifeEvent: answers.lifeEvent,
      hasCareerProfile: answers.hasCareerProfile === 'yes',
    };

    const routing = routeToDecisionDomains(context);
    const ageGroup = classifyAgeGroup(answers.age);

    setResult({
      primaryDomain: routing.primaryDomain,
      secondaryDomains: routing.secondaryDomains,
      ageGroupClassification: ageGroup,
    });

    setPhase('results');
  };

  const handleRetake = () => {
    setAnswers({
      age: null,
      primaryConcern: '',
      lifeEvent: 'none',
      hasCareerProfile: '',
    });
    setResult(null);
    setPhase('intro');
  };

  const handleBackToDashboard = () => {
    router.push('/map');
  };

  const handleNavigateToTool = (toolId: string) => {
    router.push(`/map/${toolId}`);
  };

  return (
    <ToolShell
      title="Decision Domain Router"
      description="Discover your recommended decision domain based on your age, context, and career concerns"
      estimatedTime="3 min"
    >
      {phase === 'intro' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900">
              This tool helps you find the decision domain that best matches your current career situation. We'll ask you a few quick questions to determine the right focus area for you.
            </p>
          </div>
          <button
            onClick={handleStartQuestions}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
          >
            Start Assessment
          </button>
        </div>
      )}

      {phase === 'questions' && (
        <div className="space-y-8">
          {/* Age Input */}
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              What is your current age?
            </label>
            <input
              id="age"
              type="number"
              min="16"
              max="100"
              value={answers.age || ''}
              onChange={(e) =>
                setAnswers({ ...answers, age: e.target.value ? parseInt(e.target.value) : null })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your age"
            />
          </div>

          {/* Primary Concern */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              What is your primary career concern right now?
            </label>
            <div className="space-y-2">
              {[
                { value: 'exploration', label: 'Career Exploration - Understanding myself and my options' },
                { value: 'development', label: 'Skill Development - Building competencies for my career' },
                { value: 'transition', label: 'Career Transition - Moving to a new role or industry' },
                { value: 'advancement', label: 'Career Advancement - Growing and moving up in my field' },
                { value: 'wellbeing', label: 'Work-Life Wellbeing - Balancing career with personal life' },
                { value: 'not_sure', label: 'Not Sure - Help me figure it out' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="primaryConcern"
                    value={option.value}
                    checked={answers.primaryConcern === option.value}
                    onChange={(e) =>
                      setAnswers({ ...answers, primaryConcern: e.target.value })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Life Event */}
          <div className="space-y-2">
            <label htmlFor="lifeEvent" className="block text-sm font-medium text-gray-700">
              Have you experienced any recent career-related life events?
            </label>
            <select
              id="lifeEvent"
              value={answers.lifeEvent}
              onChange={(e) =>
                setAnswers({ ...answers, lifeEvent: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="none">No recent events</option>
              <option value="job_change">Job change or new position</option>
              <option value="graduation">Recent graduation</option>
              <option value="layoff">Layoff or job loss</option>
              <option value="retirement">Retirement planning</option>
              <option value="promotion">Promotion or new opportunity</option>
            </select>
          </div>

          {/* Career Profile */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Do you have a completed career profile?
            </label>
            <div className="space-y-2">
              {[
                { value: 'yes', label: 'Yes, I have completed one' },
                { value: 'no', label: 'No, I have not' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="hasCareerProfile"
                    value={option.value}
                    checked={answers.hasCareerProfile === option.value}
                    onChange={(e) =>
                      setAnswers({ ...answers, hasCareerProfile: e.target.value })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitAnswers}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
          >
            See My Domain Recommendation
          </button>
        </div>
      )}

      {phase === 'results' && result && (
        <div className="space-y-8">
          {/* Age Group Classification */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Age Group Classification</p>
            <p className="text-lg font-semibold text-green-900">{result.ageGroupClassification}</p>
          </div>

          {/* Primary Domain */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg p-6 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{result.primaryDomain.icon}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-indigo-900">{result.primaryDomain.name}</h3>
                <p className="text-indigo-700 mt-2">{result.primaryDomain.description}</p>
              </div>
            </div>

            {/* Primary Domain Details */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Core Decision</p>
                <p className="text-gray-900">{result.primaryDomain.coreDecision}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Age Range</p>
                <p className="text-gray-900">{result.primaryDomain.ageRange}</p>
              </div>
            </div>

            {/* Recommended Tools */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Recommended Tools</p>
              <div className="space-y-2">
                {result.primaryDomain.primaryTools.map((toolId) => (
                  <button
                    key={toolId}
                    onClick={() => handleNavigateToTool(toolId)}
                    className="block w-full text-left px-4 py-2 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition text-indigo-700 font-medium"
                  >
                    → {toolId.replace(/-/g, ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Domains */}
          {result.secondaryDomains.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Secondary Domains to Consider</h4>
              {result.secondaryDomains.map((domain) => (
                <div key={domain.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{domain.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{domain.name}</h5>
                      <p className="text-sm text-gray-600">{domain.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
