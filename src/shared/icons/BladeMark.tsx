import { type SVGProps } from "react";

/**
 * Abstract blade-mark used as the brand's logo glyph.
 * A single angled stroke evokes a knife edge without illustrating a literal knife.
 */
export function BladeMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 22L24 4h4v4L10 28H4v-6z"
        fill="currentColor"
      />
      <path d="M4 22L24 4" stroke="hsl(var(--background))" strokeWidth="1.2" />
    </svg>
  );
}
