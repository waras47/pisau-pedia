"use client";

import { useState } from "react";

interface Props {
  title: string;
  discountPercent: number;
  imageUrl?: string;
}

export function PromoImage({ title, discountPercent, imageUrl }: Props) {
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    return (
      <div className="shrink-0">
        <img
          src={imageUrl}
          alt={title}
          onError={() => setFailed(true)}
          className="h-auto max-h-[350px] w-auto"
        />
      </div>
    );
  }

  return (
    <div className="flex h-[300px] w-[300px] shrink-0 items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5 lg:h-[350px] lg:w-[350px]">
      <div className="text-center">
        <p className="text-lg font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        <p className="mt-2 text-6xl font-black leading-none text-accent sm:text-7xl lg:text-8xl">
          {discountPercent}%
        </p>
        <p className="mt-1 text-xl font-bold uppercase tracking-wider text-foreground sm:text-2xl">
          OFF
        </p>
      </div>
    </div>
  );
}
