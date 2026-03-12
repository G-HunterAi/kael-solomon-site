// ============================================================================
// Decision Domain Router
//
// Routes users to the right decision support based on age + life context.
// Part of the RDTE Expansion: extending the engine from working-adults-only
// to supporting anyone aged 14–65 across five major decision domains.
//
// Three-Layer Architecture:
//   Layer 1: Universal Profile (28 sub-components, age-appropriate measurement)
//   Layer 2: Decision Router (this file — routes to the right domain)
//   Layer 3: Decision-Specific Outputs (career families, gap analysis, etc.)
//
// Five Decision Domains:
//   Identity    (14–22): "Who am I becoming?"
//   Direction   (17–30): "What should I pursue?"
//   Transition  (25–55): "Should I stay or go?"
//   Optimization(30–55): "How do I level up here?"
//   Legacy      (45–65): "What do I want to leave behind?"
//
// Users may be active in multiple domains simultaneously.
// Age ranges overlap intentionally — context determines primary domain.
// ============================================================================

// ── Domain Definitions ──

export const DECISION_DOMAINS = [
  'identity', 'direction', 'transition', 'optimization', 'legacy',
] as const;

export type DecisionDomain = typeof DECISION_DOMAINS[number];

export interface DomainDefinition {
  id: DecisionDomain;
  label: string;
  question: string;
  ageRange: { min: number; max: number };
  description: string;
  coreDecisions: string[];
  primaryTools: string[];
  /** Which RDTE components weigh most heavily for this domain */
  weightEmphasis: string[];
  icon: string;
}

export const DOMAIN_DEFINITIONS: Record<DecisionDomain, DomainDefinition> = {
  identity: {
    id: 'identity',
    label: 'Identity',
    question: 'Who am I becoming?',
    ageRange: { min: 14, max: 22 },
    description:
      'First-time self-discovery. Building an authentic identity separate from ' +
      'family expectations, peer pressure, and cultural defaults.',
    coreDecisions: [
      'What are my real strengths (not just grades)?',
      'Which subjects and activities energize vs. drain me?',
      'Should I go to college? If so, what should I study?',
      'What kind of work might fit who I actually am?',
      'How do I separate my identity from what others expect?',
    ],
    primaryTools: ['Energy Sort', 'FSI-30 (Youth)', 'Career Family Finder', 'Peer Mirror'],
    weightEmphasis: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'P1', 'P2', 'P4'],
    icon: '🌱',
  },
  direction: {
    id: 'direction',
    label: 'Direction',
    question: 'What should I pursue?',
    ageRange: { min: 17, max: 30 },
    description:
      'First major career or education choice. Translating self-knowledge into ' +
      'a concrete path — major, first job, graduate school, or entrepreneurship.',
    coreDecisions: [
      'What career family fits my profile?',
      'What gaps do I need to close first?',
      'Should I specialize or stay broad?',
      'Is this career path future-proof?',
      'What does a realistic 3-year path look like?',
    ],
    primaryTools: ['Career Family Finder', 'Gap Analysis', 'Path Sequencing', 'AI Displacement Monitor'],
    weightEmphasis: ['C1', 'C2', 'C4', 'N4', 'N6', 'N7', 'V1', 'V3', 'V4', 'V5'],
    icon: '🧭',
  },
  transition: {
    id: 'transition',
    label: 'Transition',
    question: 'Should I stay or go?',
    ageRange: { min: 25, max: 55 },
    description:
      'Mid-career inflection point. Evaluating whether to double down on the ' +
      'current path, pivot to something new, or make a lateral move.',
    coreDecisions: [
      'Is my dissatisfaction fixable or structural?',
      'What would I lose vs. gain by leaving?',
      'Am I being disrupted by AI/technology?',
      'Can I afford the transition financially?',
      'What bridge roles could I use?',
    ],
    primaryTools: ['Fix vs Leave', 'FSI-30', 'Gap Analysis', 'Path Sequencing', 'AI Displacement Monitor'],
    weightEmphasis: ['E1', 'E2', 'E5', 'N2', 'N7', 'V1', 'V4', 'V5'],
    icon: '🔄',
  },
  optimization: {
    id: 'optimization',
    label: 'Optimization',
    question: 'How do I level up here?',
    ageRange: { min: 30, max: 55 },
    description:
      'Already in the right domain. Focus on accelerating growth, closing ' +
      'specific gaps, building leadership capacity, and deepening expertise.',
    coreDecisions: [
      'What specific skills will unlock the next level?',
      'Should I go deep (specialist) or wide (generalist)?',
      'How do I build a stronger professional network?',
      'Am I developing leadership capacity?',
      'What credential or experience gaps are blocking promotion?',
    ],
    primaryTools: ['Gap Analysis', 'Path Sequencing', 'Decision Profile', 'Career Family Finder'],
    weightEmphasis: ['C1', 'C6', 'E4', 'E5', 'N3', 'N4', 'N7', 'V2', 'V3'],
    icon: '📈',
  },
  legacy: {
    id: 'legacy',
    label: 'Legacy',
    question: 'What do I want to leave behind?',
    ageRange: { min: 45, max: 65 },
    description:
      'Shifting from achievement to significance. Mentoring, board service, ' +
      'consulting, second acts, phased retirement, or building something that outlasts you.',
    coreDecisions: [
      'What impact do I want to have in my remaining career years?',
      'How do I transfer knowledge to the next generation?',
      'Should I start a second career or wind down?',
      'What role does financial security play in my choices?',
      'How do I stay relevant vs. gracefully transition?',
    ],
    primaryTools: ['Decision Profile', 'Fix vs Leave', 'Energy Sort', 'Career Family Finder'],
    weightEmphasis: ['P5', 'E3', 'E4', 'N1', 'N5', 'H1', 'H2', 'H3', 'H4', 'H5'],
    icon: '🏛️',
  },
};

