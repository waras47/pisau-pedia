import { type HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <span className="font-accent text-base italic text-copper">{eyebrow}</span>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
