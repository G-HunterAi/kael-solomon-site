import type { Metadata } from "next";
import EmailCapture from "@/components/ui/EmailCapture";

export const metadata: Metadata = {
  title: "Connect — Kael Solomon",
  description: "Stay close to the work.",
};

export default function ConnectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-6">
      <div className="text-center max-w-[480px]">
        <h1
          className="text-[48px] leading-[1.2] tracking-[-0.02em] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Stay close to the work.
        </h1>
        <p
          className="text-[16px] mb-8"
          style={{
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-inter)",
          }}
        >
          New releases, ideas, and things worth sharing. No noise.
        </p>
        <div className="flex justify-center">
          <EmailCapture />
        </div>
      </div>
    </div>
  );
}