// ── Age Group Classification ──

export const AGE_GROUPS = [
  'youth',        // 14–17
  'emerging',     // 18–24
  'early_career', // 25–34
  'mid_career',   // 35–49
  'senior',       // 50–65
] as const;

export type AgeGroup = typeof AGE_GROUPS[number];

export interface AgeGroupDefinition {
  id: AgeGroup;
  label: string;
  ageRange: { min: number; max: number };
  defaultDomains: DecisionDomain[];
  measurementAdaptations: string[];
}

export const AGE_GROUP_DEFINITIONS: Record<AgeGroup, AgeGroupDefinition> = {
  youth: {
    id: 'youth',
    label: 'Youth (14–17)',
    ageRange: { min: 14, max: 17 },
    defaultDomains: ['identity'],
    measurementAdaptations: [
      'Simplified language in assessments',
      'Activity-based measurement over self-report scales',
      'Energy Sort uses school/extracurricular activities',
      'No career gap analysis (too early)',
      'Parental/guardian consent required',
    ],
  },
  emerging: {
    id: 'emerging',
    label: 'Emerging Adult (18–24)',
    ageRange: { min: 18, max: 24 },
    defaultDomains: ['identity', 'direction'],
    measurementAdaptations: [
      'College major mapping enabled',
      'Future-proof scoring emphasized',
      'Internship and entry-level path sequencing',
      'Peer comparison via age cohort',
      'Student-specific flux states available',
    ],
  },
  early_career: {
    id: 'early_career',
    label: 'Early Career (25–34)',
    ageRange: { min: 25, max: 34 },
    defaultDomains: ['direction', 'transition'],
    measurementAdaptations: [
      'Full RDTE assessment available',
      'Career family scoring active',
      'Gap analysis with credential focus',
      'Financial runway calculations',
      'AI displacement monitoring active',
    ],
  },
  mid_career: {
    id: 'mid_career',
    label: 'Mid-Career (35–49)',
    ageRange: { min: 35, max: 49 },
    defaultDomains: ['transition', 'optimization'],
    measurementAdaptations: [
      'Full RDTE assessment available',
      'Fix vs Leave diagnostic active',
      'Leadership capacity assessment',
      'Network gap analysis emphasized',
      'Financial transition modeling',
    ],
  },
  senior: {
    id: 'senior',
    label: 'Senior Career (50–65)',
    ageRange: { min: 50, max: 65 },
    defaultDomains: ['optimization', 'legacy'],
    measurementAdaptations: [
      'Legacy planning tools active',
      'Mentorship matching enabled',
      'Phased retirement modeling',
      'Knowledge transfer assessment',
      'Values dimension weighted higher',
    ],
  },
};

// ── Routing Functions ──

/**
 * Compute user's age from birth date.
 */
