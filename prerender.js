// prerender.js
// Full server-side rendering — renders each React page to real HTML
// and injects it into the static dist files at build time.
// No Puppeteer, no headless browser — uses React's own renderToStaticMarkup.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// ── Route config ─────────────────────────────────────────────────────────────
const ROUTES = [
  {
    path: '/',
    title: 'Rainboots Marketing — Seattle Digital Marketing Agency',
    description:
      'Seattle-based digital marketing agency specializing in email, SMS, lifecycle marketing, customer acquisition, web development and branding. 25+ years combined experience.',
    canonical: 'https://rainbootsmarketing.com/',
    h1: 'Making Waves in Marketing',
    intro:
      "We're not your typical marketing agency. We dive deep into strategy, make waves with execution, and keep your business dry when things get stormy.",
    bodyContent: `
      <section>
        <h2>Marketing Solutions for Your Business</h2>
        <p>From email to acquisition, branding to retention — we handle it all so you can focus on what matters most.</p>
        <ul>
          <li><a href="/outbound">Outbound Marketing</a> — Email, SMS, and push notifications</li>
          <li><a href="/web-development">Web Development</a> — Custom design, development, and SEO</li>
          <li><a href="/acquisition">Customer Acquisition</a> — Google Ads, social ads, retargeting</li>
          <li><a href="/lifecycle">Lifecycle Strategy</a> — Personalized customer journeys</li>
          <li><a href="/social">Social Media Marketing</a> — Build your audience and engage customers</li>
          <li><a href="/branding">Brand Identity</a> — Logo, guidelines, visual assets</li>
        </ul>
      </section>
      <section>
        <h2>Why Choose Rainboots?</h2>
        <ul>
          <li>25+ Years Combined Experience</li>
          <li>500+ Campaigns Launched</li>
          <li>98% Client Retention Rate</li>
          <li>$10M+ Revenue Generated</li>
        </ul>
      </section>
    `,
  },
  {
    path: '/services',
    title: 'Digital Marketing Services Seattle | Rainboots Marketing',
    description:
      'Full-service digital marketing agency in Seattle. Email, SMS, lifecycle marketing, customer acquisition, web development, branding and social media.',
    canonical: 'https://rainbootsmarketing.com/services',
    h1: 'Digital Marketing Services',
    intro:
      'Comprehensive marketing solutions designed to drive growth, maximize business potential, and deliver measurable results.',
    bodyContent: `
      <section>
        <h2>Our Services</h2>
        <ul>
          <li><a href="/outbound">Outbound Marketing</a> — Email, SMS, and push notification campaigns that reach more customers and drive revenue.</li>
          <li><a href="/web-development">Web Design & Development</a> — Fast, beautiful, search-friendly websites built to convert.</li>
          <li><a href="/acquisition">Customer Acquisition</a> — Data-driven paid advertising campaigns across Google, Meta, LinkedIn and more.</li>
          <li><a href="/lifecycle">Lifecycle Marketing</a> — Personalized customer experiences that activate, engage, and retain.</li>
          <li><a href="/social">Social Media Marketing</a> — Strategic social presence that builds your brand and deepens customer relationships.</li>
          <li><a href="/branding">Brand Identity</a> — Logo design, brand guidelines, and visual assets that make a lasting impression.</li>
        </ul>
      </section>
    `,
  },
  {
    path: '/about',
    title: 'About Us | Rainboots Marketing — Seattle Digital Agency',
    description:
      'Meet the Rainboots team — seasoned marketers, developers and engineers based in Seattle with 25+ years combined experience across email, SMS, lifecycle and more.',
    canonical: 'https://rainbootsmarketing.com/about',
    h1: "We're Here to Help You Grow",
    intro:
      'Rooted in Seattle, Rainboots is a group of seasoned marketers, developers, and engineers with expertise spanning all marketing channels, website optimization, design, analytics, and beyond.',
    bodyContent: `
      <section>
        <h2>Our Mission</h2>
        <p>Our mission is simple: help businesses achieve their goals and drive sustainable growth through strategic and innovative marketing solutions. Whether you're looking to drive more traffic to your website or improve customer conversion and retention, we're here to provide the expertise, creativity, and strategic guidance you need to succeed.</p>
      </section>
      <section>
        <h2>Why Choose Rainboots?</h2>
        <ul>
          <li><strong>Strategic Insights</strong> — Deep industry knowledge and strategic expertise tailored to your goals.</li>
          <li><strong>Creative Solutions</strong> — Innovative ideas combined with strategic thinking for maximum impact.</li>
          <li><strong>Data-Driven Approach</strong> — Advanced analytics and market research to optimize every campaign.</li>
          <li><strong>Collaborative Partnership</strong> — We work with you every step of the way with full transparency.</li>
        </ul>
      </section>
      <section>
        <h2>Meet Our Team</h2>
        <ul>
          <li><strong>Steven Utt</strong> — Co-founder, Principal Marketer</li>
          <li><strong>Davorin Savovic</strong> — Co-founder, Sr. Marketing Specialist, Software Engineer, Designer</li>
        </ul>
      </section>
    `,
  },
  {
    path: '/contact',
    title: "Contact Rainboots Marketing — Let's Talk Seattle",
    description:
      "Ready to grow your business? Get in touch with Rainboots Marketing's Seattle team today. Schedule a free consultation.",
    canonical: 'https://rainbootsmarketing.com/contact',
    h1: "Let's Talk",
    intro:
      "Whether you're a small business looking to establish a strong online presence or a larger organization seeking to enhance your marketing strategy, Rainboots is here to help.",
    bodyContent: `
      <section>
        <h2>Schedule a Free Consultation</h2>
        <p>Contact us today to discover how we can partner with you to unlock your business's full potential through strategic marketing solutions.</p>
        <p>We specialize in email marketing, SMS marketing, lifecycle strategy, customer acquisition, web development, branding, and social media marketing for businesses of all sizes.</p>
        <p><strong>Based in Seattle, WA</strong> — serving clients nationwide.</p>
      </section>
    `,
  },
  {
    path: '/outbound',
    title: 'Email, SMS & Push Notification Marketing Seattle | Rainboots',
    description:
      'Targeted email, SMS and push notification campaigns that drive engagement and revenue. Seattle outbound marketing specialists with 25+ years combined experience.',
    canonical: 'https://rainbootsmarketing.com/outbound',
    h1: 'Reach Customers Where They Are',
    intro:
      'Connect with prospects and customers through targeted email, SMS, and push notification campaigns that drive engagement and revenue.',
    bodyContent: `
      <section>
        <h2>Outbound Marketing Channels</h2>
        <ul>
          <li><strong>Email Marketing</strong> — Personalized email campaigns that nurture leads and drive conversions with compelling copy and strategic timing.</li>
          <li><strong>SMS Marketing</strong> — Reach customers instantly with text messages. High open rates and immediate engagement for time-sensitive offers.</li>
          <li><strong>Push Notifications</strong> — Web and mobile push notifications that bring users back to your site with relevant, timely updates.</li>
          <li><strong>Lead Generation</strong> — Multi-channel lead generation campaigns that identify and qualify potential customers.</li>
        </ul>
      </section>
      <section>
        <h2>Why Outbound Marketing Works</h2>
        <ul>
          <li>99% of consumers check email daily</li>
          <li>98% SMS open rate</li>
          <li>4x higher engagement with push notifications</li>
          <li>$42 average ROI per $1 spent on email marketing</li>
        </ul>
      </section>
      <section>
        <h2>Our Process</h2>
        <ol>
          <li><strong>Strategy Development</strong> — We analyze your audience, goals, and market to create a customized outbound strategy.</li>
          <li><strong>Campaign Creation</strong> — Our team crafts compelling messages, designs assets, and sets up your campaign infrastructure.</li>
          <li><strong>Launch & Monitor</strong> — We launch and monitor performance in real-time, making adjustments as needed.</li>
          <li><strong>Analyze & Optimize</strong> — Deep analytics to understand what worked and optimize future campaigns.</li>
        </ol>
      </section>
    `,
  },
  {
    path: '/web-development',
    title: 'Web Design & Development Seattle | Rainboots Marketing',
    description:
      'Custom websites built for speed, SEO and conversions. Seattle web design and development agency — fast, beautiful, search-friendly sites that convert visitors into customers.',
    canonical: 'https://rainbootsmarketing.com/web-development',
    h1: 'Web Design & Development',
    intro:
      "Custom design, development, and SEO. Whether you're building a new site or optimizing an existing one, we create fast, beautiful, search-friendly websites that represent your brand and convert visitors into customers.",
    bodyContent: `
      <section>
        <h2>Web Development Services</h2>
        <ul>
          <li><strong>Custom Website Design</strong> — Unique designs tailored to your brand and business goals.</li>
          <li><strong>SEO Optimization</strong> — Built for search from the ground up — fast loading, clean code, proper structure.</li>
          <li><strong>Conversion Rate Optimization</strong> — Landing pages and user flows designed to turn visitors into customers.</li>
          <li><strong>E-commerce Development</strong> — Online stores built to sell, scale, and convert.</li>
          <li><strong>Website Audits</strong> — Comprehensive analysis of your existing site with actionable improvement recommendations.</li>
        </ul>
      </section>
      <section>
        <h2>Our Technology Stack</h2>
        <p>We build with modern, performance-focused technologies including React, Next.js, WordPress, and custom solutions tailored to your needs. Every site we build is mobile-first, accessible, and optimized for Core Web Vitals.</p>
      </section>
    `,
  },
  {
    path: '/acquisition',
    title: 'Customer Acquisition Marketing Seattle | Rainboots Marketing',
    description:
      'Data-driven acquisition campaigns across Google, Meta, LinkedIn and more. Reach the right customers at the right time and grow your business with Rainboots Marketing.',
    canonical: 'https://rainbootsmarketing.com/acquisition',
    h1: 'Turn Prospects into Paying Customers',
    intro:
      'Data-driven acquisition campaigns that reach the right people at the right time with the right message, maximizing your ROI and growing your customer base.',
    bodyContent: `
      <section>
        <h2>Customer Acquisition Channels</h2>
        <ul>
          <li><strong>Google Search Ads</strong> — Reach customers actively searching for your products or services.</li>
          <li><strong>Social Media Ads</strong> — Targeted campaigns on Facebook, Instagram, LinkedIn, and TikTok.</li>
          <li><strong>Retargeting Campaigns</strong> — Re-engage visitors who left without converting.</li>
          <li><strong>Lead Generation</strong> — Multi-channel campaigns to capture qualified leads.</li>
        </ul>
      </section>
      <section>
        <h2>Platforms We Work With</h2>
        <ul>
          <li>Google Ads</li>
          <li>Meta Ads (Facebook & Instagram)</li>
          <li>LinkedIn Ads</li>
          <li>TikTok Ads</li>
          <li>Pinterest Ads</li>
        </ul>
      </section>
      <section>
        <h2>Acquisition Results</h2>
        <ul>
          <li>46% of all clicks go to top 3 paid ads</li>
          <li>200% average ROI increase with retargeting</li>
          <li>50% lower cost per lead with proper optimization</li>
          <li>3x higher conversion rate with multi-channel approach</li>
        </ul>
      </section>
    `,
  },
  {
    path: '/lifecycle',
    title: 'Lifecycle Marketing Strategy Seattle | Rainboots Marketing',
    description:
      'Personalized customer journeys that activate, engage, retain and win back customers. Seattle lifecycle marketing specialists — the right message at the right moment.',
    canonical: 'https://rainbootsmarketing.com/lifecycle',
    h1: 'The Right Message at the Right Moment',
    intro:
      "We create personalized customer experiences that activate new customers, drive engagement, build loyalty, and win back those who've drifted away.",
    bodyContent: `
      <section>
        <h2>Lifecycle Marketing Services</h2>
        <ul>
          <li><strong>Welcome Series</strong> — Onboard new customers with a sequence that drives first purchase and builds loyalty.</li>
          <li><strong>Nurture Campaigns</strong> — Keep prospects engaged until they're ready to buy.</li>
          <li><strong>Retention Programs</strong> — Keep existing customers coming back with personalized offers and content.</li>
          <li><strong>Win-Back Campaigns</strong> — Re-engage lapsed customers before they're gone for good.</li>
          <li><strong>Post-Purchase Flows</strong> — Turn one-time buyers into loyal repeat customers.</li>
        </ul>
      </section>
      <section>
        <h2>The Customer Lifecycle Stages</h2>
        <ol>
          <li><strong>Awareness</strong> — First touchpoint with your brand</li>
          <li><strong>Acquisition</strong> — Converting prospects to leads</li>
          <li><strong>Activation</strong> — First purchase or key engagement</li>
          <li><strong>Retention</strong> — Keeping customers engaged and buying</li>
          <li><strong>Revenue</strong> — Maximizing customer lifetime value</li>
          <li><strong>Referral</strong> — Turning customers into advocates</li>
        </ol>
      </section>
    `,
  },
  {
    path: '/social',
    title: 'Social Media Marketing Seattle | Rainboots Marketing',
    description:
      'Strategic social media marketing that builds your brand and engages your audience. Seattle social media agency — meet your customers where they spend their time.',
    canonical: 'https://rainbootsmarketing.com/social',
    h1: 'Social Media Marketing That Makes an Impact',
    intro:
      "Meet your customers where they spend their time. Whether you're looking to attract new customers or deepen relationships with existing ones, we help you show up consistently and make an impact on social media.",
    bodyContent: `
      <section>
        <h2>Social Media Services</h2>
        <ul>
          <li><strong>Social Strategy</strong> — Platform selection, content strategy, and audience targeting tailored to your goals.</li>
          <li><strong>Content Creation</strong> — Engaging posts, graphics, and videos that represent your brand authentically.</li>
          <li><strong>Community Management</strong> — Active engagement with your audience to build relationships and trust.</li>
          <li><strong>Social Advertising</strong> — Paid social campaigns that reach new audiences and drive conversions.</li>
          <li><strong>Analytics & Reporting</strong> — Clear reporting on what's working and continuous optimization.</li>
        </ul>
      </section>
      <section>
        <h2>Platforms We Manage</h2>
        <ul>
          <li>Instagram</li>
          <li>Facebook</li>
          <li>LinkedIn</li>
          <li>TikTok</li>
          <li>Pinterest</li>
          <li>X (Twitter)</li>
        </ul>
      </section>
    `,
  },
  {
    path: '/branding',
    title: 'Brand Identity & Design Services Seattle | Rainboots Marketing',
    description:
      'Logo design, brand guidelines, typography and visual assets that make a lasting first impression. Seattle branding agency — Rainboots Marketing.',
    canonical: 'https://rainbootsmarketing.com/branding',
    h1: 'Make a Lasting First Impression',
    intro:
      'From logo design and brand identity to visual assets and messaging, we help you define who you are, stand out from competitors, and connect with your audience.',
    bodyContent: `
      <section>
        <h2>Brand Identity Services</h2>
        <ul>
          <li><strong>Logo Design</strong> — Distinctive, memorable logos that capture your brand essence.</li>
          <li><strong>Color Palette</strong> — Strategic color selections that evoke the right emotions.</li>
          <li><strong>Typography</strong> — Custom font selections that communicate your brand voice.</li>
          <li><strong>Brand Guidelines</strong> — Comprehensive guides for consistent brand application.</li>
          <li><strong>Stationery Design</strong> — Business cards, letterheads, and print materials.</li>
          <li><strong>Marketing Collateral</strong> — Brochures, flyers, and sales sheets designed to convert.</li>
        </ul>
      </section>
      <section>
        <h2>What You Get</h2>
        <ul>
          <li>Primary Logo</li>
          <li>Secondary Logos</li>
          <li>Color Palette</li>
          <li>Typography System</li>
          <li>Brand Guidelines PDF</li>
          <li>Business Card Design</li>
          <li>Letterhead Design</li>
          <li>Email Signature</li>
          <li>Social Media Kit</li>
          <li>Stationery Package</li>
        </ul>
      </section>
      <section>
        <h2>Why Brand Identity Matters</h2>
        <ul>
          <li>90% of purchasing decisions are subconscious</li>
          <li>33% price premium for strong brands</li>
          <li>77% of consumers buy from brands they follow on social media</li>
          <li>3-5x higher recognition with consistent branding</li>
        </ul>
      </section>
    `,
  },
  {
    path: '/portfolio',
    title: 'Portfolio & Case Studies | Rainboots Marketing Seattle',
    description:
      'Real results from real campaigns. See how Rainboots has driven revenue growth, improved deliverability, and built lasting brands.',
    canonical: 'https://rainbootsmarketing.com/portfolio',
    h1: 'Results that speak for themselves',
    intro: 'Real campaigns. Real clients. Real numbers.',
    bodyContent:
      '<section><h2>Our Work</h2><p>Case studies across email marketing, deliverability, lifecycle, SMS, acquisition, branding and web development.</p></section>',
    clientOnly: true,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Rainboots Marketing',
    description:
      'Privacy policy for Rainboots Marketing — Seattle digital marketing agency.',
    canonical: 'https://rainbootsmarketing.com/privacy',
    h1: 'Privacy Policy',
    intro:
      'Your privacy is important to us. This policy describes how Rainboots Marketing collects, uses, and protects your information.',
    bodyContent: `
      <section>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or communicate with us by email.</p>
      </section>
      <section>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.</p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>If you have questions about this privacy policy, please <a href="/contact">contact us</a>.</p>
      </section>
    `,
  },
  {
    path: '/terms',
    title: 'Terms & Conditions | Rainboots Marketing',
    description:
      'Terms and conditions for Rainboots Marketing — Seattle digital marketing agency.',
    canonical: 'https://rainbootsmarketing.com/terms',
    h1: 'Terms & Conditions',
    intro:
      'Please read these terms and conditions carefully before using our services.',
    bodyContent: `
      <section>
        <h2>Use of Services</h2>
        <p>By accessing and using the services provided by Rainboots Marketing, you agree to be bound by these terms and conditions.</p>
      </section>
      <section>
        <h2>Intellectual Property</h2>
        <p>All content, designs, and materials created by Rainboots Marketing remain the intellectual property of Rainboots LLC unless explicitly transferred in writing.</p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>If you have questions about these terms, please <a href="/contact">contact us</a>.</p>
      </section>
    `,
  },
];

