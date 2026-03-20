import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES = [
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
];

const distDir = path.join(__dirname, 'dist');
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

ROUTES.forEach((route) => {
  const isRoot = route === '/';
  const outDir = isRoot
    ? distDir
    : path.join(distDir, ...route.split('/').filter(Boolean));
  const outFile = path.join(outDir, 'index.html');

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, template);
  console.log(`✅ prerendered ${route} → ${outFile.replace(__dirname, '')}`);
});

console.log('\n✓ All routes prerendered\n');
