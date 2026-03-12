// ============================================================================
// RDTE Career Scoring Engine
//
// Maps 28 sub-component scores across 6 dimensions to 8 Career Families
// using the collinearity-audited weight matrix from the RDTE system.
//
// Dimensions (28 sub-components):
//   Cognitive (C1-C6): Analytical, Creative, Verbal, Quantitative, Spatial, Processing
//   Personality (P1-P5): Extraversion, Intuition, Thinking/Feeling, Judging/Perceiving, VIA Cluster
//   Emotional Intelligence (E1-E5): Self-Awareness, Self-Regulation, Empathy, Social Skill, Drive
//   Energy (N1-N7): People, Problems, Completion, Mastery, Helping, Building, Complexity
//   Environment (V1-V5): Pace, Structure, Scale, Risk Tolerance, Autonomy
//   Values (H1-H5): Value #1-#5 (hierarchy)
//
// Career Families:
//   Builder, Strategist, Explorer, Optimizer, Teacher, Connector, Guardian, Healer
// ============================================================================

export const CAREER_FAMILIES = [
  'Builder', 'Strategist', 'Explorer', 'Optimizer',
  'Teacher', 'Connector', 'Guardian', 'Healer',
] as const;

export type CareerFamily = typeof CAREER_FAMILIES[number];

export const SUB_COMPONENTS = [
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
  'P1', 'P2', 'P3', 'P4', 'P5',
  'E1', 'E2', 'E3', 'E4', 'E5',
  'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',
  'V1', 'V2', 'V3', 'V4', 'V5',
] as const;

export const DIMENSIONS = {
  Cognitive: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
  Personality: ['P1', 'P2', 'P3', 'P4', 'P5'],
  EmotionalIntelligence: ['E1', 'E2', 'E3', 'E4', 'E5'],
  Energy: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'],
  Environment: ['V1', 'V2', 'V3', 'V4', 'V5'],
  Values: ['H1', 'H2', 'H3', 'H4', 'H5'],
} as const;

