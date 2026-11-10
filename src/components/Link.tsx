import type { AnchorHTMLAttributes, MouseEvent } from 'react';

export function Link({
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    const link = event.currentTarget;
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute('download')
    )
      return;
    const url = new URL(link.href);
    if (
      url.origin !== location.origin ||
      url.pathname === location.pathname ||
      !['/', '/purchase', '/contact', '/privacy', '/consent'].includes(
        url.pathname,
      ) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    // Modern browsers handle document transitions natively; fallback keeps ordinary navigation.
    if ('onpageswap' in window) return;
    const main = document.getElementById('main');
    if (!main || typeof main.animate !== 'function') return;
    event.preventDefault();
    const animation = main.animate([{ opacity: 1 }, { opacity: 0.5 }], {
      duration: 100,
      easing: 'ease-out',
    });
    void animation.finished
      .catch(() => {})
      .then(() => location.assign(url.href));
  }
  return <a {...props} onClick={navigate} />;
}
