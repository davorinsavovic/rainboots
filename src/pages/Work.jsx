import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './Work.css';

// ── Work items ──────────────────────────────────────────────────────────────
// Replace src with your actual image paths in /public/images/work/
// Recommended image sizes:
//   Websites: 1200x800px screenshots
//   Logos: 800x800px on white or transparent background
//   Branding: 1200x800px mockup photos
//   Print: 1200x800px flat lay or mockup
//   Email: 600x800px email screenshots
const WORK_ITEMS = [
  // ── Websites ──────────────────────────────────────────────────────────────

  {
    id: 1,
    category: 'websites',
    title: 'Partizan Hoops',
    subtitle:
      'Full-stack youth basketball platform — K-12 registration portal, coach profiles, tournament organizer & custom CMS for sports organizations.',
    src: '/images/portfolio/partizanWebsite.png',
    srcFull: '/images/portfolio/partizanWebsite.png',
    url: 'https://partizanhoops.com',
    color: '#E85D04',
    aspect: 'wide',
    tags: [
      'React',
      'Custom CMS',
      'Registration System',
      'Tournament Mgmt',
      'AAU / K-12',
    ],
    description:
      'Partizan Basketball Camp needed more than a brochure site — they needed a living, breathing digital operations platform. We designed and built partizanhoops.com from the ground up: a responsive public-facing site paired with a robust back-office CMS that handles player registration, tryout sign-ups, camp enrollments, tournament organization, and roster management — all in one place. No third-party SportsEngine subscription required.',
    features: [
      {
        title: 'Parent Registration Portal',
        body: 'Online sign-up flows for camps, tryouts & AAU enrollment with validation and confirmation.',
      },
      {
        title: 'Admin CMS Dashboard',
        body: 'Full content management — edit players, rosters, coaches, and programs without touching code.',
      },
      {
        title: 'Tournament Organizer',
        body: 'Schedule brackets, manage events, and display upcoming tournaments dynamically.',
      },
      {
        title: 'Player & Roster Management',
        body: 'Individual athlete profiles organized by team, age group, and program.',
      },
      {
        title: 'Program & Camp Listings',
        body: 'Dynamic pages for active camps, sessions, skill levels, and pricing — CMS-editable.',
      },
      {
        title: 'Coach & Staff Profiles',
        body: 'Dedicated pages for coaching staff credentials, philosophy, and background.',
      },
    ],
    coaches: [
      {
        initials: 'ZS',
        name: 'Zlatko (Zo) Savovic',
        role: 'President & Co-Founder',
        bio: 'Former D-I player at Lehigh University. WESCO Player of the Year. Played professionally in Europe. B.S. Mechanical Engineering.',
      },
      {
        initials: 'AK',
        name: 'Armend Kahrimanovic',
        role: 'VP & Head Coach',
        bio: 'NCAA D-I at University of Idaho. Played professionally in Greece and the Balkans. European-trained fundamentalist & AAU Director.',
      },
    ],
  },

  {
    id: 2,
    category: 'websites',
    title: 'Bothell Select Basketball',
    subtitle:
      'Full-stack youth basketball platform for Boys & Girls grades 4–8 — tournament management, team registration, event listings & custom CMS. The project that brought Partizan Hoops on board.',
    src: '/images/work/web-bothellselect.png',
    srcFull: '/images/work/web-bothellselect-full.png',
    url: 'https://bothellselect.com',
    color: '#506ee4',
    aspect: 'wide',
    tags: [
      'React',
      'Custom CMS',
      'Tournament Management',
      'Team Registration',
      'Boys & Girls 4th–8th',
      'Bothell WA',
    ],
    description:
      'Bothell Select Basketball is a competitive AAU program based in Bothell, WA, serving Boys & Girls in grades 4 through 8. They needed a professional digital home that could handle everything from tournament event listings and team registrations to a back-office CMS their staff could manage independently. We built bothellselect.com as a full-stack React application — clean, fast, and purpose-built for a youth sports organization. This project was the direct referral that brought Partizan Hoops to us.',
    features: [
      {
        title: 'Tournament Event System',
        body: 'Dynamic event pages for tournaments like the Winter Classic — dates, grades, divisions, and registration links all CMS-managed.',
      },
      {
        title: 'Team Registration Portal',
        body: 'Online sign-up flows for Boys & Girls teams across grade divisions, with contact routing to program staff.',
      },
      {
        title: 'Admin CMS Dashboard',
        body: 'Staff can create and update events, rosters, news, and program info without any code changes.',
      },
      {
        title: 'Boys & Girls Programs',
        body: 'Separate program tracks for boys and girls, grades 4th–8th, with division-specific content and schedules.',
      },
      {
        title: 'Event & Schedule Listings',
        body: 'Upcoming games, practices, and tournaments displayed dynamically and kept current by admins.',
      },
      {
        title: 'Mobile-First Design',
        body: 'Fully responsive React build — parents and coaches access everything cleanly on any device.',
      },
    ],
    referral: {
      label: 'Client referral',
      text: 'After launching bothellselect.com, the Bothell Select organization referred Partizan Basketball Camp — who reached out specifically because they wanted the same platform built for their program.',
    },
  },

  {
    id: 3,
    category: 'websites',
    title: 'InvestWorkshop',
    subtitle:
      'Full-featured real estate investment education platform — structured courses, live online events, blog, podcast, and Teachable-integrated student enrollment. Ongoing project.',
    src: '/images/work/web-investworkshop.png',
    srcFull: '/images/work/web-investworkshop-full.png',
    url: 'https://investworkshop.com',
    color: '#1a6b3c',
    aspect: 'wide',
    tags: [
      'Education Platform',
      'Teachable Integration',
      'Course CMS',
      'Events & Zoom',
      'Blog & Podcast',
      'Real Estate',
    ],
    description:
      'InvestWorkshop is an ongoing education platform built to guide aspiring real estate investors from first-time prospect to confident developer. Built for instructor Edis Kulaga, the platform covers the full development pipeline — property acquisition, permitting, and building — through structured video courses, live online workshops, Zoom sessions, a blog, and a podcast. Students register and access course content through a seamless Teachable integration, while all site content is managed through a custom CMS. This is an active, growing project with new courses and events added regularly.',
    features: [
      {
        title: 'Structured Course Library',
        body: '3 learning tracks — Property Acquisition, Permitting, and Building — each with multiple video lessons covering the full development pipeline.',
      },
      {
        title: 'Teachable Integration',
        body: 'Student registration and course delivery powered by Teachable (edis-kulaga-s-school.teachable.com), fully embedded into the site experience.',
      },
      {
        title: 'Live Events & Workshops',
        body: 'Dynamic event listings for online workshops — Property Acquisition Fundamentals, Feasibility Analysis, Land Use Code & Zoning, and more.',
      },
      {
        title: 'Zoom Meeting Schedule',
        body: 'Dedicated section for recurring Zoom sessions, letting students join live Q&A and coaching calls directly from the platform.',
      },
      {
        title: 'Blog & Content Engine',
        body: 'SEO-optimized blog covering topics like feasibility analysis, permitting, avoiding costly mistakes, and property development fundamentals.',
      },
      {
        title: 'Video Hero & Intro Player',
        body: 'Immersive homepage video experience with a custom-built player — full controls, popup mode, and keyboard shortcuts for an app-like feel.',
      },
    ],
    instructor: {
      initials: 'EK',
      name: 'Edis Kulaga',
      role: 'Founder & Lead Instructor',
      bio: 'Real estate developer and educator teaching aspiring investors the full development process — from identifying a property and navigating land use codes to permitting, budgeting, and building.',
    },
    ongoing: true,
  },

  {
    id: 4,
    category: 'websites',
    title: 'Oregon Rule Co.',
    subtitle:
      'WooCommerce → Shopify migration for a 40-year-old U.S. precision measurement manufacturer. 2,000+ SKUs, two market verticals, and clients like Boeing, Tesla & Nike.',
    src: '/images/work/web-oregonrule.png',
    srcFull: '/images/work/web-oregonrule-full.png',
    url: 'https://oregonrule.com',
    color: '#2d6a2d',
    aspect: 'wide',
    tags: [
      'Shopify',
      'WooCommerce Migration',
      'E-Commerce',
      '2,000+ SKUs',
      'Industrial / Forensics',
      'Founded 1981',
    ],
    description:
      'Oregon Rule Co. has been manufacturing precision measuring tools in the U.S. since 1981. Their original WooCommerce store was straining under a catalog of 2,000+ stocked products and two distinct customer markets — industrial/commercial and forensics. The migration to Shopify modernized their entire storefront: cleaner product taxonomy, faster checkout, Apple Pay / Shop Pay / PayPal support, a full resource library (catalog, data sheets, how-to guides), and a scalable foundation for their ongoing expansion into consumer and forensics markets. Their clients include Boeing, GE Healthcare, Tesla, Nike, Ford Motor Co., General Mills, and Eastman Kodak.',
    features: [
      {
        title: 'WooCommerce → Shopify Migration',
        body: 'Full platform migration preserving 2,000+ SKUs, product collections, customer data, and SEO structure.',
      },
      {
        title: 'Dual-Market Product Taxonomy',
        body: 'Organized into two distinct storefronts-in-one: Industrial/Commercial (staff gauges, pipe calipers, floor tapes) and Forensics (rulers, blood stain, corner squares, ID labels).',
      },
      {
        title: 'Multi-Payment Checkout',
        body: 'Full payment suite enabled: Visa, Mastercard, Amex, Discover, PayPal, Apple Pay, Shop Pay, Amazon, and Diners Club.',
      },
      {
        title: 'Resource Library',
        body: 'Dedicated pages for product catalog downloads, data sheets, and how-to guides — supporting B2B buyers and distributors.',
      },
      {
        title: 'Custom Collection Pages',
        body: 'Branded collection landing pages for each product category with hero imagery tailored to industrial and forensics contexts.',
      },
      {
        title: 'B2B & D2C Ready',
        body: 'Built to serve both direct-to-consumer buyers and distributor-based sales channels, with account login and cart functionality.',
      },
    ],
    migration: {
      from: 'WooCommerce',
      to: 'Shopify',
      note: 'Platform migration preserving full catalog, customer accounts, and SEO rankings while modernizing UX and checkout.',
    },
  },

  {
    id: 5,
    category: 'websites',
    title: 'Alchemy of Yoga',
    subtitle:
      'WordPress site for a globally recognized Yoga Alliance RYS 200 school — online self-paced courses, live cohorts, Bali immersion retreats, and Teachable enrollment. 20+ years, 39 graduating classes, students from 25+ countries.',
    src: '/images/work/web-alchemyofyoga.png',
    srcFull: '/images/work/web-alchemyofyoga-full.png',
    url: 'https://alchemyofyoga.com',
    color: '#7c4a8c',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Yoga Alliance RYS 200',
      'Teachable Integration',
      'Online + In-Person',
      'Global Audience',
      '25+ Countries',
    ],
    description:
      'Alchemy of Yoga is a Yoga Alliance Registered 200-hour Teacher Training school led by Silvia Mordini — one of the most reputable yoga schools in the world, with 20+ years of operation, 39 graduating classes, and alumni from over 25 countries. The WordPress site serves as the hub for three distinct training tracks: a self-paced online course, a live cohort program, and an immersive 20-night Bali retreat. Student enrollment is handled through a Teachable integration, while the site itself drives discovery, trust-building, and conversion through rich program pages, testimonials, a blog, a free taster course, and downloadable guides.',
    features: [
      {
        title: 'Three Training Tracks',
        body: 'Self-paced online, live Zoom cohort, and 20-night Bali immersion retreat — each with dedicated landing pages, pricing, and enrollment flows.',
      },
      {
        title: 'Teachable Enrollment Integration',
        body: 'Student registration and course delivery connected to Teachable, with free taster course and instant-access purchase options.',
      },
      {
        title: 'Bali YTT Retreat Page',
        body: 'Full immersive landing page for the Bali program — daily schedule, venue, accommodation, visa info, pricing, and deposit flow.',
      },
      {
        title: 'Trust & Conversion System',
        body: 'Testimonials, free PDF guide ("Top 10 Tips"), free info session video, and Instagram feed — all working together to convert visitors to students.',
      },
      {
        title: 'Blog & Content Strategy',
        body: 'Active blog supporting SEO and audience nurturing, covering yoga philosophy, teacher training advice, and lifestyle content.',
      },
      {
        title: 'Global Community Platform',
        body: 'Multi-timezone live cohort support, newsletter integration, Facebook Messenger live chat, and social links across Facebook, Instagram, Pinterest, and YouTube.',
      },
    ],
    instructor: {
      initials: 'SM',
      name: 'Silvia Mordini',
      role: 'Founder & Lead Instructor',
      bio: 'World-renowned yoga teacher, author, and happiness coach. Founder of Alchemy of Yoga — a Yoga Alliance RYS 200 school with 39 graduating classes and alumni across 25+ countries including Australia, Japan, France, South Africa, and the United States.',
    },
  },

  {
    id: 6,
    category: 'websites',
    title: 'Live Love Flow Studios',
    subtitle:
      'WordPress website for a boutique hot yoga & fitness studio in Green Lake, Seattle — built alongside the custom logo we designed. Client has since migrated to Squarespace independently.',
    src: '/images/work/web-liveloveflow.png',
    srcFull: '/images/work/web-liveloveflow-full.png',
    url: 'https://www.liveloveflowstudios.com',
    color: '#2a7ab5',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'MindBody Integration',
      'Class Scheduling',
      'Wellness / Yoga',
      'Seattle WA',
    ],
    description:
      "Live Love Flow™ is a boutique hot yoga and fitness studio in Green Lake, Seattle offering three signature class formats: Flow (heated Vinyasa), Flow Fit (yoga-strength fusion), and Stretch (Yin-inspired mobility). We designed the original WordPress website alongside the studio's brand identity and logo — building a clean, conversion-focused online presence that connected their class schedule, instructor profiles, and pricing to a MindBody booking integration. The client has since migrated the site to Squarespace independently; the WordPress build and the logo are our work.",
    features: [
      {
        title: 'WordPress Custom Design',
        body: 'Fully custom WordPress theme built to match the Live Love Flow brand — white, blue, and warm photography throughout.',
      },
      {
        title: 'MindBody Booking Integration',
        body: 'Class scheduling and membership purchases connected to MindBody Online — the industry-standard booking platform for fitness studios.',
      },
      {
        title: 'Three Class Format Pages',
        body: 'Dedicated pages for Flow, Flow Fit, and Stretch — each with class description, intensity level, and what to expect for first-timers.',
      },
      {
        title: 'Pricing & Membership Pages',
        body: 'Class packs, monthly memberships, intro offers (3 classes for $30), and gift cards — all linked to live MindBody purchase flows.',
      },
      {
        title: 'Instructor Profiles',
        body: 'Individual pages for each instructor highlighting their background, teaching style, and class specialties.',
      },
      {
        title: 'Brand Continuity',
        body: 'Built as a direct extension of the logo we designed — same white/blue palette, "I Am" philosophy, and boutique studio tone carried throughout every page.',
      },
    ],
    migration: {
      from: 'WordPress (our build)',
      to: 'Squarespace (client-managed)',
      note: 'Client migrated to Squarespace independently after our engagement. The original WordPress site and logo design are our portfolio work.',
    },
  },

  {
    id: 7,
    category: 'websites',
    title: 'Seattle Platinum Limo',
    subtitle:
      "Original WordPress site for Seattle's premier luxury limo service — a one-of-a-kind scroll experience where a limo drives across a continuous panoramic cityscape as the user travels through service categories.",
    src: '/images/work/web-platinumlimo.png',
    srcFull: '/images/work/web-platinumlimo-full.png',
    url: 'https://seattleplatinumlimo.com',
    color: '#1a1a2e',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Horizontal Scroll',
      'Parallax Panorama',
      'Luxury Brand',
      'Seattle WA',
    ],
    description:
      "The original Seattle Platinum Limo WordPress site is one of the most distinctive scroll experiences we've ever built. Rather than a standard vertical layout, the entire site unfolds as a continuous horizontal panoramic cityscape — as the user scrolls, a limousine literally drives across the screen through seamlessly stitched Seattle scenes: downtown skyline at golden hour, the airport, lush green suburbs, a wedding venue at dusk, and an entertainment district at night. Each scene maps to a service category, with a dark content panel floating above the panorama. The sky itself transitions from warm daylight to deep night as you travel right — a cinematic metaphor for round-the-clock availability. Trusted by Microsoft, Boeing, Google, Apple, Deloitte, GE, and Expedia.",
    features: [
      {
        title: 'Limo-Drives-Through-the-Page',
        body: 'As the user scrolls, a stretch limo animates across a continuous panoramic backdrop — one of the most memorable scroll interactions ever built for a transport brand.',
      },
      {
        title: 'Seamless Panoramic Cityscape',
        body: 'A single composited horizontal scene spanning downtown Seattle, SeaTac airport, green suburbs, a wedding venue, and a nightlife strip — each zone its own service category.',
      },
      {
        title: 'Day-to-Night Sky Progression',
        body: "The sky transitions from warm golden daylight on the left to deep night on the right — a visual metaphor for Platinum Limo's 24/7 availability across every occasion.",
      },
      {
        title: 'Floating Dark Content Panels',
        body: 'Service info, copy, and CTAs presented in dark glass-style panels hovering above the panorama — legible and elegant against the richly illustrated background.',
      },
      {
        title: 'Scene-to-Service Mapping',
        body: 'Airport transfers, corporate travel, weddings, events, and hourly service each occupy a distinct scene — storytelling through environment, not just text.',
      },
      {
        title: 'Enterprise Trust & Booking',
        body: 'Corporate client logos (Microsoft, Boeing, Google, Apple, Deloitte) and MyLimoBiz online reservation flow embedded within the immersive single-page experience.',
      },
    ],
  },

  {
    id: 8,
    category: 'websites',
    title: 'Vector RE Corp',
    subtitle:
      'WordPress website for a Kirkland-based commercial real estate development firm — project portfolio, SVG service icon system, development pipeline, and an architectural brand presence built alongside the logo we designed.',
    src: '/images/work/web-vectorrecorp.png',
    srcFull: '/images/work/web-vectorrecorp-full.png',
    url: 'https://vectorrecorp.com',
    color: '#1c3a5e',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Real Estate Development',
      'Project Portfolio',
      'B2B / Corporate',
      'Kirkland WA',
    ],
    description:
      'Vector RE Corp is a commercial real estate development company based in Kirkland, WA, specializing in industrial logistics buildings across the Pacific Northwest. Their portfolio includes American Lake Logistics (158,000 sqft, Lakewood WA), Canyon East Logistics (325,000 sqft two-building development, Frederickson WA), and Tacoma I-5 Logistics — all fully leased or sold. We built the WordPress site alongside the brand identity and logo — creating a clean, architecturally-toned presence built to impress institutional investors, long-term tenants, and development partners. The site features a custom SVG icon system spanning 10 development disciplines and individual project pages with aerial photography and development narratives.',
    features: [
      {
        title: 'Project Portfolio Pages',
        body: 'Individual pages for American Lake Logistics, Canyon East Logistics, and Tacoma I-5 — with aerial photography, square footage specs, and project narrative.',
      },
      {
        title: 'SVG Service Icon System',
        body: '10 custom SVG icons covering the full development pipeline: Site Selection, Entitlement Procurement, Master Planning, Project Management, Value Engineering, Sustainable Development, Asset Management, and more.',
      },
      {
        title: 'Industrial Development Focus',
        body: 'Content architecture built around the industrial logistics sector — truck courts, clear heights, distribution tenants, and speculative development terminology.',
      },
      {
        title: 'Architectural Visual Design',
        body: 'Dark, concrete-toned aesthetic with precision typography — a visual language that matches the scale and seriousness of multi-hundred-thousand-square-foot projects.',
      },
      {
        title: 'News & Media Section',
        body: 'Project update and media hub keeping investors, tenants, and partners informed on development pipeline and completed projects.',
      },
      {
        title: 'B2B Contact & Team Pages',
        body: 'Direct contact routing to principals Tyler Litzenberger and Max Cordell, with LinkedIn and social presence integrated throughout.',
      },
    ],
    coaches: [
      {
        initials: 'TL',
        name: 'Tyler Litzenberger',
        role: 'Principal',
        bio: 'Commercial real estate developer specializing in industrial logistics projects across the Pacific Northwest. Based in Kirkland, WA.',
      },
      {
        initials: 'MC',
        name: 'Max Cordell',
        role: 'Principal',
        bio: 'Co-founder of Vector RE Corp, focused on site selection, entitlement procurement, and development project management for industrial tenants.',
      },
    ],
  },

  {
    id: 9,
    category: 'websites',
    title: 'Simply Sweet',
    subtitle:
      'Original WordPress website for a beloved Snohomish, WA artisan bakery — founded 2009, Snohomish Wedding Guild member, Climate Pledge Collective partner, and community institution. Client has since migrated to Squarespace independently.',
    src: '/images/work/web-simplysweetwa.png',
    srcFull: '/images/work/web-simplysweetwa-full.png',
    url: 'https://www.simplysweetwa.com',
    color: '#c0576e',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Bakery / Food',
      'Square Integration',
      'Weddings & Events',
      'Snohomish WA',
    ],
    description:
      'Simply Sweet has been making Snohomish County sweeter since 2009. This beloved artisan bakery at 2705 Bickford Ave specializes in cupcakes, custom cakes, cookies, French macarons, and cake pops — serving everything from everyday walk-in treats to elaborate wedding cakes, graduation orders, and custom event desserts. A longtime member of the Snohomish Wedding Guild and a partner of the Climate Pledge Collective (home of the Seattle Kraken and Seattle Storm), Simply Sweet is a genuine community institution. We built the original WordPress website — a warm, product-focused presence connecting their walk-in shop, custom order flow, party space, workshops, and wedding services into one cohesive experience. The client has since migrated to Squarespace independently; the WordPress build is our work.',
    features: [
      {
        title: 'Five Product Category Pages',
        body: 'Dedicated pages for Cupcakes, Cakes, Cookies, French Macarons, and Cake Pops — each with photography, flavor options, and custom order lead time guidance.',
      },
      {
        title: 'Square Online Order Integration',
        body: 'Walk-in and pre-order purchasing connected to Square (simply-sweet-wa.square.site) — allowing customers to order ahead for pickup from the Snohomish shop.',
      },
      {
        title: 'Weddings & Events Section',
        body: "Full wedding landing page showcasing Simply Sweet's role as a Snohomish Wedding Guild member, with galleries, inquiry prompts, and seasonal lead time guidance.",
      },
      {
        title: 'Custom Order Guide',
        body: 'A dedicated guide page walking customers through the custom order process — lead times, peak seasons (graduation, weddings), and how to request quote.',
      },
      {
        title: 'Party Space & Workshops',
        body: "Pages for the rentable party space and baking workshops/classes — expanding the bakery's revenue beyond product sales into experiences.",
      },
      {
        title: 'Instagram Feed & Brand Voice',
        body: 'Live Instagram integration and a warm, personality-driven brand voice throughout — "You\'re Simply the Best" — reflecting the bakery\'s beloved community identity.',
      },
    ],
    migration: {
      from: 'WordPress (our build)',
      to: 'Squarespace (client-managed)',
      note: 'Client migrated to Squarespace independently after our engagement. The original WordPress site is our portfolio work.',
    },
  },

  {
    id: 10,
    category: 'websites',
    title: 'Nelson Cabinetry',
    subtitle:
      'Large-scale WordPress WooCommerce e-commerce platform for a family-owned RTA cabinet company — 150,000+ cabinets sold, 11+ collections, 5 distribution centers, free 3D design tool, and retail partnerships with Wayfair, AllModern & more.',
    src: '/images/work/web-nelsonkb.png',
    srcFull: '/images/work/web-nelsonkb-full.png',
    url: 'https://nelsonkb.com',
    color: '#1a5fa8',
    aspect: 'wide',
    tags: [
      'WordPress',
      'WooCommerce',
      'E-Commerce',
      'Large Catalog',
      'Home & Kitchen',
      'Nationwide',
    ],
    description:
      'Nelson Cabinetry is a family-owned RTA (ready-to-assemble) cabinet company built on nearly 100 years of craftsmanship, selling wholesale-priced premium cabinets directly to homeowners, contractors, and designers across the U.S. The WordPress WooCommerce platform handles a massive catalog spanning 11+ cabinet collections, a free 3D kitchen design tool, 1-minute quote engine, budget calculator, assembly video library, nationwide shipping tracking, financing options, a scholarship program, and retail integrations with Wayfair, AllModern, BirchLane, Joss & Main, Bed Bath & Beyond, and Overstock. With 150,000+ cabinets sold, 18,000+ customers, 346 Google reviews, and 5 distribution centers across Texas, Florida, New York, Illinois, and California — this is one of the most feature-complete e-commerce builds in our portfolio.',
    features: [
      {
        title: 'WooCommerce Large-Catalog Store',
        body: '11+ collections (White, Gray, Blue, Black, Brown, Honey, Slim White, Slim Oak, Glossy White, Rustic Oak, Walnut, Matte White) with product pages, door samples, and cart — custom category architecture throughout.',
      },
      {
        title: 'Free 3D Kitchen Design Tool',
        body: 'Customers submit a sketch or photo and receive a free 3D rendering, custom layout, itemized quote, and cart link within 24 hours — fully integrated into the conversion funnel.',
      },
      {
        title: '1-Minute Quote & Budget Calculator',
        body: 'Custom-built tools letting customers estimate project costs instantly — reducing friction and driving qualified leads directly to the sales team at 832-998-6598.',
      },
      {
        title: 'Retail Partner Integrations',
        body: 'Product catalog syndicated to Wayfair, AllModern, BirchLane, Joss & Main, Bed Bath & Beyond, and Overstock — expanding reach far beyond direct-to-consumer.',
      },
      {
        title: 'Nationwide Logistics Infrastructure',
        body: '$399 flat-rate shipping from 5 distribution centers (TX, FL, NY, IL, CA), with shipment tracking page, assembly video guide library, and measurement how-to resources.',
      },
      {
        title: 'Full Resource & Trust Library',
        body: 'Assembly guides, remodel checklists, warranty docs, glossary, pricelist PDF, financing, scholarships, 18,000+ customer testimonials gallery, and FAQ — a complete buying journey resource hub.',
      },
    ],
  },

  {
    id: 11,
    category: 'websites',
    title: 'Cabinets.Deals',
    subtitle:
      'Custom e-commerce platform for a Houston-based dealer-exclusive RTA cabinet company — built strictly to serve dealers and trade professionals, with multiple cabinet lines, free 3D design, and retail partnerships with Wayfair, AllModern & Overstock.',
    src: '/images/work/web-cabinetsdeals.png',
    srcFull: '/images/work/web-cabinetsdeals-full.png',
    url: 'https://www.cabinets.deals',
    color: '#c0392b',
    aspect: 'wide',
    tags: [
      'Custom E-Commerce',
      'Magento / PHP',
      'Dealer-Exclusive',
      'Cabinet Catalog',
      'Home & Kitchen',
      'Houston TX',
    ],
    description:
      'Cabinets.Deals is a dealer-exclusive kitchen and bathroom cabinet e-commerce platform based in Houston, TX — a sister company to Northville Cabinetry operating out of the same location (9815 North Fwy). The business was strictly focused on dealing exclusively with dealers nationwide, with a goal to extend their services and offer products to private customers online. We were responsible for designing and developing a clean, dealer-facing website that would provide a premium experience. The platform carries multiple cabinet lines — Elements Line (Blue Shaker, Natural Wood, Elegant White, Espresso, Grey, Metallic), Northville Cabinetry Line, Prismora Frameless, Slim Craft, and Closet — alongside free 3D kitchen design, price match, dealer onboarding, installer network, and retail syndication to Wayfair, AllModern, Overstock, BirchLane, and Joss & Main.',
    features: [
      {
        title: 'Custom E-Commerce Platform',
        body: 'Fully custom-built dealer-focused cabinet store — multiple product lines, product comparison, quote requests, sample ordering, and a clean checkout built for trade professionals.',
      },
      {
        title: 'Multiple Cabinet Line Architecture',
        body: 'Elements Line, Northville Cabinetry Line, Prismora (Frameless), Slim Craft, Closet, and Sale categories — each with dedicated collection pages, product specs, and pricing.',
      },
      {
        title: 'Dealer & Professional Portal',
        body: 'Become a Dealer and Installer Network onboarding flows — purpose-built for a business dealing exclusively with trade professionals and resellers nationwide.',
      },
      {
        title: 'Free 3D Kitchen Design Integration',
        body: 'Full design request flow connected to the in-house design team — customers submit measurements and receive a 3D rendering and itemized quote.',
      },
      {
        title: 'Retail Partner Syndication',
        body: 'Product catalog integrated with Wayfair, AllModern, Overstock, BirchLane, and Joss & Main — expanding the dealer channel with major retail marketplaces.',
      },
      {
        title: 'Fully Responsive Multi-Device Build',
        body: 'Complete responsive design across desktop, tablet, and mobile — the product catalog, quote flows, and checkout all optimized for every screen size.',
      },
    ],
  },

  {
    id: 12,
    category: 'websites',
    title: 'TSI Inc.',
    subtitle:
      'Original WordPress website for an industrial machinery company in Lynnwood, WA — advanced wood processing technology serving OSB, particle board, and wood pellet manufacturers worldwide since 1992. Client has since migrated to Webflow independently.',
    src: '/images/work/web-tsiinc.png',
    srcFull: '/images/work/web-tsiinc-full.png',
    url: 'https://www.tsi-inc.net',
    color: '#2e7d32',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Industrial B2B',
      'Heavy Machinery',
      'Corporate',
      'Lynnwood WA',
    ],
    description:
      "TSI (Technology Systems Inc.) has been building advanced machinery for the global wood processing industry since 1992, operating out of Lynnwood, WA. Their product line spans Rotary Drum Dryers, Heat Energy Systems, Pollution Control equipment (collectively the \"Dryer Island\"), Torrefaction plants, and Finishing Lines — serving manufacturers of OSB (oriented strand board), particle board, and wood pellets. Clients include Weyerhaeuser, Grant Forest Products (world's largest twin OSB plants, 2006), Masisa Brazil (world's largest dryer, 24'×100', 2007), Portucel South Carolina (largest dryer in the industrial pellet industry, 2017), and a 120,000 tpy Torrefaction plant in SE Asia for a Japanese client (2023). We built the original WordPress website — a clean, authoritative corporate presence for a technically complex, internationally operating industrial company. The client has since migrated to Webflow independently; the WordPress build is our work.",
    features: [
      {
        title: 'Industrial B2B Corporate Site',
        body: 'Clean, authoritative WordPress build for a heavy machinery company operating across North America, Europe, Brazil, China, and SE Asia — designed to communicate technical credibility to industrial buyers.',
      },
      {
        title: 'Product Line Architecture',
        body: 'Dedicated pages for each product category: Dryer Islands, Dryers, Heat Energy Systems, Pollution Control, Torrefaction, and Finishing Lines — each with technical photography and specification context.',
      },
      {
        title: 'Industries Served Section',
        body: 'Pages covering the OSB, particle board, and wood pellet manufacturing sectors — helping prospective clients immediately identify relevance to their production environment.',
      },
      {
        title: 'Company Timeline & Credibility',
        body: "A 30+ year milestone timeline (1992–2023) establishing TSI's deep industry track record — from first Weyerhaeuser dryers to the world's largest dryer in Brazil and Torrefaction plants in Asia.",
      },
      {
        title: 'International Presence',
        body: 'Site architected to serve a global client base — with clear contact routing, international phone number (+1 425-771-1190), and content that speaks to buyers from North America, Europe, and Asia.',
      },
      {
        title: 'Jobs & Careers Section',
        body: "Careers page supporting the company's ongoing engineering talent recruitment — reflecting TSI's growth into new markets including Asian operations and a Beijing office.",
      },
    ],
    migration: {
      from: 'WordPress (our build)',
      to: 'Webflow (client-managed)',
      note: 'Client migrated to Webflow independently after our engagement. The original WordPress site is our portfolio work.',
    },
  },

  {
    id: 13,
    category: 'websites',
    title: 'Schippers & Crew',
    subtitle:
      'Original WordPress website for a 35+ year Seattle electronics manufacturing services company — ISO 9001, AS9100, ISO 13485 & ITAR certified, serving aerospace, medical, industrial and communications OEMs. Included full wireframes and trade show materials.',
    src: '/images/work/web-schippers.png',
    srcFull: '/images/work/web-schippers-full.png',
    url: 'https://www.schippers.com',
    color: '#1565c0',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Electronics Manufacturing',
      'Industrial B2B',
      'Aerospace / Medical',
      'Seattle WA',
    ],
    description:
      'Schippers & Crew, Inc. is a Seattle-based Electronics Manufacturing Services (EMS) company with 35+ years of operation, serving OEMs in test and measurement, medical instruments, industrial controls, communications, and aerospace from their Shilshole Ave NW facility. Their certifications — ISO 9001, AS9100, ISO 13485, and ITAR — signal a level of regulatory compliance that demands an equally credible digital presence. We built the original WordPress website from the ground up, beginning with a full sitemap and detailed wireframes before moving into design and development. The engagement also included trade show collateral: pull-up banner stands and event display materials. The client has since migrated to Wix independently; the WordPress build and trade show materials are our work.',
    features: [
      {
        title: 'Full Wireframe & Sitemap Process',
        body: 'Complete UX planning delivered before a single pixel was designed — full sitemap architecture and detailed page-level wireframes covering all services, about, contact, and jobs sections.',
      },
      {
        title: 'Electronics Manufacturing Corporate Site',
        body: 'Clean, authoritative WordPress build communicating PCB Assembly, Electromechanical Assembly, Testing & QC, and Supply Chain Management to OEM buyers across multiple regulated industries.',
      },
      {
        title: 'Certification & Compliance Visibility',
        body: 'ISO 9001, AS9100 (aerospace), ISO 13485 (medical devices), and ITAR certification prominently integrated — critical trust signals for aerospace and medical OEM prospects.',
      },
      {
        title: 'Services Architecture',
        body: 'Individual service pages for PCB Assembly, Electromechanical Assembly, Testing & Quality Control, and Supply Chain Management — each designed for technical buyers evaluating manufacturing partners.',
      },
      {
        title: 'Pull-Up Banner Stands — Three-Panel Suite',
        body: 'Three coordinated retractable banner stands: center services panel (Prototype Development, SMT, Box-Build, X-Ray Inspection, Turnkey Purchasing, Consigned Assembly, Through-Hole, Cable & Wire Assembly, Test & Engineering) flanked by industry sector panels (Industrial Controls/Communications/Medical and Commercial/Defense/Aerospace).',
      },
      {
        title: 'Quote Request & Lead Generation',
        body: 'Contact and quote request flows designed to convert OEM prospects into qualified leads — optimized for the long-cycle B2B manufacturing services sales process.',
      },
    ],
    migration: {
      from: 'WordPress (our build)',
      to: 'Wix (client-managed)',
      note: 'Client migrated to Wix independently after our engagement. The original WordPress site and trade show materials are our portfolio work.',
    },
  },

  {
    id: 14,
    category: 'websites',
    title: 'Alpha Construction',
    subtitle:
      'WordPress website and branding for a Greater Seattle custom home builder and remodeling company — founded 2001, serving residential and commercial clients including Nike Town Seattle, Old Navy & Abercrombie & Fitch. Full wireframes included.',
    src: '/images/work/web-alphawa.png',
    srcFull: '/images/work/web-alphawa-full.png',
    url: 'https://www.alphawa.com',
    color: '#e65100',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Construction / Home Building',
      'Wireframes',
      'Residential & Commercial',
      'Seattle WA',
    ],
    description:
      'Alpha Construction was founded in 2001 in Woodinville, WA to handle large-scale construction projects — custom home builds, major remodels, additions, and commercial work across the Greater Seattle area including Seattle, Bellevue, Kirkland, Redmond, Woodinville, and Puget Sound. Their commercial client roster includes Nike Town Seattle, Old Navy, Coldwater Creek, and Abercrombie & Fitch. They also manage 50+ residential properties with a handyman division. The objective was a website with impressive design that stood out from competitors, represented their modern home designs, was SEO-friendly, responsive, and eliminated clutter. We delivered a full engagement: custom WordPress build designed from complete wireframes and sitemap through to final responsive multi-page implementation — plus a supporting brand identity system.',
    features: [
      {
        title: 'Full Wireframe & Sitemap Process',
        body: 'Complete UX planning from the ground up — full orange-coded sitemap architecture and detailed hand-sketched page wireframes before any design began.',
      },
      {
        title: 'Custom WordPress Build',
        body: 'Modern, responsive WordPress site showcasing custom home builds and remodels — dramatic architectural photography, clean layouts, and a design that stands apart from competitor sites.',
      },
      {
        title: 'Residential & Commercial Services',
        body: 'Site architecture covering custom homes, remodeling, home additions, warranty repairs, handyman division, and property management — serving both homeowners and commercial clients.',
      },
      {
        title: 'Puget Sound Service Area Coverage',
        body: 'Content and SEO structure built for Seattle, Bellevue, Kirkland, Redmond, Woodinville, Issaquah, Sammamish, Lynnwood, Snohomish, and surrounding King/Snohomish County areas.',
      },
      {
        title: 'Lead Generation & Quote Flow',
        body: 'Contact and project inquiry flows optimized for the long-cycle residential remodeling and custom home sales process — designed to convert visitors into qualified consultations.',
      },
      {
        title: 'Multi-Page Responsive Build',
        body: "Full responsive implementation across desktop, tablet, and mobile — every page of the site optimized for the home-building prospect's research journey.",
      },
    ],
  },

  {
    id: 15,
    category: 'websites',
    title: 'Nova-Tech Engineering',
    subtitle:
      'Original WordPress website for a Lynnwood, WA aerospace automation & tooling company — 787 assembly systems, AGVs, friction stir welding, and circumferential drilling for Boeing and Northrop Grumman. Acquired by AIT in 2017.',
    src: '/images/work/web-novatech.png',
    srcFull: '/images/work/web-novatech-full.png',
    url: 'https://www.aint.com',
    color: '#00838f',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Aerospace Engineering',
      'Industrial B2B',
      'Information Architecture',
      'Lynnwood WA',
    ],
    description:
      'Nova-Tech Engineering was a Lynnwood/Mountlake Terrace, WA aerospace automation and tooling company with a strong reputation for engineering excellence — building 787 final assembly systems, AGVs, automated drilling systems, laser indexing, friction stir welding equipment, and precision tooling for clients including Boeing and Northrop Grumman. The existing website had a critical problem: overwhelming content scattered all over the place with no clear organization. The solution was a modern-looking WordPress site that pulled all that data together — organized logically with just enough links to prevent clutter and an intuitive browsing experience. The site was reduced from 5 style pages to 2, with a clean sidebar navigation offering an elegant solution for a technically deep company. Nova-Tech was acquired by Dallas-based Advanced Integration Technology (AIT) in 2017, and was previously a division of TSI Inc. — another client of ours — before being sold in 2018.',
    features: [
      {
        title: 'Content Architecture Overhaul',
        body: 'Reduced from 5 style pages to 2 — all technical data, product specs, and service content reorganized into a clean, logical hierarchy with intuitive sidebar navigation.',
      },
      {
        title: 'Aerospace Product Pages',
        body: 'Individual pages for AGVs, Automated Systems for Part-to-Part Assembly, Circumferential Drillers, Friction Stir Welding, Laser Indexing Systems, Positioning Systems, and NCDJ.',
      },
      {
        title: 'Boeing 787 Project Showcase',
        body: 'Dedicated project pages for the 787 final assembly systems, large-scale integration projects, drilling projects, and assembly/alignment work — with aerospace photography throughout.',
      },
      {
        title: 'Modern Responsive WordPress Build',
        body: 'Clean, modern-looking site that is fully responsive across desktop, tablet, and mobile — consistent across all modern devices and browsers.',
      },
      {
        title: 'Sidebar Navigation System',
        body: 'Elegant sidebar navigation structure replacing the previous overcrowded layout — allowing deep technical content to breathe while remaining fully accessible.',
      },
      {
        title: 'B2B Aerospace Credibility',
        body: 'Visual design and content strategy built to communicate engineering excellence to aerospace prime contractors — a site that looks as capable as the machines Nova-Tech builds.',
      },
    ],
  },

  {
    id: 16,
    category: 'websites',
    title: 'Ruby The Pet Nanny',
    subtitle:
      'WordPress website and brand identity for a pet sitting & nanny service — warm photography-driven design, hand-sketched logo, full wireframes, mobile-responsive build, and business card design. Business has since closed.',
    src: '/images/work/web-rubypetnanny.png',
    srcFull: '/images/work/web-rubypetnanny-full.png',
    url: null,
    color: '#f9a825',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Brand Identity',
      'Wireframes',
      'Pet Services',
      'Business Cards',
    ],
    description:
      'Ruby The Pet Nanny was a pet sitting and nanny service with a warm, personality-driven brand built around the genuine relationship between Ruby, her clients, and their animals. The full engagement included: hand-drawn logo concept sketches, a complete blue-coded sitemap and wireframes, custom WordPress build with warm pet photography as the hero, full mobile-responsive implementation, contact form, and yellow premium business card design. The site led with beautiful dog and cat photography to immediately communicate trust and warmth — exactly what pet owners need to feel before handing over their keys. The business has since closed, but the work stands as a complete website + brand identity package.',
    features: [
      {
        title: 'Hand-Sketched Logo Concept',
        body: 'Logo development started from hand-drawn sketch concepts — an organic, personal process that matched the warmth and authenticity of the Ruby The Pet Nanny brand.',
      },
      {
        title: 'Wireframe & Sitemap Process',
        body: 'Complete blue-coded sitemap and page-level wireframes delivered before design — covering Home, Services, About Us, Photo/Pricing, Contact, and Gallery pages.',
      },
      {
        title: 'Photography-Led WordPress Build',
        body: 'Warm, animal-forward hero photography anchors every page — desktop, tablet, and mobile — making the emotional connection with pet owners immediate and instinctive.',
      },
      {
        title: 'Mobile-Responsive Design',
        body: 'Fully responsive build across desktop, tablet, and phone — clean and consistent at every screen size, tested across modern devices and browsers.',
      },
      {
        title: 'Contact & Booking Flow',
        body: 'Integrated contact form and booking inquiry flow designed to convert pet owners into consultations — simple, friendly, and frictionless.',
      },
      {
        title: 'Business Card Design',
        body: 'Premium yellow business cards with the Ruby The Pet Nanny logo and contact details — print-ready mockup delivered alongside the website launch.',
      },
    ],
  },

  {
    id: 17,
    category: 'websites',
    title: 'Classmates.com',
    subtitle:
      'UI/UX revamp and feature development for a subscription platform with 40M+ active subscribers and 100M+ unique members across corporate sites — A/B testing with Optimizely & Adobe Target, component design, and full template system.',
    src: '/images/work/web-classmates.png',
    srcFull: '/images/work/web-classmates-full.png',
    url: 'https://www.classmates.com',
    color: '#1a73e8',
    aspect: 'wide',
    tags: [
      'UI/UX Design',
      'Product Design',
      'A/B Testing',
      'Subscription Platform',
      'Enterprise Scale',
      'Optimizely / Adobe Target',
    ],
    description:
      'Classmates.com is one of the longest-running social networking platforms in the United States — a subscription-based service connecting people with their school memories and former classmates, with over 40 million active subscribers and more than 100 million unique members across the corporate site network. The engagement involved revamping the UI and app interface at scale: designing and developing content, features, components, and templates across all corporate websites — then validating improvements through A/B tests using Optimizely and Adobe Target. Working at this level of scale means every design decision impacts tens of millions of real users, and every A/B test is a live experiment running against a massive subscriber base.',
    features: [
      {
        title: 'UI/UX Revamp at Scale',
        body: 'Full interface revamp across the Classmates subscription platform — new visual design, updated component library, and improved user flows affecting 40M+ active subscribers.',
      },
      {
        title: 'Component & Template System',
        body: 'Designed and developed reusable content components and page templates deployed across all corporate websites in the network — exceeding 100M unique members combined.',
      },
      {
        title: 'A/B Testing with Optimizely',
        body: 'Built and ran controlled A/B experiments using Optimizely — testing interface variations, feature presentations, and conversion flows against live subscriber traffic.',
      },
      {
        title: 'A/B Testing with Adobe Target',
        body: 'Parallel experimentation using Adobe Target for personalization and targeting — optimizing the subscription experience for different audience segments at enterprise scale.',
      },
      {
        title: 'Subscription Conversion Optimization',
        body: 'Feature and UI work focused on improving subscription conversion, retention, and engagement — metrics that directly affect revenue at a platform with millions of paid members.',
      },
      {
        title: 'Enterprise-Scale Product Development',
        body: 'Operated within a large-scale product team environment — designing, developing, and shipping features that reach tens of millions of users with the quality and rigor that scale demands.',
      },
    ],
  },

  {
    id: 18,
    category: 'websites',
    title: 'Intelius',
    subtitle:
      'UI/UX revamp, feature development, and corporate blog design for a people search & background check subscription platform — part of the PeopleConnect family alongside Classmates.com, 40M+ subscribers, 100M+ unique members, A/B testing at enterprise scale.',
    src: '/images/work/web-intelius.png',
    srcFull: '/images/work/web-intelius-full.png',
    url: 'https://www.intelius.com',
    color: '#0d47a1',
    aspect: 'wide',
    tags: [
      'UI/UX Design',
      'Product Design',
      'A/B Testing',
      'People Search',
      'Subscription Platform',
      'Corporate Blog',
    ],
    description:
      'Intelius is a people search and background check subscription platform based in Bellevue, WA — part of the PeopleConnect family alongside Classmates.com, serving over 40 million subscribers with access to public records, contact information, background reports, and identity data. The engagement mirrored the Classmates work in scope and tooling: UI/UX revamp across the subscription platform and app interface, designing and developing content, features, components, and templates across all corporate websites in the network (combined 100M+ unique members), and A/B testing using Optimizely and Adobe Target. Additionally, we designed and developed a full corporate blog for Intelius — a standalone 3-month project covering information architecture, visual design, content templates, and CMS integration.',
    features: [
      {
        title: 'UI/UX Platform Revamp',
        body: 'Full interface redesign across the Intelius subscription platform and app — updated component library, improved user flows, and a modern visual system for 40M+ active subscribers.',
      },
      {
        title: 'Component & Template System',
        body: 'Designed and developed reusable content components and page templates across all PeopleConnect corporate websites — a network exceeding 100M unique members combined.',
      },
      {
        title: 'A/B Testing with Optimizely & Adobe Target',
        body: 'Built and ran controlled experiments using both Optimizely and Adobe Target — testing subscription flows, feature presentations, and personalization strategies against live subscriber traffic.',
      },
      {
        title: 'Corporate Blog — 3-Month Project',
        body: 'Standalone blog design and development engagement spanning 3 months — information architecture, visual design system, article templates, category pages, and CMS integration for the Intelius editorial team.',
      },
      {
        title: 'People Search & Background Check UX',
        body: 'Interface design for a sensitive product category — balancing data density (public records, contact info, background reports) with a clean, trustworthy user experience.',
      },
      {
        title: 'PeopleConnect Network Consistency',
        body: 'Design work coordinated across the Intelius and Classmates product portfolios within the same parent company — shared component patterns, consistent quality bar, and unified enterprise tooling.',
      },
    ],
  },

  {
    id: 19,
    category: 'websites',
    title: 'DCM Contractors',
    subtitle:
      'WordPress website and logo design for a specialty commercial general contractor — Dental, Medical & Commercial construction across the Greater Seattle area, with a project portfolio featuring dental offices, medical facilities, and public buildings.',
    src: '/images/work/web-dcmcontractors.png',
    srcFull: '/images/work/web-dcmcontractors-full.png',
    url: 'http://dcmcontractors.com',
    color: '#1a237e',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Theme',
      'Logo Design',
      'Construction',
      'Dental / Medical',
      'Seattle WA',
    ],
    description:
      'DCM Contractors is a specialty commercial general contractor serving dental offices, medical facilities, and commercial clients across Greater Seattle — operating within the framework of integrity and craftsmanship. Their specialization in dental and medical construction sets them apart from general contractors: they understand the unique systems, regulations, and end-user needs of clinical environments. We designed the logo and built the custom WordPress site as a clean single-page experience with smooth anchor navigation — covering Services (Dental, Medical, Commercial), a filterable project Portfolio (Juanita Kids Dentistry, Signature Smiles, Dr. Matt Bagnulo, Dr. Brandon Johnson, Dentistry of Monroe, Dr. Bart Robison, Dr. Alex Kang, Lea Hill Police Substation), About, and Contact.',
    features: [
      {
        title: 'Dental & Medical Construction Specialization',
        body: "Site architecture and content built for DCM's niche: dental office fit-outs, medical facility construction, and commercial builds — each service section communicating industry-specific expertise.",
      },
      {
        title: 'Single-Page Anchor Navigation',
        body: 'Clean single-page WordPress build with smooth anchor scroll to Home, Services, Portfolio, and Our Company — minimal, fast, and distraction-free for prospective clients.',
      },
      {
        title: 'Filterable Project Portfolio',
        body: 'Project gallery with Dental and Commercial category filters — showcasing completed work for dental practices (Juanita Kids Dentistry, Signature Smiles, 5 dental offices) and commercial clients (Lea Hill Police Substation).',
      },
      {
        title: 'Custom WordPress Theme',
        body: "Fully custom theme with retina-ready logo (@2x), responsive layout, and a sliding contact bar — built to perform on any device and reflect the professionalism of DCM's work.",
      },
      {
        title: 'Lead Generation Contact Form',
        body: 'Integrated contact form with sliding panel — optimized for the project inquiry and consultation-booking process typical of commercial construction sales cycles.',
      },
      {
        title: 'Logo Design',
        body: 'Custom logo designed alongside the site — a professional mark that carries the DCM brand across the website header, business collateral, and construction site materials.',
      },
    ],
  },

  {
    id: 22,
    category: 'websites',
    title: 'GraphiCode Inc.',
    subtitle:
      'Website design and development for a Redmond electronics manufacturing CAM software company — GC-PowerPlatform suite (GC-Prevue, GC-PowerPlace, GC-PowerStation, GC-CAM Edit), plus software box packaging, disc design, and product data sheets.',
    src: '/images/work/web-graphicode.png',
    srcFull: '/images/work/web-graphicode-full.png',
    url: 'https://www.graphicode.com',
    color: '#e65100',
    aspect: 'wide',
    tags: [
      'Website Design',
      'B2B Software',
      'Electronics Manufacturing',
      'CAM Software',
      'Product Pages',
      'Redmond WA',
    ],
    description:
      'GraphiCode Inc. is a Redmond, WA software company providing the GC-PowerPlatform suite of CAM tools for the global electronics manufacturing industry — GC-Prevue (industry-standard Gerber data viewer), GC-PowerPlace (PCB assembly CAM), GC-PowerStation (PCB fabrication CAM), GC-CAM Edit (panelization and editing), and GC-PrevuePlus. The website needed to communicate a technically complex product line to engineering buyers across PCB manufacturing, assembly, and fabrication — with clear product differentiation, downloadable trial versions, and a product matrix for comparison. The engagement also covered software packaging: retail box design, CD packaging, product data sheets, and the Product Matrix comparison grid.',
    features: [
      {
        title: 'CAM Software Product Architecture',
        body: 'Website structure covering five distinct products — GC-Prevue, GC-PowerPlace, GC-PowerStation, GC-CAM Edit, GC-PrevuePlus — each with dedicated pages, feature lists, and trial download flows.',
      },
      {
        title: 'GC-Prevue Eye-Graphic Hero',
        body: 'Distinctive close-up eye photography brand visual for GC-Prevue ("Your Hassle Free Gerber Data Viewer") — a memorable visual metaphor that anchors the flagship product page.',
      },
      {
        title: 'Product Matrix Page',
        body: 'Comparison grid for the full GC-PowerPlatform suite — Input Format, Output Format, Assembly Operations, and feature flags across all products — built for technical buyers evaluating CAM software options.',
      },
      {
        title: 'Software Packaging & Print Collateral',
        body: 'Full physical product suite: retail box design, CD/disc packaging for GC-PowerPlace, product data sheets, and the GC-PowerPlatform brochure — all in the dark orange tech aesthetic.',
      },
      {
        title: 'Technical B2B Product Pages',
        body: 'Product pages written and designed for PCB engineers and contract manufacturers — technical specifications, feature comparisons, and download/purchase CTAs integrated throughout.',
      },
      {
        title: 'Global Electronics Manufacturing Audience',
        body: "Site designed for GraphiCode's worldwide customer base — PCB fabricators, contract manufacturers, and EMS companies across North America, Europe, and Asia.",
      },
    ],
  },

  {
    id: 23,
    category: 'websites',
    title: 'Dominis Stone',
    subtitle:
      "Website design and development for Seattle's & Boise's countertop destination — Quartz, Dekton, Porcelain, Quartzite, Granite, and Marble product pages, Cambria brand integration, kitchen design tools, installer network, two locations (Tukwila WA & Meridian ID).",
    src: '/images/work/web-dominisstone.png',
    srcFull: '/images/work/web-dominisstone-full.png',
    url: 'https://dominisstone.com',
    color: '#4a4a4a',
    aspect: 'wide',
    tags: [
      'Website Design',
      'WordPress',
      'E-Commerce / Showroom',
      'Natural Stone',
      'Cambria Partner',
      'Seattle WA',
    ],
    description:
      "Dominis Stone is Seattle's and Boise's premier countertop destination — a natural stone showroom and fabricator with locations in Tukwila, WA (13400 Interurban Ave S, 253-277-1854) and Meridian, ID (2835 E Lanark St, 208-609-3805). Their product offering spans Quartz, Dekton, Porcelain, Quartzite, Granite, Marble, and Sinks — with brand partnerships including Silestone, MSI, Cambria, Dekton, Arizon, Natural Stone Institute, and ISFA. The website needed to showcase the full stone catalog, support the Cambria brand partnership (Design Palette, Inspiration Gallery, Why Cambria, Edge Profiles, Cambria Videos), and provide kitchen design tools (Kitchen Design, How to Sketch) and process information for homeowners and designers.",
    features: [
      {
        title: 'Six Stone Category Pages',
        body: 'Individual product pages for Quartz, Dekton, Porcelain, Quartzite, Granite, and Marble — each with material properties, photography, and specification details for homeowners and design professionals.',
      },
      {
        title: 'Cambria Brand Partnership Integration',
        body: 'Full Cambria sub-site section: Design Palette, Inspiration Gallery, Why Cambria, Edge Profiles, and Cambria Videos — a dedicated brand presence within the Dominis Stone site.',
      },
      {
        title: 'Kitchen Design Tools',
        body: 'Kitchen Design and How to Sketch pages — interactive resources helping customers plan their countertop projects before visiting the showroom.',
      },
      {
        title: 'Dual Location Coverage',
        body: 'Site architecture serving both the Tukwila, WA and Meridian, ID locations — with distinct contact information, maps, and local SEO for both Pacific Northwest and Idaho markets.',
      },
      {
        title: 'Brand Partner Showcase',
        body: "Silestone, MSI, Cambria, Dekton, Arizon, Natural Stone Institute, and ISFA partner logos integrated — communicating the quality and credentials of Dominis Stone's supplier relationships.",
      },
      {
        title: 'Gallery & Process Pages',
        body: 'Completed project gallery and installation process explanation — helping homeowners understand what to expect from countertop selection through professional installation.',
      },
    ],
  },

  {
    id: 24,
    category: 'websites',
    title: 'Meraka',
    subtitle:
      'WordPress website for a Washington State real estate investment and property management company — transforming homes and revitalizing communities through strategic acquisitions, thoughtful renovations, and affordable housing. Designed by Rainboots Marketing.',
    src: '/images/portfolio/merakaWebsite.png',
    srcFull: '/images/portfolio/merakaWebsite.png',
    url: 'https://meraka.com',
    color: '#2e7d32',
    aspect: 'wide',
    tags: [
      'WordPress',
      'Custom Design',
      'Real Estate',
      'Property Management',
      'Affordable Housing',
      'Washington State',
    ],
    description:
      'Meraka is a Washington State real estate investment and property management company founded in 2022 — specializing in single- and multi-family housing with a mission to revitalize neighborhoods through strategic acquisitions, thoughtful renovations, and high-quality affordable housing. The name draws from the Bosnian phrase "E Merak(a) u večeri rane," reflecting a philosophy of cherishing simple joys and building lasting community. The WordPress website covers Available Properties, About Us, Team, and Contact — with an inquiry flow for prospective renters and a clean, community-focused design. Designed and developed by Rainboots Marketing.',
    features: [
      {
        title: 'Available Properties Showcase',
        body: 'Clean property listing section with rental inquiry flow — "Inquire About Rental" CTA connecting prospective tenants directly to the Meraka team.',
      },
      {
        title: 'Mission & Values Architecture',
        body: 'About Us content communicating the three-pillar approach: Discover Potential (identify undervalued properties), Elevate Design (thoughtful renovation), Build Community (qualified tenant placement).',
      },
      {
        title: 'Team & Credibility Pages',
        body: 'Team page establishing the principals behind Meraka — supporting the trust-building process for both prospective tenants and investment partners.',
      },
      {
        title: 'Affordable Housing Positioning',
        body: "Brand voice and design that communicates Meraka's dual mission — sustainable returns for investors AND high-quality, affordable housing for community members — without compromising either.",
      },
      {
        title: 'Washington State & Idaho Market',
        body: "Site designed for Meraka's Pacific Northwest operations — clean, community-oriented aesthetic reflecting the neighborhoods they invest in and the tenants they serve.",
      },
      {
        title: 'Rainboots Marketing Build',
        body: 'Designed and developed by Rainboots Marketing LLC — the footer credit on the live site confirms the engagement and connects this work to the broader Rainboots portfolio.',
      },
    ],
  },

  // ── Logos ──────────────────────────────────────────────────────────────────

  {
    id: 25,
    category: 'logos',
    title: 'DCM Contractors',
    subtitle:
      'Logo design for a specialty commercial general contractor — a professional mark built for dental, medical, and commercial construction in Greater Seattle.',
    src: '/images/portfolio/dcmContractors.jpg',
    srcFull: '/images/portfolio/dcmContractors.jpg',
    url: 'http://dcmcontractors.com',
    color: '#1a237e',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Construction',
      'Dental / Medical',
      'Corporate',
      'Seattle WA',
    ],
    description:
      'DCM Contractors specializes in dental office construction, medical facility build-outs, and commercial construction across Greater Seattle — a niche that demands a logo communicating precision, trust, and industry expertise. The mark needed to work across a WordPress website header, construction site signage, business cards, and proposal documents — credible enough to win bids from dental and medical practice owners who are investing significant capital in their facilities. Designed as part of a full engagement that included the custom WordPress website.',
    features: [
      {
        title: 'Specialty Contractor Credibility',
        body: 'A professional, clean mark that communicates the precision and trust required to win dental and medical construction contracts from practice owners and healthcare operators.',
      },
      {
        title: 'Retina-Ready Delivery',
        body: 'Logo delivered as standard and @2x retina-ready PNG files — crisp at all resolutions across the WordPress header, digital materials, and high-DPI displays.',
      },
      {
        title: 'Construction Industry Positioning',
        body: 'Visual identity that positions DCM above generic contractors — reflecting their niche expertise in Dental, Medical, and Commercial build environments.',
      },
      {
        title: 'Multi-Format Application',
        body: 'Mark applied across website header, business collateral, project portfolio pages, and construction documentation — consistent identity at every client touchpoint.',
      },
      {
        title: 'Built Alongside the Website',
        body: 'Logo and site designed as a unified engagement — the same mark used in the custom WordPress theme header, sliding contact bar, and all site imagery.',
      },
      {
        title: 'Greater Seattle Market Presence',
        body: "Identity built to establish DCM's brand authority across their service area — supporting business development with dental practices, medical clinics, and commercial property owners.",
      },
    ],
  },

  {
    id: 21,
    category: 'logos',
    title: 'Partizan Hoops',
    subtitle:
      'Logo design for a K-12 AAU basketball camp in the Pacific Northwest — a bold, dynamic mark for a program built on European fundamentals and elite coaching.',
    src: '/images/portfolio/partizanLogo.jpg',
    srcFull: '/images/portfolio/partizanLogo-full.jpg',
    url: 'https://partizanhoops.com',
    color: '#E85D04',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Sports / Basketball',
      'AAU / K-12',
      'Pacific Northwest',
    ],
    description:
      'Partizan Hoops is a K-12 youth basketball camp and AAU program led by two former professional players — Zlatko Savovic (Lehigh University, Crvena Zvezda, Europe) and Armend Kahrimanovic (University of Idaho, professional clubs in Greece and the Balkans). The logo needed to project athletic intensity and European-style precision while remaining accessible to the parents, kids, and coaches who make up the community. The mark anchors the entire platform — from the custom React website and CMS to tournament flyers, team jerseys, and registration confirmation emails — in a cohesive identity that sets Partizan apart from generic AAU programs.',
    features: [
      {
        title: 'Athletic Energy & Precision',
        body: 'The mark balances the intensity of competitive basketball with the structured, fundamentals-first coaching philosophy the program is built on.',
      },
      {
        title: 'European Basketball Heritage',
        body: "Visual language informed by Partizan Belgrade's storied European basketball tradition — serious, technical, and proud of its roots.",
      },
      {
        title: 'Full Platform Application',
        body: 'Applied across the React website, CMS admin panel, tournament materials, registration flows, coach profile pages, and program listings.',
      },
      {
        title: 'Bold Orange Identity',
        body: 'A high-energy orange palette commands attention on court and screen alike — standout on dark jerseys, white backgrounds, and digital assets.',
      },
      {
        title: 'Multi-Format Delivery',
        body: 'Logo suite covering primary mark, horizontal lockup, and icon-only version for app icons, social avatars, and embroidered apparel.',
      },
      {
        title: 'Community-Ready Brand',
        body: 'Designed to grow with the program — from single-session camps to a full AAU tournament calendar serving grades K–12 across the Pacific Northwest.',
      },
    ],
  },

  {
    id: 26,
    category: 'logos',
    title: 'Bothell Select Basketball',
    subtitle:
      'Logo design for a competitive Boys & Girls AAU program in Bothell, WA — clean, professional mark for a grades 4–8 organization running tournaments, registrations, and year-round programming.',
    src: '/images/work/logo-bothellselect.png',
    srcFull: '/images/work/logo-bothellselect-full.png',
    url: 'https://bothellselect.com',
    color: '#506ee4',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Sports / Basketball',
      'Boys & Girls 4th–8th',
      'Bothell WA',
    ],
    description:
      'Bothell Select Basketball is a competitive AAU program serving Boys & Girls in grades 4 through 8 in Bothell, WA. The logo needed to look as organized and credible as the program itself — one that runs tournaments like the Winter Classic, manages multi-division team registrations, and operates a full CMS-powered digital platform. The mark communicates structure and competitive spirit without leaning into aggressive sports clichés — it needed to appeal equally to parents, kids, and coaches across age groups and skill levels.',
    features: [
      {
        title: 'Credibility for a Growing Program',
        body: 'A polished, professional mark that signals organizational depth — matching the tournament management infrastructure and custom registration platform behind it.',
      },
      {
        title: 'Blue & White Brand System',
        body: 'Primary blue (#506ee4) and white palette — clean and versatile across jerseys, tournament banners, website headers, and digital registration materials.',
      },
      {
        title: 'Boys & Girls Inclusive',
        body: 'Gender-neutral design language that works equally well across the Boys and Girls program tracks, grades 4th through 8th.',
      },
      {
        title: 'Tournament Identity',
        body: 'Mark applied across Winter Classic and other tournament materials — brackets, event pages, and CMS-generated schedules all anchor back to this identity.',
      },
      {
        title: 'Full Platform Integration',
        body: 'Applied across the React website, team registration portal, admin CMS dashboard, event listings, and coach-facing roster management tools.',
      },
      {
        title: 'Referral-Grade Brand',
        body: 'The identity helped establish Bothell Select as the reference client that directly referred Partizan Basketball Camp — proof the brand communicated the right level of quality.',
      },
    ],
  },

  {
    id: 27,
    category: 'logos',
    title: 'Vector RE Corp',
    subtitle:
      'Logo design for a Kirkland-based commercial real estate development firm — a precise, architectural mark built for industrial-scale credibility.',
    src: '/images/work/logo-vectorrecorp.png',
    srcFull: '/images/work/logo-vectorrecorp-full.png',
    url: 'https://vectorrecorp.com',
    color: '#1c3a5e',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Real Estate',
      'Corporate / B2B',
      'Kirkland WA',
      'Industrial',
    ],
    description:
      'Vector RE Corp develops large-scale industrial logistics buildings across the Pacific Northwest — 158,000 to 325,000+ square foot projects serving sophisticated distribution tenants. The logo needed to communicate institutional precision, architectural scale, and long-term investment credibility. The mark references the concept of a vector: direction, force, and purposeful movement — aligned with the firm\'s tagline "Develop Efficiently, Build Creatively." Applied across the WordPress site, business collateral, LinkedIn, investor presentations, and individual project PDFs.',
    features: [
      {
        title: 'Architectural Precision',
        body: 'Clean geometric mark conveying the exactness of site planning, entitlement management, and structural development — not decorative, purposeful.',
      },
      {
        title: '"Vector" Concept in the Mark',
        body: 'The identity references direction and momentum — a visual embodiment of the firm\'s tagline "Develop Efficiently, Build Creatively."',
      },
      {
        title: 'Institutional Color Palette',
        body: 'Deep navy tones communicate the gravitas of a firm managing multi-hundred-thousand-square-foot industrial projects for long-term tenants.',
      },
      {
        title: 'WordPress Header Delivery',
        body: 'Logo delivered as a clean PNG optimized for the WordPress site header — crisp at all viewport sizes across desktop and mobile.',
      },
      {
        title: 'B2B & Investor-Ready',
        body: 'Mark works across project PDFs, LinkedIn, investor presentations, and business cards — anywhere a Fortune 500 tenant or institutional investor might encounter the brand.',
      },
      {
        title: 'Scales with the Portfolio',
        body: 'Designed to anchor a growing portfolio — from Tacoma I-5 to Canyon East — giving each project page a consistent, trusted parent brand.',
      },
    ],
  },

  {
    id: 28,
    category: 'logos',
    title: 'Live Love Flow Studios',
    subtitle:
      'Logo design for a boutique hot yoga & fitness studio in Green Lake, Seattle — white/blue mark built around the "I Am" philosophy and three signature movement methods.',
    src: '/images/work/logo-liveloveflow.png',
    srcFull: '/images/work/logo-liveloveflow-full.png',
    url: 'https://www.liveloveflowstudios.com',
    color: '#2a7ab5',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Wellness / Yoga',
      'Seattle WA',
      'Boutique Studio',
    ],
    description:
      'Live Love Flow™ is a boutique Heated Flow Yoga and Strength Training studio located in Green Lake, Seattle. We designed the logo as part of a full brand engagement that included the original WordPress website. The mark needed to carry the studio\'s core philosophy — the "I Am" concept rooted in the first chakra, representing grounding, confidence, and connection — while feeling clean and versatile enough to live across class booking apps, signage, merchandise, and the web. The result is a white-and-blue mark that balances the warmth of a wellness brand with the clarity of a modern fitness studio.',
    features: [
      {
        title: '"I Am" Philosophy',
        body: "The mark reflects the studio's chakra-rooted identity — grounded, confident, and inviting across all three signature movement methods.",
      },
      {
        title: 'White & Blue Color System',
        body: 'A crisp white primary mark with a signature blue accent — versatile across dark backgrounds, light surfaces, and branded merchandise.',
      },
      {
        title: 'Transparent PNG Delivery',
        body: 'Logo delivered as a transparent-background PNG for seamless use across the website, MindBody booking app, and print.',
      },
      {
        title: 'Multi-Format Suite',
        body: 'Full logo suite including primary stacked lockup, horizontal variant, and icon-only mark for app icons and social avatars.',
      },
      {
        title: 'Wellness Brand Tone',
        body: 'Balances the energy of a hot yoga studio with the approachability of a community-first fitness space — not clinical, not overly spiritual.',
      },
      {
        title: 'Applied Brand Context',
        body: 'Designed for real-world use: website header, class scheduling platform (MindBody), instructor bios, signage at 6900 East Green Lake Way N.',
      },
    ],
  },

  {
    id: 29,
    category: 'logos',
    title: 'Seattle Platinum Limo',
    subtitle:
      "Logo design for Seattle's premier luxury chauffeured transport service — a premium dark mark trusted by Microsoft, Boeing, Google, Apple & Deloitte.",
    src: '/images/work/logo-platinumlimo.png',
    srcFull: '/images/work/logo-platinumlimo-full.png',
    url: 'https://seattleplatinumlimo.com',
    color: '#1a1a2e',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Luxury / Premium',
      'Transportation',
      'Seattle WA',
      'B2B & Corporate',
    ],
    description:
      'Seattle Platinum Limo is the Pacific Northwest\'s premier chauffeured transportation service, trusted by corporate clients including Microsoft, Boeing, Google, Apple, Deloitte, GE, and Expedia. Their tagline — "You\'ve Tried the Rest, Now Try the Best" — set the design brief clearly: this logo needed to communicate elite, no-compromise luxury while remaining clean and versatile across a WordPress website, booking platform, vehicle livery, and business collateral. The result is a dark, refined mark that lives up to the fleet it represents: BMW 7 Series, Cadillac XTS, Cadillac Escalade, and Mercedes Sprinter.',
    features: [
      {
        title: 'Premium Dark Identity',
        body: 'Deep dark palette communicating luxury, exclusivity, and nighttime elegance — consistent with the high-end chauffeured service segment.',
      },
      {
        title: 'Corporate & B2B Ready',
        body: 'Mark works equally well on executive business cards, email signatures, and partner materials for Fortune 500 clients like Microsoft, Boeing, and Google.',
      },
      {
        title: 'Vehicle Livery Application',
        body: 'Designed to read clearly on dark vehicle exteriors — BMW 7 Series, Cadillac Escalade, and Mercedes Sprinter fleet branding.',
      },
      {
        title: 'WordPress Website Header',
        body: 'Delivered as a cropped transparent PNG optimized for WordPress — for crisp rendering at all screen sizes.',
      },
      {
        title: 'Booking Platform Presence',
        body: 'Mark used across the MyLimoBiz online reservation platform and all client-facing digital touchpoints.',
      },
      {
        title: 'Trust Signal Design',
        body: 'The visual weight and refinement of the mark directly supports the testimonials and client roster — a logo that looks as reliable as the service.',
      },
    ],
  },

  {
    id: 30,
    category: 'logos',
    title: 'Muki Construction',
    subtitle:
      'Logo design for a Seattle tile & stone contractor — two-color system (navy/green and orange/white) built for van livery, business cards, signage, and digital use.',
    src: '/images/work/logo-mukiconstruction.png',
    srcFull: '/images/work/logo-mukiconstruction-full.png',
    url: null,
    color: '#e65100',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Construction / Trades',
      'Two-Color System',
      'Seattle WA',
      'Tile & Stone',
    ],
    description:
      'Muki Construction LLC is a licensed tile & stone contractor serving residential and commercial clients in Seattle (Lic. CONMUCC102BB) — specializing in tile & stone installation, countertops, backsplash installation, shower enclosures, bath tile walls & surrounds, heated floors, and exterior applications. The logo centers on a bold roofline mark with the MUKI name and a "tile & stone contractor" identifier band. We delivered two complete color versions: a dark navy/forest green professional variant and a bold orange/white high-visibility variant — giving Muki flexibility across dark vehicle livery, white business cards, site signage, and digital materials.',
    features: [
      {
        title: 'Two Complete Color Versions',
        body: 'Navy/forest green variant for professional print and digital use; orange/white variant for high-visibility applications — van livery, outdoor signage, and attention-grabbing marketing materials.',
      },
      {
        title: 'Roofline Architecture Mark',
        body: 'Distinctive rooftop silhouette above the MUKI name — immediately communicating construction/trades while being clean enough to scale from a van door to a business card.',
      },
      {
        title: '"Tile & Stone Contractor" Identity Band',
        body: 'Green or orange identifier band below the mark makes the specialty immediately clear — essential for a trades business where service clarity drives first calls.',
      },
      {
        title: 'Vehicle Livery Ready',
        body: 'Logo applied to work van — high-contrast orange/white variant reads clearly on a white Mercedes Sprinter in traffic, turning every job site visit into a mobile advertisement.',
      },
      {
        title: 'Business Card Application',
        body: 'Both color variants applied to business card designs — full contact information (tel: 206-605-9394, license number) in a print-ready format.',
      },
      {
        title: 'Multi-Format Delivery',
        body: 'Logo delivered across print and digital formats — business cards, van livery, hanging display mockup, and digital materials all applied and tested.',
      },
    ],
  },
  {
    id: 31,
    category: 'logos',
    title: 'AM Ruyle LLC',
    subtitle:
      'Logo design for a Seattle general contracting company — bold AM monogram on diamond-plate steel texture, white and blue, applied across business cards for two principals and all company materials.',
    src: '/images/portfolio/amruylellcLogo.jpg',
    srcFull: '/images/portfolio/amruylellcLogo.jpg',
    url: 'https://www.amruylellc.com',
    color: '#1565c0',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Construction / General Contracting',
      'Business Cards',
      'Seattle WA',
      'Diamond Plate Texture',
    ],
    description:
      'AM Ruyle LLC is a licensed general contracting company (License No: AMRUYLR872DJ) headed by Aaron Ruyle (President) and Shane Perkins (Project Superintendent) — operating out of the Seattle area (425.686.4319 / 1.206.086.4319, amruylellc.com). The logo centers on a bold AM monogram with a dynamic diagonal slash — white and electric blue on a dark diamond-plate steel background, communicating the toughness, precision, and industrial credibility of a general contracting operation. The mark needed to work equally on a clean white business card front and a dark textured card back — a dual-surface challenge the design handles with two polished variants.',
    features: [
      {
        title: 'Bold AM Monogram Mark',
        body: 'Dynamic diagonal-slash AM letterform in white and electric blue — aggressive, geometric, and instantly recognizable as a construction/trades identity at any scale.',
      },
      {
        title: 'Diamond-Plate Steel Texture Background',
        body: 'Dark diamond-plate steel texture anchors the logo in the physical world of construction — material authenticity that separates AM Ruyle from corporate-generic contractor brands.',
      },
      {
        title: 'White Background Variant',
        body: 'Clean white background version of the logo for print, proposals, and digital use — same mark, same authority, versatile across all professional contexts.',
      },
      {
        title: 'Business Card — Aaron Ruyle (President)',
        body: 'Two-sided business card: white front with blueprint/site plan background, full contact details, and license number; dark diamond-plate back with large AM mark.',
      },
      {
        title: 'Business Card — Shane Perkins (Project Superintendent)',
        body: 'Matching card design for the second principal — same two-sided system, consistent identity across both the president and project superintendent roles.',
      },
      {
        title: 'Multi-Principal Identity System',
        body: 'Brand system designed to scale across both company leaders — AM Ruyle LLC operates with two named principals and the identity works cleanly for both without dilution.',
      },
    ],
  },

  // ── Branding ──────────────────────────────────────────────────────────────

  {
    id: 32,
    category: 'branding',
    title: 'AM Ruyle LLC',
    subtitle:
      'Full brand collateral system for a Seattle general contracting company — logo on diamond-plate steel, business cards for two principals (Aaron Ruyle & Shane Perkins), scattered card fan mockup, and complete identity system.',
    src: '/images/portfolio/amruylellc.jpg',
    srcFull: '/images/portfolio/amruylellc.jpg',
    url: 'https://www.amruylellc.com',
    color: '#1565c0',
    aspect: 'wide',
    tags: [
      'Brand Collateral',
      'Business Cards',
      'Construction / General Contracting',
      'Multi-Principal',
      'Print Design',
      'Seattle WA',
    ],
    description:
      'AM Ruyle LLC needed a brand that could represent a two-principal general contracting operation — President Aaron Ruyle and Project Superintendent Shane Perkins — with consistent professionalism across every handoff. We delivered the complete brand collateral system: the diamond-plate logo suite, two-sided business cards for both principals (white/blueprint front with full contact details and license number, dark textured back with the AM mark), a scattered multi-card fan mockup for presentation, and all materials print-ready for production. The dark, industrial aesthetic communicates the confidence of an experienced general contractor without looking generic.',
    features: [
      {
        title: 'Two-Sided Business Cards — Both Principals',
        body: 'Aaron Ruyle (President) and Shane Perkins (Project Superintendent) each have individual cards — white blueprint front, dark diamond-plate back, full contact details, license number AMRUYLR872DJ.',
      },
      {
        title: 'Scattered Card Fan Presentation Mockup',
        body: "Multiple cards fanned across the frame showing both sides of both principals' cards — a professional presentation mockup demonstrating the full identity system at once.",
      },
      {
        title: 'Diamond-Plate Dark Card Back',
        body: 'The card back features the AM mark at large scale on the dark diamond-plate texture — a tactile, memorable impression that stands out from standard contractor cards.',
      },
      {
        title: 'Blueprint / Site Plan Card Front',
        body: "White card front with subtle blueprint/architectural site plan background — connecting the brand's visual language to the literal work of general contracting.",
      },
      {
        title: 'Logo on Textured Steel Application',
        body: 'Brand identity applied at full scale on the diamond-plate steel background — showing the logo in its most powerful, material-authentic context.',
      },
      {
        title: 'Print-Ready Production Files',
        body: 'All materials delivered print-ready with correct CMYK profiles, bleed, and trim marks — ready for a premium card printer without additional file preparation.',
      },
    ],
  },

  {
    id: 33,
    category: 'logos',
    title: 'Dominis Stone',
    subtitle:
      'Logo design for a premium natural stone company — elegant swirl monogram mark in black and white, positioned around a luxury stone tagline: "Going Green Has Never Looked Better."',
    src: '/images/work/dominisstone.png',
    srcFull: '/images/work/logo-dominisstone-full.png',
    url: null,
    color: '#2d2d2d',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Premium / Luxury',
      'Natural Stone',
      'Home & Garden',
      'Eco-Friendly',
    ],
    description:
      'Dominis Stone is a premium natural stone company — supplying pavers, flooring, and surrounds for residential and commercial applications under the tagline "Going Green Has Never Looked Better." The logo is a refined swirl/calligraphic monogram mark with the DOMINIS STONE wordmark — black, white, and stone-textured, communicating the organic elegance of natural stone without resorting to literal rock imagery. The mark needed to work as the centerpiece of a trifold brochure, a brochure cover, and standalone on black — clean and confident at every application.',
    features: [
      {
        title: 'Swirl Calligraphic Monogram',
        body: 'Elegant organic swirl mark evoking the natural grain and flow of stone — refined enough for luxury residential contexts, bold enough to anchor a brand system.',
      },
      {
        title: 'Black & White Stone Texture Identity',
        body: 'Monochromatic palette anchored in the natural tones of stone — black, white, and mid-gray — communicating premium quality without relying on color as a crutch.',
      },
      {
        title: '"Going Green" Brand Positioning',
        body: 'Tagline "Going Green Has Never Looked Better" positions Dominis Stone at the intersection of luxury and sustainability — a clear market differentiator for eco-conscious homeowners and specifiers.',
      },
      {
        title: 'Brochure Cover Application',
        body: 'Logo applied as the hero element on the trifold brochure cover alongside natural stone pathway photography — the mark and product working together to communicate the brand.',
      },
      {
        title: 'Standalone Black Background Variant',
        body: 'Logo on solid black background — the most premium presentation of the mark, used for high-impact digital and print contexts.',
      },
      {
        title: 'Multi-Format Delivery',
        body: 'Mark delivered for brochure cover, interior page headers, standalone black variant, and all other applications across the Dominis Stone brand system.',
      },
    ],
  },

  {
    id: 34,
    category: 'logos',
    title: 'Maurer Mechanical',
    subtitle:
      'Logo design for a Heating & Air Conditioning company — clean spiral S mark in dark/green two-color variants.',
    src: '/images/work/logo-maurermechanical.png',
    srcFull: '/images/work/logo-maurermechanical-full.png',
    url: null,
    color: '#2e7d32',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'HVAC',
      'Trades / Mechanical',
      'Two-Color System',
    ],
    description:
      'Maurer Mechanical is a Heating & Air Conditioning company that needed a clean, professional mark communicating precision and reliability. The logo centers on a refined spiral S symbol — evoking airflow and mechanical precision — in dark charcoal and green variants. The "Maurer Mechanical / Heating & Air Conditioning" wordmark sits below in structured typography.',
    features: [
      {
        title: 'Spiral S Airflow Mark',
        body: 'The central spiral symbol evokes HVAC concepts — airflow, circulation, temperature control — in a mark that reads as both mechanical and refined.',
      },
      {
        title: 'Dark & Green Two-Color System',
        body: 'Dark charcoal variant for print and formal materials; green variant for signage, digital, and high-visibility applications.',
      },
      {
        title: 'HVAC Industry Positioning',
        body: 'Mark communicates precision and reliability — the two qualities homeowners and contractors look for when selecting a heating and cooling partner.',
      },
      {
        title: 'Full Wordmark Lockup',
        body: '"Maurer Mechanical / Heating & Air Conditioning" integrated cleanly below the symbol for complete identification at any size.',
      },
    ],
  },

  {
    id: 35,
    category: 'logos',
    title: 'Puget Sound Painting Contractors',
    subtitle:
      'Logo design for a painting contractor — illustrated paint roller mark in blue and red color variants.',
    src: '/images/work/logo-pugetsoundpainting.png',
    srcFull: '/images/work/logo-pugetsoundpainting-full.png',
    url: null,
    color: '#1565c0',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Painting / Trades',
      'Illustrated Mark',
      'Two-Color System',
    ],
    description:
      'Puget Sound Painting Contractors needed a mark that immediately communicated their trade. The solution is an illustrated paint roller in motion — dynamic, slightly angled, with a paint stroke sweeping behind it — in bold blue/navy and warm red/terracotta variants. Bold block lettering with a "Contractors" dark ribbon banner anchors the mark as a professional Pacific Northwest trades business.',
    features: [
      {
        title: 'Illustrated Paint Roller Mark',
        body: 'Dynamic illustrated roller with paint stroke sweep — immediately communicates the trade with the personality that generic type-only contractor logos lack.',
      },
      {
        title: 'Blue & Red Color Variants',
        body: 'Bold blue/navy variant for print and vehicle applications; warm red/terracotta variant for alternative uses.',
      },
      {
        title: '"Contractors" Banner Ribbon',
        body: 'Dark ribbon banner with "Contractors" in white caps — a classic trade identity device adding structure and hierarchy.',
      },
      {
        title: 'Pacific Northwest Market Identity',
        body: '"Puget Sound" anchors the brand geographically — building local recognition with homeowners and property managers across the Seattle/Tacoma region.',
      },
    ],
  },

  {
    id: 36,
    category: 'logos',
    title: "Ariana's Closet",
    subtitle:
      "Logo design for a women's fashion boutique — elegant script logotype with a fashion silhouette in black/pink two-color variants.",
    src: '/images/work/logo-arianascloset.png',
    srcFull: '/images/work/logo-arianascloset-full.png',
    url: null,
    color: '#d81b8e',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Fashion / Boutique',
      'Illustrated Mark',
      'Feminine Brand',
    ],
    description:
      "Ariana's Closet is a women's fashion boutique that needed a logo with the personality of high-end retail. The mark pairs a cursive script logotype with a silhouette illustration of a fashionable woman in a bow-tied hat — black on white for print, and on bold magenta for packaging and social media.",
    features: [
      {
        title: 'Script Logotype',
        body: 'Flowing cursive "Ariana\'s Closet" — feminine, aspirational, and distinct from the block lettering dominating generic fashion marks.',
      },
      {
        title: 'Fashion Silhouette Illustration',
        body: 'Chic woman silhouette in a statement hat — personality-forward illustration giving the brand immediate visual character beyond a wordmark.',
      },
      {
        title: 'Black & Magenta Two-Color System',
        body: 'Black/white for print and packaging; bold magenta background for social media, shopping bags, and retail display.',
      },
      {
        title: 'Boutique Retail Positioning',
        body: 'Communicates curated, personal fashion retail — clearly distinct from mass market and positioned as a personality-driven shopping experience.',
      },
    ],
  },

  {
    id: 37,
    category: 'logos',
    title: 'Scout For Athletes',
    subtitle:
      'Logo design for a social network for athletes — SA circle monogram in red/gray two-color variants.',
    src: '/images/work/logo-scoutforathletes.png',
    srcFull: '/images/work/logo-scoutforathletes-full.png',
    url: null,
    color: '#c62828',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Sports / Athletics',
      'Social Network',
      'Circle Monogram',
    ],
    description:
      'Scout For Athletes is a social network connecting players, scouts, and coaches. The SA circle monogram — interlocking S and A within a circle — communicates team structure and platform credibility. White-on-red for energy and brand presence; black-on-gray for professional, neutral contexts.',
    features: [
      {
        title: 'SA Circle Monogram',
        body: 'Interlocking S and A inside a solid circle — scalable from app icon to jersey patch without losing clarity.',
      },
      {
        title: 'Red & Gray Two-Color System',
        body: 'White/red for high-energy presence; black/gray for professional digital contexts — athletic energy and platform credibility in one system.',
      },
      {
        title: '"Social Network for Athletes" Tagline',
        body: 'Sub-tagline below the mark communicates platform purpose immediately to athletes, scouts, and coaches.',
      },
      {
        title: 'App Icon Geometry',
        body: 'Circle monogram designed to work cleanly at 60×60px app icon size and scale to large format without complexity loss.',
      },
    ],
  },

  {
    id: 38,
    category: 'logos',
    title: 'Rain Nightclub',
    subtitle:
      'Logo design for a nightclub — illustrated umbrella-in-rain mark in black and blue/silver two-color variants.',
    src: '/images/work/logo-rainnightclub.png',
    srcFull: '/images/work/logo-rainnightclub-full.png',
    url: null,
    color: '#1a237e',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Nightclub / Entertainment',
      'Illustrated Mark',
      'Pacific Northwest',
    ],
    description:
      'Rain Nightclub\'s mark features a stylized umbrella with rain streaks — a nod to Seattle\'s iconic weather rendered in dynamic hand-drawn illustration style — with flowing "Rain" script and "Nightclub" in bold caps. Black variant for drama; blue/silver for upscale venue contexts.',
    features: [
      {
        title: 'Illustrated Umbrella Mark',
        body: 'Dynamic umbrella-in-rain illustration with hand-drawn energy — immediate personality and Pacific Northwest authenticity.',
      },
      {
        title: '"Rain" Script Logotype',
        body: 'Flowing script "Rain" paired with bold caps "Nightclub" — fluid elegance meets strong presence.',
      },
      {
        title: 'Black & Blue/Silver Variants',
        body: 'High-contrast black for dark backgrounds and signage; blue/silver for premium print and VIP materials.',
      },
      {
        title: 'Pacific Northwest Nightlife Identity',
        body: "Turns Seattle's weather symbol into a memorable nightlife brand — local and aspirational simultaneously.",
      },
    ],
  },

  {
    id: 39,
    category: 'logos',
    title: 'Snohomish Learning Tree Preschool',
    subtitle:
      'Logo design for a preschool — colorful illustrated alphabet tree with activity border tiles in white/sky-blue variants.',
    src: '/images/work/logo-snohomishlearningtree.png',
    srcFull: '/images/work/logo-snohomishlearningtree-full.png',
    url: null,
    color: '#f57f17',
    aspect: 'square',
    tags: [
      'Logo Design',
      'Brand Identity',
      'Education / Preschool',
      'Illustrated Mark',
      'Colorful / Playful',
    ],
    description:
      'Snohomish Learning Tree Preschool needed a logo communicating joy, learning, and childhood imagination. The mark is a richly illustrated alphabet tree — letters, numbers, and characters growing from its branches — surrounded by activity border tiles (crayon, apple, sun, rainbow, scissors, bus). White background for print; sky-blue background for a warm, welcoming feel.',
    features: [
      {
        title: 'Illustrated Alphabet Tree',
        body: 'Colorful tree with letters, numbers, and playful characters — communicating learning, growth, and childhood wonder in a single image.',
      },
      {
        title: 'Activity Border Tile System',
        body: 'Surrounding border of activity icons — crayon, apple, sun, rainbow, scissors, school bus — each tile representing a different aspect of the preschool day.',
      },
      {
        title: 'White & Sky-Blue Variants',
        body: 'White background for print materials and signage; sky-blue background for a warm, welcoming classroom and digital presence.',
      },
      {
        title: 'Parent & Child Dual Appeal',
        body: 'Complex enough to signal a rich curriculum to parents, playful enough to delight the children who will attend.',
      },
    ],
  },

  // ── Branding ──────────────────────────────────────────────────────────────

  {
    id: 40,
    category: 'branding',
    title: 'Dominis Stone',
    subtitle:
      'Complete brand identity system for a premium natural stone company — logo, trifold brochure (About Us, product grids for Pavers/Flooring/Surrounds, Where to Buy), and a luxury print system built around "Going Green Has Never Looked Better."',
    src: '/images/portfolio/dominisstone.jpg',
    srcFull: '/images/portfolio/dominisstone.jpg',
    url: null,
    color: '#2d2d2d',
    aspect: 'wide',
    tags: [
      'Brand Identity',
      'Trifold Brochure',
      'Print Design',
      'Natural Stone',
      'Premium / Luxury',
      'Eco-Friendly',
    ],
    description:
      'Dominis Stone needed a brand system that could communicate premium quality to both luxury homeowners and design professionals specifying natural stone for pavers, flooring, and surrounds. The full engagement delivered the logo and a comprehensive trifold brochure — a multi-panel print piece covering the About Us story, product photography and grid layouts for Pavers (8 products), Flooring (6+ products), and Surrounds (5 products), and a Where to Buy dealer section — all anchored by the "Going Green Has Never Looked Better" brand positioning and "Quality is the Way We Matter" mission statement. The black, dark green, and natural stone photography palette communicates luxury and sustainability simultaneously.',
    features: [
      {
        title: 'Trifold Brochure — Cover & About Panel',
        body: 'Stone pathway photography with the Dominis logo and "Going Green Has Never Looked Better" tagline on the cover; About Us story and company philosophy on the inner left panel.',
      },
      {
        title: 'Pavers Product Grid',
        body: 'Eight paver products presented with photography and product names — a clean grid layout that lets the natural stone speak while maintaining brand architecture.',
      },
      {
        title: 'Flooring Product Grid',
        body: 'Six+ flooring options including Bull Nose Tile, Full Bullnose, Slate, Light Quartzite, Dark Quartzite, and Travertine — with product photography and naming throughout.',
      },
      {
        title: 'Surrounds Product Grid',
        body: 'Five surround products including Granite Texture, Lava Texture, and additional options — completing the three-category product system for residential and commercial specifiers.',
      },
      {
        title: 'Where to Buy Dealer Section',
        body: 'Final brochure panel directing customers to dealer locations — with supporting photography and the Dominis Stone logo as the closing brand impression.',
      },
      {
        title: '"Going Green" Luxury + Sustainability Positioning',
        body: 'The entire brand system — color, photography, copy, and layout — communicates that natural stone is the sustainable luxury choice, not a compromise between the two.',
      },
    ],
  },

  {
    id: 41,
    category: 'branding',
    title: 'AM Ruyle LLC',
    subtitle:
      'Full brand collateral system for a Seattle general contracting company — logo on diamond-plate steel, business cards for two principals (Aaron Ruyle & Shane Perkins), scattered card fan mockup, and complete identity system.',
    src: '/images/work/brand-amruyle.png',
    srcFull: '/images/work/brand-amruyle-full.png',
    url: 'https://www.amruylellc.com',
    color: '#1565c0',
    aspect: 'wide',
    tags: [
      'Brand Collateral',
      'Business Cards',
      'Construction / General Contracting',
      'Multi-Principal',
      'Print Design',
      'Seattle WA',
    ],
    description:
      'AM Ruyle LLC needed a brand that could represent a two-principal general contracting operation — President Aaron Ruyle and Project Superintendent Shane Perkins — with consistent professionalism across every handoff. We delivered the complete brand collateral system: the diamond-plate logo suite, two-sided business cards for both principals (white/blueprint front with full contact details and license number, dark textured back with the AM mark), a scattered multi-card fan mockup for presentation, and all materials print-ready for production. The dark, industrial aesthetic communicates the confidence of an experienced general contractor without looking generic.',
    features: [
      {
        title: 'Two-Sided Business Cards — Both Principals',
        body: 'Aaron Ruyle (President) and Shane Perkins (Project Superintendent) each have individual cards — white blueprint front, dark diamond-plate back, full contact details, license number AMRUYLR872DJ.',
      },
      {
        title: 'Scattered Card Fan Presentation Mockup',
        body: "Multiple cards fanned across the frame showing both sides of both principals' cards — a professional presentation mockup demonstrating the full identity system at once.",
      },
      {
        title: 'Diamond-Plate Dark Card Back',
        body: 'The card back features the AM mark at large scale on the dark diamond-plate texture — a tactile, memorable impression that stands out from standard contractor cards.',
      },
      {
        title: 'Blueprint / Site Plan Card Front',
        body: "White card front with subtle blueprint/architectural site plan background — connecting the brand's visual language to the literal work of general contracting.",
      },
      {
        title: 'Logo on Textured Steel Application',
        body: 'Brand identity applied at full scale on the diamond-plate steel background — showing the logo in its most powerful, material-authentic context.',
      },
      {
        title: 'Print-Ready Production Files',
        body: 'All materials delivered print-ready with correct CMYK profiles, bleed, and trim marks — ready for a premium card printer without additional file preparation.',
      },
    ],
  },

  {
    id: 42,
    category: 'branding',
    title: 'Live Love Flow Studios',
    subtitle:
      'Full brand collateral system for a Seattle hot yoga studio — event flyers, social media graphics, business cards, indoor signage, and promotional campaigns. Built around the logo and WordPress site we designed.',
    src: '/images/work/brand-liveloveflow.png',
    src: '/images/portfolio/liveloveflow.jpg',
    srcFull: '/images/portfolio/liveloveflow-full.jpg',
    color: '#2a7ab5',
    aspect: 'square',
    tags: [
      'Brand Collateral',
      'Event Flyers',
      'Social Media Graphics',
      'Signage',
      'Business Cards',
      'Wellness / Yoga',
    ],
    description:
      'Beyond the logo and WordPress website, Live Love Flow Studios needed a full suite of branded marketing materials to support their day-to-day studio operations, event promotions, and community growth. We designed everything: event flyers for the EuroBound Travel + Yoga retreat (Netherlands, Belgium & France), Teacher Training open house, and Instagram Challenge campaigns; social media graphics for new student intro offers and weekly promotions; business card designs; and physical indoor/outdoor signage including the studio door sign and upstairs directional — all maintaining the bold pink, navy, and white brand identity throughout.',
    features: [
      {
        title: 'Event Flyer Suite',
        body: 'Branded flyers for EuroBound Travel + Yoga retreat (July 4–14, Netherlands/Belgium/France), Teacher Training Open House, Instagram Challenge, and Intro Offer campaigns.',
      },
      {
        title: 'Social Media Graphics',
        body: 'Instagram and social post designs for studio promotions — Intro Offer ($29 for new students), 1-Week Trial, Instagram Challenge (#LIVELOVEFLOW), and seasonal campaigns.',
      },
      {
        title: 'Business Card Design',
        body: "Branded business cards in the studio's navy, pink, and white palette — stacked mockup delivery for presentation and print production.",
      },
      {
        title: 'Indoor & Outdoor Signage',
        body: 'Physical studio signage including the main door sign ("Live Love Flow — Intention to Flow") and the interior directional sign ("Live Love Flow — Upstairs ▶").',
      },
      {
        title: 'Consistent Brand Voice',
        body: 'All materials maintain the bold, energetic Live Love Flow brand identity — same typographic hierarchy, color palette, and logo lock-up used across digital and print.',
      },
      {
        title: 'Full-System Cohesion',
        body: 'Designed as a direct extension of the logo and website we built — every flyer, card, and sign connects back to a single, recognizable brand.',
      },
    ],
  },
  {
    id: 43,
    category: 'branding',
    title: 'Partizan Hoops',
    subtitle:
      'Full brand collateral system for a K-12 AAU basketball program — applied across the React platform, tournament materials, team jerseys, registration flows, and coach-facing content.',
    src: '/images/work/brand-partizan.png',
    srcFull: '/images/work/brand-partizan-full.png',
    url: 'https://partizanhoops.com',
    color: '#E85D04',
    aspect: 'wide',
    tags: [
      'Brand Collateral',
      'Sports / Basketball',
      'Tournament Materials',
      'Digital + Print',
      'AAU / K-12',
      'Pacific Northwest',
    ],
    description:
      'The Partizan Hoops brand identity extended far beyond the logo — it had to work across every touchpoint of a full youth sports operation. From the React website and admin CMS to tournament bracket flyers, camp registration confirmations, coach profile pages, team rosters, and apparel, the bold orange and dark identity had to read clearly at every scale and in every context. We designed and applied the brand system across the full platform and all associated materials, ensuring that every parent, player, and coach encountered a consistent, professional presence from first click to game day.',
    features: [
      {
        title: 'Digital Platform Branding',
        body: 'Full brand application across the React website, admin CMS dashboard, registration portal, tournament pages, and coach profile sections.',
      },
      {
        title: 'Tournament & Event Materials',
        body: 'Bracket sheets, event flyers, and camp schedule materials — all carrying the Partizan mark, orange palette, and typographic system.',
      },
      {
        title: 'Registration & Confirmation Design',
        body: 'Parent-facing enrollment confirmations, camp information sheets, and sign-up flow design — brand consistency from first touchpoint to final confirmation.',
      },
      {
        title: 'Apparel & Jersey Application',
        body: 'Logo and brand guidelines applied to team jersey designs and embroidered apparel — the identity works at full size on a court as well as on screen.',
      },
      {
        title: 'Coach & Staff Collateral',
        body: 'Coach profile page design, staff information materials, and program overview documents — consistent identity across all stakeholder-facing content.',
      },
      {
        title: 'European × Pacific Northwest Identity',
        body: "Brand voice and visual language that honors the program's European basketball roots (Partizan Belgrade, Division I pedigree) while feeling at home in the PNW youth sports community.",
      },
    ],
  },

  {
    id: 44,
    category: 'branding',
    title: 'Bothell Select Basketball',
    subtitle:
      'Brand collateral system for a competitive Boys & Girls AAU program — applied across the React platform, tournament materials, registration communications, and divisional team content.',
    src: '/images/work/brand-bothellselect.png',
    srcFull: '/images/work/brand-bothellselect-full.png',
    url: 'https://bothellselect.com',
    color: '#506ee4',
    aspect: 'wide',
    tags: [
      'Brand Collateral',
      'Sports / Basketball',
      'Tournament Materials',
      'Digital + Print',
      'Boys & Girls 4th–8th',
      'Bothell WA',
    ],
    description:
      'Bothell Select Basketball needed a brand that worked across two distinct audiences — parents researching the program online and coaches managing rosters and tournaments from the admin panel. The blue and white identity was applied consistently across the full React platform, Winter Classic tournament materials, divisional team content for Boys and Girls grades 4–8, registration communications, and event listings. A cohesive brand at every level — from the website header to the bracket sheet — was part of what gave Bothell Select the credibility that led directly to the Partizan Hoops referral.',
    features: [
      {
        title: 'Digital Platform Application',
        body: 'Full brand rollout across the React website, CMS admin dashboard, team registration portal, event listings, and roster management pages.',
      },
      {
        title: 'Winter Classic Tournament Materials',
        body: 'Event flyers, bracket sheets, and divisional schedules for the Winter Classic and other tournament events — consistent mark and color throughout.',
      },
      {
        title: 'Boys & Girls Divisional Content',
        body: 'Brand applied across separate Boys and Girls program tracks, grades 4th–8th — gender-neutral identity that works equally across all age groups.',
      },
      {
        title: 'Registration & Parent Communications',
        body: 'Enrollment confirmation design, team placement notices, and parent-facing program information — brand consistency from sign-up to first practice.',
      },
      {
        title: 'Event & Schedule Graphics',
        body: 'Upcoming game, practice, and tournament schedule visuals — dynamically driven by the CMS but visually anchored in the Bothell Select brand system.',
      },
      {
        title: 'Referral-Earning Brand Quality',
        body: 'The consistency and professionalism of the applied brand system was a direct factor in the referral that brought Partizan Basketball Camp to us as a new client.',
      },
    ],
  },

  {
    id: 45,
    category: 'branding',
    title: 'Vector RE Corp',
    subtitle:
      'Full brand collateral system for a Kirkland-based commercial real estate developer — project marketing flyers, property one-pagers, business cards, American Lake Logistics campaign, logo exploration, and investor-grade materials.',
    src: '/images/work/brand-vectorrecorp.png',
    srcFull: '/images/work/brand-vectorrecorp-full.png',
    url: 'https://vectorrecorp.com',
    color: '#1c3a5e',
    aspect: 'wide',
    tags: [
      'Brand Collateral',
      'Real Estate Development',
      'Project Marketing',
      'Print + Digital',
      'B2B / Corporate',
      'Kirkland WA',
    ],
    description:
      'Vector RE Corp operates at the institutional level — their brand had to hold up in front of Fortune 500 tenants, long-term investors, and development partners reviewing project materials before committing to a 158,000 or 325,000+ square foot lease. We produced a complete brand collateral system: property marketing flyers for MI-S Business Park (231,924 SF, Available 1Q 2020) and American Lake Logistics, project one-pagers with aerial and architectural photography, multi-panel property brochures, business card design, and a full logo exploration board showing the mark across multiple contexts and applications — all anchored in the Vector navy, red, and white identity.',
    features: [
      {
        title: 'Property Marketing Flyers',
        body: 'Print and digital flyers for MI-S Business Park (231,924 SF) and American Lake Logistics — square footage, availability date, phone number, and building photography in a clean investor-ready layout.',
      },
      {
        title: 'American Lake Logistics Campaign',
        body: 'Full marketing materials for the American Lake Logistics development — aerial photography, property specs, and branded presentation for prospective tenants and buyers.',
      },
      {
        title: 'Multi-Panel Property Brochures',
        body: 'Folded brochures with architectural renderings and completed building photography — designed for in-person meetings with tenants, brokers, and development partners.',
      },
      {
        title: 'Business Card Design',
        body: 'Executive business cards for Vector principals — clean navy and white, institutional quality, consistent with the scale of projects they represent.',
      },
      {
        title: 'Logo Exploration Board',
        body: 'Comprehensive logo exploration showing the Vector mark across color variants, background applications, and scaled contexts — from business cards to building signage.',
      },
      {
        title: 'Investor-Grade Brand Consistency',
        body: 'Every material — from a PDF attachment to a property flyer — communicates the same institutional precision expected by Fortune 500 tenants and long-term development partners.',
      },
    ],
  },

  {
    id: 46,
    category: 'branding',
    title: "Asha Women's Spa & Boutique",
    subtitle:
      "Complete brand identity system for a women's spa & boutique — logo design (light & dark), typography spec, trifold brochure, service menu/rack card, and business cards. A five-deliverable brand package from mark to print.",
    src: '/images/work/brand-asha.png',
    srcFull: '/images/work/brand-asha-full.png',
    url: 'https://www.ashaspandboutique.com',
    color: '#d81b8e',
    aspect: 'wide',
    tags: [
      'Brand Identity',
      'Logo Design',
      'Print Collateral',
      'Brochure',
      'Business Cards',
      'Spa & Wellness',
    ],
    description:
      "Asha Women's Spa & Boutique needed a brand identity that felt luxurious, feminine, and deeply personal — from the first glance at a business card to the moment a client picks up a service menu. We delivered a complete five-piece brand system: a primary logo with custom script typography on both white and black backgrounds with full color and type specifications, a trifold brochure covering Makeup and Wax services with professional photography, a service menu/rack card for Relaxation services with spa photography, and a premium two-sided business card. The hot pink and black palette communicates elegance and confidence — exactly the tone a women's spa and boutique needs to stand out.",
    features: [
      {
        title: '001 — Logo on White (Light Version)',
        body: 'Primary brand mark in hot pink on white background — script logotype with full typography alphabet spec and black/pink color swatches.',
      },
      {
        title: '002 — Logo on Black (Dark Version)',
        body: 'Inverted brand application on black background — same mark and type spec, showing full versatility across light and dark surfaces.',
      },
      {
        title: '003 — Trifold Brochure',
        body: 'Three-panel trifold brochure covering Makeup and Wax service categories — professional photography, service listings, and the Asha mark throughout.',
      },
      {
        title: '004 — Service Menu / Rack Card',
        body: 'Standalone service menu for Relaxation services — premium dark format with spa photography and full service listing, designed for reception desk display.',
      },
      {
        title: '005 — Business Cards',
        body: 'Two-sided business card design — dark premium card with hot pink and white typography, and a clean white reverse — print-ready mockup delivered.',
      },
      {
        title: 'Full Brand System Delivery',
        body: 'All five deliverables designed cohesively — logo, print collateral, and cards — so every touchpoint from appointment card to service brochure carries a single, consistent identity.',
      },
    ],
  },

  {
    id: 47,
    category: 'branding',
    title: 'Alpha Construction',
    subtitle:
      'Brand identity system for a Greater Seattle custom home builder — built alongside the WordPress website, with an orange-forward identity representing modern design, precision craftsmanship, and residential/commercial capability.',
    src: '/images/work/brand-alphawa.png',
    srcFull: '/images/work/brand-alphawa-full.png',
    url: 'https://www.alphawa.com',
    color: '#e65100',
    aspect: 'wide',
    tags: [
      'Brand Identity',
      'Construction',
      'Residential & Commercial',
      'Digital + Print',
      'Seattle WA',
      'Home Building',
    ],
    description:
      'Alpha Construction needed a brand that communicated the precision and confidence of a company that builds custom homes and handles commercial fit-outs for clients like Nike Town Seattle, Old Navy, and Abercrombie & Fitch — while still feeling approachable to homeowners planning a remodel or addition. The bold orange identity was designed to stand out in a market dominated by safe, generic contractor brands, and was applied across the full WordPress website, digital materials, and supporting collateral. The orange-and-dark palette communicates energy, craftsmanship, and ambition — a brand that looks as serious as the builds.',
    features: [
      {
        title: 'Bold Orange Brand Identity',
        body: 'High-visibility orange and dark color system — designed to stand out immediately against the beige-and-blue sameness of most residential construction brands.',
      },
      {
        title: 'WordPress Site Brand Application',
        body: 'Full identity rollout across the custom WordPress build — homepage hero, service pages, project gallery, and contact flows all carrying the Alpha mark and palette.',
      },
      {
        title: 'Residential & Commercial Positioning',
        body: 'Brand language and visual system that works equally for homeowners (custom homes, remodels, additions) and commercial clients (retail fit-outs, property management).',
      },
      {
        title: 'Modern Home Design Aesthetic',
        body: "Visual tone inspired by the architectural photography of Alpha's completed projects — clean, modern, and aspirational rather than utilitarian.",
      },
      {
        title: 'Digital & Print Collateral',
        body: 'Brand system applied across website, digital materials, and print collateral — consistent identity from business card to project proposal.',
      },
      {
        title: 'Service Area Identity',
        body: 'Brand presence designed to anchor authority across the full Greater Seattle service footprint — Woodinville, Kirkland, Bellevue, Redmond, Seattle, and surrounding Puget Sound communities.',
      },
    ],
  },

  // ── Print ──────────────────────────────────────────────────────────────────

  {
    id: 48,
    category: 'branding',
    title: 'Ruby The Pet Nanny',
    subtitle:
      'Brand identity for a pet sitting & nanny service — hand-sketched logo, warm yellow and teal palette, business card design, and full brand application across the WordPress website. Business has since closed.',
    src: '/images/work/brand-rubypetnanny.png',
    srcFull: '/images/work/brand-rubypetnanny-full.png',
    url: null,
    color: '#f9a825',
    aspect: 'wide',
    tags: [
      'Brand Identity',
      'Logo Design',
      'Business Cards',
      'Pet Services',
      'Warm / Lifestyle',
      'Business Closed',
    ],
    description:
      "Ruby The Pet Nanny needed a brand that felt as personal and trustworthy as the service itself — something that would make a pet owner feel comfortable handing over their keys. The identity started from hand-drawn logo sketches, capturing the warmth and authenticity of Ruby's relationship with animals, before being developed into a full mark. The warm yellow, teal, and white palette was applied across the WordPress website and a premium business card design — yellow cards that stood out in a wallet and communicated the friendly, energetic personality of the brand. The business has since closed; the brand identity and website are our portfolio work.",
    features: [
      {
        title: 'Hand-Sketched Logo Development',
        body: 'Logo process began with hand-drawn sketches — an organic approach that captured the genuine personality of the Ruby The Pet Nanny brand before moving into digital refinement.',
      },
      {
        title: 'Warm Yellow & Teal Palette',
        body: 'Energetic yellow primary and teal accent — a combination that stands apart from the generic blues and greens of most pet service brands.',
      },
      {
        title: 'Yellow Premium Business Cards',
        body: 'Signature yellow business cards with the Ruby The Pet Nanny logo — bold, memorable, and instantly recognizable in any wallet or on any countertop.',
      },
      {
        title: 'Full Website Brand Application',
        body: 'Identity applied across every page of the WordPress build — homepage hero, services, about, gallery, and contact — with warm pet photography reinforcing the brand tone.',
      },
      {
        title: 'Trust-First Brand Strategy',
        body: 'Every design decision — colors, photography, logo style — was made to answer the fundamental question every pet owner asks: "Can I trust this person with my animal?"',
      },
      {
        title: 'Complete Engagement Delivery',
        body: 'From first sketch to live website and printed cards — a fully self-contained brand engagement covering identity, digital, and print in a single project.',
      },
    ],
  },

  // ── Print (old section header kept for clarity) ───────────────────────────

  {
    id: 49,
    category: 'print',
    title: 'Dominis Stone',
    subtitle:
      'Premium trifold brochure for a natural stone company — About Us panel, stone pathway photography, three product category grids (Pavers, Flooring, Surrounds), Where to Buy section, and the "Going Green Has Never Looked Better" brand throughout.',
    src: '/images/work/print-dominisstone.png',
    srcFull: '/images/work/print-dominisstone-full.png',
    url: null,
    color: '#2d2d2d',
    aspect: 'wide',
    tags: [
      'Print Design',
      'Trifold Brochure',
      'Product Catalog',
      'Natural Stone',
      'Premium / Luxury',
      'Eco-Friendly',
    ],
    description:
      'The Dominis Stone trifold brochure is a complete sales and specification tool — designed for homeowners, landscape architects, and design professionals selecting natural stone products. The multi-panel layout covers the full brand story and product range: an About Us narrative panel with company philosophy and contact details, a Pavers grid with eight product options, a Flooring grid featuring Bull Nose, Slate, Light and Dark Quartzite, Travertine and more, a Surrounds section with Granite Texture, Lava Texture, and additional options, and a Where to Buy dealer locator panel. Stone pathway photography, the Dominis logo, and the "Going Green Has Never Looked Better" tagline carry the brand presence throughout every fold.',
    features: [
      {
        title: 'Cover — Stone Photography + Logo',
        body: 'Natural stone pathway photography with the Dominis swirl monogram logo and "Going Green Has Never Looked Better" tagline — a premium, nature-forward first impression.',
      },
      {
        title: 'About Us — Story Panel',
        body: 'Inner left panel with company narrative, "Quality is the Way We Matter" mission statement, and full contact details — the human story behind a premium stone supplier.',
      },
      {
        title: 'Pavers Product Grid',
        body: 'Eight paver products with individual photography — a clean grid presenting the full range to homeowners and landscape professionals specifying outdoor stone.',
      },
      {
        title: 'Flooring Product Grid',
        body: 'Interior flooring options including Bull Nose Tile, Slate, Light Quartzite, Dark Quartzite, Travertine and others — product photography at a scale that communicates texture and finish quality.',
      },
      {
        title: 'Surrounds Product Grid',
        body: 'Granite Texture, Lava Texture, and additional surround options — completing the three-category system for full residential and commercial stone specification.',
      },
      {
        title: 'Where to Buy — Dealer Locator Panel',
        body: 'Final panel with store photography and dealer location information — closing the brochure with a clear next step for prospective buyers.',
      },
    ],
  },
  {
    id: 50,
    category: 'print',
    title: 'Schippers & Crew',
    subtitle:
      'Three-panel retractable banner suite for a 35+ year Seattle electronics manufacturer — full service listing, industry sector panels (Industrial/Medical, Commercial/Defense/Aerospace), IPC & J-STD certification badges, and globe circuit-board visual.',
    src: '/images/work/print-schippers.png',
    srcFull: '/images/work/print-schippers-full.png',
    url: 'https://www.schippers.com',
    color: '#1565c0',
    aspect: 'wide',
    tags: [
      'Print Design',
      'Trade Show Banners',
      'Retractable Banners',
      'Electronics Manufacturing',
      'B2B / Industrial',
      'Seattle WA',
    ],
    description:
      'Schippers & Crew needed trade show materials that could communicate the full breadth of their Electronics Manufacturing Services offering at a glance — to buyers from across the industrial controls, communications, medical, commercial, defense, and aerospace sectors. We designed a coordinated three-panel retractable banner suite: a center services panel listing all nine capabilities with the Schippers & Crew logo, globe circuit-board hero visual, IPC, J-STD, and third-party certification badges, and "Effectiveness · Precision · Quality" tagline — flanked by two industry sector panels with circular photography vignettes (wind turbines for industrial/energy, satellite dishes for communications, PCB close-ups for medical, oil platforms for commercial, fighter jets for aerospace). All three banners carry the same blue/yellow/black color system and schippers.com + 206-782-2325 contact details.',
    features: [
      {
        title: 'Center Services Banner',
        body: 'Nine-service listing: Prototype Development, Surface Mount Assembly (SMT), Box-Build Assembly, X-Ray Inspection Services, Turnkey Purchasing Services, Consigned Assembly Services, Through-Hole Assembly, Cable and Wire Assembly, and Test and Engineering.',
      },
      {
        title: 'Left Industry Sector Panel',
        body: 'Industrial Controls, Communications, Medical — with wind turbine, satellite dish, and industrial facility photography in circular vignettes against the dark globe background.',
      },
      {
        title: 'Right Industry Sector Panel',
        body: "Commercial, Defense, Aerospace — with PCB close-up, oil platform, and fighter jet photography — speaking directly to Schippers' highest-value regulated market segments.",
      },
      {
        title: 'Certification Badge Display',
        body: 'IPC membership, J-STD compliance, and third certification badge prominently displayed on the center panel — the exact trust signals procurement teams look for when qualifying EMS partners.',
      },
      {
        title: 'Coordinated Three-Banner System',
        body: 'All three stands use the same blue/yellow accent band, black background, globe circuit-board motif, and footer contact strip — a unified trade show presence that reads as a professional suite.',
      },
      {
        title: 'Designed Alongside the WordPress Site',
        body: 'Banner design developed in parallel with the Schippers WordPress build — consistent brand language across digital and physical, so every OEM prospect encounters the same identity online and at industry events.',
      },
    ],
  },
  {
    id: 51,
    category: 'print',
    title: 'Northville Cabinetry',
    subtitle:
      'Rush trade show flyer, brochure & promo materials for a Houston RTA cabinet company — designed and delivered within 24 hours for BuildExpo Dallas, Booth B #808.',
    src: '/images/work/print-northvillecabinetry.png',
    srcFull: '/images/work/print-northvillecabinetry-full.png',
    url: 'http://www.northvillecabinetry.com',
    color: '#1b2d4f',
    aspect: 'wide',
    tags: [
      'Print Design',
      'Trade Show Flyer',
      'Brochure',
      'Rush Delivery',
      'Cabinetry / Home',
      'Houston TX',
    ],
    description:
      'Northville Cabinetry came to us with a tight deadline — they needed polished trade show flyers, a brochure, and promotional materials ready to hand out in-store and at BuildExpo Dallas (Booth B #808). We turned the full package around within 24 hours. The design centers on a dark navy, gold, and white palette that communicates the premium positioning of their ready-to-assemble kitchen and bathroom cabinets — using real kitchen photography, cabinet door finish swatches, and a confident typographic hierarchy. The client was happy with the results and had everything they needed for the expo.',
    features: [
      {
        title: '24-Hour Rush Turnaround',
        body: 'Full print-ready flyer and promo materials designed and delivered within one business day to meet the BuildExpo Dallas deadline.',
      },
      {
        title: 'Trade Show Flyer',
        body: 'Single-page event flyer featuring the BuildExpo Dallas booth number (B #808), phone number, kitchen photography, and cabinet door swatch showcase.',
      },
      {
        title: 'Navy / Gold / White Brand Palette',
        body: 'Premium color system anchored by deep navy, warm gold accents, and crisp white — communicating quality cabinetry at an accessible price point.',
      },
      {
        title: 'Cabinet Door Swatch Showcase',
        body: 'Bottom strip displaying five finish options (natural oak, white shaker, espresso, gray, classic white) — giving trade show attendees an immediate visual catalog.',
      },
      {
        title: 'Brochure & In-Store Collateral',
        body: 'Supporting brochure and promotional pieces designed for in-store distribution alongside the expo materials — consistent brand voice throughout.',
      },
      {
        title: 'Print-Ready Production Files',
        body: 'All files delivered print-ready with correct bleed, trim marks, and CMYK color profiles — ready to send directly to the printer.',
      },
    ],
  },
  {
    id: 52,
    category: 'print',
    title: 'Sarajevo Lounge',
    subtitle:
      'Nightclub event marketing suite for a Downtown Seattle club — dramatic themed flyers for Greek Nite, Balkan Night, Luda Turk, Eastern Night & Euro Saturdays, plus business cards and a full-scale poster.',
    src: '/images/work/print-sarajevolounge.png',
    srcFull: '/images/work/print-sarajevolounge-full.png',
    url: null,
    color: '#8b1a1a',
    aspect: 'wide',
    tags: [
      'Print Design',
      'Event Flyers',
      'Nightclub Marketing',
      'Poster Design',
      'Business Cards',
      'Seattle WA',
    ],
    description:
      "Sarajevo Lounge is a late-night club in Downtown Seattle at 2332 1st Ave — one of the city's great nightlife venues and a fun and inspiring client to work with. We designed a full suite of event marketing materials: themed flyers for recurring nights including Greek Nite (DJ Shaka & DJ Yann), Balkan Night, Luda Turk, Eastern Night, and Euro Saturdays — each with its own dramatic visual identity — plus business cards and a full-scale poster. The work required designing for dark, high-energy contexts where photography, typography, and color had to command attention at a glance across social media, print, and in-venue display.",
    features: [
      {
        title: 'Greek Nite Series',
        body: 'Multiple flyer iterations for Greek Nite — anchored by a dramatic bronze helmet and angel-winged performer, featuring DJ Shaka & DJ Yann at Club Sarajevo Lounge.',
      },
      {
        title: 'Multi-Night Event Suite',
        body: 'Full series of themed flyer designs: Balkan Night, Luda Turk (with DJ), Eastern Night, Euro Saturdays — each with a distinct visual identity while maintaining venue branding.',
      },
      {
        title: 'Full-Scale Poster Design',
        body: 'Large-format Greek Nite poster — cinematic dark composition with hero typography, venue address, date, and DJ credits — designed for in-venue and street display.',
      },
      {
        title: 'Business Card Design',
        body: 'Club business cards with dark premium finish, city skyline mark, and venue contact details — consistent nightlife brand identity carried into physical collateral.',
      },
      {
        title: 'Social Media Flyer Formats',
        body: 'All event flyers designed to work across both print and social media distribution — sized and composed for Instagram and Facebook event promotion.',
      },
      {
        title: 'High-Energy Visual Design',
        body: 'Dark, cinematic aesthetic with dramatic photography, bold event typography, and color treatments that command attention in nightclub and social media contexts.',
      },
    ],
  },
  {
    id: 53,
    category: 'print',
    title: 'GraphiCode Inc.',
    subtitle:
      'Software product packaging and marketing collateral for a Redmond electronics manufacturing CAM software company — retail box design, CD/disc packaging, product data sheets, and the GC-PowerPlatform product matrix.',
    src: '/images/work/print-graphicode.png',
    srcFull: '/images/work/print-graphicode-full.png',
    url: 'https://www.graphicode.com',
    color: '#e65100',
    aspect: 'wide',
    tags: [
      'Print Design',
      'Software Packaging',
      'Product Data Sheets',
      'B2B Software',
      'Electronics Manufacturing',
      'Redmond WA',
    ],
    description:
      'GraphiCode Inc. is a Redmond, WA software company providing CAM software solutions for electronics manufacturing — the GC-PowerPlatform suite covers GC-Prevue (industry-standard Gerber data viewer), GC-PowerPlace (PCB assembly CAM), GC-PowerStation (PCB fabrication CAM), GC-CAM Edit, and GC-PrevuePlus. The print engagement delivered a complete suite of physical and marketing materials: retail software box packaging with the GC globe/orange sphere mark, CD/disc package design for GC-PowerPlace ("Get Productive"), product data sheets and the Product Matrix comparison grid, and the distinctive GC-Prevue "Your Hassle Free Gerber Viewer" eye-graphic marketing visual. All designed to position GraphiCode as a premium software provider in the competitive electronics manufacturing software market.',
    features: [
      {
        title: 'Software Box Packaging',
        body: 'Retail software box design for GC-PowerPlatform — dark tech aesthetic with the GraphiCode globe/sphere mark in orange, positioned as a premium B2B software product.',
      },
      {
        title: 'CD / Disc Package Design',
        body: 'CD packaging for GC-PowerPlace "Get Productive" — branded disc and sleeve design matching the GC-PowerPlatform visual system.',
      },
      {
        title: 'GC-Prevue Eye-Graphic Campaign',
        body: 'Distinctive close-up eye photography for GC-Prevue ("Your Hassle Free Gerber Data Viewer") — a memorable visual metaphor for precision data viewing in electronics manufacturing.',
      },
      {
        title: 'Product Matrix Data Sheet',
        body: 'Comparison grid for the full GC-PowerPlatform product line — Input Format, Output Format, Import File Types, Assembly Operations, Single-Step Commands, and more — designed for technical buyers evaluating CAM software.',
      },
      {
        title: 'GC-PowerPlatform Product Brochure',
        body: 'Multi-panel product brochure covering the full suite with feature listings, product photography, and technical specifications — the primary leave-behind for trade show and sales meetings.',
      },
      {
        title: 'Website UI Design',
        body: 'Website design and UI work for graphicode.com — matching the dark tech, orange-accent brand system established across the physical product materials.',
      },
    ],
  },
  {
    id: 54,
    category: 'print',
    title: 'Schippers & Crew — Trade Show',
    subtitle:
      'Three-panel retractable banner suite · See full case study in the Schippers & Crew print entry.',
    src: '/images/work/print-schippers.png',
    srcFull: '/images/work/print-schippers-full.png',
    url: 'https://www.schippers.com',
    color: '#1565c0',
    aspect: 'wide',
  },

  // ── Email ──────────────────────────────────────────────────────────────────

  {
    id: 55,
    category: 'email',
    title: 'Classmates.com',
    subtitle:
      'Email campaign design for a 40M+ subscriber nostalgia and social platform — transactional notifications, member engagement campaigns, review requests, reunion promotions, and a full reusable template system with analytics tracking.',
    src: '/images/work/email-classmates.png',
    srcFull: '/images/work/email-classmates-full.png',
    url: 'https://www.classmates.com',
    color: '#e65100',
    aspect: 'tall',
    tags: [
      'Email Design',
      'HTML Email',
      'Transactional Email',
      'Engagement Campaigns',
      'A/B Testing',
      'Subscription Platform',
    ],
    description:
      'While on the Classmates marketing team, the focus was on improving email campaigns to drive subscription conversion, member engagement, and platform activity. Highly reusable, dynamic, component-based email templates were created — designed to accommodate any combination of content blocks the campaign team needed to send to the subscriber base. The work included transactional notification emails (yearbook member found, photo sharing alerts), engagement campaigns (virtual reunions, report card nostalgia, "Don\'t stop there" feature discovery), review and reputation prompts, and promotional campaigns with Goldman Sachs & Bank of America partner integrations. Integrated tracking ensured any future campaign created from these components could be accurately monitored for performance.',
    features: [
      {
        title: 'Yearbook Member Notification Emails',
        body: '"A class member has been found in the 1996 Everett High School yearbook" — transactional trigger emails driving subscribers back into the platform through personalized nostalgia hooks.',
      },
      {
        title: 'Member Engagement Campaigns',
        body: '"Make a great first impression" review request emails, Virtual Reunions promotional campaigns, Report Card nostalgia series, and "Don\'t stop there" feature discovery flows.',
      },
      {
        title: 'Reusable Component Template System',
        body: 'Highly dynamic, component-based HTML email templates — any combination of content blocks could be assembled for new campaigns without rebuilding from scratch.',
      },
      {
        title: 'Partner & Promotional Integrations',
        body: 'Goldman Sachs and Bank of America partner ad integrations woven into campaign templates — additional revenue stream built into the email design system.',
      },
      {
        title: 'Analytics & Campaign Tracking',
        body: 'Integrated tracking on all email components — ensuring every campaign send could be accurately monitored for open rates, click-through, and subscription conversion performance.',
      },
      {
        title: 'Platform Feature Promotion',
        body: 'Emails designed to surface and promote specific Classmates features — photo sharing, yearbook search, virtual reunions, and free vs. paid tier differentiation — to a 40M+ subscriber base.',
      },
    ],
  },

  {
    id: 56,
    category: 'email',
    title: 'Zulily',
    subtitle:
      "Email campaign design and UI/UX concepts for a flash-sale e-commerce platform with millions of subscribers — Mother's Day series, seasonal campaigns, mobile app checkout flows, and full email template system.",
    src: '/images/work/email-zulily.png',
    srcFull: '/images/work/email-zulily-full.png',
    url: 'https://www.zulily.com',
    color: '#6a1b9a',
    aspect: 'tall',
    tags: [
      'Email Design',
      'UI/UX Concepts',
      'E-Commerce',
      'Seasonal Campaigns',
      'Mobile App Design',
      'Flash Sale',
    ],
    description:
      "Zulily is a flash-sale e-commerce platform serving millions of subscribers with daily deals on women's, kids', and home products. The engagement covered email campaign design and UI/UX concept work: a Mother's Day campaign series (#SuperMom, MVM, MOM themes) with product-grid layouts and promotional pricing, seasonal email templates, mobile app UI concepts for the iOS checkout and browsing experience, tablet and desktop e-commerce page designs, full mobile product page layouts, and detailed email newsletter templates with Zulily's signature purple and teal brand — supported by wireframes and spec sheets for development handoff.",
    features: [
      {
        title: "Mother's Day Campaign Series",
        body: '#SuperMom, MVM, and MOM-themed email campaigns — product-grid layouts with promotional pricing ($100.98, $102.98), bold seasonal headers, and full mobile-responsive design.',
      },
      {
        title: 'Mobile App UI Concepts',
        body: 'iOS app screen concepts covering checkout flows, product browsing, and account screens — clean, conversion-focused designs built for the Zulily mobile shopping experience.',
      },
      {
        title: 'Tablet & Desktop E-Commerce Pages',
        body: 'Full product browsing page concepts for tablet and desktop — category navigation, product grid, and promotional banner placements in the Zulily brand system.',
      },
      {
        title: 'Email Newsletter Template System',
        body: "Full email newsletter template designs with Zulily's purple/teal palette — product feature sections, promotional banners, and category blocks designed for high-frequency daily send cadence.",
      },
      {
        title: 'Wireframes & Dev Spec Sheets',
        body: 'Detailed wireframe layouts and specification documents for developer handoff — ensuring pixel-accurate implementation across all email clients and screen sizes.',
      },
      {
        title: 'Flash Sale Visual Language',
        body: 'Design system built for urgency and conversion — price callouts, limited-time offer framing, and product photography layouts optimized for the flash-sale browse-and-buy behavior.',
      },
    ],
  },
  {
    id: 57,
    category: 'email',
    title: 'Promotional Campaign',
    subtitle: 'E-commerce · Seasonal',
    src: '/images/work/email-promo.png',
    srcFull: '/images/work/email-promo-full.png',
    url: null,
    color: '#dc2626',
    aspect: 'tall',
  },
  {
    id: 58,
    category: 'email',
    title: 'Newsletter Template',
    subtitle: 'B2B · Monthly Send',
    src: '/images/work/email-newsletter.png',
    srcFull: '/images/work/email-newsletter-full.png',
    url: null,
    color: '#059669',
    aspect: 'tall',
  },
];

