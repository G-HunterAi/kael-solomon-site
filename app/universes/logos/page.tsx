import type { Metadata } from "next";
import BookCard from "@/components/ui/BookCard";
import SectionReveal from "@/components/ui/SectionReveal";
import { logosBooks } from "@/data/logos-books";

export const metadata: Metadata = {
  title: "LOGOS — Kael Solomon",
  description:
    "LOGOS: a civilization that chose fear over clarity. A 4-book sci-fi series.",
};

export default function LogosPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-logos-bg)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-[120px]">
        {/* Hero */}
        <SectionReveal>
          <div
            className="mb-16"
            style={{ borderTop: "4px solid var(--color-logos-accent)" }}
          >
            <div className="pt-8">
              <h1
                className="text-[64px] leading-[1.2] tracking-[-0.02em] m-0 mb-3"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--color-hero-text)",
                }}
              >
                LOGOS
              </h1>
              <p
                className="text-[20px] m-0"
                style={{
                  color: "var(--color-hero-muted)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {/* TODO: Pending G approval — LOGOS tagline from v2.0 brief */}
                A civilization that chose fear over clarity. A cost that took generations to count.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* World overview */}
        <SectionReveal delay={0.1}>
          <div className="max-w-[720px] mb-16">
            {/* TODO: Replace with LOGOS world overview from G (3-4 paragraphs) */}
            <p
              className="text-[18px] mb-6"
              style={{
                color: "var(--color-hero-text)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.8,
              }}
            >
              In the LOGOS universe, fear is not an emotion — it is an operating system.
              Civilizations do not fall because they lack intelligence or resources.
              They fall because fear becomes the architecture of every decision they make.
            </p>
            <p
              className="text-[18px] mb-6"
              style={{
                color: "var(--color-hero-text)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.8,
              }}
            >
              The series follows a civilization at the edge of this recognition — the moment
              where it becomes possible to see the pattern, name it, and choose differently.
              Courage, clarity, and patience as the antidote.
            </p>
            <p
              className="text-[18px] mb-0"
              style={{
                color: "var(--color-hero-text)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.8,
              }}
            >
              Four books. Each one a lens on the same question: what does it cost to be afraid,
              and what does it take to stop?
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
                color: "var(--color-logos-highlight)",
                lineHeight: 1.6,
              }}
            >
              FEAR as the fundamental human failure mode. Courage, clarity, and patience as its antidote.
            </p>
          </div>
        </SectionReveal>

        {/* Books grid */}
        <SectionReveal delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {logosBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                dark
                highlightColor="var(--color-logos-highlight)"
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
