import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionReveal from "@/components/ui/SectionReveal";

export const metadata: Metadata = {
  title: "Music — Kael Solomon",
  description: "Music by Kael Solomon.",
};

export default function MusicPage() {
  return (
    <PageWrapper maxWidth="reading">
      <div className="py-[120px] flex flex-col items-center justify-center min-h-[calc(100vh-60px-240px)]">
        <SectionReveal>
          <h1
            className="text-[28px] leading-[1.2] m-0 mb-3 text-center"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Music is coming.
          </h1>
          <p
            className="text-[16px] m-0 text-center"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Downtempo house, tropical house, cinematic ambient. When it&apos;s ready.
          </p>
        </SectionReveal>
      </div>
    </PageWrapper>
  );
}
