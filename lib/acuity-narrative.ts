import type { DimensionId, DimensionScore } from './acuity-types'

const OPENING_TEMPLATES = {
  high: [
    "Your constellation is one of the more complete profiles we've seen \u2014 not uniform, but genuinely built across most of its range.",
    "What the shape of your constellation shows first: this is someone who has done real work on themselves. Not perfectly distributed, but built.",
  ],
  mid: [
    "Your constellation maps a person with distinct areas of genuine strength alongside clear places where you lose ground.",
    "The shape is specific \u2014 and specificity is useful. It tells you exactly where you are and exactly where to focus.",
  ],
  low: [
    "Your constellation is honest about where you are right now \u2014 and it has significant room to expand.",
    "There's real material here. Several dimensions are in early development, which means the growth curve is steep if you engage it.",
  ],
}

const STRENGTH_TEMPLATES: Record<DimensionId, string[]> = {
  C1: [
    "Your memory and comprehension are a genuine advantage \u2014 you retain and integrate what others let pass through.",
    "You hold information with unusual fidelity. This isn't just recall \u2014 it's the ability to connect what you learned months ago to what you're deciding today.",
  ],
  C2: [
    "Your linguistic precision is real \u2014 you communicate in ways that make complex things land clearly.",
    "You have a capacity for making yourself understood that goes beyond vocabulary. The structure of how you deliver information actually serves the person receiving it.",
  ],
  C3: [
    "Your logical reasoning is a real asset \u2014 you catch the flaw in an argument that others accept because it sounds credible.",
    "You think in structures. The gap between a plausible claim and a valid one is visible to you in ways that it isn't to most people.",
  ],
  D1: [
    "Your contextual judgment is sharp \u2014 you read situations with an accuracy that lets you make good calls in ambiguous environments.",
    "You have a reliable sense for what's actually happening in a room, a meeting, or a dynamic. That's harder to build than most people realize.",
  ],
  D2: [
    "Your self-authority is genuine \u2014 you make decisions from your own assessment, not from the room's pressure.",
    "You trust your own read. Not blindly, not arrogantly, but in a way that lets you hold position when the social current says otherwise.",
  ],
  D3: [
    "Your regulation under pressure is a real differentiator \u2014 when the stakes go up, your quality of thinking doesn't collapse.",
    "Pressure doesn't degrade your performance. That's not just temperament \u2014 it's a capacity you've built, and it gives you access to situations that break most people.",
  ],
  D4: [
    "Your execution capacity is real \u2014 you close. In a world full of people who have good ideas and don't finish them, that's a meaningful differentiator.",
    "You move. From insight to action is a shorter distance for you than for most, and you've built the discipline to keep that distance short.",
  ],
  D5: [
    "Your pattern recognition is strong \u2014 you see the recurring structure underneath events that look unrelated on the surface.",
    "You notice the thread. Where others see separate incidents, you see the system producing them. That's a high-leverage capacity.",
  ],
  D6: [
    "Your reference intelligence is sharp \u2014 you know how to find the right source, the right person, the right signal when you need it.",
    "You don't just know things \u2014 you know how to find out things, and more importantly, you know which sources carry real signal.",
  ],
  D7: [
    "Your adaptive learning is a genuine asset \u2014 insight becomes behavior faster for you than for most people.",
    "You integrate new information into how you actually operate, not just into what you know. That speed of update is rare.",
  ],
  D8: [
    "Your social calibration is real \u2014 you read people with a precision that lets you adjust in real time.",
    "You model other people accurately. Not just what they're saying, but what they're actually thinking and what they need to hear.",
  ],
  D9: [
    "Your resilience profile is exceptional \u2014 and this isn't the resilience of someone who hasn't been tested. It's the kind that gets built by being genuinely flattened and rebuilding anyway.",
    "You've developed the capacity to absorb real collapse without losing your structural integrity. Most people never get tested at this level. Fewer come through it with their operating capacity intact.",
  ],
  D10: [
    "Your resourcefulness is a genuine differentiator \u2014 you find ways to make things work with what's available, not just with what's ideal.",
    "You don't wait for perfect conditions. You build with what you have, and what you build works.",
  ],
  D11: [
    "Your systems thinking is strong \u2014 you see the feedback loops, the second-order effects, the structure underneath the visible surface.",
    "You hold complexity well. Where others see isolated events, you see the system producing them. That's a rare and high-leverage capacity.",
  ],
  D12: [
    "Your temporal intelligence is a quiet advantage \u2014 you hold both urgency and long-term thinking without letting one collapse the other.",
    "You pace well. That balance between being present in what you're doing and building toward something larger is harder than it looks.",
  ],
  G1: [
    "Your creative capacity is real \u2014 you generate options that others don't see, not because they're trying to be original but because the connections are genuinely novel.",
    "You produce. The ideas are real, the options are real, and they come from a generative capacity that most people don't have access to.",
  ],
  G2: [
    "Your self-awareness accuracy is a genuine strength \u2014 you see yourself with unusual clarity, including the parts most people prefer not to examine.",
    "You have a reliable model of how you actually operate, not just how you'd like to operate. That kind of accuracy is the foundation for everything else.",
  ],
  G3: [
    "Your values clarity is a genuine anchor. You know what you stand for with an accuracy that most people only think they have.",
    "You've actually tested your values under real pressure \u2014 and they held. That's the difference between stated values and load-bearing ones.",
  ],
}

