export { installStorageAdapter, createSignalStorageAdapter, saveSignalResult } from './storage-adapter';
export { bridgeSignalToCareer, getLatestEnergySnapshot, getExperimentInsights } from './bridge';

// ── Youth Tool Variants (Phase 3 Expansion) ──
export {
  YOUTH_ACTIVITIES,
  YOUTH_FSI_ITEMS,
  YOUTH_FSI_LABELS,
  YOUTH_FLUX_GUIDANCE,
  YOUTH_CAREER_EXPLORATIONS,
  YOUTH_TOOL_REGISTRY,
  getYouthActivities,
  scoreYouthFsi,
  generateYouthExplorations,
  getToolsForAge,
  requiresGuardianConsent,
} from './youth-tools';

export type {
  YouthActivity,
  YouthFsiItem,
  YouthCareerExploration,
  YouthToolDefinition,
} from './youth-tools';
