import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/shared/lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full",
          "text-foreground transition-colors duration-200 hover:bg-muted",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";
