import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { navigate, routes } from '../lib/navigation';
export function Link({
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function follow(event: MouseEvent<HTMLAnchorElement>) {
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
      !routes.includes(url.pathname) ||
      (url.pathname === location.pathname && url.hash)
    )
      return;
    event.preventDefault();
    navigate(url);
  }
  return <a {...props} onClick={follow} />;
}
