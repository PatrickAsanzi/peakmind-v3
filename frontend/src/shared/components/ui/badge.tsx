import { forwardRef } from "react";
import { cn } from "@/shared/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "accent";
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700",
  secondary:
    "inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700",
  accent:
    "inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants[variant], className)}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";

export { Badge };
