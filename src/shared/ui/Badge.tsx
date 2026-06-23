import { type HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

type BadgeVariant = "copper" | "neutral" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  copper: "bg-copper text-copper-foreground",
  neutral: "bg-foreground text-background",
  outline: "border border-border text-muted-foreground",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11px] font-medium uppercase tracking-widest2",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
