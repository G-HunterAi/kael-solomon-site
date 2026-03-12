// ============================================================================
// Domain-Specific Output Engines
//
// Phase 4 of RDTE Expansion: the third layer of the three-layer architecture.
// Each decision domain produces tailored outputs — action plans, recommendations,
// tool results, and next steps — based on the user's profile, age group, and
// domain context.
//
// Five Output Engines:
//   Identity    → Energy map, exploration paths, identity clarity scorecard
//   Direction   → Career family fit, gap priorities, 3-year path sequence
//   Transition  → Fix vs Leave analysis, transition cost model, bridge roles
//   Optimization→ Skill acceleration, leadership readiness, network strategy
//   Legacy      → Impact assessment, knowledge transfer plan, second act paths
//
// Each engine takes a DomainOutputContext and returns a DomainOutput with
// structured sections the UI can render.
// ============================================================================

import type { DecisionDomain, AgeGroup, YouthFluxState } from './decision-domains';
import type { CareerFamily, CareerFamilyScores, FluxState, GapType } from './scoring';
import {
  DOMAIN_DEFINITIONS,
  YOUTH_FLUX_DESCRIPTIONS,
  classifyAgeGroup,
} from './decision-domains';
import {
  CAREER_FAMILIES,
  FAMILY_DESCRIPTIONS,
  GAP_TYPES,
  GAP_DESCRIPTIONS,
  getBlendProfile,
  computeGapPriority,
} from './scoring';

// ── Types ──

export interface DomainOutputContext {
  userId: string;
  domain: DecisionDomain;
  age: number;
  ageGroup: AgeGroup;

  /** 28 sub-component scores (may be partial for youth) */
  subComponentScores?: Record<string, number>;

  /** Career family scoring results */
  careerFamilies?: CareerFamilyScores;

  /** Current flux state (adult or youth) */
  fluxState?: FluxState | YouthFluxState;
  fluxConfidence?: number;

  /** Energy dimensions (N1-N7) */
  energyDimensions?: Record<string, number>;

  /** Existing gap data */
  gaps?: GapRecord[];

  /** User's self-reported context */
  primaryConcern?: string;
  recentLifeEvent?: string;
  currentRole?: string;
  targetRole?: string;
  yearsInCurrentRole?: number;

  /** Which tools the user has already completed */
  completedTools?: string[];
}

export interface GapRecord {
  type: GapType;
  score: number;
  width?: number;
  criticality?: number;
  closeability?: number;
  description?: string;
}

export interface DomainOutput {
  domain: DecisionDomain;
  domainLabel: string;
  domainQuestion: string;
  generatedAt: string;

  /** Executive summary — 2-3 sentences */
  summary: string;

  /** Structured output sections */
  sections: OutputSection[];

  /** Prioritized action items */
  actionPlan: ActionItem[];

  /** Recommended next tools and their order */
  recommendedTools: ToolRecommendation[];

  /** Key metrics for this domain */
  metrics: DomainMetric[];

  /** Age-appropriate encouragement/framing */
  framing: DomainFraming;
}

export interface OutputSection {
  id: string;
  title: string;
  type: 'insight' | 'analysis' | 'comparison' | 'timeline' | 'scorecard';
  content: string;
  data?: any;
  priority: number; // 1-10, higher = more prominent
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'immediate' | 'short_term' | 'long_term';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  relatedGap?: GapType;
  relatedTool?: string;
}

export interface ToolRecommendation {
  toolId: string;
  toolName: string;
  reason: string;
  priority: number; // 1 = do first
  completed: boolean;
  ageAppropriate: boolean;
}

export interface DomainMetric {
  id: string;
  label: string;
  value: number;
  max: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  interpretation: string;
}

export interface DomainFraming {
  tone: 'encouraging' | 'supportive' | 'professional' | 'reflective';
  ageMessage: string;
  keyInsight: string;
  normalizer: string; // "It's normal at your stage to..."
}

// ── Main Generator ──

/**
 * Generate domain-specific outputs for a user.
 * Routes to the correct engine based on the domain.
 */
export function generateDomainOutput(ctx: DomainOutputContext): DomainOutput {
  const def = DOMAIN_DEFINITIONS[ctx.domain];

  const base: Omit<DomainOutput, 'summary' | 'sections' | 'actionPlan' | 'recommendedTools' | 'metrics' | 'framing'> = {
    domain: ctx.domain,
    domainLabel: def.label,
    domainQuestion: def.question,
    generatedAt: new Date().toISOString(),
  };

  switch (ctx.domain) {
    case 'identity':
      return { ...base, ...generateIdentityOutput(ctx) };
    case 'direction':
      return { ...base, ...generateDirectionOutput(ctx) };
    case 'transition':
      return { ...base, ...generateTransitionOutput(ctx) };
    case 'optimization':
      return { ...base, ...generateOptimizationOutput(ctx) };
    case 'legacy':
      return { ...base, ...generateLegacyOutput(ctx) };
    default:
      return { ...base, ...generateDirectionOutput(ctx) };
  }
}

// ── Identity Domain Engine (14–22) ──

