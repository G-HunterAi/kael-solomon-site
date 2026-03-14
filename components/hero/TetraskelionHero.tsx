"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamic import — no SSR for Three.js canvas
const TetraskelionCanvas = dynamic(() => import("./TetraskelionCanvas"), {
  ssr: false,
});

export default function TetraskelionHero() {
  const [headlineVisible, setHeadlineVisible] = useState(false);

  const handleHeadlineReady = useCallback(() => {
    setHeadlineVisible(true);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "100vh",
        backgroundColor: "var(--color-hero-bg)",
      }}
    >
      {/* Three.js Canvas */}
      <TetraskelionCanvas onHeadlineReady={handleHeadlineReady} />

      {/* TETRASKELION label — always visible at 0.5 opacity */}
      <div
        className="absolute top-[80px] left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{
          color: "var(--color-hero-label)",
          fontSize: "10px",
          letterSpacing: "7px",
          textTransform: "uppercase",
          opacity: 0.5,
          fontFamily: "var(--font-playfair)", // Cinzel not loaded; Playfair is close
          fontWeight: 400,
        }}
      >
        Tetraskelion
      </div>

      {/* Headline — fades in at t=11s */}
      <h1
        className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none select-none w-[90%] max-w-[900px]"
        style={{
          bottom: "14%",
          fontFamily: "var(--font-playfair)",
          color: "var(--color-hero-text)",
          fontSize: "clamp(16px, 2.2vw, 38px)",
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          textShadow: "0 2px 40px rgba(0, 0, 0, 0.8)",
          opacity: headlineVisible ? 0.88 : 0,
          transition: "opacity 2.5s ease",
        }}
      >
        Genius isn&apos;t what you were born with.
        <br />
        It&apos;s what you build.
      </h1>

      {/* Scroll indicator — fades in with headline */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          opacity: headlineVisible ? 0.5 : 0,
          transition: "opacity 2s ease",
        }}
        aria-hidden={!headlineVisible}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="var(--color-hero-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4,7 10,13 16,7" />
        </svg>
      </div>

      {/* Dark-to-light gradient at bottom edge */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "200px",
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg))",
        }}
      />
    </section>
  );
}
