import { type SVGProps, useId } from "react";

import { type KnifeShapeId } from "./KnifeShapeIcon";

// Same viewBox/geometry as KnifeShapeIcon and KnifeOutline — each shape
// there is one continuous path (handle rectangle + bolster + blade). Split
// here into a handle piece and a blade+bolster piece along the exact same
// vertices so the two halves still line up into one seamless silhouette,
// but can be filled in different colors (handle material vs. steel).
const HANDLE_PATHS: Record<KnifeShapeId, string> = {
  gyuto: "M30 40 H140 V98 H30 Z",
  santoku: "M30 40 H140 V98 H30 Z",
  bunka: "M30 40 H140 V98 H30 Z",
  nakiri: "M30 40 H140 V98 H30 Z",
  petty: "M30 40 H100 V98 H30 Z",
};

const BLADE_PATHS: Record<KnifeShapeId, string> = {
  gyuto: "M140 40 L146 58 L172 46 L368 68 L172 90 L146 80 L140 98 Z",
  santoku: "M140 40 L146 58 L172 46 L330 60 Q345 64 340 78 L172 90 L146 80 L140 98 Z",
  bunka: "M140 40 L146 58 L172 46 L320 55 L360 62 L320 85 L172 90 L146 80 L140 98 Z",
  nakiri: "M140 40 L146 58 L172 46 H360 V88 H172 L146 80 L140 98 Z",
  petty: "M100 40 L106 58 L130 46 L230 65 L130 90 L106 80 L100 98 Z",
};

interface KnifePreviewProps extends SVGProps<SVGSVGElement> {
  shape: KnifeShapeId;
  // Hex color for the handle fill — pass the selected handle's material
  // color, or omit for an unselected/neutral look.
  handleColor?: string;
}

// Original composite illustration (blade silhouette + handle, one
// connected shape) — hand-authored, not traced from any product photo or
// reference site. Built for the configurator's sticky preview so the
// blade/handle always visually connect regardless of which real photos
// are selected below (those are independently-shot product photos with
// mismatched backgrounds/lighting, so they can't be blended together).
export function KnifePreview({ shape, handleColor = "#C9C2B4", ...props }: KnifePreviewProps) {
  const gradientId = useId();

  return (
    <svg viewBox="0 0 400 140" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E7EB" />
          <stop offset="55%" stopColor="#C7CBD1" />
          <stop offset="100%" stopColor="#AEB3BA" />
        </linearGradient>
      </defs>
      <path
        d={BLADE_PATHS[shape]}
        fill={`url(#${gradientId})`}
        stroke="#8B8F96"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d={HANDLE_PATHS[shape]}
        fill={handleColor}
        stroke="#00000022"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
