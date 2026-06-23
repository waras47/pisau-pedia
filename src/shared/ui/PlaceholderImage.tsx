import { type HTMLAttributes } from "react";

import { BladeMark } from "@/shared/icons";
import { cn } from "@/shared/lib/utils";

interface PlaceholderImageProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  ratio?: "square" | "portrait" | "landscape" | "wide";
}

const ratioClasses: Record<NonNullable<PlaceholderImageProps["ratio"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/7]",
};

/**
 * Stand-in for real photography. This is a slicing-only build (no CMS / API
 * wired up yet), so every image slot renders this instead of a hotlinked or
 * copyrighted photo. Swap with <Image> once real assets are available.
 */
export function PlaceholderImage({
  label,
  ratio = "square",
  className,
  ...props
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden",
        "bg-[linear-gradient(135deg,hsl(var(--muted))_0%,hsl(var(--surface))_60%,hsl(var(--muted))_100%)]",
        ratioClasses[ratio],
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, hsl(var(--foreground)) 0px, hsl(var(--foreground)) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 text-muted-foreground">
        <BladeMark className="h-7 w-7 opacity-30" />
        {label ? (
          <span className="px-4 text-center text-xs uppercase tracking-widest2 opacity-60">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
