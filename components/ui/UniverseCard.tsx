import Link from "next/link";

interface UniverseCardProps {
  name: string;
  tagline: string;
  description: string;
  seriesLabel: string;
  href: string;
  accentColor: string;
  large?: boolean;
  /** Render on dark background */
  dark?: boolean;
  /** Highlight color for dark mode link */
  highlightColor?: string;
}

export default function UniverseCard({
  name,
  tagline,
  description,
  seriesLabel,
  href,
  accentColor,
  large = false,
  dark = false,
  highlightColor,
}: UniverseCardProps) {
  const nameSize = large ? "text-[48px]" : "text-[36px]";
  const borderWidth = large ? "4px" : "3px";
  const padding = large ? "48px" : "24px";

  const bgColor = dark ? "rgba(255,255,255,0.04)" : "var(--color-bg-subtle)";
  const borderColor = dark ? "rgba(255,255,255,0.08)" : "var(--color-border)";
  const textPrimary = dark ? "var(--color-hero-text)" : "var(--color-text-primary)";
  const textMuted = dark ? "var(--color-hero-muted)" : "var(--color-text-muted)";
  const linkColor = dark ? (highlightColor || "rgba(255,255,255,0.7)") : "var(--color-text-primary)";

  return (
    <div
      className="rounded-[2px] transition-shadow duration-200 ease-in-out"
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderLeft: `${borderWidth} solid ${accentColor}`,
        padding,
      }}
    >
      <h2
        className={`${nameSize} leading-[1.2] tracking-[-0.02em] m-0 mb-3`}
        style={{
          fontFamily: "var(--font-playfair)",
          color: textPrimary,
        }}
      >
        {name}
      </h2>

      <p
        className="text-[18px] m-0 mb-3"
        style={{
          color: textMuted,
          fontFamily: "var(--font-inter)",
        }}
      >
        {tagline}
      </p>

      {large && (
        <p
          className="text-[16px] m-0 mb-4"
          style={{
            color: textMuted,
            fontFamily: "var(--font-inter)",
            lineHeight: 1.7,
          }}
        >
          {description}
        </p>
      )}

      <p
        className="text-[12px] uppercase m-0 mb-4"
        style={{
          color: textMuted,
          fontFamily: "var(--font-inter)",
          letterSpacing: "0.08em",
        }}
      >
        {seriesLabel}
      </p>

      <Link
        href={href}
        className="arrow-link text-[14px] no-underline transition-colors duration-150 ease-in-out"
        style={{
          color: linkColor,
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
        }}
      >
        Enter the world{" "}
        <span aria-hidden="true" className="arrow">
          →
        </span>
      </Link>
    </div>
  );
}