export function computeAge(birthDate: Date, referenceDate?: Date): number {
  const ref = referenceDate ?? new Date();
  let age = ref.getFullYear() - birthDate.getFullYear();
  const monthDiff = ref.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Classify user into an age group.
 */
export function classifyAgeGroup(age: number): AgeGroup {
  if (age < 18) return 'youth';
  if (age < 25) return 'emerging';
  if (age < 35) return 'early_career';
  if (age < 50) return 'mid_career';
  return 'senior';
}

/**
 * Get all domains available for a given age.
 * Returns domains sorted by relevance (most relevant first).
 */
export function getAvailableDomains(age: number): DecisionDomain[] {
  return DECISION_DOMAINS.filter((domain) => {
    const def = DOMAIN_DEFINITIONS[domain];
    return age >= def.ageRange.min && age <= def.ageRange.max;
  });
}

/**
 * Route a user to their recommended decision domains.
 *
 * Uses age + optional context signals to determine which domains are
 * most relevant. Returns primary domain, available domains, and the
 * age group classification.
 */
export interface DomainRoutingResult {
  ageGroup: AgeGroup;
  primaryDomain: DecisionDomain;
  availableDomains: DecisionDomain[];
  recommendations: DomainRecommendation[];
}

export interface DomainRecommendation {
  domain: DecisionDomain;
  relevance: 'primary' | 'secondary' | 'available';
  reason: string;
}

export interface RoutingContext {
  age: number;
  /** Current flux state if known */
  fluxState?: string;
  /** Life stage from user profile */
  lifeStage?: string;
  /** Whether user has an existing career profile */
  hasCareerProfile?: boolean;
  /** Recent major life event */
  recentLifeEvent?: 'job_change' | 'graduation' | 'layoff' | 'retirement_planning' | 'promotion' | null;
  /** User's self-reported primary concern */
  primaryConcern?: 'identity' | 'direction' | 'transition' | 'optimization' | 'legacy' | null;
}

export function routeToDecisionDomains(ctx: RoutingContext): DomainRoutingResult {
  const ageGroup = classifyAgeGroup(ctx.age);
  const availableDomains = getAvailableDomains(ctx.age);
  const ageGroupDef = AGE_GROUP_DEFINITIONS[ageGroup];

  // If user explicitly stated their concern and it's available, use that
  if (ctx.primaryConcern && availableDomains.includes(ctx.primaryConcern)) {
    return buildResult(ageGroup, ctx.primaryConcern, availableDomains, ctx);
  }

  // Route based on contextual signals
  let primaryDomain: DecisionDomain = ageGroupDef.defaultDomains[0];

  // Life event overrides
  if (ctx.recentLifeEvent === 'layoff' && availableDomains.includes('transition')) {
    primaryDomain = 'transition';
  } else if (ctx.recentLifeEvent === 'graduation' && availableDomains.includes('direction')) {
    primaryDomain = 'direction';
  } else if (ctx.recentLifeEvent === 'retirement_planning' && availableDomains.includes('legacy')) {
    primaryDomain = 'legacy';
  } else if (ctx.recentLifeEvent === 'promotion' && availableDomains.includes('optimization')) {
    primaryDomain = 'optimization';
  }

  // Flux state signals
  if (ctx.fluxState === 'stalled' || ctx.fluxState === 'forced') {
    if (availableDomains.includes('transition')) {
      primaryDomain = 'transition';
    }
  } else if (ctx.fluxState === 'scaling' && availableDomains.includes('optimization')) {
    primaryDomain = 'optimization';
  } else if (ctx.fluxState === 'seeking' && availableDomains.includes('direction')) {
    primaryDomain = 'direction';
  }

  // No career profile at all → probably early in the journey
  if (!ctx.hasCareerProfile && availableDomains.includes('identity')) {
    primaryDomain = 'identity';
  }

  return buildResult(ageGroup, primaryDomain, availableDomains, ctx);
}

function buildResult(
  ageGroup: AgeGroup,
  primaryDomain: DecisionDomain,
  availableDomains: DecisionDomain[],
  ctx: RoutingContext,
): DomainRoutingResult {
  const recommendations: DomainRecommendation[] = availableDomains.map((domain) => {
    if (domain === primaryDomain) {
      return {
        domain,
        relevance: 'primary' as const,
        reason: buildReason(domain, ctx, 'primary'),
      };
    }

    const ageGroupDef = AGE_GROUP_DEFINITIONS[classifyAgeGroup(ctx.age)];
    const isDefault = ageGroupDef.defaultDomains.includes(domain);

    return {
      domain,
      relevance: isDefault ? 'secondary' as const : 'available' as const,
      reason: buildReason(domain, ctx, isDefault ? 'secondary' : 'available'),
    };
  });

  // Sort: primary first, then secondary, then available
  const order = { primary: 0, secondary: 1, available: 2 };
  recommendations.sort((a, b) => order[a.relevance] - order[b.relevance]);

  return {
    ageGroup,
    primaryDomain,
    availableDomains,
    recommendations,
  };
}

function buildReason(
  domain: DecisionDomain,
  ctx: RoutingContext,
  relevance: 'primary' | 'secondary' | 'available',
): string {
  const def = DOMAIN_DEFINITIONS[domain];

  if (relevance === 'primary') {
    if (ctx.primaryConcern === domain) {
      return `You selected "${def.question}" as your primary focus.`;
    }
    if (ctx.recentLifeEvent) {
      const eventLabels: Record<string, string> = {
        layoff: 'a recent job change',
        graduation: 'a recent graduation',
        retirement_planning: 'retirement planning',
        promotion: 'a recent promotion',
        job_change: 'a recent job change',
      };
      return `${def.question} — recommended based on ${eventLabels[ctx.recentLifeEvent] || 'your situation'}.`;
    }
    return `${def.question} — the most common focus for your age group.`;
  }

  if (relevance === 'secondary') {
    return `${def.question} — also relevant for your life stage.`;
  }

  return `${def.question} — available if needed.`;
}

// ── Youth Flux States ──

export const YOUTH_FLUX_STATES = [
  'exploring', 'drifting', 'pressured', 'committed', 'mismatched',
] as const;

export type YouthFluxState = typeof YOUTH_FLUX_STATES[number];

export const YOUTH_FLUX_DESCRIPTIONS: Record<YouthFluxState, {
  label: string;
  description: string;
  color: string;
  guidance: string;
}> = {
  exploring: {
    label: 'Exploring',
    description: 'Actively trying different things with curiosity and openness',
    color: '#3b82f6',
    guidance: 'This is healthy. Keep trying new activities, subjects, and interests. ' +
      'The goal is exposure, not commitment.',
  },
  drifting: {
    label: 'Drifting',
    description: 'Not actively exploring and unclear about interests or direction',
    color: '#94a3b8',
    guidance: 'It\'s okay to not know yet. Start with small experiments — try one new ' +
      'activity, subject, or conversation each week.',
  },
  pressured: {
    label: 'Pressured',
    description: 'Feeling forced into a path by family, school, or peers',
    color: '#ef4444',
    guidance: 'External pressure can drown out your own signals. The RDTE helps you ' +
      'separate what energizes YOU from what others expect.',
  },
  committed: {
    label: 'Committed',
    description: 'Has a clear sense of direction and is actively pursuing it',
    color: '#10b981',
    guidance: 'Great clarity for your age. Validate your direction with the Career Family ' +
      'Finder and build your first path sequence.',
  },
  mismatched: {
    label: 'Mismatched',
    description: 'Current path doesn\'t match energy patterns or interests',
    color: '#f59e0b',
    guidance: 'Your energy patterns suggest a different path than the one you\'re on. ' +
      'This is valuable information — not a failure.',
  },
};

/**
 * Detect flux state for youth users (14–24).
 * Uses different signals than adult flux detection.
 */
export function detectYouthFluxState(
  energyClarity: number,
  selfDirected: boolean,
  externalPressure: number,
  activeExploration: number,
  pathAlignment: number,
): { state: YouthFluxState; confidence: number; reasoning: string } {
  // High external pressure dominates
  if (externalPressure >= 7) {
    return {
      state: 'pressured',
      confidence: 0.75,
      reasoning: 'High external pressure is the dominant signal, regardless of other factors.',
    };
  }

  // Committed: clear + self-directed + aligned
  if (energyClarity >= 7 && selfDirected && pathAlignment >= 7) {
    return {
      state: 'committed',
      confidence: 0.8,
      reasoning: 'Strong energy clarity, self-direction, and path alignment indicate commitment.',
    };
  }

  // Mismatched: clear but misaligned
  if (energyClarity >= 6 && pathAlignment < 4) {
    return {
      state: 'mismatched',
      confidence: 0.7,
      reasoning: 'Energy patterns are clear but don\'t match current path, suggesting a mismatch.',
    };
  }

  // Exploring: moderate clarity + active exploration
  if (activeExploration >= 5 && energyClarity >= 4) {
    return {
      state: 'exploring',
      confidence: 0.65,
      reasoning: 'Active exploration with developing clarity is healthy exploration.',
    };
  }

  // Drifting: low everything
  if (activeExploration < 4 && energyClarity < 5) {
    return {
      state: 'drifting',
      confidence: 0.6,
      reasoning: 'Low exploration activity and unclear energy signals suggest drifting.',
    };
  }

  // Default: exploring (benefit of the doubt for young people)
  return {
    state: 'exploring',
    confidence: 0.4,
    reasoning: 'Insufficient signal for confident classification. Defaulting to exploring.',
  };
}

// ── Measurement Adaptation ──

export interface MeasurementAdapter {
  ageGroup: AgeGroup;
  /** Which assessment components to include */
  enabledComponents: string[];
  /** Which components to simplify */
  simplifiedComponents: string[];
  /** Which components to skip entirely */
  skippedComponents: string[];
  /** Language complexity level */
  languageLevel: 'simple' | 'standard' | 'professional';
  /** Whether to use activity-based or self-report measures */
  measurementStyle: 'activity_based' | 'self_report' | 'hybrid';
  /** Minimum consent requirements */
  consentRequired: 'guardian_and_user' | 'user_only';
}

export const MEASUREMENT_ADAPTERS: Record<AgeGroup, MeasurementAdapter> = {
  youth: {
    ageGroup: 'youth',
    enabledComponents: [
      'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',  // Energy (core for identity)
      'P1', 'P2', 'P4',                             // Key personality traits
      'C2', 'C3',                                    // Creative + Verbal
    ],
    simplifiedComponents: ['E1', 'E3'],              // Self-awareness + Empathy (simplified)
    skippedComponents: [
      'C4', 'C5', 'C6',       // Quantitative, Spatial, Processing (too abstract)
      'V1', 'V2', 'V3', 'V4', 'V5',  // Environment prefs (not yet relevant)
      'H1', 'H2', 'H3', 'H4', 'H5',  // Values hierarchy (still forming)
    ],
    languageLevel: 'simple',
    measurementStyle: 'activity_based',
    consentRequired: 'guardian_and_user',
  },
  emerging: {
    ageGroup: 'emerging',
    enabledComponents: [
      'C1', 'C2', 'C3', 'C4',
      'P1', 'P2', 'P3', 'P4', 'P5',
      'E1', 'E2', 'E3', 'E4', 'E5',
      'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',
      'V1', 'V4', 'V5',
    ],
    simplifiedComponents: ['C5', 'C6', 'V2', 'V3'],
    skippedComponents: ['H1', 'H2', 'H3', 'H4', 'H5'],  // Values still solidifying
    languageLevel: 'standard',
    measurementStyle: 'hybrid',
    consentRequired: 'user_only',
  },
  early_career: {
    ageGroup: 'early_career',
    enabledComponents: [
      'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
      'P1', 'P2', 'P3', 'P4', 'P5',
      'E1', 'E2', 'E3', 'E4', 'E5',
      'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',
      'V1', 'V2', 'V3', 'V4', 'V5',
      'H1', 'H2', 'H3', 'H4', 'H5',
    ],
    simplifiedComponents: [],
    skippedComponents: [],
    languageLevel: 'professional',
    measurementStyle: 'self_report',
    consentRequired: 'user_only',
  },
  mid_career: {
    ageGroup: 'mid_career',
    enabledComponents: [
      'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
      'P1', 'P2', 'P3', 'P4', 'P5',
      'E1', 'E2', 'E3', 'E4', 'E5',
      'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',
      'V1', 'V2', 'V3', 'V4', 'V5',
      'H1', 'H2', 'H3', 'H4', 'H5',
    ],
    simplifiedComponents: [],
    skippedComponents: [],
    languageLevel: 'professional',
    measurementStyle: 'self_report',
    consentRequired: 'user_only',
  },
  senior: {
    ageGroup: 'senior',
    enabledComponents: [
      'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
      'P1', 'P2', 'P3', 'P4', 'P5',
      'E1', 'E2', 'E3', 'E4', 'E5',
      'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7',
      'V1', 'V2', 'V3', 'V4', 'V5',
      'H1', 'H2', 'H3', 'H4', 'H5',
    ],
    simplifiedComponents: [],
    skippedComponents: [],
    languageLevel: 'professional',
    measurementStyle: 'self_report',
    consentRequired: 'user_only',
  },
};

/**
 * Get the measurement adapter for a given age.
 */
export function getMeasurementAdapter(age: number): MeasurementAdapter {
  return MEASUREMENT_ADAPTERS[classifyAgeGroup(age)];
}

/**
 * Check if a sub-component should be measured for a given age group.
 * Returns 'full', 'simplified', or 'skip'.
 */
export function getComponentMeasurementLevel(
  component: string,
  ageGroup: AgeGroup,
): 'full' | 'simplified' | 'skip' {
  const adapter = MEASUREMENT_ADAPTERS[ageGroup];
  if (adapter.enabledComponents.includes(component)) return 'full';
  if (adapter.simplifiedComponents.includes(component)) return 'simplified';
  return 'skip';
}
