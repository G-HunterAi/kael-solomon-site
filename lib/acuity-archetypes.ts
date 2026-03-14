import type { DimensionId, DimensionScore } from './acuity-types'

export interface ArchetypeDefinition {
  name: string
  highDimensions: DimensionId[]
  lowDimensions: DimensionId[]
  description: string
}

// Ordered from most-specific to least-specific. Array order is the implicit tiebreaker.
export const ARCHETYPE_DEFINITIONS: ArchetypeDefinition[] = [
  {
    name: 'The Principled Dreamer',
    highDimensions: ['G3', 'G1', 'C1', 'C2', 'C3'],
    lowDimensions: ['D4', 'D8', 'D10'],
    description:
      'Your values and creative capacity are both strong \u2014 you know what you stand for, and you generate ideas worth standing for. The gap is in bringing those ideas into real contact with the world: with real people, real constraints, real social complexity.',
  },
  {
    name: 'The Generative Force',
    highDimensions: ['G1', 'C2', 'D8', 'D10'],
    lowDimensions: ['D6', 'G3', 'D5'],
    description:
      "You produce. Ideas, language, energy, and options \u2014 the output is real and it moves people. The gap is in the architecture beneath the generation: values clarity, pattern depth, and reference intelligence occasionally don't keep pace with what you're creating.",
  },
  {
    name: 'The Pattern Hunter',
    highDimensions: ['D5', 'C1', 'D1', 'G2'],
    lowDimensions: ['D4', 'D8'],
    description:
      "You see things \u2014 connections, recurring structures, the thread running beneath the surface \u2014 and your self-awareness matches your external perception. The gap is in acting on what you see: analysis tends to outpace action, which means the patterns get identified but not always leveraged.",
  },
  {
    name: 'The Composed Operator',
    highDimensions: ['D3', 'D4', 'D9'],
    lowDimensions: ['G1', 'D11', 'G2'],
    description:
      "You execute cleanly, hold your state under pressure, and don't break when things get hard. The most reliable person in most rooms. The gap is generative: you build well from existing blueprints but rarely write new ones.",
  },
  {
    name: 'The Unfinished Genius',
    highDimensions: ['C1', 'C2', 'C3', 'G1'],
    lowDimensions: ['D4', 'D7'],
    description:
      'Your cognitive range is real \u2014 you generate ideas, hold complexity, and connect dots that others miss. Something between generation and completion keeps breaking down, not from lack of ability but from something in the architecture of how you move from knowing to doing.',
  },
  {
    name: 'The Reluctant Architect',
    highDimensions: ['D11', 'D5', 'C3'],
    lowDimensions: ['D4', 'D7'],
    description:
      'You can see how things connect before most people even know there are things to connect. Your capacity to hold and build systems is genuine. The gap is in execution \u2014 the map is drawn with unusual precision, but the territory remains largely unmapped.',
  },
  {
    name: 'The Sovereign Analyst',
    highDimensions: ['D2', 'C3', 'D11'],
    lowDimensions: ['D8', 'D1'],
    description:
      "You think rigorously and commit to your own conclusions with unusual confidence. Your reasoning is often better than the group's, and you have learned \u2014 correctly \u2014 not to always defer. The cost is social: you read situations with precision but read people with less.",
  },
  {
    name: 'The Visionary Without Portfolio',
    highDimensions: ['G1', 'D11', 'G2'],
    lowDimensions: ['D4', 'D10'],
    description:
      "The ideas are real, and so is the vision \u2014 this isn't just ambition dressed up as strategy. The gap lives between what you can see and what you can build; execution and resourcefulness haven't yet caught up to the range of what you can generate.",
  },
  {
    name: 'The Steady Compass',
    highDimensions: ['D3', 'D9', 'G3'],
    lowDimensions: [],
    description:
      "You are the stable point in turbulent situations \u2014 regulated, grounded, and clear on what you stand for in ways most people aren't tested on. You are not the most generative presence, but you are the one whose word means something when it matters.",
  },
  {
    name: 'The Grounded Guardian',
    highDimensions: ['G3', 'D2', 'D9'],
    lowDimensions: ['G1', 'D11'],
    description:
      "You are deeply rooted in values, in self-knowledge, and in the capacity to stay standing when things go sideways. You are not the one with the most ideas, but you are the one whose commitments actually mean something \u2014 and that is a rarer quality than it appears.",
  },
  {
    name: 'The Rapid Calibrator',
    highDimensions: ['D7', 'D5', 'D8'],
    lowDimensions: ['D4'],
    description:
      "You update fast. New information, new environment, new person in front of you \u2014 you recalibrate quickly and with real accuracy. The gap is in sustained execution: the calibration is excellent, and the follow-through on what the calibration reveals is inconsistent.",
  },
  {
    name: 'The Relentless Survivor',
    highDimensions: ['D9', 'D4', 'D10'],
    lowDimensions: ['D5', 'D11'],
    description:
      "You've been tested and kept moving. Execution, resilience, and resourcefulness are all earned, not just claimed. The gap is the larger map \u2014 you navigate the terrain in front of you with real skill, but don't always see where the territory as a whole is heading.",
  },
  {
    name: 'The Perceptive Appeaser',
    highDimensions: ['D8', 'C2'],
    lowDimensions: ['D2', 'G3'],
    description:
      "You read rooms, people, and dynamics with genuine accuracy \u2014 you often know what's happening before anyone says it. The gap is that you occasionally subordinate your own read to what the room wants to hear, even in moments when you're right and they're wrong.",
  },
  {
    name: 'The Adaptive Pragmatist',
    highDimensions: ['D4', 'D10'],
    lowDimensions: ['D11', 'G1'],
    description:
      "You get things done. When everyone else is still debating, you are already in motion. The tradeoff is depth \u2014 your execution speed sometimes outpaces your system-level awareness, and you occasionally arrive somewhere you didn't mean to go.",
  },
  // Special cases
  {
    name: 'The Adaptive Generalist',
    highDimensions: [],
    lowDimensions: [],
    description:
      "No dramatic spikes, no dramatic gaps \u2014 you are functional across the full range, which means you are rarely the weakest person in any room and rarely the strongest. The opportunity is deliberate development in two or three specific dimensions that would move you from generally capable to genuinely exceptional.",
  },
  {
    name: 'The Clear-Eyed Architect',
    highDimensions: [],
    lowDimensions: [],
    description:
      "This is a built constellation \u2014 genuinely developed across most of its range, with clear-eyed awareness of where the gaps remain. You've done real work on yourself over time, and the shape of what you can do reflects it.",
  },
]

