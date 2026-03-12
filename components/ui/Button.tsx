import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "text-[14px] font-medium rounded-[2px] transition-all duration-150 ease-in-out cursor-pointer inline-flex items-center justify-center";

  const variants = {
    primary: `${base} py-3 px-6 border-none text-[var(--color-bg)] bg-[var(--color-text-primary)] hover:opacity-85 active:opacity-70`,
    ghost: `${base} py-[11px] px-[23px] bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-text-muted)] active:bg-[var(--color-bg-subtle)]`,
  };

  const disabledStyles = disabled ? "opacity-40 cursor-not-allowed" : "";

  return (
    <button
      className={`${variants[variant]} ${disabledStyles} ${className}`}
      disabled={disabled}
      style={{ fontFamily: "var(--font-inter)" }}
      {...props}
    >
      {children}
    </button>
  );
}
