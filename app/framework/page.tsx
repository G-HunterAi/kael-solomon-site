import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionReveal from "@/components/ui/SectionReveal";
import { frameworkElements } from "@/data/framework-elements";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Framework — Kael Solomon",
  description:
    "The REPROGRAM Framework. Eight elements. Not self-help — a structural model.",
};

export default function FrameworkPage() {
  return (
    <PageWrapper maxWidth="reading">
      <div className="py-[120px]">
        {/* Hero */}
        <SectionReveal>
          <h1
            className="text-[64px] leading-[1.2] tracking-[-0.02em] m-0 mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            REPROGRAM
          </h1>
          <p
            className="text-[20px] m-0 mb-16"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Eight elements. Not self-help — a structural model.
          </p>
        </SectionReveal>

        {/* 8 Elements */}
        <div className="flex flex-col gap-12 mb-16">
          {frameworkElements.map((el) => (
            <SectionReveal key={el.order} delay={el.order * 0.05}>
              <div className="flex flex-col gap-2">
                <span
                  className="text-[48px] leading-[1] m-0"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    color: "var(--color-text-faint)",
                  }}
                >
                  {el.order}
                </span>
                <h2
                  className="text-[18px] m-0"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {el.name}
                </h2>
                <p
                  className="text-[16px] m-0"
                  style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-inter)",
                    lineHeight: 1.7,
                  }}
                >
                  {el.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Philosophy callout */}
        <SectionReveal>
          <div
            className="mb-12 p-12"
            style={{ background: "var(--color-bg-subtle)" }}
          >
            <p
              className="text-[20px] m-0 italic"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-text-primary)",
                lineHeight: 1.6,
              }}
            >
              You are not broken. There is nothing to fix. There never was.
            </p>
          </div>
        </SectionReveal>

        {/* CTAs */}
        <SectionReveal>
          <div className="flex flex-col gap-4 items-start">
            <a
              href="https://reprogram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-medium rounded-[2px] transition-all duration-150 ease-in-out cursor-pointer inline-flex items-center justify-center py-[11px] px-[23px] bg-transparent border border-[var(--color-border)] hover:border-[var(--color-text-muted)] active:bg-[var(--color-bg-subtle)] no-underline"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Explore the framework in depth{" "}
              <span aria-hidden="true" className="ml-1">→</span>
            </a>
            <Link
              href="/diagnose"
              className="text-[14px] font-medium rounded-[2px] transition-all duration-150 ease-in-out cursor-pointer inline-flex items-center justify-center py-3 px-6 border-none hover:opacity-85 active:opacity-70 no-underline"
              style={{
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-bg)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Find your entry point{" "}
              <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          </div>
        </SectionReveal>
      </div>
    </PageWrapper>
  );
}
