import { type SVGProps } from "react";

/**
 * Simple hand-drawn-style knife silhouette (handle, bolster, blade tapering
 * to a point) — original line art, not traced from any reference photo.
 * Used as the configurator's "nothing selected yet" placeholder.
 */
export function KnifeOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 140" fill="none" aria-hidden="true" {...props}>
      <path
        d="M30 40 H140 L146 58 L172 46 L368 68 L172 90 L146 80 L140 98 H30 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