const GAP_TEMPLATES: Record<DimensionId, string[]> = {
  C1: [
    "Memory and comprehension is the developing area \u2014 specifically, the capacity to retain and integrate information you encountered but weren't specifically trying to remember.",
    "The gap in retention means you're working harder than necessary on decisions that depend on information you already encountered. The data was there; the architecture for holding it wasn't.",
  ],
  C2: [
    "Linguistic intelligence is where your constellation loses ground \u2014 specifically, the ability to restructure how you deliver information based on how it's actually landing.",
    "You know what you mean. The gap is in the translation \u2014 getting what's clear in your head to be equally clear for the person in front of you, particularly when they're not starting from the same context.",
  ],
  C3: [
    "Logical reasoning is the current gap \u2014 specifically, the ability to identify when an argument sounds right but isn't structurally valid.",
    "The gap in reasoning means you're occasionally persuaded by arguments that feel correct rather than ones that are correct. The fix is structural: learning to check the logic, not just the conclusion.",
  ],
  D1: [
    "Contextual judgment is where you lose ground \u2014 the ability to accurately read what's actually happening in a situation when the signals are mixed.",
    "You're sometimes operating on what a situation looks like rather than what it is. The gap isn't in decision quality \u2014 it's in the accuracy of the read that precedes the decision.",
  ],
  D2: [
    "Self-authority is the developing dimension \u2014 specifically, the capacity to hold your own position when social or hierarchical pressure pushes against it.",
    "You know what you think. The gap is in whether you act on it when the room disagrees, or when someone with more authority presents a different read.",
  ],
  D3: [
    "Regulation under pressure is the current gap \u2014 not composure, but the ability to maintain the quality of your thinking when the stakes increase.",
    "When pressure rises, your decision-making shifts. The gap isn't that you panic \u2014 it's that your processing degrades in ways you might not notice until the situation has passed.",
  ],
  D4: [
    "Execution is where your constellation loses ground. The ideas, the vision, the analysis \u2014 all real. The gap is in the translation from knowing to doing, consistently, without external pressure.",
    "Your execution profile tells a familiar story for high-systems thinkers: the capacity to see the full picture can make starting harder, not easier. The map is drawn. The territory is waiting.",
  ],
  D5: [
    "Pattern recognition is the developing area \u2014 the ability to see what connects events, decisions, or outcomes that appear unrelated on the surface.",
    "You're processing each situation as new when some of them are actually the same situation in different clothes. The pattern is there; the detection hasn't reliably kicked in.",
  ],
  D6: [
    "Reference intelligence is where you lose ground \u2014 specifically, knowing which sources of information carry real signal and which carry noise.",
    "The gap means you're sometimes making decisions with publicly available information when the real signal is one conversation away \u2014 with the right person, not just any person.",
  ],
  D7: [
    "Adaptive learning is the current gap \u2014 the speed at which new insight becomes new behavior, not just new knowledge.",
    "You learn. The gap is in the integration: turning what you now understand into what you now do, consistently, without a significant delay.",
  ],
  D8: [
    "Social calibration is the current gap \u2014 specifically, the precision with which you model how your presence and communication land on another person in real time.",
    "You read situations and ideas accurately. The gap is in real-time adjustment when the person in front of you stops receiving what you're sending.",
  ],
  D9: [
    "Resilience architecture is the developing dimension \u2014 not the willingness to endure, but the structural capacity to resume forward motion after genuine disruption.",
    "The gap isn't about toughness. It's about what happens after the hit lands: how quickly you rebuild the architecture for moving forward, not just surviving.",
  ],
  D10: [
    "Resourcefulness is the current gap \u2014 the ability to build with what's available rather than waiting for what's ideal.",
    "You wait for better conditions more often than you need to. The gap isn't in capability \u2014 it's in the willingness to start building before the resources feel sufficient.",
  ],
  D11: [
    "Systems thinking is where your constellation loses ground \u2014 the ability to see the feedback loops and second-order effects that connect what looks like separate events.",
    "You're solving problems at the symptom level when the system producing them is still running. The gap is in zooming out enough to see the structure, not just the output.",
  ],
  D12: [
    "Your temporal intelligence is the developing dimension \u2014 specifically, the capacity to hold urgency and presence at the same time, rather than alternating between them.",
    "You can be urgent. And you can be present. The gap is in holding both simultaneously \u2014 building toward something while being genuinely in the thing you're doing right now.",
  ],
  G1: [
    "Creative capacity is the current gap \u2014 not the desire to be creative, but the ability to generate genuinely novel options when the obvious ones don't work.",
    "When the first three ideas don't work, you tend to optimize within the same frame rather than stepping outside it. The gap is in generative range, not effort.",
  ],
  G2: [
    "Self-awareness accuracy is the developing dimension \u2014 specifically, the gap between how you experience yourself and how you actually land on others.",
    "You have a self-model. The gap is in its accuracy: the places where what you think you're projecting and what others actually perceive have drifted apart.",
  ],
  G3: [
    "Values clarity is where you lose ground \u2014 not the absence of values, but the precision with which you can articulate what you actually stand for when it costs something.",
    "You have principles. The gap is in whether they're load-bearing: do they hold when the cost of keeping them becomes real and immediate?",
  ],
}

