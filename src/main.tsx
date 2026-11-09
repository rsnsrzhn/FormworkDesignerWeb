import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
const root = document.getElementById('root')!;
const config = document.getElementById('site-config')?.textContent;
const app = (
  <App
    path={location.pathname.replace(/\/$/, '') || '/'}
    initialConfig={config ? JSON.parse(config) : null}
  />
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
