import type { DimensionId, DimensionScore, AssessmentResponse, Tier } from './acuity-types'
import { COGNITIVE_IDS, APPLIED_IDS, CHARACTER_IDS } from './acuity-types'

export const OUTLIER_LABELS: Record<DimensionId, string> = {
  C1: 'The Archive',
  C2: 'The Translator',
  C3: 'The Arbiter',
  D1: 'The Sensor',
  D2: 'The Unmoved',
  D3: 'The Still',
  D4: 'The Operator',
  D5: 'The Thread',
  D6: 'The Curator',
  D7: 'The Integrator',
  D8: 'The Mirror',
  D9: 'The Forged',
  D10: 'The Finder',
  D11: 'The Cartographer',
  D12: 'The Pacer',
  G1: 'The Generator',
  G2: 'The Witness',
  G3: 'The Anchored',
}

export const OUTLIER_DESCRIPTIONS: Record<DimensionId, string> = {
  C1: 'Nothing escapes them \u2014 retention is a superpower',
  C2: 'Communicates with precision that makes complex things land',
  C3: 'Cuts through flawed reasoning before others see it',
  D1: 'Reads rooms with almost uncanny accuracy',
  D2: "Social pressure simply doesn't land",
  D3: 'Performance under pressure is their natural state',
  D4: 'They start, they finish, they move',
  D5: 'Sees the connection everyone else misses',
  D6: 'Knows exactly who to call and what to ask',
  D7: 'Insight becomes behavior within days, not months',
  D8: 'Reads people with precision that can feel uncanny',
  D9: 'Been genuinely tested at the highest level and rebuilt',
  D10: 'Always finds a way regardless of constraints',
  D11: "Maps systems nobody else can hold in their head",
  D12: 'Holds urgency and presence in rare balance',
  G1: 'Produces novel options that genuinely surprise',
  G2: 'Sees themselves with unusual and disarming accuracy',
  G3: "Values don't move regardless of cost",
}

export function normalizeScore(rawTiers: number[]): number {
  const sum = rawTiers.reduce((a, b) => a + b, 0)
  const max = rawTiers.length * 3
  return Math.round((sum / max) * 100)
}

export function calculateDimensionScore(tiers: Tier[]): DimensionScore {
  const normalized = normalizeScore(tiers)
  const avgTier = tiers.reduce<number>((a, b) => a + b, 0) / tiers.length
  return {
    raw: tiers.reduce<number>((a, b) => a + b, 0),
    normalized,
    tier: Math.round(avgTier),
    questionsAnswered: tiers.length,
    isOutlier: false,
  }
}

export function calculateScores(
  responses: AssessmentResponse[]
): Partial<Record<DimensionId, DimensionScore>> {
  const byDimension: Partial<Record<DimensionId, Tier[]>> = {}

  for (const r of responses) {
    if (!r.scored || r.tier === undefined) continue
    if (!byDimension[r.dimensionId]) byDimension[r.dimensionId] = []
    byDimension[r.dimensionId]!.push(r.tier)
  }

  const scores: Partial<Record<DimensionId, DimensionScore>> = {}
  for (const [dim, tiers] of Object.entries(byDimension) as [DimensionId, Tier[]][]) {
    scores[dim] = calculateDimensionScore(tiers)
  }

  return scores
}

export function calculateSectionScore(
  dimensionIds: DimensionId[],
  scores: Partial<Record<DimensionId, DimensionScore>>
): number {
  const vals = dimensionIds.map((id) => scores[id]?.normalized ?? 0)
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

export function calculateSectionScores(scores: Partial<Record<DimensionId, DimensionScore>>) {
  const cognitive = calculateSectionScore(COGNITIVE_IDS, scores)
  const applied = calculateSectionScore(APPLIED_IDS, scores)
  const character = calculateSectionScore(CHARACTER_IDS, scores)
  const all = [...COGNITIVE_IDS, ...APPLIED_IDS, ...CHARACTER_IDS]
  const overall = calculateSectionScore(all, scores)
  return { cognitive, applied, character, overall }
}

export interface OutlierResult {
  dimension: DimensionId
  label: string
  score: number
}

export function detectOutliers(
  scores: Partial<Record<DimensionId, DimensionScore>>
): OutlierResult[] {
  const entries = (Object.entries(scores) as [DimensionId, DimensionScore][]).filter(
    ([, s]) => s !== undefined
  )
  const sorted = entries.sort((a, b) => b[1].normalized - a[1].normalized)

  if (sorted.length < 2) return []

  const results: OutlierResult[] = []

  const [topId, topScore] = sorted[0]
  const [, secondScore] = sorted[1]
  const primaryGap = topScore.normalized - secondScore.normalized

  if (primaryGap >= 20 && topScore.normalized >= 65) {
    results.push({
      dimension: topId,
      label: OUTLIER_LABELS[topId],
      score: topScore.normalized,
    })
  }

  if (results.length > 0 && sorted.length >= 3) {
    const [secondId] = sorted[1]
    const [, thirdScore] = sorted[2]
    const secondaryGap = secondScore.normalized - thirdScore.normalized

    if (secondaryGap >= 20 && secondScore.normalized >= 65) {
      results.push({
        dimension: secondId,
        label: OUTLIER_LABELS[secondId],
        score: secondScore.normalized,
      })
    }
  }

  return results
}

export function detectGaps(
  scores: Partial<Record<DimensionId, DimensionScore>>
): DimensionId[] {
  return (Object.entries(scores) as [DimensionId, DimensionScore][])
    .filter(([, s]) => s.normalized < 50)
    .sort((a, b) => a[1].normalized - b[1].normalized)
    .map(([id]) => id)
}

export function assessValidity(responses: AssessmentResponse[]) {
  const times = responses.filter((r) => r.scored).map((r) => r.responseTimeSeconds)
  if (times.length === 0) return { avgResponseTimeSeconds: 0, fastResponseCount: 0, isLikelyValid: true }
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const fast = times.filter((t) => t < 10).length
  return {
    avgResponseTimeSeconds: Math.round(avg),
    fastResponseCount: fast,
    isLikelyValid: fast <= 6,
  }
}
