import type { Metadata } from "next";
import BooksClient from "./BooksClient";

export const metadata: Metadata = {
  title: "Books — Kael Solomon",
  description:
    "All books by Kael Solomon — the LOGOS series, the Resonance series, and standalone works.",
};

export default function BooksPage() {
  return <BooksClient />;
}
