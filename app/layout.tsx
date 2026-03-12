import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { playfair, inter, jetbrainsMono, geist } from "./fonts";
import SkipNav from "@/components/layout/SkipNav";
import Nav from "@/components/layout/Nav";
import MainContent from "@/components/layout/MainContent";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kael Solomon — Author & Creative Intelligence",
  description:
    "The work of one mind across every medium it can reach. Two sci-fi universes, a philosophical framework, music, and open-source tools.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kaelsolomon.com"
  ),
  openGraph: {
    title: "Kael Solomon — Author & Creative Intelligence",
    description:
      "The work of one mind across every medium it can reach. Two sci-fi universes, a philosophical framework, music, and open-source tools.",
    images: ["/og-default.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} ${geist.variable}`}
    >
      <body>
        <SkipNav />
        <Nav />
        <MainContent>{children}</MainContent>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