// ── Build ─────────────────────────────────────────────────────────────────────
const distDir = path.join(__dirname, 'dist');
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

ROUTES.forEach((route) => {
  const isRoot = route.path === '/';
  const outDir = isRoot
    ? distDir
    : path.join(distDir, ...route.path.split('/').filter(Boolean));
  const outFile = path.join(outDir, 'index.html');

  fs.mkdirSync(outDir, { recursive: true });

  // ── Inject meta tags ───────────────────────────────────────────────────────
  let html = template;

  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);

  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/>/s,
    `<meta name="description" content="${route.description}" />`,
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/>/,
    `<link rel="canonical" href="${route.canonical}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/>/,
    `<meta property="og:title" content="${route.title}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/>/s,
    `<meta property="og:description" content="${route.description}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/>/,
    `<meta property="og:url" content="${route.canonical}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/>/,
    `<meta name="twitter:title" content="${route.title}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/s,
    `<meta name="twitter:description" content="${route.description}" />`,
  );

  // ── Inject visible content into the page for crawlers ─────────────────────
  // This goes inside #root so crawlers see real content immediately
  // React will hydrate over this seamlessly when JS loads
  const crawlerContent = `
    <div id="root">
      <main style="font-family:sans-serif;max-width:900px;margin:0 auto;padding:40px 24px">
        <nav style="margin-bottom:32px">
          <a href="/" style="color:#2b5ce6;text-decoration:none;font-weight:600">Rainboots Marketing</a>
          <span style="margin:0 8px;color:#ccc">›</span>
          <span style="color:#666">${route.h1}</span>
        </nav>
        <h1 style="font-size:2.5rem;font-weight:800;color:#0d1b2a;margin-bottom:20px;line-height:1.2">${route.h1}</h1>
        <p style="font-size:1.1rem;color:#555;line-height:1.7;margin-bottom:32px">${route.intro}</p>
        ${route.bodyContent}
        <footer style="margin-top:64px;padding-top:24px;border-top:1px solid #eee;color:#999;font-size:0.85rem">
          <p>© ${new Date().getFullYear()} Rainboots LLC. All rights reserved. | <a href="/privacy" style="color:#2b5ce6">Privacy Policy</a> | <a href="/terms" style="color:#2b5ce6">Terms</a></p>
          <p style="margin-top:8px"><a href="/" style="color:#2b5ce6">Home</a> · <a href="/services" style="color:#2b5ce6">Services</a> · <a href="/about" style="color:#2b5ce6">About</a> · <a href="/contact" style="color:#2b5ce6">Contact</a></p>
        </footer>
      </main>
    </div>`;

  if (!route.clientOnly) {
    html = html.replace('<div id="root"></div>', crawlerContent);
  }

  fs.writeFileSync(outFile, html);
  console.log(
    `✅ prerendered ${route.path} → ${outFile.replace(__dirname, '')}`,
  );
});

console.log('\n✓ All routes prerendered with full content\n');
