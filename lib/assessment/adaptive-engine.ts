// ============================================================================
// Age-Adaptive Assessment Engine
//
// Filters and adapts RDTE questions based on the user's age group and
// measurement adapter from the Decision Domain Router (Phase 1).
//
// Responsibilities:
//   1. Select which components to assess based on age group
//   2. Choose the right language level for each question
//   3. Score responses into the 28-component profile
//   4. Handle partial profiles (youth skip some components)
//   5. Provide domain-specific intake questions
// ============================================================================

import type { AgeGroup, MeasurementAdapter, DecisionDomain } from '@/lib/career/decision-domains';
import {
  getMeasurementAdapter,
  getComponentMeasurementLevel,
  DOMAIN_DEFINITIONS,
} from '@/lib/career/decision-domains';
import {
  RDTE_DIMENSION_BLOCKS,
  getRdteQuestion,
  type RdteQuestion,
  type RdteDimensionBlock,
  type LanguageLevel,
} from './rdte-questions';

// ── Adaptive Assessment Builder ──

export interface AdaptiveQuestion {
  id: string;
  component: string;
  dimension: string;
  measurementLevel: 'full' | 'simplified';
  text: string;
  subtext?: string;
  type: RdteQuestion['type'];
  scaleMin?: number;
  scaleMax?: number;
  lowLabel?: string;
  highLabel?: string;
  scenarios?: { situation: string; options: { label: string; score: number }[] };
}

export interface AdaptiveDimensionBlock {
  dimension: string;
  label: string;
  description: string;
  color: string;
  icon: string;
  questions: AdaptiveQuestion[];
}

export interface AdaptiveAssessment {
  ageGroup: AgeGroup;
  languageLevel: LanguageLevel;
  measurementStyle: string;
  totalQuestions: number;
  skippedComponents: string[];
  simplifiedComponents: string[];
  blocks: AdaptiveDimensionBlock[];
}

/**
 * Build an age-adaptive RDTE assessment for the given age group.
 * Filters questions based on the measurement adapter, selects appropriate
 * language level, and returns a ready-to-render assessment.
 */
export function buildAdaptiveAssessment(ageGroup: AgeGroup): AdaptiveAssessment {
  const adapter = getMeasurementAdapter(
    ageGroup === 'youth' ? 16 :
    ageGroup === 'emerging' ? 21 :
    ageGroup === 'early_career' ? 30 :
    ageGroup === 'mid_career' ? 42 : 57
  );

  const blocks: AdaptiveDimensionBlock[] = [];

  for (const block of RDTE_DIMENSION_BLOCKS) {
    const adaptiveQuestions: AdaptiveQuestion[] = [];

    for (const question of block.questions) {
      const level = getComponentMeasurementLevel(question.component, ageGroup);

      if (level === 'skip') continue;

      adaptiveQuestions.push(adaptQuestion(question, adapter.languageLevel, level));
    }

    // Only include blocks that have at least one question
    if (adaptiveQuestions.length > 0) {
      blocks.push({
        dimension: block.dimension,
        label: block.label,
        description: block.description[adapter.languageLevel],
        color: block.color,
        icon: block.icon,
        questions: adaptiveQuestions,
      });
    }
  }

  const totalQuestions = blocks.reduce((sum, b) => sum + b.questions.length, 0);

  return {
    ageGroup,
    languageLevel: adapter.languageLevel,
    measurementStyle: adapter.measurementStyle,
    totalQuestions,
    skippedComponents: adapter.skippedComponents,
    simplifiedComponents: adapter.simplifiedComponents,
    blocks,
  };
}

function adaptQuestion(
  question: RdteQuestion,
  languageLevel: LanguageLevel,
  measurementLevel: 'full' | 'simplified',
): AdaptiveQuestion {
  return {
    id: question.id,
    component: question.component,
    dimension: question.dimension,
    measurementLevel,
    text: question.text[languageLevel],
    subtext: question.subtext?.[languageLevel],
    type: question.type,
    scaleMin: question.scaleMin,
    scaleMax: question.scaleMax,
    lowLabel: question.lowLabel?.[languageLevel],
    highLabel: question.highLabel?.[languageLevel],
    scenarios: question.scenarios?.[languageLevel],
  };
}

// ── Response Scoring ──

export interface RdteResponse {
  componentId: string;
  value: number;           // 1-10 for scale questions
}

export interface RdteProfile {
  ageGroup: AgeGroup;
  /** Component scores that were actually measured */
  scores: Record<string, number>;
  /** Components that were skipped due to age group */
  skipped: string[];
  /** Components that used simplified measurement */
  simplified: string[];
  /** Total components measured */
  measured: number;
  /** Timestamp */
  assessedAt: string;
}

