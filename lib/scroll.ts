import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const stopScroll = () => {
  instance?.stop();
  document.body.style.overflow = "hidden";
};

export const startScroll = () => {
  instance?.start();
  document.body.style.overflow = "";
};

export function scrollToTarget(target: string, offset = 0) {
  if (target === "#top" || target === "#") {
    if (instance) instance.scrollTo(0);
    else window.scrollTo({ top: 0 });
    return;
  }
  const el = document.querySelector<HTMLElement>(target);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset });
  else el.scrollIntoView({ block: "start" });
}
