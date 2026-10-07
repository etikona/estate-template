"use client";

import { useRef } from "react";
import { site } from "@/site.config";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SiteImage } from "@/components/media/site-image";
import { RevealText } from "@/components/motion/reveal-text";
import { Button } from "@/components/ui/button";

export function Agent() {
  const { agent } = site;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Portrait unveils upward, then drifts inside its frame
        gsap.fromTo(
          "[data-portrait-frame]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "power4.inOut",
            scrollTrigger: { trigger: "[data-portrait-frame]", start: "top 80%", once: true },
          },
        );
        gsap.fromTo(
          "[data-portrait-image]",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: "[data-portrait-frame]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        gsap.from("[data-agent-fade]", {
          opacity: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-agent-copy]", start: "top 70%", once: true },
        });

        // Gallery strip slides sideways as the section scrolls past
        const strip = root.current?.querySelector<HTMLElement>("[data-strip]");
        const wrap = strip?.parentElement;
        if (strip && wrap) {
          gsap.set(wrap, { overflowX: "hidden" });
          gsap.to(strip, {
            x: () => Math.min(0, -(strip.scrollWidth - wrap.clientWidth)),
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="agent" className="overflow-hidden bg-surface py-28 md:py-44">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center">
        <div data-agent-copy className="lg:col-span-5">
          <RevealText as="h2" text={agent.title} className="display-md text-balance" />

          <div className="mt-14">
            <p data-agent-fade className="font-serif text-4xl leading-none tracking-tight md:text-5xl">
              {agent.name}
            </p>
            <p data-agent-fade className="mt-3 text-base text-muted">
              {agent.role}
            </p>
            <ul data-agent-fade className="mt-8 space-y-1 font-serif text-2xl">
              {agent.markets.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p data-agent-fade className="mt-8 max-w-md text-base leading-relaxed text-muted">
              {agent.bio}
            </p>
            <div data-agent-fade className="mt-10">
              <Button asChild size="lg">
                <a href={agent.cta.href}>{agent.cta.label}</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div data-portrait-frame className="relative aspect-[4/5] overflow-hidden bg-border">
            <div data-portrait-image className="absolute inset-x-0 -inset-y-[7%]">
              <SiteImage src={agent.portrait.src} alt={agent.portrait.alt} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </div>

      {agent.gallery.length ? (
        <div className="mt-24 overflow-x-auto md:mt-32">
          <div data-strip className="flex w-max gap-4 px-[clamp(1.25rem,4vw,3.5rem)] md:gap-6">
            {agent.gallery.map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                className="relative aspect-[4/3] w-[72vw] shrink-0 overflow-hidden bg-border sm:w-[46vw] lg:w-[30vw]"
              >
                <SiteImage src={img.src} alt={img.alt} sizes="(min-width: 1024px) 30vw, 72vw" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
