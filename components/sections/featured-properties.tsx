"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/site.config";
import type { Listing } from "@/lib/types";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SiteImage } from "@/components/media/site-image";
import { RevealText } from "@/components/motion/reveal-text";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/utils";

type Props = { listings: Listing[]; total: number; onReset: () => void };

// Editorial rhythm: wide, narrow, narrow, wide, with a vertical offset on every second card
const layouts = [
  { col: "lg:col-span-7", aspect: "aspect-[4/3]", offset: "" },
  { col: "lg:col-span-5", aspect: "aspect-[4/5]", offset: "lg:mt-36" },
  { col: "lg:col-span-5", aspect: "aspect-[4/5]", offset: "" },
  { col: "lg:col-span-7", aspect: "aspect-[4/3]", offset: "lg:mt-36" },
];

export function FeaturedProperties({ listings, total, onReset }: Props) {
  const { featured } = site;
  const root = useRef<HTMLElement>(null);
  const signature = listings.map((l) => l.id).join("|");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          const frame = card.querySelector("[data-card-frame]");
          const text = card.querySelectorAll("[data-card-text]");

          // Image grows from 0.92 → 1 as the card enters the viewport
          gsap.fromTo(
            frame,
            { scale: 0.92 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 92%", end: "top 40%", scrub: 0.6 },
            },
          );
          gsap.from(text, {
            y: 26,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: card, start: "top 72%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [signature], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="properties" className="pb-28 pt-24 md:pb-44 md:pt-40">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <RevealText as="h2" text={featured.title} className="display-lg lg:col-span-7" />
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm text-base leading-relaxed text-muted">{featured.intro}</p>
            {featured.cta ? <TextLink href={featured.cta.href} className="mt-6">{featured.cta.label}</TextLink> : null}
          </div>
        </div>

        <p className="mt-14 text-sm text-muted" aria-live="polite">
          Showing {listings.length} of {total}
        </p>

        <div id="listings" className="mt-6 grid gap-x-8 gap-y-16 lg:grid-cols-12 lg:gap-x-12">
          {listings.map((listing, i) => {
            const layout = layouts[i % layouts.length];
            const specs = [
              listing.beds ? `${listing.beds} beds` : null,
              listing.baths ? `${listing.baths} baths` : null,
              listing.area ?? null,
            ].filter(Boolean) as string[];

            return (
              <article key={listing.id} data-card className={cn(layout.col, layout.offset)}>
                <a
                  href={listing.href ?? "#contact"}
                  className="group block outline-offset-8"
                  aria-label={`${listing.title}, ${listing.location}, ${listing.price}`}
                >
                  <div
                    data-card-frame
                    className={cn("relative overflow-hidden bg-surface", layout.aspect)}
                  >
                    <SiteImage
                      src={listing.image.src}
                      alt={listing.image.alt}
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                    />
                    <span className="absolute left-5 top-5 bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur">
                      {featured.statusLabels[listing.status]}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-dark/85 px-5 py-4 text-sm text-dark-foreground backdrop-blur transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      {featured.viewLabel}
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>

                  <div data-card-text className="mt-6 flex items-start justify-between gap-6">
                    <div>
                      <p className="text-sm text-muted">{listing.location}</p>
                      <h3 className="mt-2 font-serif text-3xl leading-none tracking-tight md:text-4xl">
                        {listing.title}
                      </h3>
                    </div>
                    <p className="whitespace-nowrap font-serif text-2xl md:text-3xl">{listing.price}</p>
                  </div>

                  {specs.length ? (
                    <ul data-card-text className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
                      {specs.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  ) : null}
                </a>
              </article>
            );
          })}
        </div>

        {listings.length === 0 ? (
          <div className="mt-6 border-y py-20 text-center">
            <p className="font-serif text-3xl md:text-4xl">{featured.emptyTitle}</p>
            <Button type="button" variant="outline" className="mt-8" onClick={onReset}>
              {featured.emptyAction}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
