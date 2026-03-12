// ============================================================================
// Tool Sequencing Engine
//
// Determines which diagnostic tools a user should complete, in what order,
// based on their decision domain, age group, and progress so far.
//
// Tool chains are domain-specific and age-adaptive:
//   - Youth (14-24) get youth-variant tools first
//   - Adults get the full Signal Suite tools
//   - Each domain has a recommended sequence
//   - Already-completed tools are marked but kept in order for context
//
// The sequencer also generates "nudges" — context-aware prompts to complete
// the next tool in the chain.
// ============================================================================

import type { DecisionDomain, AgeGroup } from './decision-domains';
import { classifyAgeGroup, DOMAIN_DEFINITIONS } from './decision-domains';

// ── Types ──

export interface ToolStep {
  toolId: string;
  toolName: string;
  description: string;
  /** Estimated time to complete in minutes */
  estimatedMinutes: number;
  /** Whether this tool is required for domain outputs */
  required: boolean;
  /** Minimum age to use this tool */
  minAge: number;
  /** Whether this step has a youth-variant alternative */
  youthVariant?: string;
}

export interface ToolSequence {
  domain: DecisionDomain;
  ageGroup: AgeGroup;
  steps: SequencedStep[];
  progress: SequenceProgress;
  nextStep: SequencedStep | null;
  nudge: string;
}

export interface SequencedStep extends ToolStep {
  order: number;
  completed: boolean;
  /** The actual tool ID to use (youth variant if applicable) */
  resolvedToolId: string;
}

export interface SequenceProgress {
  totalSteps: number;
  completedSteps: number;
  percentComplete: number;
  requiredComplete: boolean;
  estimatedRemainingMinutes: number;
}

// ── Tool Definitions ──

const TOOL_CATALOG: Record<string, ToolStep> = {
  'energy-sort': {
    toolId: 'energy-sort',
    toolName: 'Energy Sort',
    description: 'Sort activities by what energizes and drains you to map your N1-N7 energy dimensions.',
    estimatedMinutes: 8,
    required: true,
    minAge: 14,
    youthVariant: 'youth-energy-sort',
  },
  'fsi-30': {
    toolId: 'fsi-30',
    toolName: 'Flux State Inventory',
    description: 'Assess your current career/life state — are you stalled, seeking, pivoting, or scaling?',
    estimatedMinutes: 10,
    required: true,
    minAge: 14,
    youthVariant: 'youth-fsi',
  },
  'signal-check': {
    toolId: 'signal-check',
    toolName: 'Signal Check',
    description: 'Comprehensive assessment of all 28 sub-components across 6 dimensions.',
    estimatedMinutes: 15,
    required: true,
    minAge: 18,
  },
  'career-family-finder': {
    toolId: 'career-family-finder',
    toolName: 'Career Family Finder',
    description: 'Match your profile to the 8 career families and find your blend.',
    estimatedMinutes: 5,
    required: true,
    minAge: 14,
    youthVariant: 'youth-career-finder',
  },
  'gap-analysis': {
    toolId: 'gap-analysis',
    toolName: 'Gap Analysis',
    description: 'Identify and prioritize skill, experience, credential, network, and financial gaps.',
    estimatedMinutes: 12,
    required: false,
    minAge: 18,
  },
  'ai-displacement-monitor': {
    toolId: 'ai-displacement-monitor',
    toolName: 'AI Displacement Monitor',
    description: 'Evaluate how AI and automation trends affect your target roles.',
    estimatedMinutes: 5,
    required: false,
    minAge: 20,
  },
  'decision-profile': {
    toolId: 'decision-profile',
    toolName: 'Decision Profile',
    description: 'Analyze your decision-making patterns under different conditions.',
    estimatedMinutes: 10,
    required: false,
    minAge: 18,
  },
  'peer-mirror': {
    toolId: 'peer-mirror',
    toolName: 'Peer Mirror',
    description: 'Compare your profile to aggregated peer data in your age and career group.',
    estimatedMinutes: 3,
    required: false,
    minAge: 18,
  },
  'experiment-tracker': {
    toolId: 'experiment-tracker',
    toolName: 'Experiment Tracker',
    description: 'Design and track micro-experiments to test career hypotheses.',
    estimatedMinutes: 5,
    required: false,
    minAge: 16,
  },
  'energy-pulse': {
    toolId: 'energy-pulse',
    toolName: 'Energy Pulse',
    description: 'Quick daily energy check-in across your top dimensions.',
    estimatedMinutes: 2,
    required: false,
    minAge: 14,
  },
};

