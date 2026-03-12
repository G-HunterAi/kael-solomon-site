import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch — Kael Solomon",
  description:
    "Deep dives into the LOGOS and Resonance universes, the REPROGRAM framework, and behind-the-work content.",
};

export default function WatchPage() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        padding: "120px 24px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "32px",
          color: "var(--color-text-primary)",
          letterSpacing: "-0.02em",
          margin: 0,
          marginBottom: "16px",
        }}
      >
        Coming soon.
      </p>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "16px",
          color: "var(--color-text-muted)",
          margin: 0,
        }}
      >
        Video content is in production.
      </p>
    </div>
  );
}
