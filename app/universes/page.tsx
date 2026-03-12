import type { Metadata } from "next";
import UniverseCard from "@/components/ui/UniverseCard";
import SectionReveal from "@/components/ui/SectionReveal";

export const metadata: Metadata = {
  title: "Universes — Kael Solomon",
  description: "Two science fiction universes. LOGOS and Resonance.",
};

export default function UniversesPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-hero-bg)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-[120px]">
        {/* Hero */}
        <SectionReveal>
          <div className="mb-16">
            <h1
              className="text-[64px] leading-[1.2] tracking-[-0.02em] m-0 mb-3"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-hero-text)",
              }}
            >
              Universes
            </h1>
            <p
              className="text-[20px] m-0"
              style={{
                color: "var(--color-hero-muted)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Two science fiction universes. Different questions. Same species.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UniverseCard
              name="LOGOS"
              tagline="A civilization that chose fear over clarity. A cost that took generations to count."
              description="LOGOS is a four-book sci-fi series about an ancient advanced civilization whose collapse was not technological but psychological. Fear became the dominant operating system. Everything that followed was inevitable."
              seriesLabel="4-book series"
              href="/universes/logos"
              accentColor="var(--color-logos-accent)"
              dark
              highlightColor="var(--color-logos-highlight)"
              large
            />
            <UniverseCard
              name="Resonance"
              tagline="A consciousness engineered to perceive more than the human system was designed to hold."
              description="Resonance is a nine-book series beginning with Attunement — the story of a human built to interface with dimensional frequencies most people can&apos;t register. Book 1 is about learning to live inside a perception that doesn&apos;t come with a manual."
              seriesLabel="9-book series — Book 1: Attunement"
              href="/universes/resonance"
              accentColor="var(--color-resonance-accent)"
              dark
              highlightColor="var(--color-resonance-highlight)"
              large
            />
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
