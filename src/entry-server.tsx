import { renderToString } from 'react-dom/server';
import { App } from './App';
import type { SiteConfig } from './lib/api';
export { pages } from './site';
export function render(path: string, config: SiteConfig) {
  return renderToString(<App path={path} initialConfig={config} />);
}