// Weight matrix: each family has weights for each sub-component.
// Derived from RDTE Scoring Calculator (post-collinearity audit).
// Weights are normalized so each family's weights sum to ~100.
const WEIGHT_MATRIX: Record<CareerFamily, Record<string, number>> = {
  Builder: {
    C1: 2, C2: 6, C3: 2, C4: 3, C5: 4, C6: 3,
    P1: 2, P2: 5, P3: 2, P4: 4, P5: 2,
    E1: 3, E2: 3, E3: 1, E4: 2, E5: 5,
    N1: 1, N2: 4, N3: 4, N4: 3, N5: 1, N6: 8, N7: 5,
    V1: 5, V2: 2, V3: 3, V4: 6, V5: 7,
    H1: 1, H2: 1, H3: 1, H4: 0, H5: 0,
  },
  Strategist: {
    C1: 5, C2: 4, C3: 4, C4: 4, C5: 2, C6: 3,
    P1: 3, P2: 6, P3: 3, P4: 3, P5: 2,
    E1: 4, E2: 3, E3: 2, E4: 4, E5: 4,
    N1: 2, N2: 5, N3: 2, N4: 4, N5: 1, N6: 3, N7: 8,
    V1: 4, V2: 3, V3: 4, V4: 5, V5: 4,
    H1: 1, H2: 1, H3: 0, H4: 0, H5: 0,
  },
  Explorer: {
    C1: 3, C2: 5, C3: 3, C4: 3, C5: 3, C6: 2,
    P1: 3, P2: 7, P3: 2, P4: 6, P5: 2,
    E1: 3, E2: 2, E3: 3, E4: 3, E5: 4,
    N1: 3, N2: 4, N3: 1, N4: 8, N5: 1, N6: 3, N7: 3,
    V1: 4, V2: 1, V3: 2, V4: 6, V5: 6,
    H1: 1, H2: 1, H3: 0, H4: 0, H5: 0,
  },
  Optimizer: {
    C1: 6, C2: 2, C3: 3, C4: 5, C5: 3, C6: 4,
    P1: 2, P2: 3, P3: 3, P4: 2, P5: 2,
    E1: 3, E2: 4, E3: 2, E4: 3, E5: 4,
    N1: 2, N2: 5, N3: 7, N4: 3, N5: 1, N6: 3, N7: 4,
    V1: 3, V2: 7, V3: 4, V4: 2, V5: 3,
    H1: 1, H2: 1, H3: 1, H4: 0, H5: 0,
  },
  Teacher: {
    C1: 3, C2: 3, C3: 5, C4: 2, C5: 2, C6: 2,
    P1: 5, P2: 4, P3: 4, P4: 3, P5: 4,
    E1: 4, E2: 3, E3: 5, E4: 5, E5: 3,
    N1: 5, N2: 2, N3: 3, N4: 5, N5: 5, N6: 1, N7: 2,
    V1: 3, V2: 4, V3: 3, V4: 2, V5: 3,
    H1: 2, H2: 1, H3: 1, H4: 1, H5: 1,
  },
  Connector: {
    C1: 2, C2: 3, C3: 5, C4: 2, C5: 2, C6: 3,
    P1: 7, P2: 3, P3: 4, P4: 4, P5: 3,
    E1: 3, E2: 3, E3: 5, E4: 7, E5: 3,
    N1: 8, N2: 2, N3: 2, N4: 2, N5: 3, N6: 2, N7: 3,
    V1: 4, V2: 2, V3: 3, V4: 3, V5: 3,
    H1: 2, H2: 1, H3: 1, H4: 1, H5: 0,
  },
  Guardian: {
    C1: 5, C2: 2, C3: 3, C4: 4, C5: 3, C6: 4,
    P1: 2, P2: 2, P3: 3, P4: 2, P5: 3,
    E1: 4, E2: 6, E3: 3, E4: 3, E5: 3,
    N1: 2, N2: 4, N3: 5, N4: 3, N5: 2, N6: 2, N7: 4,
    V1: 2, V2: 7, V3: 4, V4: 1, V5: 3,
    H1: 2, H2: 2, H3: 2, H4: 1, H5: 1,
  },
  Healer: {
    C1: 2, C2: 3, C3: 4, C4: 2, C5: 2, C6: 2,
    P1: 3, P2: 3, P3: 6, P4: 3, P5: 5,
    E1: 5, E2: 5, E3: 7, E4: 4, E5: 3,
    N1: 5, N2: 2, N3: 2, N4: 3, N5: 8, N6: 1, N7: 1,
    V1: 2, V2: 3, V3: 2, V4: 2, V5: 3,
    H1: 2, H2: 2, H3: 2, H4: 1, H5: 1,
  },
};

// Family descriptions for UI
export const FAMILY_DESCRIPTIONS: Record<CareerFamily, { tagline: string; core: string; icon: string }> = {
  Builder:    { tagline: 'Creates things from scratch', core: 'N6 (Building) + C2 (Creative) + N7 (Complexity)', icon: '🔨' },
  Strategist: { tagline: 'Sees the whole board and moves the pieces', core: 'N7 (Complexity) + C1 (Analytical) + P2 (Intuition)', icon: '♟️' },
  Explorer:   { tagline: 'Discovers what others have not found', core: 'N4 (Mastery) + P2 (Intuition) + P4 (Perceiving)', icon: '🔭' },
  Optimizer:  { tagline: 'Makes the existing work better', core: 'N3 (Completion) + C1 (Analytical) + V2 (Structure)', icon: '⚙️' },
  Teacher:    { tagline: 'Develops others\' capabilities', core: 'N1 (People) + N5 (Helping) + N4 (Mastery)', icon: '📚' },
  Connector:  { tagline: 'Builds and leverages relationships', core: 'N1 (People) + E4 (Social) + P1 (Extraversion)', icon: '🤝' },
  Guardian:   { tagline: 'Protects systems and standards', core: 'E2 (Self-Reg) + V2 (Structure) + N3 (Completion)', icon: '🛡️' },
  Healer:     { tagline: 'Restores function and wholeness', core: 'N5 (Helping) + E3 (Empathy) + P3 (Feeling)', icon: '💚' },
};

// ── Scoring Functions ──

export interface CareerFamilyScores {
  scores: Record<CareerFamily, number>;
  primary: CareerFamily;
  secondary: CareerFamily;
  blend: string;
  antiFamily: CareerFamily;
  blendMargin: number;
}

