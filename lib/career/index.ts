export {
  scoreCareerFamilies,
  detectFluxState,
  computeGapScore,
  computeGapPriority,
  getBlendProfile,
  CAREER_FAMILIES,
  FAMILY_DESCRIPTIONS,
  FLUX_STATES,
  FLUX_DESCRIPTIONS,
  GAP_TYPES,
  GAP_DESCRIPTIONS,
  DIMENSIONS,
  SUB_COMPONENTS,
  BLEND_PROFILES,
} from './scoring';

// Re-export types
export type { CareerFamily, CareerFamilyScores, FluxState, GapType } from './scoring';

// ── Decision Domain Router (Phase 1 Expansion) ──
export {
  DECISION_DOMAINS,
  DOMAIN_DEFINITIONS,
  AGE_GROUPS,
  AGE_GROUP_DEFINITIONS,
  YOUTH_FLUX_STATES,
  YOUTH_FLUX_DESCRIPTIONS,
  MEASUREMENT_ADAPTERS,
  computeAge,
  classifyAgeGroup,
  getAvailableDomains,
  routeToDecisionDomains,
  detectYouthFluxState,
  getMeasurementAdapter,
  getComponentMeasurementLevel,
} from './decision-domains';

export type {
  DecisionDomain,
  DomainDefinition,
  AgeGroup,
  AgeGroupDefinition,
  YouthFluxState,
  MeasurementAdapter,
  DomainRoutingResult,
  DomainRecommendation,
  RoutingContext,
} from './decision-domains';

// ── Domain-Specific Outputs (Phase 4 Expansion) ──
export {
  generateDomainOutput,
} from './domain-outputs';

export type {
  DomainOutputContext,
  DomainOutput,
  OutputSection,
  ActionItem,
  ToolRecommendation,
  DomainMetric,
  DomainFraming,
  GapRecord,
} from './domain-outputs';

// ── Tool Sequencing (Phase 4 Expansion) ──
export {
  buildToolSequence,
  getNextTool,
  areRequiredToolsComplete,
  getEstimatedTimeRemaining,
  getCrossDomainTools,
} from './tool-sequencing';

export type {
  ToolStep,
  ToolSequence,
  SequencedStep,
  SequenceProgress,
} from './tool-sequencing';
