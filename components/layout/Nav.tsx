"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/universes", label: "Universes" },
  { href: "/books", label: "Books" },
  { href: "/music", label: "Music" },
  { href: "/framework", label: "Framework" },
  { href: "/lab", label: "Lab" },
  { href: "/connect", label: "Connect" },
];

/** Dark pages where the nav renders transparent with white text by default. */
const darkRoutes = ["/universes", "/diagnose", "/watch"];

interface NavProps {
  /** Force transparent (dark) mode — used by the home page hero before scroll. */
  forceDark?: boolean;
}

export default function Nav({ forceDark = false }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const pathname = usePathname();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isDarkRoute = darkRoutes.some((r) => pathname.startsWith(r));

  // On home page, observe scroll to transition from transparent → solid
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      // Transition point: 80vh (hero takes 100vh, trigger early for smooth feel)
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Determine the active visual mode
  const isDark = isDarkRoute || (isHome && !scrolledPastHero) || forceDark;

  const close = useCallback(() => {
    setIsOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  // Trap focus inside overlay
  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first && last) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last && first) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Style tokens for dark vs light nav
  const navBg = isDark
    ? "transparent"
    : "var(--color-bg)";
  const navBorder = isDark
    ? "transparent"
    : "var(--color-border)";
  const textPrimary = isDark ? "var(--color-hero-text)" : "var(--color-text-primary)";
  const textMuted = isDark ? "var(--color-hero-muted)" : "var(--color-text-muted)";
  const hamburgerColor = isDark ? "var(--color-hero-text)" : "var(--color-text-primary)";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: navBg,
        borderBottom: `1px solid ${navBorder}`,
        transition: "background-color 300ms ease, border-color 300ms ease",
        backdropFilter: isDark ? "none" : "blur(12px)",
        WebkitBackdropFilter: isDark ? "none" : "blur(12px)",
      }}
    >
      {/* Desktop + Mobile bar */}
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between h-[56px] md:h-[60px]">
        <Link
          href="/"
          className="text-[16px] md:text-[18px] no-underline transition-colors duration-300"
          style={{
            fontFamily: "var(--font-playfair)",
            color: textPrimary,
          }}
        >
          Kael Solomon
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] no-underline transition-colors duration-300 ease-in-out"
              style={{
                fontFamily: "var(--font-inter)",
                color: isActive(link.href) ? textPrimary : textMuted,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hamburger */}
        <button
          ref={hamburgerRef}
          className="md:hidden flex flex-col justify-center gap-[5px] w-[20px] h-[20px] bg-transparent border-none cursor-pointer p-0"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
        >
          <span
            className="block w-full h-[1.5px] transition-colors duration-300"
            style={{ backgroundColor: hamburgerColor }}
          />
          <span
            className="block w-full h-[1.5px] transition-colors duration-300"
            style={{ backgroundColor: hamburgerColor }}
          />
          <span
            className="block w-full h-[1.5px] transition-colors duration-300"
            style={{ backgroundColor: hamburgerColor }}
          />
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col items-center justify-center"
          style={{ animation: "slideIn 300ms ease" }}
        >
          <button
            ref={closeRef}
            onClick={close}
            className="absolute top-4 right-6 text-[24px] bg-transparent border-none cursor-pointer p-2"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-inter)",
            }}
            aria-label="Close navigation"
          >
            ×
          </button>

          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-[32px] no-underline text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