/**
 * Score 28 sub-components against 8 career families using weight matrix.
 * Returns percentage fit scores (0-100) per family.
 */
export function scoreCareerFamilies(
  subScores: Record<string, number>
): CareerFamilyScores {
  const familyScores: Record<string, number> = {};

  for (const family of CAREER_FAMILIES) {
    const weights = WEIGHT_MATRIX[family];
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [comp, weight] of Object.entries(weights)) {
      const score = subScores[comp];
      if (score != null && weight > 0) {
        weightedSum += score * weight;
        totalWeight += weight * 10; // max score per component is 10
      }
    }

    familyScores[family] = totalWeight > 0
      ? Math.round((weightedSum / totalWeight) * 1000) / 10  // percentage to 1 decimal
      : 0;
  }

  // Sort by score descending
  const sorted = Object.entries(familyScores)
    .sort((a, b) => b[1] - a[1]);

  const primary = sorted[0][0] as CareerFamily;
  const secondary = sorted[1][0] as CareerFamily;
  const antiFamily = sorted[sorted.length - 1][0] as CareerFamily;
  const blendMargin = sorted[0][1] - sorted[1][1];

  return {
    scores: familyScores as Record<CareerFamily, number>,
    primary,
    secondary,
    blend: blendMargin < 3 ? `${primary}=${secondary}` : `${primary}-${secondary}`,
    antiFamily,
    blendMargin: Math.round(blendMargin * 10) / 10,
  };
}

// ── Flux State Detection ──

export const FLUX_STATES = [
  'stalled', 'forced', 'seeking', 'pivoting', 'scaling', 'disrupted', 'stable',
] as const;

export type FluxState = typeof FLUX_STATES[number];

export const FLUX_DESCRIPTIONS: Record<FluxState, { label: string; description: string; color: string }> = {
  stalled:   { label: 'Stalled',   description: 'Knows something is wrong but not moving toward change', color: '#94a3b8' },
  forced:    { label: 'Forced',    description: 'External event forcing a transition (layoff, relocation, etc.)', color: '#ef4444' },
  seeking:   { label: 'Seeking',   description: 'Actively exploring options but hasn\'t committed to a direction', color: '#3b82f6' },
  pivoting:  { label: 'Pivoting',  description: 'Has chosen a direction and is executing the transition', color: '#8b5cf6' },
  scaling:   { label: 'Scaling',   description: 'In the right direction, building momentum', color: '#10b981' },
  disrupted: { label: 'Disrupted', description: 'AI or technology has changed the landscape of their field', color: '#f59e0b' },
  stable:    { label: 'Stable',    description: 'Aligned and functioning well in current role', color: '#22c55e' },
};

/**
 * Detect flux state from element scores and recent patterns.
 * Returns suggested state with confidence score.
 */
export function detectFluxState(
  elements: Record<string, number>,
  recentDecisionCount: number = 0,
  hasRecentJobChange: boolean = false,
): { state: FluxState; confidence: number; reasoning: string } {
  const clarity = elements.clarity || 5;
  const authority = elements.authority || 5;
  const state = elements.state || 5;
  const capacity = elements.capacity || 5;
  const repetition = elements.repetition || 5;

  // Forced: low authority + recent external trigger
  if (authority < 4 && hasRecentJobChange) {
    return { state: 'forced', confidence: 0.8, reasoning: 'Low authority with recent external change suggests a forced transition.' };
  }

  // Stalled: low clarity + low authority + low decision activity
  if (clarity < 4 && authority < 5 && recentDecisionCount < 2) {
    return { state: 'stalled', confidence: 0.7, reasoning: 'Low clarity and authority with minimal decision activity indicates stalling.' };
  }

  // Seeking: moderate clarity + high decision activity
  if (clarity >= 4 && clarity < 7 && recentDecisionCount >= 3) {
    return { state: 'seeking', confidence: 0.65, reasoning: 'Moderate clarity with active exploration suggests seeking mode.' };
  }

  // Pivoting: high clarity + high authority + recent decisions
  if (clarity >= 7 && authority >= 6 && recentDecisionCount >= 2) {
    return { state: 'pivoting', confidence: 0.7, reasoning: 'High clarity and authority with active decisions suggests committed pivot.' };
  }

  // Scaling: high everything
  if (clarity >= 7 && authority >= 7 && state >= 6 && capacity >= 6) {
    return { state: 'scaling', confidence: 0.75, reasoning: 'Strong scores across clarity, authority, state, and capacity indicate scaling.' };
  }

  // Stable: moderate-high everything, low repetition (not in loops)
  if (state >= 5 && clarity >= 5 && repetition >= 5) {
    return { state: 'stable', confidence: 0.6, reasoning: 'Balanced scores with positive momentum suggest stability.' };
  }

  // Default: stalled
  return { state: 'stalled', confidence: 0.4, reasoning: 'Insufficient signal for confident classification. Defaulting to stalled.' };
}

