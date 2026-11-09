export function animatePageIntro(heading: HTMLElement | null): () => void {
  if (
    !heading ||
    typeof heading.animate !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.visibilityState === "hidden"
  )
    return () => {};
  try {
    const animation = heading.animate([{ opacity: 0.65 }, { opacity: 1 }], {
      duration: 160,
      easing: "ease-out",
    });
    return () => animation.cancel();
  } catch {
    return () => {};
  }
}
