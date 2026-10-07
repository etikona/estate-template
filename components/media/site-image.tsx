"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image wrapper (always `fill`) that falls back to a soft tonal block
 * if a client image URL is broken, so the layout never shows a broken icon.
 */
export function SiteImage({ alt, className, ...props }: Omit<ImageProps, "fill">) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 bg-[linear-gradient(135deg,var(--surface),var(--accent))]"
      />
    );
  }

  return (
    <Image
      alt={alt}
      fill
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