// ── Gap Analysis ──

export const GAP_TYPES = [
  'skill', 'experience', 'credential', 'network',
  'financial', 'structural', 'ai_displacement',
] as const;
export type GapType = typeof GAP_TYPES[number];

export const GAP_DESCRIPTIONS: Record<GapType, { label: string; description: string; examples: string }> = {
  skill: {
    label: 'Skill',
    description: 'Technical or professional skills you need but don\'t have',
    examples: 'Programming, public speaking, financial modeling, project management, negotiation',
  },
  experience: {
    label: 'Experience',
    description: 'Hands-on experience in a role, industry, or context',
    examples: 'Management experience, client-facing work, startup experience, international work',
  },
  credential: {
    label: 'Credential',
    description: 'Degrees, certifications, or formal qualifications',
    examples: 'MBA, PMP, CPA, specific licenses, portfolio pieces',
  },
  network: {
    label: 'Network',
    description: 'Relationships and connections in your target field',
    examples: 'Industry contacts, mentors in the field, hiring managers, professional community',
  },
  financial: {
    label: 'Financial',
    description: 'Income gap, savings runway, or investment needed for transition',
    examples: 'Savings to cover transition, tuition costs, income drop during pivot',
  },
  structural: {
    label: 'Structural',
    description: 'External barriers that can\'t be closed with effort alone',
    examples: 'Geographic limits, visa restrictions, non-compete clauses, market conditions',
  },
  ai_displacement: {
    label: 'AI Displacement',
    description: 'Automation exposure risk for your target role',
    examples: 'Tasks automatable by AI, role consolidation trends, industry disruption signals',
  },
};

/**
 * Compute gap score from current profile vs target requirements.
 * Returns 0-10 where 10 = massive gap, 0 = no gap.
 */
export function computeGapScore(
  currentScore: number,
  requiredScore: number
): number {
  const gap = Math.max(0, requiredScore - currentScore);
  return Math.round(gap * 10) / 10;
}

/**
 * Compute gap priority using 3-factor model from DM Tools.
 * width: How big is this gap? (1-10, 10 = huge gap)
 * criticality: How much does it matter for the target role? (1-10, 10 = absolute requirement)
 * closeability: How easily can you close this gap? (1-10, 10 = very easy)
 * Returns priority score where higher = more urgent to address.
 */
export function computeGapPriority(
  width: number,
  criticality: number,
  closeability: number,
): number {
  // Prevent division by zero; minimum closeability of 0.5
  const safeCloseability = Math.max(0.5, closeability);
  const priority = (width * criticality) / safeCloseability;
  return Math.round(priority * 10) / 10;
}

// ── Blend Profile Lookup ──

