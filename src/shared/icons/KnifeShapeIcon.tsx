import { type SVGProps } from "react";

export type KnifeShapeId = "gyuto" | "santoku" | "bunka" | "nakiri" | "petty";

// Original flat silhouettes for each blade shape (handle + blade, side
// profile) — hand-authored, not traced from any product photo or reference
// site. Differentiated mainly by the blade tip: gyuto tapers to a fine
// point, santoku is blunt/rounded, bunka has an angular reverse-tanto tip,
// nakiri is a square-ended rectangle, petty is a short gyuto-like blade.
const SHAPE_PATHS: Record<KnifeShapeId, string> = {
  gyuto: "M30 40 H140 L146 58 L172 46 L368 68 L172 90 L146 80 L140 98 H30 Z",
  santoku:
    "M30 40 H140 L146 58 L172 46 L330 60 Q345 64 340 78 L172 90 L146 80 L140 98 H30 Z",
  bunka:
    "M30 40 H140 L146 58 L172 46 L320 55 L360 62 L320 85 L172 90 L146 80 L140 98 H30 Z",
  nakiri: "M30 40 H140 L146 58 L172 46 H360 V88 H172 L146 80 L140 98 H30 Z",
  petty: "M30 40 H100 L106 58 L130 46 L230 65 L130 90 L106 80 L100 98 H30 Z",
};

export function KnifeShapeIcon({
  shape,
  ...props
}: { shape: KnifeShapeId } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 140" fill="currentColor" aria-hidden="true" {...props}>
      <path d={SHAPE_PATHS[shape]} />
    </svg>
  );
}
