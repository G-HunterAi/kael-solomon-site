"use client";

import { useState } from "react";

const TOOLS = [
  { id: "baseline-assessment",       label: "Baseline Assessment",         time: "8 min",  category: "Core",       desc: "Map your eight foundational elements." },
  { id: "daily-checkin",             label: "Daily Check-in",              time: "2 min",  category: "Core",       desc: "Where are you today." },
  { id: "quick-checkin",             label: "Quick Pulse",                 time: "1 min",  category: "Core",       desc: "Three questions. Right now." },
  { id: "energy-assessment",         label: "Energy Assessment",           time: "5 min",  category: "Signal",     desc: "Identify what activates and drains you." },
  { id: "aspiration-audit",          label: "Aspiration Audit",            time: "5 min",  category: "Signal",     desc: "What do you actually want." },
  { id: "temperature-check",         label: "Temperature Check",           time: "2 min",  category: "Signal",     desc: "Twelve readings. One honest picture." },
  { id: "career-family-assessment",  label: "Career Family",               time: "10 min", category: "Direction",  desc: "Find your natural professional terrain." },
  { id: "flux-state-assessment",     label: "Flux State",                  time: "2 min",  category: "Direction",  desc: "Where you are in the transition cycle." },
  { id: "gap-analysis",              label: "Gap Analysis",                time: "5 min",  category: "Direction",  desc: "The distance between here and there." },
  { id: "decision-capture",          label: "Decision Capture",            time: "5 min",  category: "Decision",   desc: "Structure the choice in front of you." },
  { id: "decision-domain-router",    label: "Decision Domain Router",      time: "3 min",  category: "Decision",   desc: "Route your decision to the right frame." },
  { id: "peer-mirror",               label: "Peer Mirror",                 time: "5 min",  category: "Wellbeing",  desc: "How do you compare to your cohort." },
  { id: "hrv-pipeline",              label: "HRV Pipeline",                time: "3 min",  category: "Wellbeing",  desc: "Self-report physiological balance." },
  { id: "adaptive-rdte-assessment",  label: "Adaptive RDTE",               time: "15 min", category: "Deep",       desc: "The full reverse decision tree assessment." },
  { id: "ai-displacement-monitor",  label: "AI Displacement Monitor",     time: "3 min",  category: "Signal",     desc: "Assess your career resilience to AI." },
  { id: "decision-profile",         label: "Decision Profile",            time: "5 min",  category: "Decision",   desc: "Understand your decision-making style." },
  { id: "experiment-tracker",       label: "Experiment Tracker",          time: "5 min",  category: "Direction",  desc: "Log micro-experiments to test career hypotheses." },
  { id: "fix-vs-leave",             label: "Fix vs Leave",                time: "5 min",  category: "Decision",   desc: "Should you fix or should you go." },
  { id: "parent-profile",           label: "Parent Profile",              time: "10 min", category: "Deep",       desc: "Understand your energy patterns as a parent." },
];

const CATEGORIES = ["All", "Core", "Signal", "Direction", "Decision", "Wellbeing", "Deep"];

const CATEGORY_COLORS: Record<string, string> = {
  Core:      "rgba(100,160,255,0.15)",
  Signal:    "rgba(100,220,180,0.12)",
  Direction: "rgba(180,130,255,0.12)",
  Decision:  "rgba(255,180,80,0.10)",
  Wellbeing: "rgba(255,120,120,0.10)",
  Deep:      "rgba(100,160,255,0.20)",
};

const RDTE_URL = "https://rdte-two.vercel.app";

export default function MapClient() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("All");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tag: "ks-map" }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "All" ? TOOLS : TOOLS.filter(t => t.category === filter);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080810",
      color: "#E8E8F0",
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── HERO ── */}
      <section style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "120px 32px 80px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: 11,
          letterSpacing: "0.25em",
          color: "rgba(100,160,255,0.6)",
          marginBottom: 28,
          textTransform: "uppercase",
        }}>
          Kael Solomon
        </p>

        <h1 style={{
          fontSize: "clamp(42px, 7vw, 72px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1.08,
          margin: "0 0 28px",
          background: "linear-gradient(135deg, #FFFFFF 0%, rgba(100,160,255,0.9) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Map of Me
        </h1>

        <p style={{
          fontSize: "clamp(17px, 2.5vw, 21px)",
          color: "rgba(220,220,240,0.65)",
          fontWeight: 300,
          lineHeight: 1.6,
          maxWidth: 520,
          margin: "0 auto 48px",
          fontStyle: "italic",
        }}>
          The most uncharted territory is the one you carry.
        </p>

        {/* Email gate */}
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: "0 auto" }}>
            <p style={{
              fontSize: 14,
              color: "rgba(200,200,220,0.5)",
              marginBottom: 20,
              lineHeight: 1.6,
            }}>
              Enter your email to access all 24 tools — free, no account required.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(100,160,255,0.2)",
                  borderRadius: 8,
                  color: "#E8E8F0",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, rgba(100,160,255,0.9), rgba(80,100,255,0.9))",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: loading ? "wait" : "pointer",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                }}
              >
                {loading ? "..." : "Begin your map"}
              </button>
            </div>
            {error && (
              <p style={{ color: "rgba(255,100,100,0.8)", fontSize: 13, marginTop: 10 }}>{error}</p>
            )}
          </form>
        ) : (
          <div style={{
            background: "rgba(100,160,255,0.08)",
            border: "1px solid rgba(100,160,255,0.2)",
            borderRadius: 12,
            padding: "28px 32px",
            maxWidth: 420,
            margin: "0 auto",
          }}>
            <p style={{ fontSize: 16, fontWeight: 400, marginBottom: 8 }}>You&apos;re in.</p>
            <p style={{ fontSize: 14, color: "rgba(200,200,220,0.55)", lineHeight: 1.6 }}>
              Choose a tool below and begin. There&apos;s no right order — start with what&apos;s pulling your attention.
            </p>
          </div>
        )}
      </section>

      {/* ── TOOLS GRID ── */}
      {submitted && (
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 32px 120px" }}>

          {/* Filter bar */}
          <div style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 48,
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 100,
                  border: filter === cat
                    ? "1px solid rgba(100,160,255,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: filter === cat
                    ? "rgba(100,160,255,0.12)"
                    : "transparent",
                  color: filter === cat
                    ? "rgba(180,210,255,0.9)"
                    : "rgba(200,200,220,0.4)",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tool cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {filtered.map(tool => (
              <a
                key={tool.id}
                href={`/map/${tool.id}`}
                style={{
                  display: "block",
                  padding: "24px 24px 20px",
                  background: CATEGORY_COLORS[tool.category] ?? "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(100,160,255,0.3)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: "rgba(100,160,255,0.5)",
                    textTransform: "uppercase",
                  }}>
                    {tool.category}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: "rgba(200,200,220,0.3)",
                  }}>
                    {tool.time}
                  </span>
                </div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginBottom: 8,
                  color: "rgba(230,230,245,0.9)",
                }}>
                  {tool.label}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: "rgba(180,180,200,0.5)",
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {tool.desc}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── FOOTER NOTE ── */}
      <footer style={{
        textAlign: "center",
        padding: "0 0 48px",
        color: "rgba(150,150,170,0.3)",
        fontSize: 12,
        letterSpacing: "0.05em",
      }}>
        Part of the Kael Solomon universe &mdash;{" "}
        <a href="/" style={{ color: "rgba(100,160,255,0.4)", textDecoration: "none" }}>
          kaelsolomon.com
        </a>
      </footer>
    </main>
  );
}
