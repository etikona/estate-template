"use client";

import { useRef } from "react";
import { site } from "@/site.config";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SiteImage } from "@/components/media/site-image";
import { RevealText } from "@/components/motion/reveal-text";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/utils";

export function Lifestyle() {
  const { lifestyle } = site;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          const frame = panel.querySelector("[data-panel-frame]");
          const image = panel.querySelector("[data-panel-image]");
          const lines = panel.querySelectorAll("[data-panel-line]");
          const fades = panel.querySelectorAll("[data-panel-fade]");

          // Image mask opens as the panel arrives
          gsap.fromTo(
            frame,
            { clipPath: "inset(12% 8% 12% 8%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top 88%", end: "top 20%", scrub: true },
            },
          );
          // Image drifts inside its frame
          gsap.fromTo(
            image,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
          gsap.from(lines, {
            yPercent: 115,
            duration: 1.3,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: { trigger: panel, start: "top 50%", once: true },
          });
          gsap.from(fades, {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.35,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: panel, start: "top 50%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="lifestyle" className="pb-3 md:pb-4">
      <div className="container-x grid gap-10 pb-16 lg:grid-cols-12 lg:items-end">
        <RevealText as="h2" text={lifestyle.title} className="display-lg lg:col-span-7" />
        <p className="max-w-sm text-base leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
          {lifestyle.intro}
        </p>
      </div>

      <div className="flex flex-col gap-3 px-3 md:gap-4 md:px-4">
        {lifestyle.items.map((item, i) => (
          <article
            key={item.name.join(" ")}
            data-panel
            className="relative h-[86svh] min-h-[540px] overflow-hidden bg-dark text-dark-foreground md:h-[100svh]"
          >
            <div data-panel-frame className="absolute inset-0 overflow-hidden">
              <div data-panel-image className="absolute inset-x-0 -inset-y-[10%]">
                <SiteImage src={item.image.src} alt={item.image.alt} sizes="100vw" />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,15,0.7),rgba(17,17,15,0.05)_55%,rgba(17,17,15,0.25))]"
              />
            </div>

            <div
              className={cn(
                "container-x relative z-10 flex h-full items-end pb-12 md:pb-20",
                i % 2 === 1 && "md:justify-end",
              )}
            >
              <div className="max-w-xl">
                <h3 className="display-xl">
                  {item.name.map((line) => (
                    <span key={line} className="line-mask">
                      <span data-panel-line className="block">
                        {line}
                      </span>
                    </span>
                  ))}
                </h3>
                <p data-panel-fade className="mt-6 max-w-md text-base leading-relaxed text-white/80">
                  {item.description}
                </p>
                <div data-panel-fade className="mt-8">
                  <TextLink href={item.cta.href}>{item.cta.label}</TextLink>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
