interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: "reading" | "layout";
}

export default function PageWrapper({
  children,
  maxWidth = "layout",
}: PageWrapperProps) {
  const width = maxWidth === "reading" ? "720px" : "1200px";

  return (
    <div
      className="mx-auto px-6"
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  );
}