export function assignArchetype(
  scores: Partial<Record<DimensionId, DimensionScore>>
): { primary: string; description: string } {
  const entries = (Object.entries(scores) as [DimensionId, DimensionScore][]).filter(
    ([, s]) => s !== undefined
  )
  const sorted = entries.sort((a, b) => b[1].normalized - a[1].normalized)
  if (sorted.length === 0) {
    const def = ARCHETYPE_DEFINITIONS.find((a) => a.name === 'The Adaptive Generalist')!
    return { primary: def.name, description: def.description }
  }

  const overall = sorted.reduce((sum, [, s]) => sum + s.normalized, 0) / sorted.length
  const spread = sorted[0][1].normalized - sorted[sorted.length - 1][1].normalized

  // Special case 1: Adaptive Generalist — all within 20 points
  if (spread <= 20) {
    const def = ARCHETYPE_DEFINITIONS.find((a) => a.name === 'The Adaptive Generalist')!
    return { primary: def.name, description: def.description }
  }

  // Special case 2: Clear-Eyed Architect — overall > 78, nothing below 55
  if (overall > 78 && sorted[sorted.length - 1][1].normalized >= 55) {
    const def = ARCHETYPE_DEFINITIONS.find((a) => a.name === 'The Clear-Eyed Architect')!
    return { primary: def.name, description: def.description }
  }

  // General case: score each archetype
  const top3 = new Set(sorted.slice(0, 3).map(([id]) => id))
  const top5 = new Set(sorted.slice(0, 5).map(([id]) => id))
  const bottom2 = new Set(sorted.slice(-2).map(([id]) => id))
  const bottom4 = new Set(sorted.slice(-4).map(([id]) => id))

  let bestArchetype = ARCHETYPE_DEFINITIONS[0]
  let bestScore = -1

  for (const archetype of ARCHETYPE_DEFINITIONS) {
    if (
      archetype.name === 'The Adaptive Generalist' ||
      archetype.name === 'The Clear-Eyed Architect'
    )
      continue

    let matchScore = 0
    for (const dim of archetype.highDimensions) {
      if (top3.has(dim)) matchScore += 3
      else if (top5.has(dim)) matchScore += 1
    }
    for (const dim of archetype.lowDimensions) {
      if (bottom2.has(dim)) matchScore += 2
      else if (bottom4.has(dim)) matchScore += 1
    }

    if (matchScore > bestScore) {
      bestScore = matchScore
      bestArchetype = archetype
    }
    // Ties favor earlier array position (more specific archetype)
  }

  return { primary: bestArchetype.name, description: bestArchetype.description }
}
