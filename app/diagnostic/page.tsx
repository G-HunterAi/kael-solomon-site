'use client'

import Link from 'next/link'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { DIMENSIONS, SECTION_COLORS } from '@/lib/acuity-types'
import type { DimensionId, DimensionScore } from '@/lib/acuity-types'

const ConstellationChart = dynamic(
  () => import('@/components/diagnostic/ConstellationChart'),
  { ssr: false }
)

// Example constellation data for preview
const PREVIEW_SCORES: Partial<Record<DimensionId, DimensionScore>> = Object.fromEntries(
  DIMENSIONS.map((d) => [
    d.id,
    {
      raw: 0,
      normalized: [72, 85, 58, 67, 45, 78, 33, 91, 55, 60, 42, 70, 88, 65, 50, 80, 73, 62][
        DIMENSIONS.indexOf(d)
      ],
      tier: 2,
      questionsAnswered: 1,
      isOutlier: false,
    },
  ])
)

const FAQ_ITEMS = [
  {
    q: 'How is this different from Myers-Briggs or IQ tests?',
    a: "ACUITY measures practical intelligence through scenario-based questions \u2014 how you actually operate, not how you describe yourself. It doesn't categorize you into a type. It maps 18 specific dimensions of capability with a score for each one.",
  },
  {
    q: 'How long does it take?',
    a: 'The lite assessment is 18 questions and takes approximately 20-25 minutes. There are no time limits on individual questions.',
  },
  {
    q: 'What do I get at the end?',
    a: 'A Capability Constellation (18-axis radar chart), a named archetype that describes your overall operating pattern, and a written profile narrative with specific development recommendations.',
  },
  {
    q: 'Can I retake it?',
    a: "Yes. We recommend retesting every 90 days. When you do, you'll see a ghost overlay of your previous constellation so you can track what moved.",
  },
  {
    q: 'Is my data private?',
    a: 'In Phase 1, all results are stored locally in your browser. Nothing is sent to a server. Your data stays on your device.',
  },
  {
    q: 'What is ACUITY part of?',
    a: 'ACUITY is part of the Genius platform \u2014 built to help people understand and develop their practical intelligence over time.',
  },
]

export default function DiagnosticHub() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
        <span className="text-[#666] text-sm">&larr; kaelsolomon.com</span>
        <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">Genius</span>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-12 pb-20 max-w-4xl mx-auto text-center">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">
          Acuity Profile
        </p>
        <h1 className="text-[#e8e8e8] text-4xl md:text-6xl font-light leading-tight mb-6">
          The intelligence test designed for the life you&apos;re actually living.
        </h1>
        <p className="text-[#888] text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
          18 dimensions of practical intelligence. Scenario-based. No abstract puzzles.
          A Capability Constellation that shows exactly how you think &mdash; and where
          you lose ground.
        </p>
        <p className="text-[#c9a84c] text-sm italic mb-12">
          Genius isn&apos;t what you were born with. It&apos;s what you build.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <Link
            href="/diagnostic/assessment"
            className="bg-[#c9a84c] text-[#0a0a0a] px-8 py-4 text-sm font-medium hover:bg-[#d4b35a] transition-colors"
          >
            Start Free &mdash; 18 Questions &middot; ~25 min
          </Link>
          <span className="border border-[#333] text-[#555] px-8 py-4 text-sm cursor-not-allowed">
            Full Assessment &mdash; 36 Questions &middot; ~55 min (Coming soon)
          </span>
        </div>
        <p className="text-[#666] text-xs">
          No account required. Results saved to your device.
        </p>
      </section>

      {/* Constellation Preview */}
      <section className="px-6 pb-20 max-w-xl mx-auto">
        <ConstellationChart scores={PREVIEW_SCORES} />
        <p className="text-[#666] text-xs text-center mt-4">
          Your Capability Constellation &mdash; 18 dimensions of practical intelligence
        </p>
      </section>

      {/* How It Works */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase text-center mb-10">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', text: 'Answer 18 scenario-based questions (~25 min)' },
            { step: '02', text: 'See your Capability Constellation \u2014 all 18 dimensions mapped' },
            { step: '03', text: 'Discover your archetype and signature strength' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <p className="text-[#c9a84c] text-2xl font-light mb-3">{item.step}</p>
              <p className="text-[#888] text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Measure */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase text-center mb-10">
          What We Measure
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Cognitive Foundation',
              color: SECTION_COLORS.cognitive,
              desc: 'Memory & comprehension, linguistic precision, logical reasoning',
            },
            {
              title: 'Applied Intelligence',
              color: SECTION_COLORS.applied,
              desc: 'How you judge situations, execute, adapt, regulate, and navigate complexity',
            },
            {
              title: 'Character & Generative',
              color: SECTION_COLORS.character,
              desc: 'Creative capacity, self-awareness, values clarity',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="border rounded-lg p-6"
              style={{ borderColor: card.color + '40' }}
            >
              <h3 className="text-base font-medium mb-2" style={{ color: card.color }}>
                {card.title}
              </h3>
              <p className="text-[#888] text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="px-6 pb-20 max-w-2xl mx-auto">
        <div className="space-y-4">
          {[
            'Not what you know \u2014 how you operate',
            'Scenario-based, not self-reported',
            'A profile that grows with you \u2014 retest in 90 days to see your constellation change',
            'Two layers of identity: your archetype shape + your signature dimension',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="text-[#c9a84c] text-sm mt-0.5">&bull;</span>
              <p className="text-[#888] text-sm">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-20 max-w-2xl mx-auto">
        <h2 className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className="border border-[#222] rounded">
              <button
                className="w-full text-left p-4 flex items-center justify-between"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span className="text-[#e8e8e8] text-sm">{faq.q}</span>
                <span className="text-[#666] text-xs shrink-0 ml-4">
                  {openFaq === i ? '\u25B2' : '\u25BC'}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-[#888] text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