const CATEGORIES = [
  { value: 'all', label: 'All Work', icon: '✦' },
  { value: 'websites', label: 'Websites', icon: 'websites' },
  { value: 'logos', label: 'Logos', icon: 'logos' },
  { value: 'branding', label: 'Branding', icon: 'branding' },
  { value: 'print', label: 'Print', icon: 'print' },
  { value: 'email', label: 'Email Design', icon: 'email' },
];

// ── Category icon — JSX component, not a string in data ────────────────────
function CategoryIcon({ icon, size = 42 }) {
  if (icon === 'websites')
    return (
      <img
        src='/images/i_customDesign.png'
        alt='Website Development'
        height={size}
      />
    );
  if (icon === 'branding')
    return (
      <img src='/images/i_colorPalette.png' alt='Branding' height={size} />
    );
  if (icon === 'print')
    return (
      <img src='/images/i_marketingCollateral.png' alt='Print' height={size} />
    );
  if (icon === 'email')
    return (
      <img src='/images/i_outbound.png' alt='Email Design' height={size} />
    );
  if (icon === 'logos')
    return (
      <img
        src='/images/rainboots_splashboot_icon.png'
        alt='Logo Design'
        height={size}
      />
    );
  return <span>{icon}</span>;
}

// ── Placeholder card when image not yet added ───────────────────────────────
function PlaceholderCard({ item }) {
  return (
    <div className='work-placeholder' style={{ '--ph-color': item.color }}>
      <div className='work-placeholder__icon'>
        {item.category === 'logos' ? (
          <img
            src='/images/rainboots_splashboot_icon.png'
            alt='Logo Design'
            height={32}
          />
        ) : (
          <CategoryIcon icon={item.category} size={42} />
        )}
      </div>
      <div className='work-placeholder__label'>{item.category}</div>
      <div className='work-placeholder__rings'>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

// ── Case Study Panel ────────────────────────────────────────────────────────
function CaseStudyPanel({ item }) {
  return (
    <div className='case-study'>
      {/* Tags — with optional Ongoing badge */}
      <div className='case-study__tags'>
        {item.ongoing && (
          <span className='case-study__tag case-study__tag--ongoing'>
            ● Ongoing
          </span>
        )}
        {item.tags.map((t) => (
          <span
            key={t}
            className='case-study__tag'
            style={{ '--cs-color': item.color }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className='case-study__desc'>{item.description}</p>

      {/* Features grid */}
      <div className='case-study__features'>
        {item.features.map((f) => (
          <div
            key={f.title}
            className='case-study__feature'
            style={{ '--cs-color': item.color }}
          >
            <div className='case-study__feature-title'>{f.title}</div>
            <div className='case-study__feature-body'>{f.body}</div>
          </div>
        ))}
      </div>

      {/* Single instructor */}
      {item.instructor && (
        <>
          <div className='case-study__section-label'>Instructor & founder</div>
          <div className='case-study__coaches'>
            <div className='case-study__coach'>
              <div
                className='case-study__coach-avatar'
                style={{ background: item.color }}
              >
                {item.instructor.initials}
              </div>
              <div>
                <div className='case-study__coach-name'>
                  {item.instructor.name}
                </div>
                <div
                  className='case-study__coach-role'
                  style={{ color: item.color }}
                >
                  {item.instructor.role}
                </div>
                <div className='case-study__coach-bio'>
                  {item.instructor.bio}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Multiple coaches / principals */}
      {item.coaches && (
        <>
          <div className='case-study__section-label'>
            Team behind the platform
          </div>
          <div className='case-study__coaches'>
            {item.coaches.map((c) => (
              <div key={c.initials} className='case-study__coach'>
                <div
                  className='case-study__coach-avatar'
                  style={{ background: item.color }}
                >
                  {c.initials}
                </div>
                <div>
                  <div className='case-study__coach-name'>{c.name}</div>
                  <div
                    className='case-study__coach-role'
                    style={{ color: item.color }}
                  >
                    {c.role}
                  </div>
                  <div className='case-study__coach-bio'>{c.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Referral badge */}
      {item.referral && (
        <div
          className='case-study__referral'
          style={{ '--cs-color': item.color }}
        >
          <div className='case-study__referral-label'>
            {item.referral.label}
          </div>
          <p className='case-study__referral-text'>{item.referral.text}</p>
        </div>
      )}

      {/* Platform migration badge */}
      {item.migration && (
        <div
          className='case-study__migration'
          style={{ '--cs-color': item.color }}
        >
          <div className='case-study__migration-track'>
            <span className='case-study__migration-from'>
              {item.migration.from}
            </span>
            <span className='case-study__migration-arrow'>→</span>
            <span
              className='case-study__migration-to'
              style={{ color: item.color }}
            >
              {item.migration.to}
            </span>
          </div>
          <p className='case-study__migration-note'>{item.migration.note}</p>
        </div>
      )}
    </div>
  );
}

// ── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ item, onClose, onPrev, onNext, total, current }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, onNext, onPrev]);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isEnriched = Boolean(item.description && item.features);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [item.id]);

  return (
    <motion.div
      className='lightbox-overlay'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`lightbox${isEnriched ? ' lightbox--enriched' : ''}`}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='lightbox__header' style={{ '--lb-color': item.color }}>
          <div className='lightbox__header-left'>
            <span className='lightbox__cat'>{item.category}</span>
            <h3 className='lightbox__title'>{item.title}</h3>
            <p className='lightbox__subtitle'>{item.subtitle}</p>
          </div>
          <div className='lightbox__header-right'>
            <span className='lightbox__counter'>
              {current + 1} / {total}
            </span>
            {item.url && (
              <a
                href={item.url}
                target='_blank'
                rel='noopener noreferrer'
                className='lightbox__visit'
              >
                Visit site ↗
              </a>
            )}
            <button className='lightbox__close' onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Enriched: image left + case study right */}
        {isEnriched ? (
          <div className='lightbox__enriched-body'>
            <div
              className='lightbox__image-wrap lightbox__image-wrap--side'
              style={{ background: item.color + '12' }}
            >
              {!imgLoaded && !imgError && (
                <div className='lightbox__loading'>
                  <div
                    className='lightbox__spinner'
                    style={{ borderTopColor: item.color }}
                  />
                </div>
              )}
              {imgError ? (
                <PlaceholderCard item={item} />
              ) : (
                <img
                  src={item.srcFull || item.src}
                  alt={item.title}
                  className={`lightbox__img ${item.aspect}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => {
                    setImgError(true);
                    setImgLoaded(true);
                  }}
                  style={{ opacity: imgLoaded ? 1 : 0 }}
                />
              )}
            </div>
            <div className='lightbox__case-panel'>
              <CaseStudyPanel item={item} />
            </div>
          </div>
        ) : (
          <div
            className='lightbox__image-wrap'
            style={{ background: item.color + '12' }}
          >
            {!imgLoaded && !imgError && (
              <div className='lightbox__loading'>
                <div
                  className='lightbox__spinner'
                  style={{ borderTopColor: item.color }}
                />
              </div>
            )}
            {imgError ? (
              <PlaceholderCard item={item} />
            ) : (
              <img
                src={item.srcFull || item.src}
                alt={item.title}
                className={`lightbox__img ${item.aspect}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  setImgError(true);
                  setImgLoaded(true);
                }}
                style={{ opacity: imgLoaded ? 1 : 0 }}
              />
            )}
          </div>
        )}

        {/* Nav */}
        <div className='lightbox__nav'>
          <button className='lightbox__nav-btn' onClick={onPrev}>
            ← Prev
          </button>
          <div className='lightbox__dots'>
            {Array.from({ length: Math.min(total, 7) }).map((_, i) => (
              <span
                key={i}
                className={`lightbox__dot ${i === current % 7 ? 'active' : ''}`}
                style={i === current % 7 ? { background: item.color } : {}}
              />
            ))}
          </div>
          <button className='lightbox__nav-btn' onClick={onNext}>
            Next →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Work card ───────────────────────────────────────────────────────────────
function WorkCard({ item, index, onClick }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`work-card work-card--${item.aspect}`}
      style={{
        '--wc-color': item.color,
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(28px) scale(0.98)',
        transition: `opacity 0.5s ease ${(index % 4) * 0.07}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${(index % 4) * 0.07}s`,
      }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      onClick={() => onClick(item)}
    >
      <div className='work-card__img-wrap'>
        {imgError ? (
          <PlaceholderCard item={item} />
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className='work-card__img'
            onError={() => setImgError(true)}
          />
        )}
        <div className='work-card__overlay'>
          <span className='work-card__zoom'>
            {item.description ? 'Case Study ↗' : 'View ↗'}
          </span>
        </div>
        <div className='work-card__bar' />
      </div>
      <div className='work-card__info'>
        <div className='work-card__title'>
          {item.title}
          {item.ongoing && (
            <span className='work-card__ongoing-dot' title='Ongoing project' />
          )}
        </div>
        <div className='work-card__subtitle'>{item.subtitle}</div>
        {item.tags && (
          <div className='work-card__tags'>
            {item.tags.slice(0, 3).map((t) => (
              <span key={t} className='work-card__tag-pill'>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Work page ──────────────────────────────────────────────────────────
const Work = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);

  const filtered =
    activeCategory === 'all'
      ? WORK_ITEMS
      : WORK_ITEMS.filter((w) => w.category === activeCategory);

  const lightboxIndex = lightboxItem
    ? filtered.findIndex((w) => w.id === lightboxItem.id)
    : -1;

  const openLightbox = useCallback(
    (item) => {
      const idx = filtered.findIndex((w) => w.id === item.id);
      if (idx !== -1) setLightboxItem(item);
    },
    [filtered],
  );

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  const nextItem = useCallback(() => {
    if (lightboxIndex < filtered.length - 1) {
      setLightboxItem(filtered[lightboxIndex + 1]);
    } else {
      setLightboxItem(filtered[0]);
    }
  }, [lightboxIndex, filtered]);

  const prevItem = useCallback(() => {
    if (lightboxIndex > 0) {
      setLightboxItem(filtered[lightboxIndex - 1]);
    } else {
      setLightboxItem(filtered[filtered.length - 1]);
    }
  }, [lightboxIndex, filtered]);

  return (
    <div className='work-page'>
      <Helmet>
        <title>
          Our Work — Websites, Logos & Branding | Rainboots Marketing
        </title>
        <meta
          name='description'
          content='Browse our portfolio of websites, logo designs, brand identities, print collateral and email templates. Seattle digital marketing and design agency.'
        />
        <link rel='canonical' href='https://rainbootsmarketing.com/work' />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className='work-hero'>
        <div className='work-hero__bg' />
        <div className='work-hero__grid' />
        <div className='work-hero__content'>
          <motion.div
            className='work-hero__eyebrow'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Visual Work
          </motion.div>
          <motion.h1
            className='work-hero__title'
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Designed to
            <br />
            <em>make an impression</em>
          </motion.h1>
          <motion.p
            className='work-hero__sub'
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Websites, logos, brand identities, print collateral and email
            templates — built with intention and crafted for impact.
          </motion.p>
          <motion.div
            className='work-hero__pills'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat.value}
                className='work-hero__pill'
                onClick={() => setActiveCategory(cat.value)}
              >
                <CategoryIcon icon={cat.icon} size={20} />
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
        <div className='work-hero__drops'>
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className='work-hero__drop'
              style={{
                left: `${8 + i * 9}%`,
                height: `${28 + (i % 4) * 20}px`,
                animationDelay: `${i * 0.28}s`,
                animationDuration: `${1.1 + (i % 4) * 0.35}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <div className='work-filters'>
        <div className='work-filters__inner'>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`work-filter-btn ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              <span className='work-filter-icon'>
                <CategoryIcon icon={cat.icon} size={20} />
              </span>
              {cat.label}
              {activeCategory === cat.value && cat.value !== 'all' && (
                <span className='work-filter-count'>
                  {WORK_ITEMS.filter((w) => w.category === cat.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Masonry grid ──────────────────────────────────────────────────── */}
      <section className='work-grid-section'>
        <div className='work-grid-inner'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeCategory}
              className='work-grid'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.map((item, i) => (
                <WorkCard
                  key={item.id}
                  item={item}
                  index={i}
                  onClick={openLightbox}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className='work-cta'>
        <motion.div
          className='work-cta__inner'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className='work-cta__tag'>Start a project</span>
          <h2>
            Like what you see?
            <br />
            <em>Let's build something together.</em>
          </h2>
          <p>
            From a single logo to a full brand identity and website — we handle
            it all.
          </p>
          <Link to='/contact' className='btn-primary work-cta__btn'>
            Get in Touch
          </Link>
          <div className='work-cta__links'>
            <Link to='/portfolio' className='work-cta__link'>
              View case studies with results →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            onClose={closeLightbox}
            onNext={nextItem}
            onPrev={prevItem}
            total={filtered.length}
            current={lightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Work;