/**
 * Score RDTE responses into a component profile.
 * Validates that responses match the expected components for the age group.
 */
export function scoreRdteResponses(
  responses: RdteResponse[],
  ageGroup: AgeGroup,
): RdteProfile {
  const adapter = getMeasurementAdapter(
    ageGroup === 'youth' ? 16 :
    ageGroup === 'emerging' ? 21 :
    ageGroup === 'early_career' ? 30 :
    ageGroup === 'mid_career' ? 42 : 57
  );

  const scores: Record<string, number> = {};
  const simplified: string[] = [];

  for (const response of responses) {
    const level = getComponentMeasurementLevel(response.componentId, ageGroup);

    if (level === 'skip') continue; // Ignore responses for skipped components

    // Clamp to valid range
    const score = Math.max(1, Math.min(10, Math.round(response.value * 10) / 10));
    scores[response.componentId] = score;

    if (level === 'simplified') {
      simplified.push(response.componentId);
    }
  }

  return {
    ageGroup,
    scores,
    skipped: adapter.skippedComponents,
    simplified,
    measured: Object.keys(scores).length,
    assessedAt: new Date().toISOString(),
  };
}

/**
 * Fill in skipped component scores with age-group-appropriate defaults.
 * This allows the Career Family scoring engine to still produce results
 * even for youth profiles that skip many components.
 *
 * Default strategy: use population median (5.0) for skipped components.
 * This is a neutral fill — it won't bias toward any career family.
 */
export function fillProfileDefaults(
  profile: RdteProfile,
  defaultScore: number = 5.0,
): Record<string, number> {
  const allComponents = [
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
    'P1', 'P2', 'P3', 'P4', 'P5',
    'E1', 'E2', 'E3', 'E4', 'E5',
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',
    'V1', 'V2', 'V3', 'V4', 'V5',
    'H1', 'H2', 'H3', 'H4', 'H5',
  ];

  const filled: Record<string, number> = {};

  for (const comp of allComponents) {
    filled[comp] = profile.scores[comp] ?? defaultScore;
  }

  return filled;
}

// ── Domain-Specific Intake Questions ──

export interface DomainIntakeQuestion {
  id: string;
  domain: DecisionDomain;
  text: Record<LanguageLevel, string>;
  type: 'scale' | 'select' | 'text';
  scaleMin?: number;
  scaleMax?: number;
  lowLabel?: Record<LanguageLevel, string>;
  highLabel?: Record<LanguageLevel, string>;
  options?: Record<LanguageLevel, { value: string; label: string }[]>;
}

