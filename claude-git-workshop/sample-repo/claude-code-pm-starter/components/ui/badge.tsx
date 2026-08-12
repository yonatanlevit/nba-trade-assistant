// components/ui/badge.tsx
import { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger";
};

const VARIANTS: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-ink-100 text-ink-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
};

export default function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
