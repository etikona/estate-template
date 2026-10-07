"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { site } from "@/site.config";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";
import { startScroll, stopScroll } from "@/lib/scroll";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { nav, name, logo, contact, social } = site;
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const barRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false);

  // Solid bar after scrolling, hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 40);
      if (Math.abs(delta) > 4) {
        setHidden(delta > 0 && y > 500);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Staggered entrance, started when the preloader curtain lifts
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set("[data-nav-item]", { opacity: 0, y: -16 });
        const off = onIntroReady(() => {
          gsap.to("[data-nav-item]", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.25,
          });
        });
        return off;
      });
      return () => mm.revert();
    },
    { scope: barRef },
  );

  // Mobile menu open/close
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (!open && !hasOpened.current) return;
    hasOpened.current = true;

    const k = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
    const items = menu.querySelectorAll("[data-menu-item]");
    gsap.killTweensOf([menu, items]);

    if (open) {
      stopScroll();
      gsap.set(menu, { visibility: "visible" });
      gsap.fromTo(
        menu,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 * k, ease: "power4.inOut" },
      );
      gsap.fromTo(
        items,
        { yPercent: 115 },
        { yPercent: 0, duration: 1 * k, ease: "power4.out", stagger: 0.07 * k, delay: 0.25 * k },
      );
    } else {
      startScroll();
      gsap.to(menu, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.6 * k,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(menu, { visibility: "hidden" });
        },
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onHero = !scrolled && !open;

  return (
    <>
      <header
        ref={barRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color] duration-500 ease-out",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          onHero
            ? "border-b border-transparent text-dark-foreground"
            : open
              ? "border-b border-transparent text-dark-foreground"
              : "border-b border-border bg-background/85 text-foreground backdrop-blur-xl",
        )}
      >
        <div className="container-x flex h-20 items-center justify-between gap-8">
          <a href="#top" data-nav-item className="relative z-10 flex items-center" aria-label={`${name}, back to top`}>
            {logo ? (
              <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} priority className="h-8 w-auto" />
            ) : (
              <span className="font-serif text-[1.65rem] leading-none tracking-tight">{name}</span>
            )}
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
            {nav.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-nav-item
                className="group relative text-[0.78rem] font-medium uppercase tracking-[0.14em]"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div data-nav-item className="hidden lg:block">
              <Button asChild size="sm" variant={onHero ? "light" : "default"}>
                <a href={nav.cta.href}>{nav.cta.label}</a>
              </Button>
            </div>
            <button
              type="button"
              data-nav-item
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-10 inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.14em] lg:hidden"
            >
              {open ? "Close" : "Menu"}
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        className="fixed inset-0 z-40 flex flex-col justify-between bg-dark px-[clamp(1.25rem,4vw,3.5rem)] pb-10 pt-28 text-dark-foreground lg:hidden"
        style={{ visibility: "hidden", clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {[...nav.links, nav.cta].map((link) => (
              <li key={link.label} className="overflow-hidden pb-[0.12em]">
                <a
                  href={link.href}
                  data-menu-item
                  onClick={() => {
                    setOpen(false);
                    startScroll();
                  }}
                  className="block font-serif text-[clamp(2.75rem,12vw,4.5rem)] leading-[1.05] tracking-tight"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-6 text-sm text-white/70">
          <div className="space-y-1">
            <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="block">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="block">
              {contact.email}
            </a>
          </div>
          <ul className="flex gap-6">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