// ── Domain Tool Sequences ──
// Each domain has an ordered list of tool IDs representing the recommended sequence.

const DOMAIN_SEQUENCES: Record<DecisionDomain, string[]> = {
  identity: [
    'energy-sort',
    'fsi-30',
    'career-family-finder',
    'peer-mirror',
    'experiment-tracker',
    'energy-pulse',
  ],
  direction: [
    'signal-check',
    'energy-sort',
    'career-family-finder',
    'fsi-30',
    'gap-analysis',
    'ai-displacement-monitor',
    'experiment-tracker',
  ],
  transition: [
    'fsi-30',
    'signal-check',
    'energy-sort',
    'career-family-finder',
    'gap-analysis',
    'ai-displacement-monitor',
    'decision-profile',
    'experiment-tracker',
  ],
  optimization: [
    'signal-check',
    'gap-analysis',
    'career-family-finder',
    'decision-profile',
    'ai-displacement-monitor',
    'energy-pulse',
  ],
  legacy: [
    'energy-sort',
    'career-family-finder',
    'decision-profile',
    'fsi-30',
    'signal-check',
    'energy-pulse',
  ],
};

// ── Sequencer ──

/**
 * Build the tool sequence for a user based on their domain, age, and completed tools.
 */
export function buildToolSequence(
  domain: DecisionDomain,
  age: number,
  completedTools: string[] = [],
): ToolSequence {
  const ageGroup = classifyAgeGroup(age);
  const isYouth = age < 25;
  const sequenceIds = DOMAIN_SEQUENCES[domain];

  const steps: SequencedStep[] = [];
  let order = 1;

  for (const toolId of sequenceIds) {
    const tool = TOOL_CATALOG[toolId];
    if (!tool) continue;

    // Skip tools that are above the user's age
    if (age < tool.minAge) continue;

    // Resolve youth variant if applicable
    const resolvedId = isYouth && tool.youthVariant ? tool.youthVariant : toolId;

    // Check completion (check both the original and resolved IDs)
    const completed = completedTools.includes(resolvedId) ||
      completedTools.includes(toolId) ||
      (tool.youthVariant ? completedTools.includes(tool.youthVariant) : false);

    steps.push({
      ...tool,
      order,
      completed,
      resolvedToolId: resolvedId,
    });

    order++;
  }

  // Calculate progress
  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => s.completed).length;
  const remainingMinutes = steps
    .filter(s => !s.completed)
    .reduce((sum, s) => sum + s.estimatedMinutes, 0);
  const requiredSteps = steps.filter(s => s.required);
  const requiredComplete = requiredSteps.every(s => s.completed);

  const progress: SequenceProgress = {
    totalSteps,
    completedSteps,
    percentComplete: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    requiredComplete,
    estimatedRemainingMinutes: remainingMinutes,
  };

  // Find next step
  const nextStep = steps.find(s => !s.completed) ?? null;

  // Generate nudge
  const nudge = generateNudge(domain, ageGroup, nextStep, progress);

  return {
    domain,
    ageGroup,
    steps,
    progress,
    nextStep,
    nudge,
  };
}

/**
 * Get just the next recommended tool for a domain.
 */
export function getNextTool(
  domain: DecisionDomain,
  age: number,
  completedTools: string[] = [],
): SequencedStep | null {
  const sequence = buildToolSequence(domain, age, completedTools);
  return sequence.nextStep;
}

/**
 * Check if all required tools for a domain are complete.
 */
export function areRequiredToolsComplete(
  domain: DecisionDomain,
  age: number,
  completedTools: string[] = [],
): boolean {
  const sequence = buildToolSequence(domain, age, completedTools);
  return sequence.progress.requiredComplete;
}

/**
 * Get estimated time to complete remaining tools for a domain.
 */
