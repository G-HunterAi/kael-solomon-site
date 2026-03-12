"use client";

import { useState, FormEvent } from "react";
import Button from "./Button";

type FormState = "idle" | "loading" | "success" | "error";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [hasEmptyError, setHasEmptyError] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasEmptyError(false);

    if (!email.trim()) {
      setHasEmptyError(true);
      return;
    }

    if (!emailRegex.test(email)) {
      setState("error");
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <p
        className="text-[18px]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        You&apos;re in.
      </p>
    );
  }

  const showError = state === "error";
  const borderColor = hasEmptyError || showError
    ? "var(--color-error)"
    : "var(--color-border)";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[400px]">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          aria-label="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setHasEmptyError(false);
            if (state === "error") setState("idle");
          }}
          placeholder="your@email.com"
          disabled={state === "loading"}
          className="flex-1 px-4 py-3 text-[14px] bg-transparent rounded-[2px] transition-colors duration-150 ease-in-out"
          style={{
            border: `1px solid ${borderColor}`,
            fontFamily: "var(--font-inter)",
            color: "var(--color-text-primary)",
          }}
          onFocus={(e) => {
            if (!hasEmptyError && !showError) {
              e.target.style.borderColor = "var(--color-text-primary)";
            }
          }}
          onBlur={(e) => {
            if (!hasEmptyError && !showError) {
              e.target.style.borderColor = "var(--color-border)";
            }
          }}
        />
        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "..." : "Submit"}
        </Button>
      </div>
      {showError && (
        <p
          className="text-[13px] m-0"
          style={{
            color: "var(--color-error)",
            fontFamily: "var(--font-inter)",
          }}
        >
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
