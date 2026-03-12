"use client";

import UniverseCard from "@/components/ui/UniverseCard";
import SectionReveal from "@/components/ui/SectionReveal";
import EmailCapture from "@/components/ui/EmailCapture";
import TetraskelionHero from "@/components/hero/TetraskelionHero";
import { books } from "@/data/books";

export default function HomeClient() {
  // Get most recent book for Latest section
  const latestBook = books.find((b) => b.status === "in-progress") || books[0];

  if (!latestBook) return null;

  return (
    <>
      {/* Hero — dark Tetraskelion WebGL, full viewport */}
      <TetraskelionHero />

      {/* Section 1 — The Corridor */}
      <SectionReveal>
        <section className="py-[120px] px-6">
          <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row gap-12">
            {/* Left column — reading content */}
            <div className="md:w-1/2">
              <p
                className="text-[18px] leading-[1.7] m-0"
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {/* TODO: Pending G approval — Corridor paragraph from v2.0 brief */}
                Every medium I work in is a different door into the same room. The sci-fi is the
                philosophy rendered as story. The framework is the story rendered as practice. The
                music is the practice rendered as feeling. I&apos;m not building a body of work — I&apos;m
                building a corridor. You enter wherever you enter.
              </p>
            </div>
            {/* Right column — intentionally empty on desktop. Not in DOM on mobile. */}
            <div className="hidden md:block md:w-1/2" />
          </div>
        </section>
      </SectionReveal>

      {/* Section 2 — Universes */}
      <SectionReveal>
        <section className="py-[120px] px-6">
          <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* TODO: Taglines + descriptions pending G approval from v2.0 brief */}
            <UniverseCard
              name="LOGOS"
              tagline="A civilization that chose fear over clarity. A cost that took generations to count."
              description="LOGOS is a four-book sci-fi series about an ancient advanced civilization whose collapse was not technological but psychological. Fear became the dominant operating system. Everything that followed was inevitable."
              seriesLabel="4-book series"
              href="/universes/logos"
              accentColor="var(--color-logos-accent)"
            />
            <UniverseCard
              name="Resonance"
              tagline="A consciousness engineered to perceive more than the human system was designed to hold."
              description="Resonance is a nine-book series beginning with Attunement — the story of a human built to interface with dimensional frequencies most people can&apos;t register. Book 1 is about learning to live inside a perception that doesn&apos;t come with a manual."
              seriesLabel="9-book series — Book 1: Attunement"
              href="/universes/resonance"
              accentColor="var(--color-resonance-accent)"
            />
          </div>
        </section>
      </SectionReveal>

      {/* Section 3 — Latest */}
      <SectionReveal>
        <section className="py-[120px] px-6">
          <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row gap-12 items-start">
            {/* Cover */}
            <div className="md:w-[40%] w-full">
              <div
                role="img"
                aria-label={`${latestBook.title} — cover coming soon`}
                className="w-full flex items-center justify-center"
                style={{
                  aspectRatio: "2/3",
                  background: "var(--color-bg-subtle)",
                }}
              >
                <span
                  className="text-[11px] text-center px-3"
                  style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {latestBook.title}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-[60%] w-full flex flex-col gap-3">
              <p
                className="text-[11px] uppercase m-0"
                style={{
                  color: "var(--color-text-faint)",
                  fontFamily: "var(--font-inter)",
                  letterSpacing: "0.08em",
                }}
              >
                {latestBook.universe === "logos"
                  ? "LOGOS Series"
                  : latestBook.universe === "resonance"
                  ? "Resonance Series"
                  : latestBook.universe}
              </p>
              <h2
                className="text-[28px] leading-[1.2] m-0"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--color-text-primary)",
                }}
              >
                {latestBook.title}
              </h2>
              {latestBook.description && (
                <p
                  className="text-[16px] m-0"
                  style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-inter)",
                    lineHeight: 1.7,
                  }}
                >
                  {latestBook.description}
                </p>
              )}
              <p
                className="text-[13px] m-0"
                style={{
                  color: "var(--color-text-faint)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {latestBook.status === "in-progress"
                  ? "In progress"
                  : latestBook.status === "available"
                  ? "Available now"
                  : "Coming soon"}
              </p>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Section 4 — Email Capture */}
      <SectionReveal>
        <section className="py-[120px] px-6">
          <div className="mx-auto max-w-[600px] text-center">
            <h2
              className="text-[28px] leading-[1.2] mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Stay close to the work.
            </h2>
            <div className="flex justify-center">
              <EmailCapture />
            </div>
          </div>
        </section>
      </SectionReveal>
    </>
  );
}
