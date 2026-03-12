import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionReveal from "@/components/ui/SectionReveal";
import ToolCard from "@/components/ui/ToolCard";
import { labTools } from "@/data/lab-tools";

export const metadata: Metadata = {
  title: "Lab — Kael Solomon",
  description:
    "Open source tools built to support this work. Free, MIT licensed, built on Claude.",
};

export default function LabPage() {
  return (
    <PageWrapper maxWidth="reading">
      <div className="py-[120px]">
        <SectionReveal>
          <h1
            className="text-[48px] leading-[1.2] tracking-[-0.02em] m-0 mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Lab
          </h1>

          {/* TODO: Replace with Lab intro from G (2 sentences, Kael's voice) */}
          <p
            className="text-[18px] mb-12"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-inter)",
              lineHeight: 1.7,
            }}
          >
            Tools built to support the work — and released because someone else might need them too.
            Everything here is free, open source, and built on Claude.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div>
            {labTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <p
            className="text-[13px] mt-8"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "var(--font-inter)",
            }}
          >
            All tools are MIT licensed. Built on Claude.
          </p>
        </SectionReveal>
      </div>
    </PageWrapper>
  );
}
