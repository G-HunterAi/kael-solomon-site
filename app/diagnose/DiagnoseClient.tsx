"use client";

import { useState, FormEvent } from "react";
import SectionReveal from "@/components/ui/SectionReveal";

const TOOLS = [
  {
    num: "01",
    icon: "⏸",
    title: "Flux State Assessment",
    desc: "30 questions · 6 min — Identifies where you are right now: Stalled, Forced, Seeking, Pivoting, Scaling, or Disrupted.",
    color: "#1B3A5C",
  },
  {
    num: "02",
    icon: "⚡",
    title: "Energy Sort",
    desc: "33 items · 7 min — Maps what fuels and drains you across 7 energy dimensions plus a Flow Signature.",
    color: "#276749",
  },
  {
    num: "03",
    icon: "🧬",
    title: "Career Family Finder",
    desc: "36 questions · 8 min — Ranks 8 career families by cognitive strengths, personality, and values. Primary + secondary blend.",
    color: "#A23B72",
  },
  {
    num: "04",
    icon: "🔍",
    title: "Fix vs. Leave",
    desc: "4 levels · 5 min — Pinpoints whether dissatisfaction lives at the Role, Manager, Company, or Career Field level.",
    color: "#C8553D",
  },
  {
    num: "05",
    icon: "📊",
    title: "Gap Analysis",
    desc: "Interactive · 10 min — Identifies and scores every gap between you and your target, including AI displacement risk.",
    color: "#975A16",
  },
  {
    num: "06",
    icon: "🗺",
    title: "Path Sequencing",
    desc: "Interactive · 5 min — Generates a 3-horizon plan: Immediate, Bridge, and Destination, with kill criteria.",
    color: "#2E86AB",
  },
  {
    num: "07",
    icon: "📋",
    title: "Decision Profile",
    desc: "Synthesis · 3 min — Cross-references all instruments into one unified career intelligence dashboard.",
    color: "#0F2A44",
  },
];

const FAMILIES = [
  { name: "Builder", color: "#E07A5F" },
  { name: "Strategist", color: "#1B3A5C" },
  { name: "Explorer", color: "#2E86AB" },
  { name: "Optimizer", color: "#5B8C5A" },
  { name: "Teacher", color: "#D4A843" },
  { name: "Connector", color: "#A23B72" },
  { name: "Guardian", color: "#718096" },
  { name: "Healer", color: "#38A169" },
];