function generateIdentityOutput(ctx: DomainOutputContext): Omit<DomainOutput, 'domain' | 'domainLabel' | 'domainQuestion' | 'generatedAt'> {
  const energy = ctx.energyDimensions ?? {};
  const families = ctx.careerFamilies;

  // Build energy profile map
  const energyEntries = Object.entries(energy).sort((a, b) => b[1] - a[1]);
  const topEnergy = energyEntries.slice(0, 3);
  const lowEnergy = energyEntries.filter(([, v]) => v < 4);

  const energyLabels: Record<string, string> = {
    N1: 'People Energy', N2: 'Problem-Solving Energy', N3: 'Completion Energy',
    N4: 'Mastery Energy', N5: 'Helping Energy', N6: 'Building Energy', N7: 'Complexity Energy',
  };

  // Identity clarity score (how differentiated the profile is)
  const energyValues = Object.values(energy);
  const energyVariance = energyValues.length > 0
    ? energyValues.reduce((sum, v) => sum + Math.pow(v - 5, 2), 0) / energyValues.length
    : 0;
  const clarityScore = Math.min(10, Math.round(energyVariance * 2 * 10) / 10);

  // Youth flux state messaging
  const fluxMsg = ctx.fluxState && YOUTH_FLUX_DESCRIPTIONS[ctx.fluxState as YouthFluxState]
    ? YOUTH_FLUX_DESCRIPTIONS[ctx.fluxState as YouthFluxState]
    : null;

  const sections: OutputSection[] = [
    {
      id: 'energy-map',
      title: 'Your Energy Map',
      type: 'scorecard',
      content: topEnergy.length > 0
        ? `Your strongest energy sources are ${topEnergy.map(([k, v]) => `${energyLabels[k] || k} (${v}/10)`).join(', ')}. ` +
          (lowEnergy.length > 0
            ? `Activities involving ${lowEnergy.map(([k]) => energyLabels[k] || k).join(', ')} tend to drain you.`
            : 'You have no strong energy drains — an unusually balanced profile.')
        : 'Complete the Energy Sort to reveal your energy map.',
      data: { energyDimensions: energy, labels: energyLabels },
      priority: 10,
    },
    {
      id: 'identity-clarity',
      title: 'Identity Clarity',
      type: 'insight',
      content: clarityScore >= 6
        ? 'Your profile is well-differentiated — you have clear preferences and energy patterns. This is strong self-knowledge for your age.'
        : clarityScore >= 3
          ? 'Your energy patterns are emerging but not yet sharply defined. This is normal — keep exploring different activities and notice what energizes you.'
          : 'Your energy profile is still forming. The best next step is more exposure to different types of activities.',
      data: { clarityScore },
      priority: 9,
    },
  ];

  // Add career family explorer if available
  if (families) {
    const blend = getBlendProfile(families.primary, families.secondary);
    sections.push({
      id: 'career-families',
      title: 'Career Families That Fit You',
      type: 'analysis',
      content: `Your top career family is ${families.primary} (${FAMILY_DESCRIPTIONS[families.primary].tagline}) ` +
        `with ${families.secondary} (${FAMILY_DESCRIPTIONS[families.secondary].tagline}) as a strong secondary. ` +
        `Together, that makes you "${blend.name}" — people like you thrive in roles like ${blend.sweetSpot.slice(0, 3).join(', ')}.`,
      data: { families: families.scores, primary: families.primary, secondary: families.secondary, blend },
      priority: 8,
    });
  }

  // Add flux state section for youth
  if (fluxMsg) {
    sections.push({
      id: 'flux-state',
      title: `Your Current State: ${fluxMsg.label}`,
      type: 'insight',
      content: `${fluxMsg.description}. ${fluxMsg.guidance}`,
      data: { state: ctx.fluxState, confidence: ctx.fluxConfidence },
      priority: 7,
    });
  }

  // Add exploration suggestions
  sections.push({
    id: 'exploration-paths',
    title: 'Exploration Paths',
    type: 'analysis',
    content: buildExplorationPaths(topEnergy, families, ctx.ageGroup),
    data: { ageGroup: ctx.ageGroup },
    priority: 6,
  });

  return {
    summary: buildIdentitySummary(ctx, clarityScore, families),
    sections,
    actionPlan: buildIdentityActions(ctx, clarityScore, families),
    recommendedTools: buildIdentityTools(ctx),
    metrics: [
      {
        id: 'identity-clarity',
        label: 'Identity Clarity',
        value: clarityScore,
        max: 10,
        interpretation: clarityScore >= 6 ? 'Strong self-knowledge' : clarityScore >= 3 ? 'Developing' : 'Early stage',
      },
      ...(families ? [{
        id: 'family-fit',
        label: 'Career Family Confidence',
        value: Math.round((100 - families.blendMargin) * 10) / 10,
        max: 100,
        unit: '%',
        interpretation: families.blendMargin < 3 ? 'Near-equal blend' : 'Clear primary family',
      }] : []),
    ],
    framing: {
      tone: 'encouraging',
      ageMessage: ctx.age < 18
        ? 'You have time to explore. The goal right now isn\'t to pick a career — it\'s to discover what energizes you.'
        : 'You\'re building the foundation for all future decisions. Self-knowledge now saves years of wrong turns later.',
      keyInsight: 'Your energy patterns are the most honest signal of who you are — they\'re harder to fake than grades or test scores.',
      normalizer: ctx.age < 18
        ? 'It\'s completely normal at your age to not know what you want to do. Most adults don\'t figure it out until much later.'
        : 'Most people your age are still figuring out their identity. The fact that you\'re measuring it puts you ahead.',
    },
  };
}

// ── Direction Domain Engine (17–30) ──

