import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-6">
      <p
        className="text-[120px] leading-[1] m-0 mb-4"
        style={{
          fontFamily: "var(--font-playfair)",
          color: "var(--color-text-faint)",
        }}
      >
        404
      </p>
      <p
        className="text-[16px] m-0 mb-6"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-inter)",
        }}
      >
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-[14px] no-underline transition-colors duration-150 ease-in-out"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-inter)",
        }}
      >
        ← Back to home
      </Link>
    </div>
  );
}
