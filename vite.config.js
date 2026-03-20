import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePrerender from 'vite-plugin-prerender';
import path from 'path';

const Renderer = vitePrerender.PuppeteerRenderer;

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: [
        '/',
        '/services',
        '/about',
        '/contact',
        '/outbound',
        '/web-development',
        '/acquisition',
        '/lifecycle',
        '/social',
        '/branding',
        '/privacy',
        '/terms',
      ],
      renderer: new Renderer({
        headless: true,
        renderAfterTime: 2000,
      }),
    }),
  ],
});
