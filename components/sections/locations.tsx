"use client";

import { useState } from "react";
import { site } from "@/site.config";
import { SiteImage } from "@/components/media/site-image";
import { RevealText } from "@/components/motion/reveal-text";
import { cn } from "@/lib/utils";

/** Hover (or tap / focus) a city and the whole section's background becomes that city */
export function Locations() {
  const { locations } = site;
  const [active, setActive] = useState(0);

  return (
    <section id="locations" className="relative overflow-hidden bg-dark py-24 text-dark-foreground md:py-32">
      <div aria-hidden className="absolute inset-0">
        {locations.items.map((item, i) => (
          <div
            key={item.name}
            className={cn(
              "absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              i === active ? "scale-100 opacity-100" : "scale-[1.07] opacity-0",
            )}
          >
            <SiteImage src={item.image.src} alt="" sizes="100vw" />
          </div>
        ))}
        <div className="absolute inset-0 bg-dark/65" />
      </div>

      <div className="container-x relative z-10 flex min-h-[80svh] flex-col">
        <RevealText as="h2" text={locations.title} className="font-serif text-3xl tracking-tight md:text-4xl" />

        <ul className="mt-auto pt-20">
          {locations.items.map((item, i) => {
            const on = i === active;
            return (
              <li key={item.name} className="border-t border-white/15 last:border-b">
                <a
                  href={item.href ?? "#contact"}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="flex items-baseline justify-between gap-6 py-5 outline-offset-[-4px] md:py-7"
                >
                  <span
                    className={cn(
                      "display-lg transition-[opacity,transform] duration-700 ease-out",
                      on ? "translate-x-3 opacity-100" : "translate-x-0 opacity-40",
                    )}
                  >
                    {item.name}
                  </span>
                  <span
                    className={cn(
                      "hidden text-sm transition-opacity duration-700 sm:block",
                      on ? "opacity-90" : "opacity-0",
                    )}
                  >
                    {item.detail}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
