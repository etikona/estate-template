"use client";

import { useRef } from "react";
import { site } from "@/site.config";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { cn } from "@/lib/utils";

/**
 * The one orchestrated moment of the page load:
 * wordmark rises, a hairline fills, the dark curtain lifts and the hero begins.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const enabled = site.preloader.enabled;

  useGSAP(
    () => {
      const el = root.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let seen = false;
      try {
        seen = sessionStorage.getItem("intro-seen") === "1";
      } catch {}

      if (!enabled || reduced || seen) {
        if (el) gsap.set(el, { display: "none" });
        markIntroDone();
        return;
      }

      document.documentElement.style.overflow = "hidden";
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          document.documentElement.style.overflow = "";
          if (el) gsap.set(el, { display: "none" });
          try {
            sessionStorage.setItem("intro-seen", "1");
          } catch {}
        },
      });

      tl.fromTo("[data-pre-name]", { yPercent: 115 }, { yPercent: 0, duration: 1.1 })
        .fromTo("[data-pre-bar]", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0.1)
        .to(el, { yPercent: -100, duration: 1, ease: "power4.inOut" }, 1.4)
        .add(() => markIntroDone(), 1.8);

      return () => {
        document.documentElement.style.overflow = "";
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className={cn(
        "preloader fixed inset-0 z-[100] flex items-center justify-center bg-dark text-dark-foreground",
        !enabled && "hidden",
      )}
    >
      <span className="block overflow-hidden pb-[0.15em]">
        <span
          data-pre-name
          className="block font-serif text-5xl tracking-tight md:text-7xl"
          style={{ transform: "translateY(115%)" }}
        >
          {site.name}
        </span>
      </span>
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10">
        <div
          data-pre-bar
          className="h-full bg-accent"
          style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
        />
      </div>
    </div>
  );
}