function generateDirectionOutput(ctx: DomainOutputContext): Omit<DomainOutput, 'domain' | 'domainLabel' | 'domainQuestion' | 'generatedAt'> {
  const families = ctx.careerFamilies;
  const gaps = ctx.gaps ?? [];
  const energy = ctx.energyDimensions ?? {};

  const sections: OutputSection[] = [];

  // Career family fit analysis
  if (families) {
    const blend = getBlendProfile(families.primary, families.secondary);
    const topThree = CAREER_FAMILIES
      .map(f => ({ family: f, score: families.scores[f] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    sections.push({
      id: 'career-fit',
      title: 'Career Family Fit',
      type: 'scorecard',
      content: `Your strongest fit is ${families.primary} at ${families.scores[families.primary]}%, ` +
        `followed by ${families.secondary} at ${families.scores[families.secondary]}%. ` +
        `Your blend profile "${blend.name}" suggests roles like ${blend.sweetSpot.join(', ')}.`,
      data: { scores: families.scores, topThree, blend },
      priority: 10,
    });
  }

  // Gap analysis
  if (gaps.length > 0) {
    const prioritizedGaps = gaps
      .map(g => ({
        ...g,
        priority: g.width && g.criticality && g.closeability
          ? computeGapPriority(g.width, g.criticality, g.closeability)
          : g.score,
      }))
      .sort((a, b) => b.priority - a.priority);

    sections.push({
      id: 'gap-priorities',
      title: 'Gap Priorities',
      type: 'analysis',
      content: `You have ${gaps.length} identified gaps. The highest priority is ${GAP_DESCRIPTIONS[prioritizedGaps[0].type].label}: ` +
        `${prioritizedGaps[0].description || GAP_DESCRIPTIONS[prioritizedGaps[0].type].description}. ` +
        (prioritizedGaps.length > 1
          ? `Second priority: ${GAP_DESCRIPTIONS[prioritizedGaps[1].type].label}.`
          : ''),
      data: { gaps: prioritizedGaps },
      priority: 9,
    });
  }

  // Path sequence
  if (ctx.targetRole || families?.primary) {
    const targetLabel = ctx.targetRole || (families ? `${families.primary} career path` : 'your target path');
    sections.push({
      id: 'path-sequence',
      title: '3-Year Path Sequence',
      type: 'timeline',
      content: buildPathSequence(ctx, gaps),
      data: { targetRole: targetLabel, timelineMonths: 36 },
      priority: 8,
    });
  }

  // AI displacement awareness (for 20+)
  if (ctx.age >= 20 && families) {
    sections.push({
      id: 'future-proofing',
      title: 'Future-Proofing Your Path',
      type: 'insight',
      content: buildFutureProofInsight(families, energy),
      data: { family: families.primary },
      priority: 7,
    });
  }

  return {
    summary: buildDirectionSummary(ctx, families, gaps),
    sections,
    actionPlan: buildDirectionActions(ctx, families, gaps),
    recommendedTools: buildDirectionTools(ctx),
    metrics: buildDirectionMetrics(families, gaps),
    framing: {
      tone: ctx.age < 22 ? 'supportive' : 'professional',
      ageMessage: ctx.age < 22
        ? 'You\'re making your first big direction choice. It doesn\'t have to be permanent — but it should align with your energy.'
        : 'You\'re translating self-knowledge into a concrete path. The RDTE helps ensure that path actually fits who you are.',
      keyInsight: 'The best career direction is where your energy profile meets market demand. Neither alone is sufficient.',
      normalizer: ctx.age < 25
        ? 'It\'s normal to feel uncertain about direction at this stage. Most people change their career focus 2-3 times before 30.'
        : 'First career choices rarely stick forever. What matters is choosing a direction that builds transferable strengths.',
    },
  };
}

// ── Transition Domain Engine (25–55) ──

function generateTransitionOutput(ctx: DomainOutputContext): Omit<DomainOutput, 'domain' | 'domainLabel' | 'domainQuestion' | 'generatedAt'> {
  const families = ctx.careerFamilies;
  const gaps = ctx.gaps ?? [];
  const yearsInRole = ctx.yearsInCurrentRole ?? 0;

  const sections: OutputSection[] = [];

  // Fix vs Leave analysis
  const fixVsLeaveScore = computeFixVsLeave(ctx);
  sections.push({
    id: 'fix-vs-leave',
    title: 'Fix vs Leave Analysis',
    type: 'analysis',
    content: fixVsLeaveScore.recommendation === 'fix'
      ? `The data suggests your current situation is fixable. ${fixVsLeaveScore.reasoning} Consider addressing the specific pain points before making a major move.`
      : fixVsLeaveScore.recommendation === 'leave'
        ? `The data leans toward a transition. ${fixVsLeaveScore.reasoning} The mismatch between your energy profile and current role may be structural.`
        : `It\'s a close call. ${fixVsLeaveScore.reasoning} Gather more data — try a micro-experiment or informational interviews before committing.`,
    data: fixVsLeaveScore,
    priority: 10,
  });

  // Transition cost model
  sections.push({
    id: 'transition-costs',
    title: 'Transition Cost Model',
    type: 'analysis',
    content: buildTransitionCostAnalysis(ctx, gaps),
    data: {
      financialGaps: gaps.filter(g => g.type === 'financial'),
      skillGaps: gaps.filter(g => g.type === 'skill'),
      timeEstimate: estimateTransitionTime(gaps),
    },
    priority: 9,
  });

  // Bridge roles
  if (families) {
    const blend = getBlendProfile(families.primary, families.secondary);
    sections.push({
      id: 'bridge-roles',
      title: 'Bridge Roles',
      type: 'analysis',
      content: `Bridge roles let you transition gradually. Based on your ${families.primary}-${families.secondary} blend, ` +
        `consider roles like ${blend.sweetSpot.slice(0, 2).join(' or ')} as stepping stones. ` +
        `These leverage your existing strengths while building toward your target.`,
      data: { blend, sweetSpot: blend.sweetSpot },
      priority: 8,
    });
  }

  // AI displacement check
  if (ctx.currentRole) {
    sections.push({
      id: 'displacement-check',
      title: 'AI & Technology Impact',
      type: 'insight',
      content: 'Evaluate whether your dissatisfaction is personal (fixable by changing your situation) or structural ' +
        '(your role or industry is being disrupted). The AI Displacement Monitor can help quantify this.',
      data: { currentRole: ctx.currentRole },
      priority: 7,
    });
  }

  return {
    summary: buildTransitionSummary(ctx, fixVsLeaveScore),
    sections,
    actionPlan: buildTransitionActions(ctx, fixVsLeaveScore, gaps),
    recommendedTools: buildTransitionTools(ctx),
    metrics: [
      {
        id: 'fix-vs-leave',
        label: 'Fix vs Leave Score',
        value: fixVsLeaveScore.score,
        max: 10,
        interpretation: fixVsLeaveScore.recommendation === 'fix' ? 'Lean fix' : fixVsLeaveScore.recommendation === 'leave' ? 'Lean leave' : 'Undecided',
      },
      {
        id: 'transition-readiness',
        label: 'Transition Readiness',
        value: computeTransitionReadiness(ctx, gaps),
        max: 10,
        interpretation: 'How prepared you are if you do decide to move',
      },
      {
        id: 'years-invested',
        label: 'Years in Current Role',
        value: yearsInRole,
        max: 30,
        unit: 'years',
        interpretation: yearsInRole > 10 ? 'Deep investment — higher switching cost' : yearsInRole > 5 ? 'Moderate tenure' : 'Relatively new',
      },
    ],
    framing: {
      tone: 'supportive',
      ageMessage: ctx.age < 35
        ? 'Career transitions in your late 20s to early 30s are among the most common and often most successful.'
        : ctx.age < 45
          ? 'Mid-career transitions require more planning but often lead to the most meaningful work.'
          : 'Late-career transitions carry more financial weight but can unlock a deeply fulfilling final chapter.',
      keyInsight: 'The question isn\'t just "should I leave?" — it\'s "can what I need be fixed here, or is the mismatch structural?"',
      normalizer: 'Most professionals consider a major career transition at least once. The ones who handle it best use data, not just feelings.',
    },
  };
}

// ── Optimization Domain Engine (30–55) ──

function generateOptimizationOutput(ctx: DomainOutputContext): Omit<DomainOutput, 'domain' | 'domainLabel' | 'domainQuestion' | 'generatedAt'> {
  const families = ctx.careerFamilies;
  const gaps = ctx.gaps ?? [];
  const subScores = ctx.subComponentScores ?? {};

  const sections: OutputSection[] = [];

  // Skill acceleration plan
  const skillGaps = gaps.filter(g => g.type === 'skill' || g.type === 'credential');
  if (skillGaps.length > 0 || Object.keys(subScores).length > 0) {
    sections.push({
      id: 'skill-acceleration',
      title: 'Skill Acceleration Plan',
      type: 'scorecard',
      content: buildSkillAccelerationPlan(ctx, skillGaps),
      data: { skillGaps, subScores },
      priority: 10,
    });
  }

  // Leadership readiness
  const leadershipComponents = ['E4', 'E5', 'P1', 'N1', 'C1'];
  const leadershipScores = leadershipComponents
    .filter(c => subScores[c] != null)
    .map(c => ({ component: c, score: subScores[c] }));
  const leadershipAvg = leadershipScores.length > 0
    ? Math.round(leadershipScores.reduce((s, l) => s + l.score, 0) / leadershipScores.length * 10) / 10
    : null;

  if (leadershipAvg !== null) {
    sections.push({
      id: 'leadership-readiness',
      title: 'Leadership Readiness',
      type: 'scorecard',
      content: leadershipAvg >= 7
        ? `Your leadership indicators are strong (${leadershipAvg}/10). ` +
          'Focus on translating these strengths into visible leadership opportunities.'
        : leadershipAvg >= 5
          ? `Your leadership indicators are developing (${leadershipAvg}/10). ` +
            `Key areas to strengthen: ${leadershipScores.filter(l => l.score < 6).map(l => l.component).join(', ')}.`
          : `Leadership readiness is a growth area (${leadershipAvg}/10). ` +
            'Consider targeted development in social skills, drive, and people energy before pursuing leadership roles.',
      data: { scores: leadershipScores, average: leadershipAvg },
      priority: 9,
    });
  }

  // Network strategy
  const networkGaps = gaps.filter(g => g.type === 'network');
  sections.push({
    id: 'network-strategy',
    title: 'Network Strategy',
    type: 'analysis',
    content: buildNetworkStrategy(ctx, families, networkGaps),
    data: { networkGaps, family: families?.primary },
    priority: 8,
  });

  // Specialist vs generalist recommendation
  if (families && subScores) {
    sections.push({
      id: 'depth-vs-breadth',
      title: 'Specialist vs Generalist',
      type: 'insight',
      content: buildDepthVsBreadthInsight(families, subScores),
      data: { family: families.primary, blendMargin: families.blendMargin },
      priority: 7,
    });
  }

  return {
    summary: buildOptimizationSummary(ctx, families, leadershipAvg),
    sections,
    actionPlan: buildOptimizationActions(ctx, skillGaps, leadershipAvg, networkGaps),
    recommendedTools: buildOptimizationTools(ctx),
    metrics: [
      ...(leadershipAvg !== null ? [{
        id: 'leadership-readiness',
        label: 'Leadership Readiness',
        value: leadershipAvg,
        max: 10,
        interpretation: leadershipAvg >= 7 ? 'Ready for leadership' : leadershipAvg >= 5 ? 'Developing' : 'Growth area',
      }] : []),
      {
        id: 'gap-count',
        label: 'Active Gaps',
        value: gaps.length,
        max: 10,
        interpretation: gaps.length === 0 ? 'No identified gaps' : `${gaps.length} gaps to close`,
      },
      ...(families ? [{
        id: 'family-alignment',
        label: 'Role-Family Alignment',
        value: families.scores[families.primary],
        max: 100,
        unit: '%',
        interpretation: families.scores[families.primary] > 70 ? 'Strong alignment' : 'Room for optimization',
      }] : []),
    ],
    framing: {
      tone: 'professional',
      ageMessage: ctx.age < 40
        ? 'Early optimization is about closing the specific gaps that block promotion. Targeted effort beats generalized development.'
        : 'At this stage, focus on the gaps that will matter for the next 10 years, not just the next promotion.',
      keyInsight: 'Optimization isn\'t about doing more — it\'s about doing the right things. Close the gaps that have the highest priority score.',
      normalizer: 'Feeling like you\'ve plateaued is one of the most common mid-career experiences. The RDTE helps identify what specific levers to pull.',
    },
  };
}

// ── Legacy Domain Engine (45–65) ──

function generateLegacyOutput(ctx: DomainOutputContext): Omit<DomainOutput, 'domain' | 'domainLabel' | 'domainQuestion' | 'generatedAt'> {
  const families = ctx.careerFamilies;
  const energy = ctx.energyDimensions ?? {};
  const subScores = ctx.subComponentScores ?? {};

  const sections: OutputSection[] = [];

  // Impact assessment
  const helpingEnergy = energy['N5'] ?? subScores['N5'] ?? 5;
  const peopleEnergy = energy['N1'] ?? subScores['N1'] ?? 5;
  const masteryEnergy = energy['N4'] ?? subScores['N4'] ?? 5;

  sections.push({
    id: 'impact-assessment',
    title: 'Impact Assessment',
    type: 'insight',
    content: buildImpactAssessment(helpingEnergy, peopleEnergy, masteryEnergy, families),
    data: { helpingEnergy, peopleEnergy, masteryEnergy },
    priority: 10,
  });

  // Knowledge transfer plan
  sections.push({
    id: 'knowledge-transfer',
    title: 'Knowledge Transfer Plan',
    type: 'analysis',
    content: peopleEnergy >= 6 && helpingEnergy >= 6
      ? 'Your energy profile strongly supports mentoring and teaching roles. ' +
        'Consider structured mentorship (1-on-1), advisory board service, or creating content that captures your expertise.'
      : masteryEnergy >= 7
        ? 'Your deep expertise is your legacy asset. Consider writing (books, articles), speaking, or consulting ' +
          'engagements that codify what you\'ve learned.'
        : 'Knowledge transfer can take many forms. Explore whether writing, teaching, mentoring, or consulting ' +
          'feels most energizing to you.',
    data: { mentorFit: peopleEnergy >= 6 && helpingEnergy >= 6, expertFit: masteryEnergy >= 7 },
    priority: 9,
  });

  // Second act paths
  if (families) {
    const blend = getBlendProfile(families.primary, families.secondary);
    sections.push({
      id: 'second-act',
      title: 'Second Act Paths',
      type: 'analysis',
      content: buildSecondActPaths(families, energy),
      data: { family: families.primary, blend },
      priority: 8,
    });
  }

  // Values alignment
  const valuesScores = ['H1', 'H2', 'H3', 'H4', 'H5']
    .filter(v => subScores[v] != null)
    .map(v => ({ component: v, score: subScores[v] }));

  if (valuesScores.length > 0) {
    sections.push({
      id: 'values-alignment',
      title: 'Values Alignment',
      type: 'scorecard',
      content: 'Your values hierarchy reveals what matters most to you at this stage. ' +
        'Legacy work is most fulfilling when it directly serves your top values.',
      data: { valuesScores },
      priority: 7,
    });
  }

  return {
    summary: buildLegacySummary(ctx, families),
    sections,
    actionPlan: buildLegacyActions(ctx, families, energy),
    recommendedTools: buildLegacyTools(ctx),
    metrics: [
      {
        id: 'helping-energy',
        label: 'Helping Energy (N5)',
        value: helpingEnergy,
        max: 10,
        interpretation: helpingEnergy >= 7 ? 'Strong service orientation' : helpingEnergy >= 5 ? 'Moderate' : 'Low — legacy may be through creation rather than service',
      },
      {
        id: 'mastery-energy',
        label: 'Mastery Energy (N4)',
        value: masteryEnergy,
        max: 10,
        interpretation: masteryEnergy >= 7 ? 'Deep expertise to share' : 'Moderate expertise depth',
      },
      {
        id: 'people-energy',
        label: 'People Energy (N1)',
        value: peopleEnergy,
        max: 10,
        interpretation: peopleEnergy >= 7 ? 'Natural mentor/connector' : 'May prefer written or structural legacy',
      },
    ],
    framing: {
      tone: 'reflective',
      ageMessage: ctx.age < 55
        ? 'You\'re entering the stage where the question shifts from "what can I achieve?" to "what do I want to leave behind?"'
        : 'This is the time to focus your remaining professional energy on the work that matters most to you.',
      keyInsight: 'Legacy isn\'t about retirement — it\'s about redirecting your energy toward impact that outlasts your tenure.',
      normalizer: 'It\'s common at this stage to feel a pull between continuing to achieve and wanting to contribute something more lasting.',
    },
  };
}

// ── Helper Functions ──

function buildIdentitySummary(ctx: DomainOutputContext, clarity: number, families?: CareerFamilyScores): string {
  if (!ctx.energyDimensions || Object.keys(ctx.energyDimensions).length === 0) {
    return 'Start by completing the Energy Sort to discover what activities energize and drain you. ' +
      'This is the foundation for understanding who you are becoming.';
  }
  if (clarity < 3) {
    return 'Your energy profile is still developing. Keep experimenting with different activities — ' +
      'the more data you gather, the clearer the picture becomes.';
  }
  const familyMsg = families
    ? ` Your strongest career family fit is ${families.primary}.`
    : '';
  return `Your energy profile shows ${clarity >= 6 ? 'strong' : 'emerging'} identity clarity (${clarity}/10).${familyMsg} ` +
    'The next step is translating these patterns into concrete exploration paths.';
}

function buildExplorationPaths(topEnergy: [string, number][], families: CareerFamilyScores | undefined, ageGroup: AgeGroup): string {
  const paths: string[] = [];

  if (topEnergy.length > 0) {
    const energyLabels: Record<string, string> = {
      N1: 'people-oriented activities', N2: 'problem-solving challenges', N3: 'project completion tasks',
      N4: 'deep learning opportunities', N5: 'helping and service roles', N6: 'building and creating',
      N7: 'complex intellectual work',
    };
    const topKey = topEnergy[0][0];
    paths.push(`Explore ${energyLabels[topKey] || 'activities matching your top energy'}`);
  }

  if (families) {
    const desc = FAMILY_DESCRIPTIONS[families.primary];
    paths.push(`Try activities related to the ${families.primary} family: ${desc.tagline.toLowerCase()}`);
  }

  if (ageGroup === 'youth') {
    paths.push('Look for clubs, electives, or volunteer work that let you test these patterns');
  } else {
    paths.push('Try internships, part-time work, or informational interviews in these areas');
  }

  return paths.join('. ') + '.';
}

function buildIdentityActions(ctx: DomainOutputContext, clarity: number, families?: CareerFamilyScores): ActionItem[] {
  const actions: ActionItem[] = [];

  if (!ctx.completedTools?.includes('youth-energy-sort') && !ctx.completedTools?.includes('energy-sort')) {
    actions.push({
      id: 'complete-energy-sort',
      title: 'Complete the Energy Sort',
      description: 'Sort activities by what energizes and drains you to build your energy map.',
      category: 'immediate',
      effort: 'low',
      impact: 'high',
      relatedTool: ctx.age < 25 ? 'youth-energy-sort' : 'energy-sort',
    });
  }

  if (clarity < 5) {
    actions.push({
      id: 'try-new-activities',
      title: 'Try 3 New Activities This Month',
      description: 'Exposure is the fastest way to build identity clarity. Pick things outside your comfort zone.',
      category: 'short_term',
      effort: 'medium',
      impact: 'high',
    });
  }

  if (!ctx.completedTools?.includes('youth-fsi') && !ctx.completedTools?.includes('fsi-30')) {
    actions.push({
      id: 'complete-fsi',
      title: 'Take the Flux State Inventory',
      description: 'Understand whether you\'re exploring, drifting, pressured, committed, or mismatched.',
      category: 'immediate',
      effort: 'low',
      impact: 'medium',
      relatedTool: ctx.age < 25 ? 'youth-fsi' : 'fsi-30',
    });
  }

  if (families && clarity >= 5) {
    actions.push({
      id: 'research-families',
      title: `Research ${families.primary} Career Paths`,
      description: `Look into roles that fit the ${families.primary} family. Talk to people in those roles.`,
      category: 'short_term',
      effort: 'medium',
      impact: 'high',
    });
  }

  return actions;
}

function buildIdentityTools(ctx: DomainOutputContext): ToolRecommendation[] {
  const isYouth = ctx.age < 25;
  const tools: ToolRecommendation[] = [
    {
      toolId: isYouth ? 'youth-energy-sort' : 'energy-sort',
      toolName: 'Energy Sort',
      reason: 'Discover what activities energize and drain you',
      priority: 1,
      completed: ctx.completedTools?.includes(isYouth ? 'youth-energy-sort' : 'energy-sort') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: isYouth ? 'youth-fsi' : 'fsi-30',
      toolName: 'Flux State Inventory',
      reason: 'Understand your current exploration state',
      priority: 2,
      completed: ctx.completedTools?.includes(isYouth ? 'youth-fsi' : 'fsi-30') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: isYouth ? 'youth-career-finder' : 'career-family-finder',
      toolName: 'Career Family Finder',
      reason: 'See which career families match your energy profile',
      priority: 3,
      completed: ctx.completedTools?.includes(isYouth ? 'youth-career-finder' : 'career-family-finder') ?? false,
      ageAppropriate: true,
    },
  ];

  if (!isYouth) {
    tools.push({
      toolId: 'peer-mirror',
      toolName: 'Peer Mirror',
      reason: 'See how you compare to others in your age group',
      priority: 4,
      completed: ctx.completedTools?.includes('peer-mirror') ?? false,
      ageAppropriate: ctx.age >= 18,
    });
  }

  return tools;
}

function buildDirectionSummary(ctx: DomainOutputContext, families?: CareerFamilyScores, gaps?: GapRecord[]): string {
  if (!families) {
    return 'Complete the career assessment to discover which career families fit your profile. ' +
      'This will unlock gap analysis and path sequencing.';
  }
  const gapMsg = gaps && gaps.length > 0
    ? ` You have ${gaps.length} gaps to close, with ${GAP_DESCRIPTIONS[gaps[0].type].label} as the top priority.`
    : '';
  return `Your top career fit is ${families.primary} (${families.scores[families.primary]}%).${gapMsg} ` +
    'The path sequence below shows how to get from where you are to where you want to be.';
}

function buildPathSequence(ctx: DomainOutputContext, gaps: GapRecord[]): string {
  const phases = [];
  const target = ctx.targetRole || (ctx.careerFamilies ? `${ctx.careerFamilies.primary} career path` : 'your target');

  // Phase 1: 0-6 months
  const urgentGaps = gaps.filter(g => g.score && g.score >= 6);
  if (urgentGaps.length > 0) {
    phases.push(`Months 1-6: Close critical gaps (${urgentGaps.map(g => GAP_DESCRIPTIONS[g.type].label).join(', ')})`);
  } else {
    phases.push('Months 1-6: Build foundational skills and make initial connections in target area');
  }

  // Phase 2: 6-18 months
  phases.push('Months 6-18: Gain hands-on experience through projects, internships, or bridge roles');

  // Phase 3: 18-36 months
  phases.push(`Months 18-36: Transition into ${target} with remaining gaps closed`);

  return phases.join('. ') + '.';
}

function buildFutureProofInsight(families: CareerFamilyScores, energy: Record<string, number>): string {
  const complexity = energy['N7'] ?? 5;
  const creative = energy['N6'] ?? 5;

  if (complexity >= 7 && creative >= 7) {
    return 'Your high complexity and building energy suggest strong future-proofing. ' +
      'Roles requiring creative problem-solving in complex domains are among the most AI-resistant.';
  }
  if (complexity < 4) {
    return 'Your profile leans toward roles that may face AI automation pressure. ' +
      'Consider developing skills in areas that require human judgment, creativity, or relationship management.';
  }
  return 'Your profile has moderate future-proofing. To strengthen your position, ' +
    'build skills at the intersection of human judgment and technical capability.';
}

function buildDirectionActions(ctx: DomainOutputContext, families?: CareerFamilyScores, gaps?: GapRecord[]): ActionItem[] {
  const actions: ActionItem[] = [];

  if (!families) {
    actions.push({
      id: 'complete-assessment',
      title: 'Complete Career Assessment',
      description: 'Take the full RDTE assessment to identify your career family fit.',
      category: 'immediate',
      effort: 'medium',
      impact: 'high',
      relatedTool: 'signal-check',
    });
  }

  if (gaps && gaps.length > 0) {
    const topGap = gaps[0];
    actions.push({
      id: 'close-top-gap',
      title: `Address ${GAP_DESCRIPTIONS[topGap.type].label} Gap`,
      description: topGap.description || GAP_DESCRIPTIONS[topGap.type].description,
      category: 'short_term',
      effort: 'high',
      impact: 'high',
      relatedGap: topGap.type,
    });
  }

  actions.push({
    id: 'informational-interviews',
    title: 'Conduct 3 Informational Interviews',
    description: families
      ? `Talk to people in ${families.primary} roles to validate your direction.`
      : 'Talk to professionals in fields you\'re considering.',
    category: 'short_term',
    effort: 'medium',
    impact: 'high',
  });

  if (ctx.age >= 20) {
    actions.push({
      id: 'check-displacement',
      title: 'Run AI Displacement Check',
      description: 'Evaluate whether your target path is future-proof against automation.',
      category: 'short_term',
      effort: 'low',
      impact: 'medium',
      relatedTool: 'ai-displacement-monitor',
    });
  }

  return actions;
}

function buildDirectionTools(ctx: DomainOutputContext): ToolRecommendation[] {
  const isYouth = ctx.age < 25;
  return [
    {
      toolId: 'signal-check',
      toolName: 'Signal Check (Full Assessment)',
      reason: 'Comprehensive energy dimension assessment',
      priority: 1,
      completed: ctx.completedTools?.includes('signal-check') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: isYouth ? 'youth-career-finder' : 'career-family-finder',
      toolName: 'Career Family Finder',
      reason: 'Match your profile to career families',
      priority: 2,
      completed: ctx.completedTools?.includes(isYouth ? 'youth-career-finder' : 'career-family-finder') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'gap-analysis',
      toolName: 'Gap Analysis',
      reason: 'Identify and prioritize gaps between you and your target',
      priority: 3,
      completed: ctx.completedTools?.includes('gap-analysis') ?? false,
      ageAppropriate: ctx.age >= 18,
    },
    {
      toolId: 'ai-displacement-monitor',
      toolName: 'AI Displacement Monitor',
      reason: 'Check if your target path is future-proof',
      priority: 4,
      completed: ctx.completedTools?.includes('ai-displacement-monitor') ?? false,
      ageAppropriate: ctx.age >= 20,
    },
  ];
}

function buildDirectionMetrics(families?: CareerFamilyScores, gaps?: GapRecord[]): DomainMetric[] {
  const metrics: DomainMetric[] = [];
  if (families) {
    metrics.push({
      id: 'primary-fit',
      label: `${families.primary} Fit`,
      value: families.scores[families.primary],
      max: 100,
      unit: '%',
      interpretation: families.scores[families.primary] > 70 ? 'Strong fit' : 'Moderate fit',
    });
    metrics.push({
      id: 'blend-margin',
      label: 'Blend Margin',
      value: families.blendMargin,
      max: 20,
      interpretation: families.blendMargin < 3 ? 'Near-equal blend' : 'Clear primary',
    });
  }
  if (gaps && gaps.length > 0) {
    metrics.push({
      id: 'total-gaps',
      label: 'Gaps to Close',
      value: gaps.length,
      max: 10,
      interpretation: `${gaps.length} identified gap${gaps.length === 1 ? '' : 's'}`,
    });
  }
  return metrics;
}

// ── Transition Helpers ──

interface FixVsLeaveResult {
  score: number; // 1-10 where 1=definitely fix, 10=definitely leave
  recommendation: 'fix' | 'leave' | 'gather_data';
  reasoning: string;
  factors: { factor: string; leansToward: 'fix' | 'leave'; weight: number }[];
}

function computeFixVsLeave(ctx: DomainOutputContext): FixVsLeaveResult {
  const factors: { factor: string; leansToward: 'fix' | 'leave'; weight: number }[] = [];
  let leaveSignal = 0;
  let fixSignal = 0;

  // Energy alignment with current role
  const families = ctx.careerFamilies;
  if (families && families.scores[families.primary] < 50) {
    factors.push({ factor: 'Low career family alignment', leansToward: 'leave', weight: 3 });
    leaveSignal += 3;
  } else if (families && families.scores[families.primary] >= 70) {
    factors.push({ factor: 'Strong career family alignment', leansToward: 'fix', weight: 2 });
    fixSignal += 2;
  }

  // Flux state signals
  if (ctx.fluxState === 'stalled' || ctx.fluxState === 'forced') {
    factors.push({ factor: `Flux state: ${ctx.fluxState}`, leansToward: 'leave', weight: 2 });
    leaveSignal += 2;
  } else if (ctx.fluxState === 'scaling' || ctx.fluxState === 'stable') {
    factors.push({ factor: `Flux state: ${ctx.fluxState}`, leansToward: 'fix', weight: 2 });
    fixSignal += 2;
  }

  // Years in role
  if (ctx.yearsInCurrentRole && ctx.yearsInCurrentRole > 10) {
    factors.push({ factor: 'Long tenure (high switching cost)', leansToward: 'fix', weight: 1 });
    fixSignal += 1;
  }

  // Financial gaps
  const financialGaps = ctx.gaps?.filter(g => g.type === 'financial') ?? [];
  if (financialGaps.length > 0 && financialGaps.some(g => g.score && g.score >= 7)) {
    factors.push({ factor: 'Significant financial gap for transition', leansToward: 'fix', weight: 2 });
    fixSignal += 2;
  }

  // Life event triggers
  if (ctx.recentLifeEvent === 'layoff') {
    factors.push({ factor: 'Recent layoff (forced transition)', leansToward: 'leave', weight: 3 });
    leaveSignal += 3;
  } else if (ctx.recentLifeEvent === 'promotion') {
    factors.push({ factor: 'Recent promotion', leansToward: 'fix', weight: 2 });
    fixSignal += 2;
  }

  const total = leaveSignal + fixSignal;
  const score = total > 0 ? Math.round((leaveSignal / total) * 10 * 10) / 10 : 5;

  return {
    score,
    recommendation: score >= 7 ? 'leave' : score <= 3 ? 'fix' : 'gather_data',
    reasoning: score >= 7
      ? 'Multiple signals point toward a structural mismatch that\'s unlikely to resolve in the current situation.'
      : score <= 3
        ? 'The data suggests your current path has strong alignment. Focus on fixing specific pain points.'
        : 'The signals are mixed. Before making a big move, run targeted experiments to gather more data.',
    factors,
  };
}

function buildTransitionCostAnalysis(ctx: DomainOutputContext, gaps: GapRecord[]): string {
  const financial = gaps.filter(g => g.type === 'financial');
  const skill = gaps.filter(g => g.type === 'skill');
  const credential = gaps.filter(g => g.type === 'credential');

  const parts: string[] = [];
  if (financial.length > 0) {
    parts.push('Financial runway is a key factor — ensure 6-12 months of savings before a voluntary transition');
  }
  if (skill.length > 0) {
    parts.push(`${skill.length} skill gap${skill.length > 1 ? 's' : ''} need closing, which may take 3-12 months of focused effort`);
  }
  if (credential.length > 0) {
    parts.push(`${credential.length} credential gap${credential.length > 1 ? 's' : ''} (degrees, certifications) may require 6-24 months`);
  }
  if (parts.length === 0) {
    parts.push('No major transition costs identified. You\'re well-positioned for a move if you choose to make one');
  }

  return parts.join('. ') + '.';
}

function estimateTransitionTime(gaps: GapRecord[]): number {
  if (gaps.length === 0) return 3;
  const maxGapScore = Math.max(...gaps.map(g => g.score || 0));
  return Math.min(36, Math.max(3, Math.round(maxGapScore * 3)));
}

function computeTransitionReadiness(ctx: DomainOutputContext, gaps: GapRecord[]): number {
  let readiness = 5;
  if (ctx.careerFamilies) readiness += 1;
  if (ctx.completedTools?.includes('signal-check')) readiness += 1;
  if (gaps.length === 0) readiness += 2;
  const avgGapScore = gaps.length > 0
    ? gaps.reduce((s, g) => s + (g.score || 0), 0) / gaps.length
    : 0;
  readiness -= Math.round(avgGapScore / 3);
  return Math.min(10, Math.max(1, readiness));
}

function buildTransitionSummary(ctx: DomainOutputContext, fvl: FixVsLeaveResult): string {
  if (fvl.recommendation === 'leave') {
    return `The data leans toward a transition (${fvl.score}/10). ${fvl.factors.length} factors analyzed. ` +
      'Review the bridge roles and transition cost model below before making a move.';
  }
  if (fvl.recommendation === 'fix') {
    return `The data suggests your current path is worth fixing (${fvl.score}/10). ` +
      'Focus on addressing the specific pain points that are causing dissatisfaction.';
  }
  return `It\'s a close call (${fvl.score}/10) between fixing your current situation and leaving. ` +
    'The best next step is running a micro-experiment to gather more data.';
}

function buildTransitionActions(ctx: DomainOutputContext, fvl: FixVsLeaveResult, gaps: GapRecord[]): ActionItem[] {
  const actions: ActionItem[] = [];

  if (fvl.recommendation === 'gather_data') {
    actions.push({
      id: 'micro-experiment',
      title: 'Run a Micro-Experiment',
      description: 'Spend 2 weeks doing a small project or volunteering in your potential new direction. Track your energy levels.',
      category: 'immediate',
      effort: 'medium',
      impact: 'high',
    });
  }

  if (!ctx.completedTools?.includes('fsi-30')) {
    actions.push({
      id: 'complete-fsi',
      title: 'Take the Flux State Inventory',
      description: 'Quantify whether you\'re stalled, seeking, or ready to pivot.',
      category: 'immediate',
      effort: 'low',
      impact: 'medium',
      relatedTool: 'fsi-30',
    });
  }

  if (fvl.recommendation === 'leave' || fvl.recommendation === 'gather_data') {
    actions.push({
      id: 'build-runway',
      title: 'Assess Financial Runway',
      description: 'Calculate how many months you can sustain a transition. Target 6-12 months.',
      category: 'short_term',
      effort: 'medium',
      impact: 'high',
      relatedGap: 'financial',
    });
  }

  if (gaps.length > 0) {
    actions.push({
      id: 'close-critical-gap',
      title: `Close ${GAP_DESCRIPTIONS[gaps[0].type].label} Gap`,
      description: gaps[0].description || 'Address your highest-priority gap.',
      category: 'short_term',
      effort: 'high',
      impact: 'high',
      relatedGap: gaps[0].type,
    });
  }

  return actions;
}

function buildTransitionTools(ctx: DomainOutputContext): ToolRecommendation[] {
  return [
    {
      toolId: 'fsi-30',
      toolName: 'Flux State Inventory',
      reason: 'Assess your transition readiness',
      priority: 1,
      completed: ctx.completedTools?.includes('fsi-30') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'signal-check',
      toolName: 'Signal Check',
      reason: 'Full energy dimension assessment for career family matching',
      priority: 2,
      completed: ctx.completedTools?.includes('signal-check') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'gap-analysis',
      toolName: 'Gap Analysis',
      reason: 'Identify barriers to your transition',
      priority: 3,
      completed: ctx.completedTools?.includes('gap-analysis') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'ai-displacement-monitor',
      toolName: 'AI Displacement Monitor',
      reason: 'Check if disruption is driving your dissatisfaction',
      priority: 4,
      completed: ctx.completedTools?.includes('ai-displacement-monitor') ?? false,
      ageAppropriate: true,
    },
  ];
}

// ── Optimization Helpers ──

function buildSkillAccelerationPlan(ctx: DomainOutputContext, skillGaps: GapRecord[]): string {
  if (skillGaps.length === 0) {
    return 'No critical skill gaps identified. Focus on deepening your existing strengths ' +
      'or building complementary skills that differentiate you from peers.';
  }

  const parts: string[] = [];
  for (const gap of skillGaps.slice(0, 3)) {
    const priority = gap.width && gap.criticality && gap.closeability
      ? computeGapPriority(gap.width, gap.criticality, gap.closeability)
      : gap.score || 0;
    parts.push(`${GAP_DESCRIPTIONS[gap.type].label} (priority: ${Math.round(priority)})` +
      (gap.description ? `: ${gap.description}` : ''));
  }

  return `Top skill gaps to close: ${parts.join('; ')}. ` +
    'Focus on the highest-priority gap first — closing it will have the most impact on your progression.';
}

function buildNetworkStrategy(ctx: DomainOutputContext, families?: CareerFamilyScores, networkGaps?: GapRecord[]): string {
  if (families?.primary === 'Connector') {
    return 'As a natural Connector, networking is your superpower. Focus on becoming a hub — ' +
      'the person others come to for introductions and connections in your domain.';
  }

  if (networkGaps && networkGaps.length > 0) {
    return 'Your network gap is a priority. Start with 2 informational conversations per week. ' +
      'Focus on people 1-2 levels above your target role — they can open doors.';
  }

  return 'Even without a network gap, intentional relationship-building accelerates optimization. ' +
    'Identify 3 key people in your field who could be mentors, sponsors, or collaborators.';
}

function buildDepthVsBreadthInsight(families: CareerFamilyScores, subScores: Record<string, number>): string {
  if (families.blendMargin < 3) {
    return 'Your near-equal blend between two families suggests a generalist path may suit you well. ' +
      'Roles at the intersection of your top families are often the best fit — and the rarest, making you highly valuable.';
  }

  const primaryScore = families.scores[families.primary];
  if (primaryScore > 80) {
    return `Your very high ${families.primary} fit (${primaryScore}%) suggests doubling down as a specialist. ` +
      'Deep expertise in your primary family will be your competitive advantage.';
  }

  return `With a clear primary (${families.primary} at ${primaryScore}%), consider being a "T-shaped" professional: ` +
    `deep in ${families.primary} skills, broad enough in ${families.secondary} to complement your work.`;
}

function buildOptimizationSummary(ctx: DomainOutputContext, families?: CareerFamilyScores, leadershipAvg?: number | null): string {
  const parts: string[] = [];
  if (families) {
    parts.push(`You're in the ${families.primary} family with ${families.scores[families.primary]}% fit`);
  }
  if (leadershipAvg != null) {
    parts.push(`leadership readiness at ${leadershipAvg}/10`);
  }
  const gapCount = ctx.gaps?.length ?? 0;
  if (gapCount > 0) {
    parts.push(`${gapCount} gap${gapCount > 1 ? 's' : ''} to close`);
  }
  if (parts.length === 0) {
    return 'Complete the career assessment to unlock your optimization plan.';
  }
  return parts.join(', ') + '. The optimization plan below shows exactly where to focus your development effort.';
}

function buildOptimizationActions(
  ctx: DomainOutputContext,
  skillGaps: GapRecord[],
  leadershipAvg: number | null,
  networkGaps: GapRecord[],
): ActionItem[] {
  const actions: ActionItem[] = [];

  if (skillGaps.length > 0) {
    actions.push({
      id: 'close-skill-gap',
      title: `Close ${GAP_DESCRIPTIONS[skillGaps[0].type].label} Gap`,
      description: skillGaps[0].description || 'Focus on your highest-priority skill gap.',
      category: 'short_term',
      effort: 'high',
      impact: 'high',
      relatedGap: skillGaps[0].type,
    });
  }

  if (leadershipAvg != null && leadershipAvg < 6) {
    actions.push({
      id: 'develop-leadership',
      title: 'Develop Leadership Capacity',
      description: 'Seek opportunities to lead projects, mentor juniors, or present to stakeholders.',
      category: 'short_term',
      effort: 'medium',
      impact: 'high',
    });
  }

  if (networkGaps.length > 0) {
    actions.push({
      id: 'build-network',
      title: 'Build Strategic Network',
      description: 'Connect with 3 people who are 1-2 levels ahead of you in your target path.',
      category: 'short_term',
      effort: 'medium',
      impact: 'high',
      relatedGap: 'network',
    });
  }

  actions.push({
    id: 'visibility-project',
    title: 'Take on a High-Visibility Project',
    description: 'Identify one project that showcases your strengths to decision-makers.',
    category: 'short_term',
    effort: 'high',
    impact: 'high',
  });

  return actions;
}

function buildOptimizationTools(ctx: DomainOutputContext): ToolRecommendation[] {
  return [
    {
      toolId: 'gap-analysis',
      toolName: 'Gap Analysis',
      reason: 'Identify exactly what gaps are blocking your progression',
      priority: 1,
      completed: ctx.completedTools?.includes('gap-analysis') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'signal-check',
      toolName: 'Signal Check',
      reason: 'Ensure your profile is current before planning',
      priority: 2,
      completed: ctx.completedTools?.includes('signal-check') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'decision-profile',
      toolName: 'Decision Profile',
      reason: 'Understand your decision-making patterns under pressure',
      priority: 3,
      completed: ctx.completedTools?.includes('decision-profile') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'career-family-finder',
      toolName: 'Career Family Finder',
      reason: 'Confirm or update your career family alignment',
      priority: 4,
      completed: ctx.completedTools?.includes('career-family-finder') ?? false,
      ageAppropriate: true,
    },
  ];
}

// ── Legacy Helpers ──

function buildImpactAssessment(helping: number, people: number, mastery: number, families?: CareerFamilyScores): string {
  const paths: string[] = [];

  if (helping >= 7) paths.push('service-oriented impact (mentoring, coaching, volunteering)');
  if (people >= 7) paths.push('people-centered legacy (building teams, nurturing talent)');
  if (mastery >= 7) paths.push('expertise-based impact (writing, speaking, consulting)');

  if (paths.length === 0) {
    return 'Your legacy path isn\'t tied to a single energy dimension. Consider what impact you\'ve ' +
      'had that you\'re most proud of — that\'s likely where your legacy instinct lives.';
  }

  return `Your energy profile points toward ${paths.join(' and ')}. ` +
    (families
      ? `As a ${families.primary}, your expertise is in ${FAMILY_DESCRIPTIONS[families.primary].tagline.toLowerCase()}.`
      : 'Consider how your specific expertise can create lasting value.');
}

function buildSecondActPaths(families: CareerFamilyScores, energy: Record<string, number>): string {
  const family = families.primary;
  const secondActMap: Record<CareerFamily, string[]> = {
    Builder: ['startup mentor', 'nonprofit board member', 'angel investor', 'maker space founder'],
    Strategist: ['management consultant', 'advisory board member', 'think tank fellow', 'executive coach'],
    Explorer: ['travel writer', 'visiting professor', 'documentary producer', 'research fellow'],
    Optimizer: ['process consultant', 'turnaround specialist', 'nonprofit operations advisor', 'efficiency coach'],
    Teacher: ['adjunct professor', 'curriculum designer', 'workshop leader', 'online course creator'],
    Connector: ['community organizer', 'networking platform founder', 'conference organizer', 'matchmaker/recruiter'],
    Guardian: ['compliance consultant', 'ethics board member', 'policy advisor', 'regulatory expert'],
    Healer: ['therapist/counselor', 'healthcare consultant', 'wellness program designer', 'peer support leader'],
  };

  const paths = secondActMap[family] || secondActMap.Strategist;
  return `Based on your ${family} profile, potential second acts include: ${paths.join(', ')}. ` +
    'These roles leverage your accumulated expertise while shifting toward impact over achievement.';
}

function buildLegacySummary(ctx: DomainOutputContext, families?: CareerFamilyScores): string {
  const familyMsg = families ? ` as a ${families.primary}` : '';
  return `Your legacy domain analysis looks at how to redirect your energy${familyMsg} toward lasting impact. ` +
    'The sections below cover knowledge transfer, second act paths, and values alignment.';
}

function buildLegacyActions(ctx: DomainOutputContext, families?: CareerFamilyScores, energy?: Record<string, number>): ActionItem[] {
  const actions: ActionItem[] = [];

  actions.push({
    id: 'define-legacy-goal',
    title: 'Define Your Legacy Goal',
    description: 'Write a single sentence describing the impact you want to have in your remaining career years.',
    category: 'immediate',
    effort: 'low',
    impact: 'high',
  });

  const helpingEnergy = energy?.['N5'] ?? 5;
  if (helpingEnergy >= 6) {
    actions.push({
      id: 'find-mentee',
      title: 'Find a Mentee',
      description: 'Your high helping energy makes you a natural mentor. Find one person to invest in regularly.',
      category: 'short_term',
      effort: 'medium',
      impact: 'high',
    });
  }

  actions.push({
    id: 'capture-expertise',
    title: 'Start Capturing Your Expertise',
    description: 'Begin documenting what you know — whether through writing, speaking, or creating training materials.',
    category: 'short_term',
    effort: 'medium',
    impact: 'high',
  });

  actions.push({
    id: 'explore-second-act',
    title: 'Explore One Second Act Path',
    description: families
      ? `Try a small project in one of the ${families.primary}-aligned second act roles.`
      : 'Test one potential second act through a small project or volunteer engagement.',
    category: 'long_term',
    effort: 'high',
    impact: 'high',
  });

  return actions;
}

function buildLegacyTools(ctx: DomainOutputContext): ToolRecommendation[] {
  return [
    {
      toolId: 'energy-sort',
      toolName: 'Energy Sort',
      reason: 'Reassess what energizes you now — it may have shifted',
      priority: 1,
      completed: ctx.completedTools?.includes('energy-sort') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'decision-profile',
      toolName: 'Decision Profile',
      reason: 'Understand how you make decisions about impact vs achievement',
      priority: 2,
      completed: ctx.completedTools?.includes('decision-profile') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'career-family-finder',
      toolName: 'Career Family Finder',
      reason: 'See if your career family has shifted toward a legacy-oriented blend',
      priority: 3,
      completed: ctx.completedTools?.includes('career-family-finder') ?? false,
      ageAppropriate: true,
    },
    {
      toolId: 'fsi-30',
      toolName: 'Flux State Inventory',
      reason: 'Assess whether you\'re in a stable or transitional state',
      priority: 4,
      completed: ctx.completedTools?.includes('fsi-30') ?? false,
      ageAppropriate: true,
    },
  ];
}
