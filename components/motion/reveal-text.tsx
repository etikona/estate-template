"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  stagger?: number;
};

/** Words rise out of a mask when the heading scrolls into view (once). */
export function RevealText({ text, as = "h2", className, stagger = 0.045 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as React.ElementType;
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-word]", {
          yPercent: 115,
          duration: 1.2,
          ease: "power4.out",
          stagger,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span aria-hidden className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em]">
            <span data-word className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