export default function DiagnoseClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), tag: "ks-diagnose" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  return (
    <div>
      {/* ─── HERO ─── */}
      <section
        className="py-[120px] px-6"
        style={{ backgroundColor: "var(--color-hero-bg)" }}
      >
        <div className="mx-auto max-w-[680px]">
          <SectionReveal>
            <p
              className="text-[10px] uppercase tracking-[0.25em] m-0 mb-5"
              style={{
                color: "var(--color-hero-label)",
                fontFamily: "var(--font-inter)",
                opacity: 0.5,
              }}
            >
              Reverse Decision Tree Engine
            </p>
            <h1
              className="text-[48px] leading-[1.2] tracking-[-0.02em] m-0 mb-6"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-hero-text)",
              }}
            >
              Find your entry point.
            </h1>
            <p
              className="text-[20px] m-0 mb-10"
              style={{
                fontFamily: "var(--font-inter)",
                color: "var(--color-hero-muted)",
                lineHeight: 1.7,
              }}
            >
              Career decisions are the most consequential choices you make on
              the least data. The RDTE replaces guessing with a diagnostic
              system — seven instruments, one unified profile.
            </p>
          </SectionReveal>

          {/* ─── Email gate ─── */}
          <SectionReveal delay={0.1}>
            <div
              className="rounded-[2px] p-8"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {status === "success" ? (
                <div>
                  <p
                    className="text-[18px] m-0 mb-3"
                    style={{
                      color: "var(--color-hero-text)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    You&apos;re in.
                  </p>
                  <p
                    className="text-[15px] m-0 mb-6"
                    style={{
                      color: "var(--color-hero-muted)",
                      fontFamily: "var(--font-inter)",
                      lineHeight: 1.7,
                    }}
                  >
                    The diagnostic is being prepared. You&apos;ll receive
                    access at the email you provided.
                  </p>
                  {/* TODO: Replace href with hosted RDTE instance URL */}
                  <a
                    href="https://rdte-two.vercel.app"
                    className="text-[14px] font-medium rounded-[2px] transition-all duration-150 ease-in-out cursor-pointer inline-flex items-center justify-center py-3 px-6 border-none hover:opacity-85 active:opacity-70 no-underline"
                    style={{
                      backgroundColor: "var(--color-hero-text)",
                      color: "var(--color-hero-bg)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    Launch the diagnostic{" "}
                    <span aria-hidden="true" className="ml-1">
                      →
                    </span>
                  </a>
                </div>
              ) : (
                <div>
                  <p
                    className="text-[15px] m-0 mb-5"
                    style={{
                      color: "var(--color-hero-muted)",
                      fontFamily: "var(--font-inter)",
                      lineHeight: 1.7,
                    }}
                  >
                    Enter your email to access the diagnostic. Results are
                    displayed on screen and optionally emailed.
                  </p>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 text-[14px] py-3 px-4 rounded-[2px] border-none outline-none"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "var(--color-hero-text)",
                        fontFamily: "var(--font-inter)",
                      }}
                      aria-label="Email address"
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="text-[14px] font-medium rounded-[2px] transition-all duration-150 ease-in-out cursor-pointer inline-flex items-center justify-center py-3 px-6 border-none hover:opacity-85 active:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "var(--color-hero-text)",
                        color: "var(--color-hero-bg)",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {status === "submitting"
                        ? "Submitting..."
                        : "Take the diagnostic →"}
                    </button>
                  </form>
                  {status === "error" && (
                    <p
                      className="text-[13px] mt-3 m-0"
                      style={{
                        color: "var(--color-error)",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {errorMsg}
                    </p>
                  )}
                </div>
              )}
            </div>
          </SectionReveal>

          {/* Stats */}
          <SectionReveal delay={0.15}>
            <div className="flex gap-8 mt-10">
              {[
                { num: "7", label: "Instruments" },
                { num: "~40", label: "Minutes" },
                { num: "8", label: "Career Families" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p
                    className="text-[28px] font-bold m-0"
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: "var(--color-hero-text)",
                    }}
                  >
                    {s.num}
                  </p>
                  <p
                    className="text-[11px] uppercase tracking-[0.08em] m-0"
                    style={{
                      fontFamily: "var(--font-inter)",
                      color: "var(--color-hero-muted)",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── PIPELINE ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FAFAF8" }}>
        <div className="mx-auto max-w-[680px]">
          <SectionReveal>
            <h2
              className="text-[36px] leading-[1.2] tracking-[-0.02em] m-0 mb-4"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-text-primary)",
              }}
            >
              The Assessment Pipeline
            </h2>
            <p
              className="text-[17px] m-0 mb-12"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.7,
              }}
            >
              Seven instruments. One unified profile. Each builds on the last.
            </p>
          </SectionReveal>

          <div className="flex flex-col gap-0">
            {TOOLS.map((tool, i) => (
              <SectionReveal key={tool.num} delay={0.05 * i}>
                <div
                  className="py-6"
                  style={{
                    borderBottom:
                      i < TOOLS.length - 1
                        ? "1px solid var(--color-border)"
                        : "none",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="text-[20px] flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-[8px]"
                      style={{
                        backgroundColor: `${tool.color}12`,
                      }}
                    >
                      {tool.icon}
                    </span>
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-[0.1em] m-0 mb-1"
                        style={{
                          color: "var(--color-text-faint)",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {tool.num}
                      </p>
                      <h3
                        className="text-[18px] font-semibold m-0 mb-2"
                        style={{
                          color: tool.color,
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {tool.title}
                      </h3>
                      <p
                        className="text-[15px] m-0"
                        style={{
                          color: "var(--color-text-muted)",
                          fontFamily: "var(--font-inter)",
                          lineHeight: 1.7,
                        }}
                      >
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8 FAMILIES ─── */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: "var(--color-hero-bg)" }}
      >
        <div className="mx-auto max-w-[680px]">
          <SectionReveal>
            <h2
              className="text-[36px] leading-[1.2] tracking-[-0.02em] m-0 mb-4"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-hero-text)",
              }}
            >
              The 8 Career Families
            </h2>
            <p
              className="text-[17px] m-0 mb-10"
              style={{
                color: "var(--color-hero-muted)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.7,
              }}
            >
              Everyone belongs to one primary family and one secondary. Your
              blend is your career DNA.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FAMILIES.map((f) => (
                <div
                  key={f.name}
                  className="rounded-[2px] py-4 px-3 text-center"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    className="text-[15px] font-semibold m-0"
                    style={{
                      color: f.color,
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {f.name}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section
        className="py-20 px-6 text-center"
        style={{ backgroundColor: "#FAFAF8" }}
      >
        <div className="mx-auto max-w-[480px]">
          <SectionReveal>
            <h2
              className="text-[32px] leading-[1.2] tracking-[-0.02em] m-0 mb-4"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-text-primary)",
              }}
            >
              40 minutes. A career&apos;s worth of clarity.
            </h2>
            <p
              className="text-[15px] m-0 mb-8"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Free. No account required. Your data stays in your browser.
            </p>
            <a
              href="https://rdte-two.vercel.app"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-[14px] font-medium rounded-[2px] transition-all duration-150 ease-in-out cursor-pointer inline-flex items-center justify-center py-3 px-6 border-none hover:opacity-85 active:opacity-70 no-underline"
              style={{
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-bg)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Begin the assessment{" "}
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </a>
          </SectionReveal>
        </div>
      </section>

      <p
        className="text-[13px] text-center py-6 m-0"
        style={{
          color: "var(--color-text-faint)",
          fontFamily: "var(--font-inter)",
          backgroundColor: "#FAFAF8",
        }}
      >
        The Reverse Decision Tree Engine (RDTE) — 6 dimensions, 8 Career
        Families.
      </p>
    </div>
  );
}
