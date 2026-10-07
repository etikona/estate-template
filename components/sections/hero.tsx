"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";
import { SiteImage } from "@/components/media/site-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const { hero } = site;
  const root = useRef<HTMLElement>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Only load the video on wide screens, when motion and data are not restricted
  useEffect(() => {
    if (!hero.video) return;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setAllowVideo(wide && !calm && !saver);
  }, [hero.video]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Entrance: slow cinematic settle, headline lines rise, details follow
        const tl = gsap.timeline({ paused: true });
        tl.fromTo("[data-hero-media]", { scale: 1.2 }, { scale: 1, duration: 3.2, ease: "power2.out" }, 0)
          .fromTo(
            "[data-hero-line]",
            { yPercent: 115 },
            { yPercent: 0, duration: 1.5, ease: "power4.out", stagger: 0.14 },
            0.15,
          )
          .fromTo(
            "[data-hero-fade]",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 },
            0.85,
          );
        const off = onIntroReady(() => tl.play());

        // Scroll: image drifts slower than the page, content eases away
        gsap.to("[data-hero-parallax]", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-content]", {
          y: -70,
          opacity: 0.1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
        });

        return () => off();
      });

      // Reduced motion: show everything immediately
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-line], [data-hero-fade]", { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-dark text-dark-foreground">
      <div data-hero-parallax className="absolute inset-x-0 -top-[7%] h-[114%]">
        <div data-hero-media className="absolute inset-0">
          <SiteImage src={hero.image.src} alt={hero.image.alt} priority sizes="100vw" />
          {allowVideo && hero.video ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={hero.video.poster ?? hero.image.src}
              onCanPlay={() => setVideoReady(true)}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
                videoReady ? "opacity-100" : "opacity-0",
              )}
            >
              <source src={hero.video.src} type="video/mp4" />
            </video>
          ) : null}
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(17,17,15,0.6)_0%,rgba(17,17,15,0.12)_32%,rgba(17,17,15,0.18)_55%,rgba(17,17,15,0.78)_100%)]"
      />

      <div data-hero-content className="container-x relative z-10 pb-44 pt-40 md:pb-56">
        <h1 className="display-xl max-w-[14ch] text-balance">
          {hero.headline.map((line) => (
            <span key={line} className="line-mask">
              <span data-hero-line className="block" style={{ transform: "translateY(115%)" }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-hero-fade
          style={{ opacity: 0 }}
          className="mt-8 max-w-sm text-base leading-relaxed text-white/80 md:text-lg"
        >
          {hero.subheadline}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div data-hero-fade style={{ opacity: 0 }}>
            <Button asChild size="lg" variant="light">
              <a href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
            </Button>
          </div>
          {hero.secondaryCta ? (
            <div data-hero-fade style={{ opacity: 0 }}>
              <Button asChild size="lg" variant="outlineLight">
                <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {hero.caption ? (
        <div
          data-hero-fade
          style={{ opacity: 0 }}
          className="absolute bottom-56 right-[clamp(1.25rem,4vw,3.5rem)] z-10 hidden text-right md:block"
        >
          <p className="font-serif text-2xl">{hero.caption.title}</p>
          <p className="mt-1 text-sm text-white/70">{hero.caption.location}</p>
        </div>
      ) : null}
    </section>
  );
}
