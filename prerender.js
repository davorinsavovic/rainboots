// prerender.js
// Injects per-route meta tags and SEO content at build time.
// Crawler content is placed OUTSIDE #root in a visually hidden div —
// React mounts into #root cleanly with no hydration conflicts.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Helper to generate rich SEO content for each route ─────────────────────
const getRouteSeoContent = (route) => {
  // Base content that all routes get
  let additionalContent = '';

  // Route-specific rich content from the React components
  switch (route.path) {
    case '/web-development':
      additionalContent = `
        <section>
          <h2>Custom Web Design</h2>
          <p>Your brand deserves more than a template.</p>
          <p>We design every site from scratch, starting with your brand, your goals, and your audience. Every color, layout, and interaction is intentional — crafted to reflect who you are and guide visitors toward what you want them to do.</p>
          <ul>
            <li>75% of users judge credibility by design</li>
            <li>2× higher conversions with custom design</li>
            <li>0.05s for users to form an opinion</li>
          </ul>
        </section>
        <section>
          <h2>Responsive Development</h2>
          <p>Every screen. Every device. Every time.</p>
          <p>We build mobile-first, which means your site is designed for the smallest screen first and scaled up — not squeezed down from a desktop layout as an afterthought.</p>
          <ul>
            <li>58% of traffic comes from mobile</li>
            <li>88% less likely to return after bad UX</li>
            <li>3s max load time before users leave</li>
          </ul>
        </section>
        <section>
          <h2>E-Commerce Solutions</h2>
          <p>A store that sells — even when you're not watching.</p>
          <p>We build e-commerce experiences on Shopify, WooCommerce, and custom platforms, with clean product pages, fast checkout flows, secure payment processing, and inventory management that scales with your business.</p>
          <ul>
            <li>69% avg. cart abandonment rate</li>
            <li>35% revenue increase with better UX</li>
            <li>100% PCI-compliant payment setup</li>
          </ul>
        </section>
        <section>
          <h2>CMS Integration</h2>
          <p>Your website, fully in your hands.</p>
          <p>We set up and configure content management systems — WordPress, Contentful, Sanity, and others — tailored to how your team actually works.</p>
          <ul>
            <li>43% of the web runs on WordPress</li>
            <li>5× faster content publishing</li>
            <li>0 developer needed for updates</li>
          </ul>
        </section>
        <section>
          <h2>SEO Optimization</h2>
          <p>Built to be found from the very first line of code.</p>
          <p>We build every site with SEO fundamentals in place, including keyword-informed content structure, technical audits, and on-page optimization.</p>
          <ul>
            <li>68% of online experiences start with search</li>
            <li>14× more traffic from organic vs paid</li>
            <li>27% of clicks go to the #1 result</li>
          </ul>
        </section>
        <section>
          <h2>Performance Optimization</h2>
          <p>Every second counts — and so does every millisecond.</p>
          <p>We audit and optimize every layer of your site's performance: image compression, code minification, lazy loading, caching strategies, CDN configuration, and Core Web Vitals.</p>
          <ul>
            <li>0.1s faster load = 8% lower bounce rate</li>
            <li>32% more conversions with fast sites</li>
            <li>Top 3 Core Web Vitals = ranking boost</li>
          </ul>
        </section>
        <section>
          <h2>Our Web Development Process</h2>
          <ul>
            <li><strong>Discovery & Planning</strong> — We learn about your business, goals, and audience to create a strategic plan.</li>
            <li><strong>Design & Prototyping</strong> — We create wireframes and visual designs that bring your brand to life.</li>
            <li><strong>Development & Testing</strong> — Our developers build your site with clean, efficient code.</li>
            <li><strong>Launch & Support</strong> — We deploy your site and provide ongoing support and optimization.</li>
          </ul>
        </section>
        <section>
          <h2>Technologies We Use</h2>
          <ul>
            <li>React</li>
            <li>Vue.js</li>
            <li>Node.js</li>
            <li>WordPress</li>
            <li>WooCommerce</li>
            <li>Shopify</li>
            <li>Figma</li>
            <li>Adobe XD</li>
          </ul>
        </section>
      `;
      break;

    case '/outbound':
      additionalContent = `
        <section>
          <h2>Email Marketing</h2>
          <p>Where real relationships are built.</p>
          <p>We help you connect with your audience in a way that feels personal, not pushy. We craft emails that sound like they came from a real person — because that's what people respond to.</p>
          <ul>
            <li>99% of consumers check email daily</li>
            <li>$42 avg. ROI per $1 spent</li>
            <li>3× higher conversion vs social</li>
          </ul>
        </section>
        <section>
          <h2>SMS Marketing</h2>
          <p>Instant. Personal. Impossible to ignore.</p>
          <p>SMS cuts through the noise with a 98% open rate. We craft concise, compelling text campaigns that feel human, not robotic.</p>
          <ul>
            <li>98% SMS open rate</li>
            <li>3 min avg. time to open</li>
            <li>45% avg. response rate</li>
          </ul>
        </section>
        <section>
          <h2>Push Notifications</h2>
          <p>Bring them back — at exactly the right moment.</p>
          <p>We design web and mobile push campaigns that are timely, relevant, and never spammy, using segmentation and automation.</p>
          <ul>
            <li>4× higher engagement vs email</li>
            <li>40% opt-in rate (web)</li>
            <li>2× return visit rate</li>
          </ul>
        </section>
        <section>
          <h2>Lead Generation</h2>
          <p>Find your next customer before they find your competitor.</p>
          <p>We build multi-channel lead generation campaigns that identify, attract, and qualify the people most likely to buy from you.</p>
          <ul>
            <li>3× more qualified leads</li>
            <li>60% lower cost per lead</li>
            <li>80% of leads need 5+ touchpoints</li>
          </ul>
        </section>
        <section>
          <h2>Marketing Automation & Workflows</h2>
          <p>Work smarter — let your marketing run while you sleep.</p>
          <p>We build automated workflows that keep your audience moving through the funnel 24/7, triggered by real behavior.</p>
          <ul>
            <li>451% increase in qualified leads</li>
            <li>14hrs saved per week on average</li>
            <li>77% of companies see conversions rise</li>
          </ul>
        </section>
        <section>
          <h2>Deliverability & Sender Reputation</h2>
          <p>Your message is only powerful if it actually arrives.</p>
          <p>We audit your sending infrastructure, clean your lists, set up proper authentication (SPF, DKIM, DMARC), and monitor your sender reputation.</p>
          <ul>
            <li>97%+ inbox placement rate</li>
            <li>100% SPF / DKIM / DMARC coverage</li>
            <li>&lt;0.1% target spam complaint rate</li>
          </ul>
        </section>
        <section>
          <h2>Our Outbound Process</h2>
          <ul>
            <li><strong>Strategy Development</strong> — We analyze your audience, goals, and market to create a customized strategy.</li>
            <li><strong>Campaign Creation</strong> — Our team crafts compelling messages and sets up campaign infrastructure.</li>
            <li><strong>Launch & Monitor</strong> — We launch your campaign and monitor performance in real-time.</li>
            <li><strong>Analyze & Optimize</strong> — Deep dive into analytics to optimize future campaigns.</li>
          </ul>
        </section>
      `;
      break;

    case '/portfolio':
      additionalContent = `
        <section>
          <h2>Case Studies</h2>
          <ul>
            <li><strong>Email Marketing</strong> — Rebuilt a dead email program from 12% to 38% open rates. +$420K incremental revenue for a national fashion retailer.</li>
            <li><strong>Lifecycle Marketing</strong> — Reduced churn by 34% with a smarter onboarding sequence. 67% trial-to-paid rate for a B2B SaaS platform.</li>
            <li><strong>Deliverability</strong> — Rescued a blacklisted domain, restored inbox placement from 22% to 96% in 8 weeks.</li>
            <li><strong>SMS & Push</strong> — Built an SMS loyalty program driving $2.1M in attributable revenue.</li>
            <li><strong>Branding</strong> — Complete rebrand that increased qualified lead volume by 58%.</li>
            <li><strong>Customer Acquisition</strong> — Scaled Google + Meta spend from $10K to $85K/month while maintaining 2.4x ROAS.</li>
            <li><strong>Web Development</strong> — New site drove 3x more demo requests in 30 days with 98/100 Core Web Vitals.</li>
            <li><strong>Retention</strong> — Win-back campaign recovered 18% of churned subscribers at $340 average recovered LTV.</li>
          </ul>
        </section>
        <section>
          <h2>Our Results</h2>
          <ul>
            <li>500+ Campaigns Launched</li>
            <li>$10M+ Revenue Generated</li>
            <li>98% Client Retention Rate</li>
            <li>25+ Years Combined Experience</li>
          </ul>
        </section>
      `;
      break;

    case '/work':
      additionalContent = `
        <section>
          <h2>Website Design & Development Projects</h2>
          <ul>
            <li><strong>Partizan Hoops</strong> — Full-stack youth basketball platform with custom CMS</li>
            <li><strong>Bothell Select Basketball</strong> — React platform with tournament management</li>
            <li><strong>Oregon Rule Co.</strong> — WooCommerce to Shopify migration with 2,000+ SKUs</li>
            <li><strong>Nelson Cabinetry</strong> — WordPress WooCommerce with 150,000+ cabinets sold</li>
            <li><strong>Classmates.com</strong> — UI/UX revamp for 40M+ active subscribers</li>
            <li><strong>Intelius</strong> — UI/UX revamp for 40M+ subscribers</li>
          </ul>
        </section>
        <section>
          <h2>Logo Design Projects</h2>
          <ul>
            <li>Partizan Hoops — Bold orange sports identity</li>
            <li>Vector RE Corp — Architectural mark for commercial real estate developer</li>
            <li>Live Love Flow Studios — Brand for boutique hot yoga studio in Seattle</li>
            <li>Seattle Platinum Limo — Premium identity for luxury transport service</li>
          </ul>
        </section>
      `;
      break;

    default:
      additionalContent = '';
  }

  return additionalContent;
};

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
        <p>Our mission is simple: help businesses achieve their goals and drive sustainable growth through strategic and innovative marketing solutions.</p>
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
          <li><strong>Email Marketing</strong> — Personalized campaigns that nurture leads and drive conversions.</li>
          <li><strong>SMS Marketing</strong> — High open rates and immediate engagement for time-sensitive offers.</li>
          <li><strong>Push Notifications</strong> — Bring users back with relevant, timely updates.</li>
          <li><strong>Lead Generation</strong> — Multi-channel campaigns that identify and qualify potential customers.</li>
        </ul>
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
      'Custom design, development, and SEO. Fast, beautiful, search-friendly websites that represent your brand and convert visitors into customers.',
    bodyContent: `
      <section>
        <h2>Web Development Services</h2>
        <ul>
          <li><strong>Custom Web Design</strong> — Unique designs tailored to your brand and business goals.</li>
          <li><strong>Responsive Development</strong> — Websites that work perfectly on all devices.</li>
          <li><strong>E-Commerce Solutions</strong> — Online stores built to sell, scale, and convert.</li>
          <li><strong>CMS Integration</strong> — Easy-to-use content management systems.</li>
          <li><strong>SEO Optimization</strong> — Built for search from the ground up.</li>
          <li><strong>Performance Optimization</strong> — Fast-loading, optimized code.</li>
        </ul>
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
      "Personalized customer experiences that activate new customers, drive engagement, build loyalty, and win back those who've drifted away.",
    bodyContent: `
      <section>
        <h2>Lifecycle Marketing Services</h2>
        <ul>
          <li><strong>Welcome Series</strong> — Onboard new customers and drive first purchase.</li>
          <li><strong>Nurture Campaigns</strong> — Keep prospects engaged until they're ready to buy.</li>
          <li><strong>Retention Programs</strong> — Keep existing customers coming back.</li>
          <li><strong>Win-Back Campaigns</strong> — Re-engage lapsed customers before they're gone for good.</li>
        </ul>
      </section>
    `,
  },
  {
    path: '/social',
    title: 'Social Media Marketing Seattle | Rainboots Marketing',
    description:
      'Strategic social media marketing that builds your brand and engages your audience. Seattle social media agency.',
    canonical: 'https://rainbootsmarketing.com/social',
    h1: 'Social Media Marketing That Makes an Impact',
    intro:
      'Meet your customers where they spend their time. Build your brand and deepen relationships with consistent, impactful social media marketing.',
    bodyContent: `
      <section>
        <h2>Social Media Services</h2>
        <ul>
          <li><strong>Social Strategy</strong> — Platform selection, content strategy, and audience targeting.</li>
          <li><strong>Content Creation</strong> — Engaging posts, graphics, and videos.</li>
          <li><strong>Community Management</strong> — Active engagement to build relationships and trust.</li>
          <li><strong>Social Advertising</strong> — Paid campaigns that reach new audiences and drive conversions.</li>
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
      'From logo design and brand identity to visual assets and messaging, we help you define who you are and connect with your audience.',
    bodyContent: `
      <section>
        <h2>Brand Identity Services</h2>
        <ul>
          <li><strong>Logo Design</strong> — Distinctive, memorable logos that capture your brand essence.</li>
          <li><strong>Color Palette</strong> — Strategic color selections that evoke the right emotions.</li>
          <li><strong>Typography</strong> — Font selections that communicate your brand voice.</li>
          <li><strong>Brand Guidelines</strong> — Comprehensive guides for consistent brand application.</li>
          <li><strong>Marketing Collateral</strong> — Brochures, flyers, and sales sheets designed to convert.</li>
        </ul>
      </section>
    `,
  },
  {
    path: '/portfolio',
    title: 'Portfolio & Case Studies | Rainboots Marketing Seattle',
    description:
      'Real results from real campaigns. See how Rainboots has driven revenue growth, improved deliverability, and built lasting brands for clients across industries.',
    canonical: 'https://rainbootsmarketing.com/portfolio',
    h1: 'Results that speak for themselves',
    intro:
      'Real campaigns. Real clients. Real numbers. No vanity metrics — just the outcomes that actually matter to your business.',
    bodyContent: ``,
  },
  {
    path: '/work',
    title: 'Our Work — Websites, Logos & Branding | Rainboots Marketing',
    description:
      'Browse our portfolio of websites, logos, brand identities, print collateral and email templates. Seattle digital marketing and design agency.',
    canonical: 'https://rainbootsmarketing.com/work',
    h1: 'Designed to make an impression',
    intro:
      'Websites, logos, brand identities, print collateral and email templates — built with intention and crafted for impact.',
    bodyContent: ``,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Rainboots Marketing',
    description:
      'Privacy policy for Rainboots Marketing — Seattle digital marketing agency.',
    canonical: 'https://rainbootsmarketing.com/privacy',
    h1: 'Privacy Policy',
    intro: 'Your privacy is important to us.',
    bodyContent: `
      <section>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you fill out a contact form or subscribe to our newsletter.</p>
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
        <p>By accessing and using our services, you agree to be bound by these terms and conditions.</p>
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

  let html = template;

  // ── Inject meta tags ───────────────────────────────────────────────────────
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

  // ── Get route-specific rich content ────────────────────────────────────────
  const routeSpecificContent = getRouteSeoContent(route);

  // ── SEO content: inject OUTSIDE #root so React never touches it ────────────
  // Visually hidden from users, fully readable by crawlers.
  const crawlerContent = `
  <div aria-hidden="true" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;left:-9999px">
    <h1>${route.h1}</h1>
    <p>${route.intro}</p>
    ${route.bodyContent}
    ${routeSpecificContent}
    <nav>
      <a href="/">Home</a>
      <a href="/services">Services</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/work">Work</a>
      <a href="/portfolio">Portfolio</a>
      <a href="/outbound">Outbound</a>
      <a href="/web-development">Web Development</a>
    </nav>
  </div>`;

  // Insert just before closing </body>
  html = html.replace('</body>', `${crawlerContent}\n</body>`);

  fs.writeFileSync(outFile, html);
  console.log(
    `✅ prerendered ${route.path} → ${outFile.replace(__dirname, '')}`,
  );
});

console.log('\n✓ All routes prerendered\n');
