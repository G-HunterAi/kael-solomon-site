import type { Metadata } from "next";
import BookCard from "@/components/ui/BookCard";
import SectionReveal from "@/components/ui/SectionReveal";
import { resonanceBooks } from "@/data/resonance-books";

export const metadata: Metadata = {
  title: "Resonance — Kael Solomon",
  description:
    "Resonance: a consciousness engineered to perceive more than the human system was designed to hold.",
};

export default function ResonancePage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-resonance-bg)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-[120px]">
        {/* Hero */}
        <SectionReveal>
          <div
            className="mb-16"
            style={{ borderTop: "4px solid var(--color-resonance-accent)" }}
          >
            <div className="pt-8">
              <h1
                className="text-[64px] leading-[1.2] tracking-[-0.02em] m-0 mb-3"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--color-hero-text)",
                }}
              >
                Resonance
              </h1>
              <p
                className="text-[20px] m-0"
                style={{
                  color: "var(--color-hero-muted)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {/* TODO: Pending G approval — Resonance tagline from v2.0 brief */}
                A consciousness engineered to perceive more than the human system was designed to hold.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* World overview */}
        <SectionReveal delay={0.1}>
          <div className="max-w-[720px] mb-16">
            {/* TODO: Replace with Resonance world overview from G (3-4 paragraphs) */}
            <p
              className="text-[18px] mb-6"
              style={{
                color: "var(--color-hero-text)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.8,
              }}
            >
              Resonance begins with a question that shouldn&apos;t be asked: what if human consciousness
              was never the finished product? What if it was a receiver — tuned to a narrow band,
              capable of far more, but limited by design?
            </p>
            <p
              className="text-[18px] mb-6"
              style={{
                color: "var(--color-hero-text)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.8,
              }}
            >
              The series follows what happens when that limitation is removed — not through
              technology, but through frequency. A signal that unlocks capacity the human body
              was never meant to hold.
            </p>
            <p
              className="text-[18px] mb-0"
              style={{
                color: "var(--color-hero-text)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.8,
              }}
            >
              Nine books. Each one a step deeper into what it means to become something
              the species has no word for yet.
            </p>
          </div>
        </SectionReveal>

        {/* Core theme callout */}
        <SectionReveal delay={0.15}>
          <div
            className="mb-16 p-12"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p
              className="text-[20px] m-0 italic"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-resonance-highlight)",
                lineHeight: 1.6,
              }}
            >
              {/* TODO: Pending G approval — Resonance core theme from v2.0 brief */}
              The cost and gift of perceiving more than your environment was built to support.
            </p>
          </div>
        </SectionReveal>

        {/* Books grid */}
        <SectionReveal delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {resonanceBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                dark
                highlightColor="var(--color-resonance-highlight)"
              />
            ))}
          </div>
        </SectionReveal>

        {/* Film/Series block */}
        <SectionReveal delay={0.25}>
          <div
            className="p-12"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p
              className="text-[12px] uppercase m-0 mb-3"
              style={{
                color: "var(--color-hero-muted)",
                fontFamily: "var(--font-inter)",
                letterSpacing: "0.08em",
              }}
            >
              Film / Series Adaptation
            </p>
            <p
              className="text-[16px] m-0"
              style={{
                color: "var(--color-hero-muted)",
                fontFamily: "var(--font-inter)",
              }}
            >
              In development. Updates when there&apos;s something worth sharing.
            </p>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