export function getEstimatedTimeRemaining(
  domain: DecisionDomain,
  age: number,
  completedTools: string[] = [],
): number {
  const sequence = buildToolSequence(domain, age, completedTools);
  return sequence.progress.estimatedRemainingMinutes;
}

// ── Nudge Generator ──

function generateNudge(
  domain: DecisionDomain,
  ageGroup: AgeGroup,
  nextStep: SequencedStep | null,
  progress: SequenceProgress,
): string {
  if (!nextStep) {
    return 'You\'ve completed all tools for this domain. Check your domain outputs for your full analysis.';
  }

  if (progress.completedSteps === 0) {
    return buildFirstStepNudge(domain, ageGroup, nextStep);
  }

  if (progress.percentComplete >= 75) {
    return `Almost there — just ${progress.totalSteps - progress.completedSteps} tool${progress.totalSteps - progress.completedSteps > 1 ? 's' : ''} left. ` +
      `Next up: ${nextStep.toolName} (~${nextStep.estimatedMinutes} min).`;
  }

  if (progress.requiredComplete) {
    return `All required tools are done. ${nextStep.toolName} is optional but will improve your results. ` +
      `It takes about ${nextStep.estimatedMinutes} minutes.`;
  }

  return `Next step: ${nextStep.toolName} — ${nextStep.description} ` +
    `(~${nextStep.estimatedMinutes} min). ${progress.completedSteps}/${progress.totalSteps} tools complete.`;
}

function buildFirstStepNudge(domain: DecisionDomain, ageGroup: AgeGroup, nextStep: SequencedStep): string {
  const def = DOMAIN_DEFINITIONS[domain];

  const domainMessages: Record<DecisionDomain, string> = {
    identity: 'Let\'s start discovering who you are',
    direction: 'Let\'s figure out your direction',
    transition: 'Let\'s evaluate your options',
    optimization: 'Let\'s identify where to focus',
    legacy: 'Let\'s explore your legacy path',
  };

  const ageMessages: Record<AgeGroup, string> = {
    youth: 'The first tool is designed for your age group — it\'s quick and visual.',
    emerging: 'Start with this assessment — it\'s tailored for where you are right now.',
    early_career: 'This assessment gives you the data you need to make informed decisions.',
    mid_career: 'Start here to establish your baseline — everything else builds on this.',
    senior: 'This assessment captures your accumulated wisdom and points toward impact.',
  };

  return `${domainMessages[domain]}. ${ageMessages[ageGroup]} ` +
    `Start with ${nextStep.toolName} (~${nextStep.estimatedMinutes} min).`;
}

// ── Cross-Domain Tool Recommendations ──

/**
 * Get tools that would benefit the user across all their active domains.
 * Useful for users with multiple active domains (e.g., Identity + Direction).
 */
export function getCrossDomainTools(
  activeDomains: DecisionDomain[],
  age: number,
  completedTools: string[] = [],
): ToolRecommendation[] {
  // Count how many domains each tool serves
  const toolDomainCount: Record<string, { domains: DecisionDomain[]; tool: ToolStep }> = {};

  for (const domain of activeDomains) {
    const sequence = buildToolSequence(domain, age, completedTools);
    for (const step of sequence.steps) {
      if (!step.completed) {
        if (!toolDomainCount[step.resolvedToolId]) {
          toolDomainCount[step.resolvedToolId] = { domains: [], tool: step };
        }
        toolDomainCount[step.resolvedToolId].domains.push(domain);
      }
    }
  }

  // Sort by number of domains served (most useful first)
  return Object.entries(toolDomainCount)
    .sort((a, b) => b[1].domains.length - a[1].domains.length)
    .map(([toolId, { domains, tool }], idx) => ({
      toolId,
      toolName: tool.toolName,
      reason: `Serves ${domains.length} domain${domains.length > 1 ? 's' : ''}: ${domains.join(', ')}`,
      priority: idx + 1,
      completed: false,
      estimatedMinutes: tool.estimatedMinutes,
      domains,
    }));
}

interface ToolRecommendation {
  toolId: string;
  toolName: string;
  reason: string;
  priority: number;
  completed: boolean;
  estimatedMinutes: number;
  domains: DecisionDomain[];
}
