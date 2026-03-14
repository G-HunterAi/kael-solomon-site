export type QuestionFormat = 'A' | 'B' | 'C'
export type Section = 'cognitive' | 'applied' | 'character'
export type Tier = 0 | 1 | 2 | 3

export type DimensionId =
  | 'C1' | 'C2' | 'C3'
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'D10' | 'D11' | 'D12'
  | 'G1' | 'G2' | 'G3'

export interface Option {
  label: 'a' | 'b' | 'c' | 'd'
  text: string
  tier: Tier
  rationale: string
}

export interface Question {
  id: string
  dimension: DimensionId
  section: Section
  format: QuestionFormat
  dimensionLabel: string
  scenario: string
  prompt?: string
  options?: Option[]
  memorySource?: boolean
  memoryRef?: string
  liteVersion: boolean
  standardVersion: boolean
  deepVersion: boolean
  phase: 1 | 2
}

export interface DimensionScore {
  raw: number
  normalized: number
  tier: number
  questionsAnswered: number
  isOutlier: boolean
}

export interface OutlierResult {
  dimension: DimensionId
  label: string
  score: number
}

export interface ArchetypeAssignment {
  primary: string
  signatures?: OutlierResult[]
  conflictNote?: string
}

export interface AssessmentResponse {
  questionId: string
  dimensionId: DimensionId
  format: QuestionFormat
  selectedOption?: 'a' | 'b' | 'c' | 'd'
  tier?: Tier
  scored: boolean
  responseTimeSeconds: number
}

export interface AssessmentResult {
  id: string
  startedAt: string
  completedAt: string
  timeTakenSeconds: number
  questionOrder: string[]
  version: 'lite' | 'standard' | 'deep'
  appVersion: string

  responses: AssessmentResponse[]

  scores: Partial<Record<DimensionId, DimensionScore>>

  sectionScores: {
    cognitive: number
    applied: number
    character: number
    overall: number
  }

  archetype: ArchetypeAssignment & { description: string }

  narrative: string
  gaps: DimensionId[]

  validity: {
    avgResponseTimeSeconds: number
    fastResponseCount: number
    isLikelyValid: boolean
  }
}

export interface DimensionMeta {
  id: DimensionId
  label: string
  shortLabel: string
  section: Section
  fullLabel: string
}

export const DIMENSIONS: DimensionMeta[] = [
  { id: 'C1', label: 'Memory', shortLabel: 'Memory', section: 'cognitive', fullLabel: 'Memory & Comprehension' },
  { id: 'C2', label: 'Language', shortLabel: 'Language', section: 'cognitive', fullLabel: 'Linguistic Intelligence' },
  { id: 'C3', label: 'Logic', shortLabel: 'Logic', section: 'cognitive', fullLabel: 'Logical Reasoning' },
  { id: 'D1', label: 'Judgment', shortLabel: 'Judgment', section: 'applied', fullLabel: 'Contextual Judgment' },
  { id: 'D2', label: 'Authority', shortLabel: 'Authority', section: 'applied', fullLabel: 'Self-Authority' },
  { id: 'D3', label: 'Regulation', shortLabel: 'Regulation', section: 'applied', fullLabel: 'Regulation Under Pressure' },
  { id: 'D4', label: 'Execution', shortLabel: 'Execution', section: 'applied', fullLabel: 'Execution Capacity' },
  { id: 'D5', label: 'Patterns', shortLabel: 'Patterns', section: 'applied', fullLabel: 'Pattern Recognition' },
  { id: 'D6', label: 'References', shortLabel: 'References', section: 'applied', fullLabel: 'Reference Intelligence' },
  { id: 'D7', label: 'Learning', shortLabel: 'Learning', section: 'applied', fullLabel: 'Adaptive Learning' },
  { id: 'D8', label: 'Social', shortLabel: 'Social', section: 'applied', fullLabel: 'Social Calibration' },
  { id: 'D9', label: 'Resilience', shortLabel: 'Resilience', section: 'applied', fullLabel: 'Resilience Architecture' },
  { id: 'D10', label: 'Resourceful', shortLabel: 'Resourceful', section: 'applied', fullLabel: 'Resourcefulness' },
  { id: 'D11', label: 'Systems', shortLabel: 'Systems', section: 'applied', fullLabel: 'Systems Thinking' },
  { id: 'D12', label: 'Time', shortLabel: 'Time', section: 'applied', fullLabel: 'Temporal Intelligence' },
  { id: 'G1', label: 'Creative', shortLabel: 'Creative', section: 'character', fullLabel: 'Creative/Generative Thinking' },
  { id: 'G2', label: 'Self-Aware', shortLabel: 'Self-Aware', section: 'character', fullLabel: 'Self-Awareness Accuracy' },
  { id: 'G3', label: 'Values', shortLabel: 'Values', section: 'character', fullLabel: 'Values Clarity' },
]

export const SECTION_COLORS: Record<Section, string> = {
  cognitive: '#7c6fcd',
  applied: '#c9a84c',
  character: '#4a9eff',
}

export const COGNITIVE_IDS: DimensionId[] = ['C1', 'C2', 'C3']
export const APPLIED_IDS: DimensionId[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12']
export const CHARACTER_IDS: DimensionId[] = ['G1', 'G2', 'G3']
