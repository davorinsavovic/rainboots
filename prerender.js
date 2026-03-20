import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES = [
  {
    path: '/',
    title: 'Rainboots Marketing — Seattle Digital Marketing Agency',
    description:
      'Seattle-based digital marketing agency specializing in email, SMS, lifecycle marketing, customer acquisition, web development and branding. 25+ years combined experience.',
    canonical: 'https://rainbootsmarketing.com/',
  },
  {
    path: '/services',
    title: 'Digital Marketing Services Seattle | Rainboots Marketing',
    description:
      'Full-service digital marketing agency in Seattle. Email, SMS, lifecycle marketing, customer acquisition, web development, branding and social media.',
    canonical: 'https://rainbootsmarketing.com/services',
  },
  {
    path: '/about',
    title: 'About Us | Rainboots Marketing — Seattle Digital Agency',
    description:
      'Meet the Rainboots team — seasoned marketers, developers and engineers based in Seattle with 25+ years combined experience across email, SMS, lifecycle and more.',
    canonical: 'https://rainbootsmarketing.com/about',
  },
  {
    path: '/contact',
    title: "Contact Rainboots Marketing — Let's Talk Seattle",
    description:
      "Ready to grow your business? Get in touch with Rainboots Marketing's Seattle team today. Schedule a free consultation.",
    canonical: 'https://rainbootsmarketing.com/contact',
  },
  {
    path: '/outbound',
    title: 'Email, SMS & Push Notification Marketing Seattle | Rainboots',
    description:
      'Targeted email, SMS and push notification campaigns that drive engagement and revenue. Seattle outbound marketing specialists.',
    canonical: 'https://rainbootsmarketing.com/outbound',
  },
  {
    path: '/web-development',
    title: 'Web Design & Development Seattle | Rainboots Marketing',
    description:
      'Custom websites built for speed, SEO and conversions. Seattle web design and development agency — fast, beautiful, search-friendly sites.',
    canonical: 'https://rainbootsmarketing.com/web-development',
  },
  {
    path: '/acquisition',
    title: 'Customer Acquisition Marketing Seattle | Rainboots Marketing',
    description:
      'Data-driven acquisition campaigns across Google, Meta, LinkedIn and more. Reach the right customers at the right time.',
    canonical: 'https://rainbootsmarketing.com/acquisition',
  },
  {
    path: '/lifecycle',
    title: 'Lifecycle Marketing Strategy Seattle | Rainboots Marketing',
    description:
      'Personalized customer journeys that activate, engage, retain and win back customers. The right message at the right moment.',
    canonical: 'https://rainbootsmarketing.com/lifecycle',
  },
  {
    path: '/social',
    title: 'Social Media Marketing Seattle | Rainboots Marketing',
    description:
      'Strategic social media marketing that builds your brand and engages your audience. Meet your customers where they spend their time.',
    canonical: 'https://rainbootsmarketing.com/social',
  },
  {
    path: '/branding',
    title: 'Brand Identity & Design Services Seattle | Rainboots Marketing',
    description:
      'Logo design, brand guidelines, typography and visual assets that make a lasting first impression. Seattle branding agency.',
    canonical: 'https://rainbootsmarketing.com/branding',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Rainboots Marketing',
    description:
      'Privacy policy for Rainboots Marketing — Seattle digital marketing agency.',
    canonical: 'https://rainbootsmarketing.com/privacy',
  },
  {
    path: '/terms',
    title: 'Terms & Conditions | Rainboots Marketing',
    description:
      'Terms and conditions for Rainboots Marketing — Seattle digital marketing agency.',
    canonical: 'https://rainbootsmarketing.com/terms',
  },
];

const distDir = path.join(__dirname, 'dist');
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

ROUTES.forEach((route) => {
  const isRoot = route.path === '/';
  const outDir = isRoot
    ? distDir
    : path.join(distDir, ...route.path.split('/').filter(Boolean));
  const outFile = path.join(outDir, 'index.html');

  fs.mkdirSync(outDir, { recursive: true });

  // Inject page-specific meta tags into the template
  let html = template;

  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/>/,
    `<meta name="description" content="${route.description}" />`,
  );

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/>/,
    `<link rel="canonical" href="${route.canonical}" />`,
  );

  // Replace og:title
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/>/,
    `<meta property="og:title" content="${route.title}" />`,
  );

  // Replace og:description
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/>/,
    `<meta property="og:description" content="${route.description}" />`,
  );

  // Replace og:url
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/>/,
    `<meta property="og:url" content="${route.canonical}" />`,
  );

  // Replace twitter:title
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/>/,
    `<meta name="twitter:title" content="${route.title}" />`,
  );

  // Replace twitter:description
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/,
    `<meta name="twitter:description" content="${route.description}" />`,
  );

  fs.writeFileSync(outFile, html);
  console.log(
    `✅ prerendered ${route.path} → ${outFile.replace(__dirname, '')}`,
  );
});

console.log('\n✓ All routes prerendered with unique meta tags\n');
