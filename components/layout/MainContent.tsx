"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps <main> and conditionally removes top padding on pages
 * where the hero section goes full-viewport behind the transparent nav.
 */

/** Routes where the hero occupies the full viewport (no top padding). */
const fullHeroRoutes = ["/"];

/** Routes with their own dark layout that handle their own top spacing. */
const darkRoutes = ["/universes", "/diagnose", "/watch"];

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullHero = fullHeroRoutes.includes(pathname);
  const isDarkRoute = darkRoutes.some((r) => pathname.startsWith(r));
  const noPadding = isFullHero || isDarkRoute;

  return (
    <main
      id="main-content"
      className={`min-h-screen ${noPadding ? "" : "pt-[56px] md:pt-[60px]"}`}
    >
      {children}
    </main>
  );
}
