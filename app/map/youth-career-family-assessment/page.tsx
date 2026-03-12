'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import { YOUTH_CAREER_EXPLORATIONS, generateYouthExplorations, type YouthCareerExploration } from '@/lib/signal/youth-tools';

type Phase = 'intro' | 'questions' | 'results';

interface CareerResponse {
  [dimensionKey: string]: number; // Energy dimension scores (0-10 scale)
}

const ENERGY_SLIDERS = [
  { key: 'N1', label: 'People', description: 'Working with, leading, or helping others' },
  { key: 'N2', label: 'Problems', description: 'Solving difficult, ambiguous challenges' },
  { key: 'N3', label: 'Completion', description: 'Finishing tasks and closing loops' },
  { key: 'N4', label: 'Mastery', description: 'Deep learning and building expertise' },
  { key: 'N5', label: 'Helping', description: 'Supporting, nurturing, and serving others' },
  { key: 'N6', label: 'Building', description: 'Creating tangible things from scratch' },
  { key: 'N7', label: 'Complexity', description: 'Working with multi-variable systems' },
];

const CAREER_FAMILY_COLORS: Record<string, string> = {
  Builder: 'bg-yellow-50 border-yellow-200',
  Strategist: 'bg-purple-50 border-purple-200',
  Explorer: 'bg-cyan-50 border-cyan-200',
  Optimizer: 'bg-blue-50 border-blue-200',
  Teacher: 'bg-green-50 border-green-200',
  Connector: 'bg-pink-50 border-pink-200',
  Guardian: 'bg-indigo-50 border-indigo-200',
  Healer: 'bg-red-50 border-red-200',
};

function computeCareerFamilyScores(energyScores: Record<string, number>): Record<string, number> {
  const scores: Record<string, number> = {};

  // Simplified mapping of energy dimensions to career families
  scores.Builder = (energyScores.N6 + energyScores.N2 + energyScores.N3) / 3;
  scores.Strategist = (energyScores.N7 + energyScores.N2 + energyScores.N1) / 3;
  scores.Explorer = (energyScores.N2 + energyScores.N4 + energyScores.N7) / 3;
  scores.Optimizer = (energyScores.N3 + energyScores.N2 + energyScores.N7) / 3;
  scores.Teacher = (energyScores.N5 + energyScores.N1 + energyScores.N4) / 3;
  scores.Connector = (energyScores.N1 + energyScores.N5 + energyScores.N7) / 3;
  scores.Guardian = (energyScores.N3 + energyScores.N7 + energyScores.N4) / 3;
  scores.Healer = (energyScores.N5 + energyScores.N1 + energyScores.N4) / 3;

  return scores;
}

export default function YouthCareerFamilyAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [responses, setResponses] = useState<CareerResponse>({
    N1: 5,
    N2: 5,
    N3: 5,
    N4: 5,
    N5: 5,
    N6: 5,
    N7: 5,
  });
  const [results, setResults] = useState<YouthCareerExploration[]>([]);

  const canProceed = useCallback(() => {
    return ENERGY_SLIDERS.every((s) => responses[s.key] !== undefined);
  }, [responses]);

  const handleSliderChange = useCallback((key: string, value: number) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <ToolShell title="Youth Career Family Assessment" subtitle="Discover what kind of work fits you" duration="~5 min">
        <div className="card space-y-4">
          <p className="text-sm text-surface-600 leading-relaxed">
            There are 8 different types of work that bring out the best in people — we call them <strong>Career Families</strong>.
            Each family matches a different mix of energy dimensions.
          </p>
          <p className="text-sm text-surface-500">
            You'll rate how much you enjoy each energy dimension (0–10), and we'll show you which career families match you best.
            Plus, you'll see school subjects and college majors that align with each family.
          </p>
          <button onClick={() => setPhase('questions')} className="btn-primary">
            Explore Career Families
          </button>
        </div>
      </ToolShell>
    );
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const topThree = results.slice(0, 3);

    return (
      <ToolShell title="Youth Career Family Assessment" subtitle="Your Top Career Families">
        <div className="space-y-6">
          {/* Top 3 Results */}
          {topThree.map((exploration, idx) => {
            const colors = CAREER_FAMILY_COLORS[exploration.family] || 'bg-gray-50 border-gray-200';
            return (
              <div key={exploration.family} className={`card border-2 ${colors}`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{exploration.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-surface-900">{exploration.family}</h3>
                      <span className="text-xs bg-surface-100 px-2 py-1 rounded text-surface-600">
                        #{idx + 1}
                      </span>
                    </div>
                    <p className="text-sm text-surface-600">{exploration.tagline}</p>
                  </div>
                </div>

                <p className="text-sm text-surface-700 mb-3">{exploration.whatItMeans}</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">Try This</h4>
                    <ul className="text-xs text-surface-600 space-y-1">
                      {exploration.tryThis.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">School Subjects</h4>
                      <div className="flex flex-wrap gap-1">
                        {exploration.relatedSubjects.map((subject) => (
                          <span key={subject} className="text-xs bg-surface-100 px-2 py-1 rounded text-surface-700">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">College Majors</h4>
                      <div className="flex flex-wrap gap-1">
                        {exploration.relatedMajors.map((major) => (
                          <span key={major} className="text-xs bg-surface-200 px-2 py-1 rounded text-surface-700">
                            {major}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Info about other families */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">About the other 5 families</h3>
            <p className="text-xs text-blue-700">
              You have some energy in all 8 career families — these three are just your strongest matches. As you explore,
              you might discover that another family is actually a great fit, especially if you find work that combines
              multiple families.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setResponses({
                  N1: 5,
                  N2: 5,
                  N3: 5,
                  N4: 5,
                  N5: 5,
                  N6: 5,
                  N7: 5,
                });
                setResults([]);
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

  // ── QUESTIONS ──
  return (
    <ToolShell title="Youth Career Family Assessment" subtitle="Rate your energy for each dimension">
      <div className="card space-y-8">
        <div className="text-sm text-surface-500">
          For each energy dimension, drag the slider to show how much you enjoy or energize from it (0 = not at all, 10 = absolutely love it).
        </div>

        {ENERGY_SLIDERS.map((slider) => (
          <div key={slider.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-surface-900">{slider.label}</label>
                <p className="text-xs text-surface-500">{slider.description}</p>
              </div>
              <span className="text-xl font-semibold text-brand-600 tabular-nums">{responses[slider.key]}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-400">0</span>
              <input
                type="range"
                min="0"
                max="10"
                value={responses[slider.key]}
                onChange={(e) => handleSliderChange(slider.key, parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full bg-surface-200 appearance-none cursor-pointer accent-brand-600"
              />
              <span className="text-xs text-surface-400">10</span>
            </div>
          </div>
        ))}

        {/* Submit */}
        <button
          onClick={() => {
            const careerScores = computeCareerFamilyScores(responses);
            const explorations = generateYouthExplorations(careerScores);
            setResults(explorations);
            setPhase('results');
          }}
          disabled={!canProceed()}
          className="btn-primary w-full"
        >
          See Career Matches
        </button>
      </div>
    </ToolShell>
  );
}
