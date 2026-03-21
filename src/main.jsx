import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

// Routes that use client-side filters, modals, or dynamic state —
// skip hydration entirely and do a fresh client render instead.
const dynamicRoutes = ['/portfolio', '/work', '/blog-generator'];
const isDynamic = dynamicRoutes.some((r) =>
  window.location.pathname.startsWith(r),
);

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

if (isDynamic) {
  // Always fresh render — wipe any prerendered shell first
  rootElement.innerHTML = '';
  createRoot(rootElement).render(app);
} else if (rootElement.hasChildNodes()) {
  // Static/SSR pages — hydrate the prerendered HTML
  hydrateRoot(rootElement, app);
} else {
  // No prerendered content — plain client render
  createRoot(rootElement).render(app);
}
