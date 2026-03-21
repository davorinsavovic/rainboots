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
    src: '/images/work/web-partizan.png',
    srcFull: '/images/work/web-partizan-full.png',
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
        title: 'Pull-Up Banner Stands & Trade Show Materials',
        body: 'Full trade show collateral designed alongside the website — pull-up banner stands and event display materials carrying the Schippers & Crew brand into physical industry events.',
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

  // ── Logos ──────────────────────────────────────────────────────────────────

  {
    id: 17,
    category: 'logos',
    title: 'Partizan Hoops',
    subtitle:
      'Logo design for a K-12 AAU basketball camp in the Pacific Northwest — a bold, dynamic mark for a program built on European fundamentals and elite coaching.',
    src: '/images/work/logo-partizan.png',
    srcFull: '/images/work/logo-partizan-full.png',
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
    id: 18,
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
    id: 19,
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
    id: 20,
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
    id: 21,
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
    id: 22,
    category: 'logos',
    title: 'Fintech Startup',
    subtitle: 'Wordmark + Symbol',
    src: '/images/work/logo-fintech.png',
    srcFull: '/images/work/logo-fintech-full.png',
    url: null,
    color: '#0284c7',
    aspect: 'square',
  },
  {
    id: 23,
    category: 'logos',
    title: 'Health & Wellness Brand',
    subtitle: 'Full Logo Suite',
    src: '/images/work/logo-wellness.png',
    srcFull: '/images/work/logo-wellness-full.png',
    url: null,
    color: '#059669',
    aspect: 'square',
  },

  // ── Branding ──────────────────────────────────────────────────────────────

  {
    id: 24,
    category: 'branding',
    title: 'Live Love Flow Studios',
    subtitle:
      'Full brand collateral system for a Seattle hot yoga studio — event flyers, social media graphics, business cards, indoor signage, and promotional campaigns. Built around the logo and WordPress site we designed.',
    src: '/images/work/brand-liveloveflow.png',
    srcFull: '/images/work/brand-liveloveflow-full.png',
    url: 'https://www.liveloveflowstudios.com',
    color: '#2a7ab5',
    aspect: 'wide',
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
    id: 25,
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
    id: 26,
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
    id: 27,
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
    id: 28,
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
    id: 29,
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
    id: 30,
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
    id: 31,
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
    id: 32,
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
    id: 33,
    category: 'print',
    title: 'Marketing Brochure',
    subtitle: 'Trifold · 4-color',
    src: '/images/work/print-brochure.png',
    srcFull: '/images/work/print-brochure-full.png',
    url: null,
    color: '#2b5ce6',
    aspect: 'wide',
  },
  {
    id: 34,
    category: 'print',
    title: 'Trade Show Displays',
    subtitle: 'Banner · Booth Graphics',
    src: '/images/work/print-tradeshow.png',
    srcFull: '/images/work/print-tradeshow-full.png',
    url: null,
    color: '#dc2626',
    aspect: 'wide',
  },

  // ── Email ──────────────────────────────────────────────────────────────────

  {
    id: 35,
    category: 'email',
    title: 'Welcome Series Template',
    subtitle: 'Email Design · HTML',
    src: '/images/work/email-welcome.png',
    srcFull: '/images/work/email-welcome-full.png',
    url: null,
    color: '#2b5ce6',
    aspect: 'tall',
  },
  {
    id: 36,
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
    id: 37,
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
  { value: 'websites', label: 'Websites', icon: '🖥' },
  { value: 'logos', label: 'Logos', icon: '◎' },
  { value: 'branding', label: 'Branding', icon: '🎨' },
  { value: 'print', label: 'Print', icon: '📄' },
  { value: 'email', label: 'Email Design', icon: '✉' },
];

// ── Placeholder card when image not yet added ───────────────────────────────
function PlaceholderCard({ item }) {
  return (
    <div className='work-placeholder' style={{ '--ph-color': item.color }}>
      <div className='work-placeholder__icon'>
        {item.category === 'websites'
          ? '🖥'
          : item.category === 'logos'
            ? '◎'
            : item.category === 'branding'
              ? '🎨'
              : item.category === 'print'
                ? '📄'
                : '✉'}
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
                {cat.icon} {cat.label}
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
              <span className='work-filter-icon'>{cat.icon}</span>
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