export const DOMAIN_INTAKE_QUESTIONS: Record<DecisionDomain, DomainIntakeQuestion[]> = {
  identity: [
    {
      id: 'identity_clarity',
      domain: 'identity',
      text: {
        simple: 'How well do you know who you are — separate from what your parents, teachers, or friends expect?',
        standard: 'How clearly have you formed your own identity, independent of external expectations?',
        professional: 'Rate your identity clarity — the degree to which you have an authentic, self-authored sense of self.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'I mostly do what others expect',
        standard: 'My identity is largely shaped by others',
        professional: 'Identity is externally defined',
      },
      highLabel: {
        simple: 'I know exactly who I am',
        standard: 'I have a clear, self-authored identity',
        professional: 'Strong, autonomous identity',
      },
    },
    {
      id: 'identity_exploration',
      domain: 'identity',
      text: {
        simple: 'How many different activities, subjects, or interests have you tried in the last year?',
        standard: 'How actively are you exploring different interests, identities, and possibilities?',
        professional: 'Rate your current level of identity exploration activity.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'I haven\'t tried anything new',
        standard: 'Minimal exploration',
        professional: 'Very low exploration',
      },
      highLabel: {
        simple: 'I\'m trying lots of new things',
        standard: 'Very actively exploring',
        professional: 'High exploration activity',
      },
    },
    {
      id: 'identity_pressure',
      domain: 'identity',
      text: {
        simple: 'How much pressure do you feel from others about what you should do with your life?',
        standard: 'How much external pressure do you feel regarding your choices and direction?',
        professional: 'Rate the level of external pressure on your identity and direction choices.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'No pressure at all',
        standard: 'Minimal external pressure',
        professional: 'Very low external pressure',
      },
      highLabel: {
        simple: 'Enormous pressure from everyone',
        standard: 'Extreme external pressure',
        professional: 'Very high external pressure',
      },
    },
  ],

  direction: [
    {
      id: 'direction_clarity',
      domain: 'direction',
      text: {
        simple: 'Do you know what kind of career or path you want to pursue?',
        standard: 'How clearly defined is your target career direction?',
        professional: 'Rate the clarity of your career or educational direction.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'No idea at all',
        standard: 'Completely unclear',
        professional: 'No defined direction',
      },
      highLabel: {
        simple: 'I know exactly what I want to do',
        standard: 'Crystal clear direction',
        professional: 'Highly defined target direction',
      },
    },
    {
      id: 'direction_confidence',
      domain: 'direction',
      text: {
        simple: 'How confident are you that you\'re choosing the right path?',
        standard: 'How confident are you in your current or planned career direction?',
        professional: 'Rate your confidence in the direction you\'re pursuing.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'Not confident at all',
        standard: 'Very low confidence',
        professional: 'Minimal confidence in direction',
      },
      highLabel: {
        simple: 'Totally confident',
        standard: 'Extremely confident',
        professional: 'Very high direction confidence',
      },
    },
    {
      id: 'direction_gaps',
      domain: 'direction',
      text: {
        simple: 'What\'s the biggest thing standing between you and your goal?',
        standard: 'What is the primary gap between where you are and where you want to be?',
        professional: 'Identify the primary barrier to achieving your target direction.',
      },
      type: 'select',
      options: {
        simple: [
          { value: 'skill', label: 'I don\'t have the right skills yet' },
          { value: 'experience', label: 'I haven\'t had enough experience' },
          { value: 'knowledge', label: 'I don\'t know enough about my options' },
          { value: 'confidence', label: 'I\'m not sure I can do it' },
          { value: 'resources', label: 'I don\'t have the money or support' },
        ],
        standard: [
          { value: 'skill', label: 'Skill gap — I need to learn more' },
          { value: 'experience', label: 'Experience gap — I need hands-on time' },
          { value: 'credential', label: 'Credential gap — I need a degree or cert' },
          { value: 'network', label: 'Network gap — I need connections' },
          { value: 'financial', label: 'Financial gap — I need funding or runway' },
        ],
        professional: [
          { value: 'skill', label: 'Skill gap' },
          { value: 'experience', label: 'Experience gap' },
          { value: 'credential', label: 'Credential gap' },
          { value: 'network', label: 'Network gap' },
          { value: 'financial', label: 'Financial gap' },
          { value: 'structural', label: 'Structural barrier' },
        ],
      },
    },
  ],

  transition: [
    {
      id: 'transition_satisfaction',
      domain: 'transition',
      text: {
        simple: 'How happy are you with your current work situation?',
        standard: 'How satisfied are you with your current career position?',
        professional: 'Rate your overall satisfaction with your current professional situation.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'Very unhappy',
        standard: 'Very dissatisfied',
        professional: 'Deeply dissatisfied',
      },
      highLabel: {
        simple: 'Love it',
        standard: 'Highly satisfied',
        professional: 'Exceptionally satisfied',
      },
    },
    {
      id: 'transition_fixability',
      domain: 'transition',
      text: {
        simple: 'Can the things that bother you about your work be fixed, or is it the whole thing?',
        standard: 'Is your dissatisfaction caused by fixable issues, or is it fundamentally structural?',
        professional: 'Assess whether your career dissatisfaction is situational (fixable) or structural (requires transition).',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'The whole thing needs to change',
        standard: 'Fundamentally structural — must leave',
        professional: 'Structural misalignment — transition needed',
      },
      highLabel: {
        simple: 'Just a few things could be fixed',
        standard: 'Mostly fixable within current role',
        professional: 'Situational issues — fixable in place',
      },
    },
    {
      id: 'transition_urgency',
      domain: 'transition',
      text: {
        simple: 'How urgent does a change feel right now?',
        standard: 'How urgent is the need for a career change?',
        professional: 'Rate the urgency of your transition consideration.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'Not urgent at all',
        standard: 'Just considering options',
        professional: 'Low urgency — exploratory phase',
      },
      highLabel: {
        simple: 'I need to change right now',
        standard: 'Extremely urgent — must move immediately',
        professional: 'Critical urgency — immediate transition needed',
      },
    },
  ],

  optimization: [
    {
      id: 'optimization_alignment',
      domain: 'optimization',
      text: {
        simple: 'How well does your current job match who you really are?',
        standard: 'How well aligned is your current role with your strengths and energy patterns?',
        professional: 'Rate the alignment between your current role and your RDTE profile.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'Doesn\'t match me at all',
        standard: 'Poorly aligned',
        professional: 'Significant misalignment',
      },
      highLabel: {
        simple: 'Perfect match',
        standard: 'Excellently aligned',
        professional: 'Strong profile-role alignment',
      },
    },
    {
      id: 'optimization_growth_area',
      domain: 'optimization',
      text: {
        simple: 'What would help you most right now?',
        standard: 'What is your primary growth priority?',
        professional: 'Identify your primary optimization vector.',
      },
      type: 'select',
      options: {
        simple: [
          { value: 'skills', label: 'Learning new skills' },
          { value: 'network', label: 'Meeting the right people' },
          { value: 'leadership', label: 'Getting better at leading others' },
          { value: 'depth', label: 'Going deeper in what I already know' },
          { value: 'visibility', label: 'Getting noticed for my work' },
        ],
        standard: [
          { value: 'skills', label: 'Skill development' },
          { value: 'network', label: 'Network expansion' },
          { value: 'leadership', label: 'Leadership capacity' },
          { value: 'depth', label: 'Domain expertise deepening' },
          { value: 'visibility', label: 'Professional visibility' },
        ],
        professional: [
          { value: 'skills', label: 'Technical skill development' },
          { value: 'network', label: 'Strategic network building' },
          { value: 'leadership', label: 'Leadership development' },
          { value: 'depth', label: 'Domain mastery' },
          { value: 'visibility', label: 'Professional brand and visibility' },
          { value: 'credential', label: 'Credential acquisition' },
        ],
      },
    },
    {
      id: 'optimization_ceiling',
      domain: 'optimization',
      text: {
        simple: 'Do you feel like you\'re growing in your current situation?',
        standard: 'How much room for growth exists in your current role?',
        professional: 'Rate the growth headroom in your current position.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'I\'ve hit a wall',
        standard: 'Very limited growth potential',
        professional: 'At or near ceiling',
      },
      highLabel: {
        simple: 'Lots of room to grow',
        standard: 'Significant growth runway',
        professional: 'Substantial headroom for advancement',
      },
    },
  ],

  legacy: [
    {
      id: 'legacy_impact',
      domain: 'legacy',
      text: {
        simple: 'What kind of impact do you want to have in your remaining career?',
        standard: 'What legacy do you want to create in your professional life?',
        professional: 'Define the impact you want your career to have produced when you look back.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'I haven\'t thought about it much',
        standard: 'Legacy is not a priority right now',
        professional: 'Legacy considerations are minimal',
      },
      highLabel: {
        simple: 'I think about this all the time',
        standard: 'Legacy is my primary focus',
        professional: 'Legacy is the dominant career driver',
      },
    },
    {
      id: 'legacy_transfer',
      domain: 'legacy',
      text: {
        simple: 'How important is it to you to teach and mentor the next generation?',
        standard: 'How important is knowledge transfer and mentorship to you?',
        professional: 'Rate the importance of knowledge transfer and succession planning in your current priorities.',
      },
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10,
      lowLabel: {
        simple: 'Not important to me',
        standard: 'Low priority',
        professional: 'Not a current focus',
      },
      highLabel: {
        simple: 'One of the most important things I do',
        standard: 'Core priority',
        professional: 'Central to my professional identity',
      },
    },
    {
      id: 'legacy_timeline',
      domain: 'legacy',
      text: {
        simple: 'When do you plan to stop working full-time?',
        standard: 'What is your anticipated career timeline?',
        professional: 'Estimate your remaining active career horizon.',
      },
      type: 'select',
      options: {
        simple: [
          { value: '1_3', label: 'In the next 1-3 years' },
          { value: '3_5', label: 'In 3-5 years' },
          { value: '5_10', label: 'In 5-10 years' },
          { value: '10_plus', label: 'More than 10 years' },
          { value: 'never', label: 'I don\'t plan to stop' },
        ],
        standard: [
          { value: '1_3', label: '1-3 years' },
          { value: '3_5', label: '3-5 years' },
          { value: '5_10', label: '5-10 years' },
          { value: '10_plus', label: '10+ years' },
          { value: 'never', label: 'Indefinite' },
        ],
        professional: [
          { value: '1_3', label: '1-3 year horizon' },
          { value: '3_5', label: '3-5 year horizon' },
          { value: '5_10', label: '5-10 year horizon' },
          { value: '10_plus', label: '10+ year horizon' },
          { value: 'never', label: 'No planned retirement' },
        ],
      },
    },
  ],
};

/**
 * Get domain-specific intake questions adapted for the given language level.
 */
export function getDomainIntakeQuestions(
  domain: DecisionDomain,
  languageLevel: LanguageLevel,
): { id: string; text: string; type: string; scaleMin?: number; scaleMax?: number; lowLabel?: string; highLabel?: string; options?: { value: string; label: string }[] }[] {
  const questions = DOMAIN_INTAKE_QUESTIONS[domain] ?? [];

  return questions.map((q) => ({
    id: q.id,
    text: q.text[languageLevel],
    type: q.type,
    scaleMin: q.scaleMin,
    scaleMax: q.scaleMax,
    lowLabel: q.lowLabel?.[languageLevel],
    highLabel: q.highLabel?.[languageLevel],
    options: q.options?.[languageLevel],
  }));
}
