"use client";

interface FilterBarProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export default function FilterBar({
  categories,
  active,
  onChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            aria-pressed={isActive}
            className="text-[14px] px-4 py-2 rounded-[2px] border-none cursor-pointer transition-colors duration-150 ease-in-out"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              background: isActive
                ? "var(--color-text-primary)"
                : "var(--color-bg-subtle)",
              color: isActive
                ? "var(--color-bg)"
                : "var(--color-text-muted)",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
