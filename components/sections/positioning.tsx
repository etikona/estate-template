"use client";

import { useRef } from "react";
import { site } from "@/site.config";
import type { Stat } from "@/lib/types";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { RevealText } from "@/components/motion/reveal-text";
import { TextLink } from "@/components/ui/text-link";

const format = (stat: Stat, value: number) => {
  const n = Math.round(value);
  const body = stat.pad ? String(n).padStart(stat.pad, "0") : n.toLocaleString("en-US");
  return `${stat.prefix ?? ""}${body}${stat.suffix ?? ""}`;
};

export function Positioning() {
  const { positioning } = site;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((el, i) => {
          const stat = positioning.stats[i];
          if (!stat) return;
          const counter = { v: 0 };
          el.textContent = format(stat, 0);
          gsap.to(counter, {
            v: stat.value,
            duration: 2.4,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = format(stat, counter.v);
            },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        gsap.from("[data-stat-cell]", {
          opacity: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-stats]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="py-28 md:py-44">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <RevealText as="h2" text={positioning.statement} className="display-lg text-balance lg:col-span-8" />
        <div className="lg:col-span-4 lg:pt-4">
          <p className="max-w-sm text-base leading-relaxed text-muted">{positioning.paragraph}</p>
          {positioning.cta ? (
            <TextLink href={positioning.cta.href} className="mt-8">
              {positioning.cta.label}
            </TextLink>
          ) : null}
        </div>
      </div>

      <div data-stats className="container-x mt-24 grid grid-cols-2 gap-x-8 gap-y-14 border-t pt-12 md:mt-32 md:grid-cols-4">
        {positioning.stats.map((stat) => (
          <div key={stat.label} data-stat-cell>
            <p data-stat className="font-serif text-[clamp(3.25rem,6.5vw,6rem)] leading-none tracking-tight tabular-nums">
              {format(stat, stat.value)}
            </p>
            <p className="mt-3 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
