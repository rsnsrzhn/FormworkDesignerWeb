const targets = [
  ".section-heading",
  ".drawing-notes",
  ".feature-media",
  ".showcase-heading",
  ".results-grid article",
  ".time-number",
  ".time-copy",
  ".platform-layout > div",
  ".custom-section > div",
  ".purchase-card",
  ".process-grid > article",
  ".cta",
  ".contact-intro",
  ".form-card",
  ".faq-list details",
].join(",");

export function mountScrollMotion(root: HTMLElement): () => void {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches || !("IntersectionObserver" in window))
    return () => {};
  const elements = [...root.querySelectorAll<HTMLElement>(targets)];
  const revealAll = () =>
    elements.forEach((element) => element.removeAttribute("data-reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = "visible";
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
  );
  for (const element of elements) {
    if (element.getBoundingClientRect().top < window.innerHeight - 24) continue;
    element.dataset.reveal = "pending";
    observer.observe(element);
  }
  const change = () => {
    if (preference.matches) {
      observer.disconnect();
      revealAll();
    }
  };
  preference.addEventListener("change", change);
  return () => {
    observer.disconnect();
    preference.removeEventListener("change", change);
    revealAll();
  };
}
