import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

// Dynamic pages with filters/modals shouldn't be hydrated from prerender
const dynamicRoutes = ['/portfolio', '/blog-generator'];
const isDynamic = dynamicRoutes.some((r) =>
  window.location.pathname.startsWith(r),
);

if (rootElement.hasChildNodes() && !isDynamic) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>,
  );
} else {
  // Clear any prerendered content and render fresh
  rootElement.innerHTML = '';
  createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>,
  );
}
