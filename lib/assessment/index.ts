// @ts-nocheck
export { ASSESSMENT_STEPS } from './questions';
export type { AssessmentQuestion, AssessmentStep } from './questions';

import type { ElementType } from '@/types';

export interface AssessmentResponse {
  questionId: string;
  element: ElementType;
  value?: number;
  subValues?: Record<string, number>;
  textValue?: string;
  selectedValue?: string;
}

export interface BaselineScore {
  element: ElementType;
  score: number;
  notes?: string;
}

/**
 * Compute element scores from assessment responses.
 * Each element may have different scoring logic.
 */
export function computeBaselineScores(
  responses: AssessmentResponse[]
): BaselineScore[] {
  const scores: BaselineScore[] = [];
  const byElement = new Map<ElementType, AssessmentResponse[]>();

  for (const r of responses) {
    const existing = byElement.get(r.element) || [];
    existing.push(r);
    byElement.set(r.element, existing);
  }

  for (const [element, elementResponses] of byElement) {
    let score: number | null = null;

    if (element === 'state') {
      // State uses sub-values (body, mind, emotion) — average them
      const subScores: number[] = [];
      for (const r of elementResponses) {
        if (r.subValues) {
          subScores.push(...Object.values(r.subValues));
        } else if (r.value != null) {
          subScores.push(r.value);
        }
      }
      score = subScores.length > 0
        ? Math.round((subScores.reduce((a, b) => a + b, 0) / subScores.length) * 10) / 10
        : null;
    } else if (element === 'capacity') {
      // Capacity is 0-100%, convert to 0-10 scale
      const vals = elementResponses.filter((r) => r.value != null).map((r) => r.value!);
      score = vals.length > 0
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length / 10) * 10) / 10
        : null;
    } else if (element === 'programming') {
      // Programming uses select options with score values
      const vals = elementResponses
        .filter((r) => r.selectedValue)
        .map((r) => {
          // The options in questions.ts should have score property
          return r.value ?? 5; // fallback
        });
      score = vals.length > 0
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : null;
    } else {
      // Standard scale elements (1-10)
      const vals = elementResponses.filter((r) => r.value != null).map((r) => r.value!);
      score = vals.length > 0
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : null;
    }

    if (score != null) {
      // Collect any notes from responses for this element
      const notes = elementResponses
        .find((r) => r.textValue)
        ?.textValue;

      scores.push({ element, score, notes });
    }
  }

  return scores;
}

// ── RDTE Sub-Component Assessment (Phase 2 Expansion) ──
export {
  RDTE_DIMENSION_BLOCKS,
  getRdteQuestion,
  getRdteQuestionsByDimension,
} from './rdte-questions';

export type {
  RdteQuestion,
  RdteDimensionBlock,
  LanguageLevel,
} from './rdte-questions';

// ── Age-Adaptive Assessment Engine ──
export {
  buildAdaptiveAssessment,
  scoreRdteResponses,
  fillProfileDefaults,
  getDomainIntakeQuestions,
  DOMAIN_INTAKE_QUESTIONS,
} from './adaptive-engine';

export type {
  AdaptiveAssessment,
  AdaptiveQuestion,
  AdaptiveDimensionBlock,
  RdteResponse,
  RdteProfile,
  DomainIntakeQuestion,
} from './adaptive-engine';
