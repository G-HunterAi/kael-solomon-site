import type { Book } from "@/data/books";

interface BookCardProps {
  book: Book;
  /** Render on dark universe background */
  dark?: boolean;
  /** Highlight color for dark mode status labels */
  highlightColor?: string;
}

export default function BookCard({
  book,
  dark = false,
  highlightColor,
}: BookCardProps) {
  const statusLabel =
    book.status === "available"
      ? "Available"
      : book.status === "in-progress"
      ? "In progress"
      : "Coming soon";

  // Color tokens switch between light editorial and dark universe
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "var(--color-border)";
  const bgSubtle = dark ? "rgba(255,255,255,0.04)" : "var(--color-bg-subtle)";
  const textPrimary = dark ? "var(--color-hero-text)" : "var(--color-text-primary)";
  const textMuted = dark ? "var(--color-hero-muted)" : "var(--color-text-muted)";
  const textFaint = dark
    ? (highlightColor || "rgba(255,255,255,0.45)")
    : "var(--color-text-faint)";

  return (
    <div
      className="rounded-[2px] transition-shadow duration-200 ease-in-out cursor-pointer"
      style={{
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* Cover placeholder — always 2:3 */}
      {book.coverImage ? (
        <div style={{ aspectRatio: "2/3", position: "relative" }}>
          <div
            role="img"
            aria-label={`${book.title} cover`}
            className="w-full h-full"
            style={{
              aspectRatio: "2/3",
              background: bgSubtle,
            }}
          />
        </div>
      ) : (
        <div
          role="img"
          aria-label={`${book.title} — cover coming soon`}
          className="w-full flex items-center justify-center"
          style={{
            aspectRatio: "2/3",
            background: bgSubtle,
          }}
        >
          <span
            className="text-[11px] text-center px-3"
            style={{
              color: textMuted,
              fontFamily: "var(--font-inter)",
            }}
          >
            {book.title}
          </span>
        </div>
      )}

      {/* Card info */}
      <div className="p-4">
        <h2
          className="text-[16px] leading-[1.2] m-0 mb-1"
          style={{
            fontFamily: "var(--font-playfair)",
            color: textPrimary,
          }}
        >
          {book.title}
        </h2>
        {book.tagline && (
          <p
            className="text-[13px] m-0 mb-2"
            style={{
              color: textMuted,
              fontFamily: "var(--font-inter)",
            }}
          >
            {book.tagline}
          </p>
        )}
        <p
          className="text-[11px] uppercase m-0"
          style={{
            color: textFaint,
            fontFamily: "var(--font-inter)",
            letterSpacing: "0.08em",
          }}
        >
          {statusLabel}
        </p>
      </div>
    </div>
  );
}
