// @ts-nocheck
import type { ElementType } from '@/types';

// ============================================================================
// REPROGRAM Baseline Assessment
// 
// Design principles:
// - Conversational, not clinical
// - Each element has its own question format per the spec
// - Questions should feel like "reading your own code for the first time"
// - Scoring: most elements 1-10, Capacity 0-100%, Programming is qualitative
// ============================================================================

export interface AssessmentQuestion {
  id: string;
  element: ElementType;
  text: string;
  subtext?: string;
  type: 'scale' | 'percentage' | 'multi_scale' | 'text' | 'select';
  // For scale type
  scaleMin?: number;
  scaleMax?: number;
  lowLabel?: string;
  highLabel?: string;
  // For multi_scale type (State has 3 sub-questions)
  subQuestions?: {
    id: string;
    text: string;
    lowLabel: string;
    highLabel: string;
  }[];
  // For select type
  options?: { value: string; label: string; score: number }[];
}

export interface AssessmentStep {
  element: ElementType;
  title: string;
  description: string;
  color: string;
  dotColor: string;
  questions: AssessmentQuestion[];
}

export const ASSESSMENT_STEPS: AssessmentStep[] = [
  // ── CLARITY ──────────────────────────────────────────────
  {
    element: 'clarity',
    title: 'Clarity',
    description: 'Your ability to see what\'s actually happening — versus the story you\'re telling yourself about it.',
    color: 'text-blue-600',
    dotColor: 'bg-blue-500',
    questions: [
      {
        id: 'clarity_1',
        element: 'clarity',
        text: 'Right now, how clearly can you see your own situation — what\'s real versus what\'s a story you\'re running?',
        subtext: 'Think about the biggest thing on your mind. Are you seeing it clearly, or through a filter?',
        type: 'scale',
        scaleMin: 1,
        scaleMax: 10,
        lowLabel: 'Completely foggy',
        highLabel: 'Crystal clear',
      },
    ],
  },

  // ── AUTHORITY ────────────────────────────────────────────
  {
    element: 'authority',
    title: 'Authority',
    description: 'Your internal sense of the right to decide your own life — without needing permission.',
    color: 'text-violet-600',
    dotColor: 'bg-violet-500',
    questions: [
      {
        id: 'authority_1',
        element: 'authority',
        text: 'How strong is your sense that you have the right to make your own decisions — without needing approval or permission?',
        subtext: 'Not whether you always get it right, but whether you feel entitled to choose.',
        type: 'scale',
        scaleMin: 1,
        scaleMax: 10,
        lowLabel: 'Constantly seeking permission',
        highLabel: 'Fully self-authorized',
      },
    ],
  },

  // ── STATE ────────────────────────────────────────────────
  {
    element: 'state',
    title: 'State',
    description: 'Your physiological and psychological operating conditions right now. This is the hardware your decisions run on.',
    color: 'text-amber-600',
    dotColor: 'bg-amber-500',
    questions: [
      {
        id: 'state_1',
        element: 'state',
        text: 'How is your State running right now?',
        subtext: 'State is the combination of your energy, threat level, and openness. We\'ll look at all three.',
        type: 'multi_scale',
        subQuestions: [
          {
            id: 'state_energy',
            text: 'Energy level',
            lowLabel: 'Running on empty',
            highLabel: 'Fully charged',
          },
          {
            id: 'state_threat',
            text: 'Threat level',
            lowLabel: 'Fight-or-flight active',
            highLabel: 'Calm and safe',
          },
          {
            id: 'state_openness',
            text: 'Openness to new information',
            lowLabel: 'Defensive / closed',
            highLabel: 'Curious / open',
          },
        ],
      },
    ],
  },

  // ── CAPACITY ─────────────────────────────────────────────
  {
    element: 'capacity',
    title: 'Capacity',
    description: 'Your available bandwidth for growth, change, and taking on new things. Not your potential — your current load.',
    color: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
    questions: [
      {
        id: 'capacity_1',
        element: 'capacity',
        text: 'What percentage of your total capacity is currently available?',
        subtext: 'Think of yourself as a system with finite processing power. How much is free right now?',
        type: 'percentage',
      },
    ],
  },

  // ── PROGRAMMING ──────────────────────────────────────────
  {
    element: 'programming',
    title: 'Programming',
    description: 'The automated patterns running in your background — habits, reactions, beliefs installed over your lifetime that run without your conscious choice.',
    color: 'text-red-600',
    dotColor: 'bg-red-500',
    questions: [
      {
        id: 'programming_1',
        element: 'programming',
        text: 'What\'s one pattern you know runs in your background — something you do automatically that you didn\'t consciously choose?',
        subtext: 'Examples: people-pleasing, conflict avoidance, over-working when stressed, shutting down emotionally, needing to prove yourself.',
        type: 'text',
      },
      {
        id: 'programming_2',
        element: 'programming',
        text: 'How much is that pattern running your decisions right now?',
        type: 'scale',
        scaleMin: 1,
        scaleMax: 10,
        lowLabel: 'Barely active',
        highLabel: 'Running the show',
      },
    ],
  },

  // ── REPETITION ───────────────────────────────────────────
  {
    element: 'repetition',
    title: 'Repetition',
    description: 'The consistency of practicing new patterns. Change doesn\'t come from insight alone — it comes from doing the new thing over and over.',
    color: 'text-cyan-600',
    dotColor: 'bg-cyan-500',
    questions: [
      {
        id: 'repetition_1',
        element: 'repetition',
        text: 'Is there a new behavior or practice you\'re actively trying to build right now?',
        type: 'select',
        options: [
          { value: 'yes_consistent', label: 'Yes, and I\'m doing it consistently', score: 8 },
          { value: 'yes_inconsistent', label: 'Yes, but I keep falling off', score: 5 },
          { value: 'yes_starting', label: 'Yes, I\'m just starting', score: 4 },
          { value: 'no_want_to', label: 'No, but I want to', score: 2 },
          { value: 'no', label: 'No, not right now', score: 1 },
        ],
      },
    ],
  },

  // ── FEEDBACK ─────────────────────────────────────────────
  {
    element: 'feedback',
    title: 'Feedback',
    description: 'The quality of your calibration loops — how well you\'re learning from outcomes and adjusting.',
    color: 'text-orange-600',
    dotColor: 'bg-orange-500',
    questions: [
      {
        id: 'feedback_1',
        element: 'feedback',
        text: 'When something doesn\'t go the way you expected recently, how did you process it?',
        type: 'select',
        options: [
          { value: 'examined', label: 'I examined what happened and adjusted', score: 9 },
          { value: 'noticed', label: 'I noticed it but haven\'t changed anything yet', score: 6 },
          { value: 'avoided', label: 'I kind of avoided thinking about it', score: 3 },
          { value: 'blamed', label: 'I blamed circumstances or other people', score: 2 },
          { value: 'na', label: 'Nothing significant has gone wrong recently', score: 5 },
        ],
      },
    ],
  },

  // ── TIME ─────────────────────────────────────────────────
  {
    element: 'time',
    title: 'Time',
    description: 'Your relationship with the pace of change — not how much time you have, but how you relate to it.',
    color: 'text-indigo-600',
    dotColor: 'bg-indigo-500',
    questions: [
      {
        id: 'time_1',
        element: 'time',
        text: 'How is your relationship with the pace of your life right now?',
        subtext: 'Are things moving at the right speed for meaningful change? Or does time feel distorted?',
        type: 'scale',
        scaleMin: 1,
        scaleMax: 10,
        lowLabel: 'Everything is urgent / stuck',
        highLabel: 'Pace feels right',
      },
    ],
  },
];

