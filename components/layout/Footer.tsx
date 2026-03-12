import Link from "next/link";

const linkGroups = [
  {
    label: "Worlds",
    links: [
      { href: "/universes", label: "Universes" },
      { href: "/universes/logos", label: "LOGOS" },
      { href: "/universes/resonance", label: "Resonance" },
    ],
  },
  {
    label: "Work",
    links: [
      { href: "/books", label: "Books" },
      { href: "/music", label: "Music" },
      { href: "/framework", label: "Framework" },
      { href: "/lab", label: "Lab" },
    ],
  },
  {
    label: "More",
    links: [
      { href: "/about", label: "About" },
      { href: "/connect", label: "Connect" },
    ],
  },
  {
    label: "External",
    links: [
      {
        href: "https://reprogram.org",
        label: "reprogram.org",
        external: true,
      },
      {
        href: "https://github.com/G-HunterAi",
        label: "GitHub",
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          {/* Left column */}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="text-[16px] no-underline text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Kael Solomon
            </Link>
            <p
              className="text-[13px] m-0"
              style={{
                color: "var(--color-text-faint)",
                fontFamily: "var(--font-inter)",
              }}
            >
              The work of one mind across every medium it can reach.
            </p>
            <p
              className="text-[12px] m-0"
              style={{
                color: "var(--color-text-faint)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Kael Solomon is a pen name.
            </p>
          </div>

          {/* Right column — link groups */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-4">
            {linkGroups.map((group) => (
              <div key={group.label}>
                <p
                  className="text-[11px] uppercase m-0 mb-3"
                  style={{
                    color: "var(--color-text-faint)",
                    letterSpacing: "0.08em",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {group.label}
                </p>
                <div className="flex flex-col gap-2">
                  {group.links.map((link) => {
                    const isExternal = "external" in link && link.external;
                    return isExternal ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] no-underline transition-colors duration-150 ease-in-out"
                        style={{
                          color: "var(--color-text-muted)",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-[13px] no-underline transition-colors duration-150 ease-in-out"
                        style={{
                          color: "var(--color-text-muted)",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex flex-col md:flex-row md:justify-between gap-2">
          <p
            className="text-[12px] m-0"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "var(--font-inter)",
            }}
          >
            © 2026 Kael Solomon. All rights reserved.
          </p>
          <p
            className="text-[12px] m-0"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Built with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
