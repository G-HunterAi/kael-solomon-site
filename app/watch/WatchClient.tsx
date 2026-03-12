"use client";

import { useState } from "react";
import SectionReveal from "@/components/ui/SectionReveal";

interface Video {
  id: string;
  title: string;
  description: string;
  /** YouTube video ID — used to build embed URL */
  youtubeId: string;
}

interface Category {
  slug: string;
  label: string;
  videos: Video[];
}

/**
 * Placeholder video data — replace YouTube IDs with real ones.
 * Each category maps to the brief spec: LOGOS Deep Dive · Resonance Lore ·
 * Framework Explained · Behind the Work.
 */
const CATEGORIES: Category[] = [
  {
    slug: "logos",
    label: "LOGOS Deep Dive",
    videos: [
      {
        id: "logos-1",
        title: "The Collapse Wasn't Technological",
        description:
          "How fear became the dominant operating system of the LOGOS civilization.",
        youtubeId: "dQw4w9WgXcQ",
      },
      {
        id: "logos-2",
        title: "Building the World of LOGOS",
        description:
          "World-building decisions, language systems, and the architecture of an ancient civilization.",
        youtubeId: "dQw4w9WgXcQ",
      },
    ],
  },
  {
    slug: "resonance",
    label: "Resonance Lore",
    videos: [
      {
        id: "res-1",
        title: "What Is Attunement?",
        description:
          "An introduction to the first book in the Resonance series and its central question.",
        youtubeId: "dQw4w9WgXcQ",
      },
      {
        id: "res-2",
        title: "Perception Without a Manual",
        description:
          "Dimensional frequencies, consciousness engineering, and learning to live inside expanded perception.",
        youtubeId: "dQw4w9WgXcQ",
      },
    ],
  },
  {
    slug: "framework",
    label: "Framework Explained",
    videos: [
      {
        id: "fw-1",
        title: "REPROGRAM in 10 Minutes",
        description:
          "The eight elements of the REPROGRAM framework — what they are and how they connect.",
        youtubeId: "dQw4w9WgXcQ",
      },
      {
        id: "fw-2",
        title: "The RDTE Walkthrough",
        description:
          "A guided tour of the Reverse Decision Tree Engine and its seven instruments.",
        youtubeId: "dQw4w9WgXcQ",
      },
    ],
  },
  {
    slug: "behind",
    label: "Behind the Work",
    videos: [
      {
        id: "bw-1",
        title: "Why I Write Science Fiction",
        description:
          "The relationship between creative intelligence and the fiction universes.",
        youtubeId: "dQw4w9WgXcQ",
      },
      {
        id: "bw-2",
        title: "Building in Public",
        description:
          "Open source tools, the creative process, and what it means to work transparently.",
        youtubeId: "dQw4w9WgXcQ",
      },
    ],
  },
];

function LazyEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="relative w-full cursor-pointer border-none p-0 m-0 bg-black rounded-[2px] overflow-hidden"
        style={{ aspectRatio: "16 / 9" }}
        aria-label={`Play ${title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl}
          alt={title}
          className="w-full h-full object-cover opacity-70"
          loading="lazy"
        />
        {/* Play button overlay */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5V19L19 12L8 5Z" fill="white" />
            </svg>
          </span>
        </span>
      </button>
    );
  }

  return (
    <div
      className="relative w-full rounded-[2px] overflow-hidden"
      style={{ aspectRatio: "16 / 9" }}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-none"
      />
    </div>
  );
}

export default function WatchClient() {
  const [activeSlug, setActiveSlug] = useState<string>("all");

  const filtered =
    activeSlug === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.slug === activeSlug);

  return (
    <div>
      {/* ─── HERO ─── */}
      <section
        className="py-[120px] px-6"
        style={{ backgroundColor: "var(--color-hero-bg)" }}
      >
        <div className="mx-auto max-w-[800px]">
          <SectionReveal>
            <h1
              className="text-[48px] leading-[1.2] tracking-[-0.02em] m-0 mb-6"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--color-hero-text)",
              }}
            >
              Watch
            </h1>
            <p
              className="text-[18px] m-0 mb-10"
              style={{
                fontFamily: "var(--font-inter)",
                color: "var(--color-hero-muted)",
                lineHeight: 1.8,
                maxWidth: 560,
              }}
            >
              Deep dives into the universes, the framework, and the work
              behind the work. Organized by topic — start anywhere.
            </p>
          </SectionReveal>

          {/* ─── Category filter ─── */}
          <SectionReveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {[{ slug: "all", label: "All" }, ...CATEGORIES].map((cat) => {
                const isActive = activeSlug === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setActiveSlug(cat.slug)}
                    className="text-[13px] font-medium rounded-[2px] py-2 px-4 border cursor-pointer transition-all duration-150"
                    style={{
                      fontFamily: "var(--font-inter)",
                      backgroundColor: isActive
                        ? "var(--color-hero-text)"
                        : "transparent",
                      color: isActive
                        ? "var(--color-hero-bg)"
                        : "var(--color-hero-muted)",
                      borderColor: isActive
                        ? "var(--color-hero-text)"
                        : "rgba(255,255,255,0.12)",
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── VIDEO GRID ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FAFAF8" }}>
        <div className="mx-auto max-w-[800px]">
          {filtered.map((category) => (
            <div key={category.slug} className="mb-16 last:mb-0">
              <SectionReveal>
                <h2
                  className="text-[24px] leading-[1.2] tracking-[-0.01em] m-0 mb-8"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {category.label}
                </h2>
              </SectionReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {category.videos.map((video) => (
                  <SectionReveal key={video.id}>
                    <div>
                      <LazyEmbed
                        youtubeId={video.youtubeId}
                        title={video.title}
                      />
                      <h3
                        className="text-[16px] font-semibold m-0 mt-3 mb-1"
                        style={{
                          fontFamily: "var(--font-inter)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {video.title}
                      </h3>
                      <p
                        className="text-[14px] m-0"
                        style={{
                          fontFamily: "var(--font-inter)",
                          color: "var(--color-text-muted)",
                          lineHeight: 1.6,
                        }}
                      >
                        {video.description}
                      </p>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
