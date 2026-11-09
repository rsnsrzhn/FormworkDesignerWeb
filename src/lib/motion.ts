/** Progressive enhancement: content is visible without JS; only offscreen sections animate. */
export function mountScrollMotion(root: HTMLElement) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const animations = new Set<Animation>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate(
          [
            { opacity: 0.55, transform: 'translateY(18px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 620, easing: 'cubic-bezier(.2,.75,.2,1)' },
        );
        animations.add(animation);
        animation.finished
          .then(() => animations.delete(animation))
          .catch(() => {});
      }
    },
    { threshold: 0.08 },
  );
  for (const element of root.querySelectorAll('[data-reveal]')) {
    if (element.getBoundingClientRect().top >= innerHeight)
      observer.observe(element);
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