export const BLEND_PROFILES: Record<string, { name: string; sweetSpot: string[] }> = {
  'Builder-Strategist':   { name: 'The Architect', sweetSpot: ['Product management', 'Startup founding', 'Systems engineering'] },
  'Builder-Explorer':     { name: 'The Inventor', sweetSpot: ['R&D lead', 'Innovation lab', 'Creative technologist'] },
  'Builder-Optimizer':    { name: 'The Craftsperson', sweetSpot: ['Senior engineer', 'Quality product lead', 'Precision manufacturing'] },
  'Builder-Teacher':      { name: 'The Coach-Builder', sweetSpot: ['Technical trainer', 'Curriculum developer', 'Dev-rel'] },
  'Builder-Connector':    { name: 'The Relationship Builder', sweetSpot: ['Community manager', 'Business development', 'Event producer'] },
  'Builder-Guardian':     { name: 'The Guardian-Builder', sweetSpot: ['Infrastructure engineer', 'Compliance systems', 'Safety product lead'] },
  'Builder-Healer':       { name: 'The Healer-Builder', sweetSpot: ['Health tech product', 'Assistive tech', 'Therapeutic tool creator'] },
  'Strategist-Explorer':  { name: 'The Visionary', sweetSpot: ['Strategy consultant', 'Venture capital', 'Futures researcher'] },
  'Strategist-Optimizer': { name: 'The Systems Optimizer', sweetSpot: ['Management consulting', 'Operations strategy', 'Supply chain'] },
  'Strategist-Teacher':   { name: 'The Strategic Educator', sweetSpot: ['Executive education', 'Thought leadership', 'Org learning'] },
  'Strategist-Connector': { name: 'The Strategic Connector', sweetSpot: ['Biz dev strategy', 'Alliance management', 'M&A advisory'] },
  'Strategist-Guardian':  { name: 'The Strategic Guardian', sweetSpot: ['Risk management', 'Institutional strategy', 'Regulatory affairs'] },
  'Strategist-Healer':    { name: 'The Strategic Healer', sweetSpot: ['Healthcare strategy', 'Public health policy', 'Social impact'] },
  'Explorer-Optimizer':   { name: 'The Explorer-Optimizer', sweetSpot: ['Research scientist', 'Process innovation', 'UX researcher'] },
  'Explorer-Teacher':     { name: 'The Explorer-Teacher', sweetSpot: ['Travel writer', 'Documentary maker', 'Science educator'] },
  'Explorer-Connector':   { name: 'The Explorer-Connector', sweetSpot: ['Int\'l business dev', 'Cross-cultural consultant', 'Field journalist'] },
  'Explorer-Guardian':    { name: 'The Explorer-Guardian', sweetSpot: ['Risk assessment', 'Forensic investigator', 'Safety researcher'] },
  'Explorer-Healer':      { name: 'The Explorer-Healer', sweetSpot: ['Global health worker', 'Humanitarian aid', 'Crisis counselor'] },
  'Optimizer-Teacher':    { name: 'The Optimizer-Teacher', sweetSpot: ['Lean/Six Sigma trainer', 'Operations professor', 'SOP developer'] },
  'Optimizer-Connector':  { name: 'The Optimizer-Connector', sweetSpot: ['Project manager', 'Scrum master', 'Team coach'] },
  'Optimizer-Guardian':   { name: 'The Optimizer-Guardian', sweetSpot: ['Compliance officer', 'QA director', 'Audit manager'] },
  'Optimizer-Healer':     { name: 'The Optimizer-Healer', sweetSpot: ['Healthcare operations', 'Clinical process improvement'] },
  'Teacher-Connector':    { name: 'The Teacher-Connector', sweetSpot: ['Community educator', 'Professional development', 'Conference organizer'] },
  'Teacher-Guardian':     { name: 'The Teacher-Guardian', sweetSpot: ['School administrator', 'Curriculum compliance', 'Ed policy'] },
  'Teacher-Healer':       { name: 'The Guide', sweetSpot: ['Executive coach', 'School counselor', 'Rehab professional'] },
  'Connector-Guardian':   { name: 'The Connector-Guardian', sweetSpot: ['HR director', 'Employee relations', 'Union representative'] },
  'Connector-Healer':     { name: 'The Connector-Healer', sweetSpot: ['Social worker', 'Community health', 'Peer support coordinator'] },
  'Guardian-Healer':      { name: 'The Guardian-Healer', sweetSpot: ['Patient safety officer', 'Clinical governance', 'Ethics board'] },
};

export function getBlendProfile(primary: CareerFamily, secondary: CareerFamily) {
  const key = `${primary}-${secondary}`;
  const reverseKey = `${secondary}-${primary}`;
  return BLEND_PROFILES[key] || BLEND_PROFILES[reverseKey] || {
    name: `${primary}-${secondary}`,
    sweetSpot: [],
  };
}
