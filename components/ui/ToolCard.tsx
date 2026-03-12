import type { LabTool } from "@/data/lab-tools";

interface ToolCardProps {
  tool: LabTool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div
      className="py-8 first:pt-0"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <h2
        className="text-[18px] m-0 mb-2"
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
        }}
      >
        {tool.name}
      </h2>

      <p
        className="text-[16px] m-0 mb-3"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-inter)",
          lineHeight: 1.7,
        }}
      >
        {tool.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-1 rounded-[2px]"
            style={{
              background: "var(--color-bg-subtle)",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-inter)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {tool.githubUrl && tool.githubUrl !== "#" && (
        <a
          href={tool.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="arrow-link text-[14px] no-underline transition-colors duration-150 ease-in-out"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
          }}
        >
          View on GitHub{" "}
          <span aria-hidden="true" className="arrow">
            →
          </span>
        </a>
      )}
    </div>
  );
}
