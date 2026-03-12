import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionReveal from "@/components/ui/SectionReveal";

export const metadata: Metadata = {
  title: "About — Kael Solomon",
  description:
    "Kael Solomon is the pen name of a real person. This is a statement of direction, not a biography.",
};

const domains = [
  {
    name: "Universes",
    description: "LOGOS and Resonance. Two science fiction worlds.",
  },
  {
    name: "Music",
    description: "Downtempo house, tropical house, cinematic ambient.",
  },
  {
    name: "Framework",
    description: "The REPROGRAM Framework. A structural model, not self-help.",
  },
  {
    name: "Tools",
    description: "Open-source software built to support this work.",
  },
];

export default function AboutPage() {
  return (
    <PageWrapper maxWidth="reading">
      <div className="py-[120px]">
        <SectionReveal>
          <h1
            className="text-[32px] leading-[1.2] tracking-[-0.02em] mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Kael Solomon is the pen name of a real person.
          </h1>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          {/* TODO: Pending G approval — About paragraphs from v2.0 brief */}
          <p
            className="text-[18px] mb-6"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter)",
              lineHeight: 1.8,
            }}
          >
            I write across every medium I can find — fiction, non-fiction, philosophy, music.
            Not because I can&apos;t commit to one, but because I don&apos;t believe the room I&apos;m trying
            to describe exists in just one language. Each form gets part of it right. None of
            them gets all of it.
          </p>
          <p
            className="text-[18px] mb-0"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-inter)",
              lineHeight: 1.8,
            }}
          >
            What I&apos;m working toward has more in common with a da Vinci notebook than a modern
            career path. I&apos;m not interested in building a brand. I&apos;m interested in leaving a
            record — of what it looked like to take ideas seriously, in as many forms as
            possible, for as long as I have.
          </p>
        </SectionReveal>

        {/* Divider */}
        <div
          className="my-12"
          style={{
            borderTop: "1px solid var(--color-border)",
          }}
        />

        {/* Domain rows */}
        <SectionReveal delay={0.2}>
          <div className="flex flex-col gap-4">
            {domains.map((d) => (
              <p key={d.name} className="text-[14px] m-0" style={{ fontFamily: "var(--font-inter)" }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {d.name}
                </span>
                <span style={{ color: "var(--color-text-primary)" }}> — </span>
                <span style={{ color: "var(--color-text-muted)" }}>
                  {d.description}
                </span>
              </p>
            ))}
          </div>
        </SectionReveal>
      </div>
    </PageWrapper>
  );
}