const CLOSING_TEMPLATES = [
  "The constellation doesn't describe who you are fixed. It maps where you are now \u2014 which means it also maps where you can go. The dimensions with the most room to develop are exactly the ones worth deliberate attention over the next 90 days. Retest when you've worked on them. The ghost overlay will show you what moved.",
  "What you do with this is the thing that matters. The profile is honest. The direction it points is specific. The work \u2014 like all real work \u2014 starts with one clear next action, not a comprehensive overhaul.",
]

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function generateNarrative(
  scores: Partial<Record<DimensionId, DimensionScore>>,
  overall: number,
  archetypeName: string,
  gaps: DimensionId[]
): string {
  const entries = (Object.entries(scores) as [DimensionId, DimensionScore][]).sort(
    (a, b) => b[1].normalized - a[1].normalized
  )

  if (entries.length === 0) return ''

  const seed = entries.reduce((s, [, v]) => s + v.normalized, 0)

  // 1. Opening
  const band = overall >= 72 ? 'high' : overall >= 45 ? 'mid' : 'low'
  const openings = OPENING_TEMPLATES[band]
  const opening = openings[Math.floor(seededRandom(seed) * openings.length)]

  // 2. Top strengths (2-3)
  const topDims = entries.slice(0, 3).filter(([, s]) => s.normalized >= 50)
  const strengthParts = topDims.map(([dim], i) => {
    const templates = STRENGTH_TEMPLATES[dim]
    return templates[Math.floor(seededRandom(seed + i + 1) * templates.length)]
  })

  // 3. Primary gap
  const bottomDim = gaps.length > 0 ? gaps[0] : entries[entries.length - 1][0]
  const gapTemplates = GAP_TEMPLATES[bottomDim]
  const gapPart = gapTemplates[Math.floor(seededRandom(seed + 10) * gapTemplates.length)]

  // 4. Archetype mention
  const archetypeMention = `This is the profile of ${archetypeName} \u2014 someone whose constellation has a specific and recognizable shape.`

  // 5. Closing
  const closing = CLOSING_TEMPLATES[Math.floor(seededRandom(seed + 20) * CLOSING_TEMPLATES.length)]

  // Assemble
  const parts = [
    opening,
    '',
    archetypeMention,
    '',
    strengthParts.join(' '),
    '',
    gapPart,
    '',
    closing,
  ]

  return parts.join('\n')
}
