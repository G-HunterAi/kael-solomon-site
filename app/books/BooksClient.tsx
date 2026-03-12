"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterBar from "@/components/ui/FilterBar";
import BookCard from "@/components/ui/BookCard";
import SectionReveal from "@/components/ui/SectionReveal";
import { books } from "@/data/books";

const categories = ["All", "LOGOS", "Resonance", "Framework", "Philosophy"];

const categoryMap: Record<string, string | null> = {
  All: null,
  LOGOS: "logos",
  Resonance: "resonance",
  Framework: "framework",
  Philosophy: "philosophy",
};

export default function BooksClient() {
  const [active, setActive] = useState("All");

  const universeFilter = categoryMap[active];
  const filtered = universeFilter
    ? books.filter((b) => b.universe === universeFilter)
    : books;

  return (
    <PageWrapper>
      <div className="py-[120px]">
        <SectionReveal>
          <h1
            className="text-[48px] leading-[1.2] tracking-[-0.02em] mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Books
          </h1>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <FilterBar
            categories={categories}
            active={active}
            onChange={setActive}
          />
        </SectionReveal>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p
            className="text-center text-[16px] py-16"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Nothing in this category yet.
          </p>
        )}
      </div>
    </PageWrapper>
  );
}
