export const routes = ['/', '/purchase', '/contact', '/privacy', '/consent'];
export function navigate(url: URL) {
  window.dispatchEvent(
    new CustomEvent('site:navigate', {
      detail: url.pathname + url.search + url.hash,
    }),
  );
}
