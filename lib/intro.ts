/**
 * Tiny coordination layer: the preloader announces when the intro curtain
 * lifts, so the navbar and hero can start their entrance animation together.
 */
export function markIntroDone() {
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event("intro:done"));
}

export function onIntroReady(callback: () => void) {
  if (document.documentElement.dataset.intro === "done") {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("intro:done", handler, { once: true });
  return () => window.removeEventListener("intro:done", handler);
}