// ============================================================================
// Scoring Logic
// ============================================================================

export interface AssessmentResponse {
  questionId: string;
  element: ElementType;
  // For scale / percentage
  value?: number;
  // For multi_scale (State)
  subValues?: Record<string, number>;
  // For text (Programming)
  textValue?: string;
  // For select
  selectedValue?: string;
}

export interface ElementBaseline {
  element: ElementType;
  score: number;
  notes?: string;
}

/**
 * Convert raw assessment responses into element baseline scores (1-10).
 */
export function computeBaselineScores(responses: AssessmentResponse[]): ElementBaseline[] {
  const scores: ElementBaseline[] = [];

  for (const response of responses) {
    const { element, questionId } = response;

    switch (element) {
      case 'clarity':
      case 'authority':
      case 'time':
        // Direct 1-10 scale
        if (response.value != null) {
          scores.push({ element, score: response.value });
        }
        break;

      case 'state':
        // Average of 3 sub-questions (energy, threat, openness)
        if (response.subValues) {
          const vals = Object.values(response.subValues);
          if (vals.length > 0) {
            const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
            scores.push({ element, score: Math.round(avg * 10) / 10 });
          }
        }
        break;

      case 'capacity':
        // Convert 0-100% to 1-10 scale
        if (response.value != null) {
          const scaled = Math.max(1, Math.min(10, response.value / 10));
          scores.push({ element, score: Math.round(scaled * 10) / 10 });
        }
        break;

      case 'programming':
        if (questionId === 'programming_2' && response.value != null) {
          // Invert: high activation = low element health
          // A "10 - running the show" means programming score is low (pattern is dominant)
          const inverted = 11 - response.value;
          scores.push({
            element,
            score: inverted,
            notes: responses.find(r => r.questionId === 'programming_1')?.textValue || undefined,
          });
        }
        break;

      case 'repetition':
      case 'feedback':
        // Select-based scoring
        if (response.selectedValue) {
          const step = ASSESSMENT_STEPS.find(s => s.element === element);
          const question = step?.questions.find(q => q.id === questionId);
          const option = question?.options?.find(o => o.value === response.selectedValue);
          if (option) {
            scores.push({ element, score: option.score });
          }
        }
        break;
    }
  }

  return scores;
}
