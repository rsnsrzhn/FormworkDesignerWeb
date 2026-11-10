/** Content stays readable without JavaScript. Animate once, using compositor properties. */
export function mountScrollMotion(root: HTMLElement, animateInitial = true) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const animations = new Set<Animation>();
  const reveal = (element: Element, delay = 0) => {
    if (preference.matches) return;
    const animation = element.animate(
      [
        { opacity: 0.45, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration: 680,
        delay,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'backwards',
      },
    );
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation)).catch(() => {});
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        reveal(entry.target);
      }
    },
    { threshold: 0.06, rootMargin: '0px 0px -24px 0px' },
  );
  // Animate content groups, never a whole long page or overlapping parent/child layers.
  const targets = root.querySelectorAll(
    '.engineering-heading, .hero-product, .workflow-intro, .product-preview, .result-grid, .demo-section, .landing-questions, .page-hero, .purchase-offer, .purchase-tailoring, .purchase-start, .contact-intro, .form-card, .cta, .legal-page',
  );
  let initial = 0;
  for (const element of targets) {
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom <= 0) continue;
    if (bounds.top < innerHeight - 24) {
      if (animateInitial) reveal(element, Math.min(initial++ * 65, 130));
    } else observer.observe(element);
  }
  const stop = () => {
    if (preference.matches)
      for (const animation of animations) animation.cancel();
  };
  preference.addEventListener('change', stop);
  return () => {
    observer.disconnect();
    preference.removeEventListener('change', stop);
    for (const animation of animations) animation.cancel();
  };
}
