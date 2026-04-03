import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import './WebDevelopment.css';

// ─── Modal content — in DOM at all times for SEO crawlability ───
const serviceDetails = {
  'Custom Web Design': {
    icon: '/images/i_customDesign.png',
    headline: 'Custom Web Design',
    subheadline: 'Your brand deserves more than a template.',
    body: [
      "Your website is often the first thing a potential customer sees — and first impressions stick. A generic template might get you online, but it won't make you memorable.",
      'We design every site from scratch, starting with your brand, your goals, and your audience. Every color, layout, and interaction is intentional — crafted to reflect who you are and guide visitors toward what you want them to do.',
      'The result is a site that looks distinctly yours, builds immediate credibility, and creates the kind of first impression that turns visitors into customers.',
    ],
    highlights: [
      {
        icon: '🎨',
        stat: '75%',
        label: 'of users judge credibility by design',
      },
      {
        icon: '💡',
        stat: '2×',
        label: 'higher conversions with custom design',
      },
      { icon: '⏱️', stat: '0.05s', label: 'for users to form an opinion' },
    ],
  },
  'Responsive Development': {
    icon: '/images/i_responsiveDesign.png',
    headline: 'Responsive Development',
    subheadline: 'Every screen. Every device. Every time.',
    body: [
      "More than half of all web traffic comes from mobile devices — and users expect the same great experience whether they're on a phone, tablet, or desktop.",
      'We build mobile-first, which means your site is designed for the smallest screen first and scaled up — not squeezed down from a desktop layout as an afterthought. Every breakpoint is tested, every interaction tuned.',
      'The result is a site that feels native on any device, loads fast on any connection, and never frustrates a potential customer with a broken layout or unclickable buttons.',
    ],
    highlights: [
      { icon: '📱', stat: '58%', label: 'of traffic comes from mobile' },
      { icon: '😤', stat: '88%', label: 'less likely to return after bad UX' },
      { icon: '⚡', stat: '3s', label: 'max load time before users leave' },
    ],
  },
  'E-Commerce Solutions': {
    icon: '/images/i_ecommerce.png',
    headline: 'E-Commerce Solutions',
    subheadline: "A store that sells — even when you're not watching.",
    body: [
      'Your online store needs to do more than display products. It needs to guide visitors from discovery to purchase with as little friction as possible — and keep them coming back.',
      'We build e-commerce experiences on Shopify, WooCommerce, and custom platforms, with clean product pages, fast checkout flows, secure payment processing, and inventory management that scales with your business.',
      'From your first product to your thousandth order, we build the technical foundation and UX that makes selling online feel effortless — for you and your customers.',
    ],
    highlights: [
      { icon: '🛒', stat: '69%', label: 'avg. cart abandonment rate' },
      { icon: '💳', stat: '35%', label: 'revenue increase with better UX' },
      { icon: '🔒', stat: '100%', label: 'PCI-compliant payment setup' },
    ],
  },
  'CMS Integration': {
    icon: '/images/i_cms.png',
    headline: 'CMS Integration',
    subheadline: 'Your website, fully in your hands.',
    body: [
      "You shouldn't need a developer every time you want to update a blog post, swap an image, or add a new page. A well-integrated CMS puts that power directly in your hands.",
      'We set up and configure content management systems — WordPress, Contentful, Sanity, and others — tailored to how your team actually works. Clean editing interfaces, logical content structures, and only the features you need.',
      "We also train your team so they're confident managing the site from day one. No mystery, no dependency on us for routine updates.",
    ],
    highlights: [
      { icon: '✏️', stat: '43%', label: 'of the web runs on WordPress' },
      { icon: '🚀', stat: '5×', label: 'faster content publishing' },
      { icon: '🧑‍💻', stat: '0', label: 'developer needed for updates' },
    ],
  },
  'SEO Optimization': {
    icon: '/images/i_seo.png',
    headline: 'SEO Optimization',
    subheadline: 'Built to be found from the very first line of code.',
    body: [
      "SEO isn't something you bolt on after a site is built — it needs to be baked in from the start. Site structure, page speed, semantic HTML, metadata, schema markup, internal linking — all of it affects how search engines read and rank your site.",
      'We build every site with SEO fundamentals in place, and we go further with keyword-informed content structure, technical audits, and on-page optimization that gives you a real head start in search rankings.',
      "Whether you're launching a new site or optimizing an existing one, we make sure Google can find you, understand you, and rank you for the terms your customers are actually searching.",
    ],
    highlights: [
      {
        icon: '🔍',
        stat: '68%',
        label: 'of online experiences start with search',
      },
      { icon: '📈', stat: '14×', label: 'more traffic from organic vs paid' },
      { icon: '🥇', stat: '27%', label: 'of clicks go to the #1 result' },
    ],
  },
  'Performance Optimization': {
    icon: '/images/i_performanceOptimization.png',
    headline: 'Performance Optimization',
    subheadline: 'Every second counts — and so does every millisecond.',
    body: [
      "A slow website doesn't just frustrate visitors — it actively costs you business. Google uses page speed as a ranking factor, and users abandon sites that take more than 3 seconds to load.",
      "We audit and optimize every layer of your site's performance: image compression, code minification, lazy loading, caching strategies, CDN configuration, and Core Web Vitals. The goal is a site that feels instant on any device and any connection.",
      "Fast sites convert better, rank higher, and leave a better impression. Performance isn't a nice-to-have — it's a competitive advantage.",
    ],
    highlights: [
      { icon: '⚡', stat: '0.1s', label: 'faster load = 8% lower bounce rate' },
      { icon: '📊', stat: '32%', label: 'more conversions with fast sites' },
      { icon: '🏆', stat: 'Top 3', label: 'Core Web Vitals = ranking boost' },
    ],
  },
};

const WebDevelopment = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = useCallback((title) => setActiveModal(title), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeModal]);

  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  const services = [
    {
      icon: '/images/i_customDesign.png',
      title: 'Custom Web Design',
      description:
        'Unique, brand-aligned designs that capture your vision and create memorable first impressions.',
    },
    {
      icon: '/images/i_responsiveDesign.png',
      title: 'Responsive Development',
      description:
        'Websites that look and function perfectly on all devices - from mobile phones to desktop screens.',
    },
    {
      icon: '/images/i_ecommerce.png',
      title: 'E-Commerce Solutions',
      description:
        'Custom online stores with secure payment processing, inventory management, and seamless checkout.',
    },
    {
      icon: '/images/i_cms.png',
      title: 'CMS Integration',
      description:
        'Easy-to-use content management systems that let you update your site without technical knowledge.',
    },
    {
      icon: '/images/i_seo.png',
      title: 'SEO Optimization',
      description:
        'Built-in search engine optimization to help your site rank higher and attract more visitors.',
    },
    {
      icon: '/images/i_performanceOptimization.png',
      title: 'Performance Optimization',
      description:
        'Fast-loading, optimized code that keeps visitors engaged and improves conversion rates.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description:
        'We learn about your business, goals, and audience to create a strategic plan for your website.',
    },
    {
      step: '02',
      title: 'Design & Prototyping',
      description:
        'We create wireframes and visual designs that bring your brand to life and ensure great user experience.',
    },
    {
      step: '03',
      title: 'Development & Testing',
      description:
        'Our developers build your site with clean, efficient code while continuously testing for quality.',
    },
    {
      step: '04',
      title: 'Launch & Support',
      description:
        'We deploy your site and provide ongoing support, maintenance, and optimization.',
    },
  ];

  const technologies = [
    { name: 'React', icon: '/images/i_react.png' },
    { name: 'Vue.js', icon: '/images/i_vue.png' },
    { name: 'Node.js', icon: '/images/i_node.png' },
    { name: 'WordPress', icon: '/images/i_wordpress.png' },
    { name: 'WooCommerce', icon: '/images/i_woo.png' },
    { name: 'Shopify', icon: '/images/i_shopify.png' },
    { name: 'Figma', icon: '/images/i_figma.png' },
    { name: 'Adobe XD', icon: '/images/i_xd.png' },
  ];

  const features = [
    {
      title: 'Mobile-First Approach',
      description:
        'We design for mobile first, ensuring your site works perfectly on every device.',
    },
    {
      title: 'Fast Loading Times',
      description:
        'Optimized code and images mean your site loads quickly, keeping visitors engaged.',
    },
    {
      title: 'SEO Ready',
      description:
        'Built with search engines in mind, helping you rank higher and attract more traffic.',
    },
    {
      title: 'Scalable Architecture',
      description:
        'Your site can grow with your business, easily adding new features and pages.',
    },
  ];

  const stats = [
    { value: '0.1s', label: 'Faster load time reduces bounce rate by 8%' },
    { value: '75%', label: 'Of users judge credibility by website design' },
    { value: '88%', label: 'Less likely to return after a bad experience' },
    { value: '2x', label: 'Higher conversions with custom design' },
  ];

  const activeDetails = activeModal ? serviceDetails[activeModal] : null;

  return (
    <div className='webdev-page'>
      <Helmet>
        <title>Web Design & Development Seattle | Rainboots Marketing</title>
        <meta
          name='description'
          content='Custom websites built for speed, SEO and conversions. Seattle web design and development agency — we build fast, beautiful, search-friendly sites that convert visitors into customers.'
        />
        <meta
          property='og:title'
          content='Web Design & Development | Rainboots Marketing Seattle'
        />
        <meta
          property='og:description'
          content="Whether you're building a new site or optimizing an existing one, we create fast, beautiful, search-friendly websites that represent your brand."
        />
        <link
          rel='canonical'
          href='https://rainbootsmarketing.com/web-development'
        />
      </Helmet>

      {/* ─── SEO hidden content store ─────────────────────────────────────────
          Rendered in DOM always so crawlers index it. clip-path keeps it
          visually invisible without display:none which Google may discount. */}
      <div className='seo-content-store' aria-hidden='true'>
        {Object.entries(serviceDetails).map(([key, detail]) => (
          <article key={key}>
            <h2>{detail.headline}</h2>
            <p>{detail.subheadline}</p>
            {detail.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            {detail.highlights.map((h, i) => (
              <p key={i}>
                {h.stat} — {h.label}
              </p>
            ))}
          </article>
        ))}
      </div>

      {/* Hero Section */}
      <section className='webdev-hero' data-header-theme='light'>
        <motion.div
          className='webdev-hero-content'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className='section-tag'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Web Development & Design
          </motion.span>
          <h1>Beautiful Websites That Drive Results</h1>
          <p>
            Custom-designed, fast-loading websites that represent your brand,
            engage visitors, and convert them into loyal customers.
          </p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to='/contact' className='btn-primary'>
              Start Your Project
            </Link>
            <Link to='/work' className='btn-secondary'>
              View Our Work
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className='webdev-hero-image'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src='/images/i_webDesign.png' alt='Web Development' />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='webdev-stats'>
        <div className='stats-grid'>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className='stat-item'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className='webdev-services'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Build
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Custom solutions tailored to your unique needs
          </motion.p>
        </div>

        <div className='services-grid'>
          {services.map((service, index) => (
            <motion.div
              key={index}
              className='service-card service-card--clickable'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => openModal(service.title)}
              role='button'
              tabIndex={0}
              aria-haspopup='dialog'
              aria-label={`Learn more about ${service.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  openModal(service.title);
              }}
            >
              <div className='service-icon'>
                <img src={service.icon} alt={service.title} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className='service-card-cta'>
                Learn more <span className='service-card-arrow'>→</span>
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className='webdev-process'>
        <div className='process-container'>
          <motion.div
            className='process-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Our Process</span>
            <h2>From Concept to Launch</h2>
            <p>
              We follow a proven, collaborative process to ensure your website
              meets your goals and exceeds expectations.
            </p>
          </motion.div>

          <div className='process-steps'>
            {process.map((step, index) => (
              <motion.div
                key={index}
                className='process-step'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className='step-number'>{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className='tech-section'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Technologies We Use
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Modern tools and frameworks for powerful, scalable websites
          </motion.p>
        </div>

        <div className='tech-grid'>
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className='tech-item'
              // initial={{ opacity: 0, scale: 0.8 }}
              // whileInView={{ opacity: 1, scale: 1 }}
              // viewport={{ once: true }}
              // transition={{ delay: index * 0.05 }}
              // whileHover={{ y: -5 }}
            >
              <img src={tech.icon} alt={tech.name} />
              <p>{tech.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className='features-section'>
        <div className='features-container'>
          <motion.div
            className='features-content'
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Why Choose Us</span>
            <h2>Websites That Work</h2>
            <p>
              We don't just build websites — we build digital experiences that
              engage users and drive business growth.
            </p>

            <div className='features-list'>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className='feature-item'
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className='feature-icon'>✓</div>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to='/work' className='btn-primary'>
              See Our Work
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='webdev-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Start Your Website Project?</h2>
          <p>
            Let's discuss your vision and create a website that stands out,
            engages visitors, and drives results for your business.
          </p>
          <Link to='/contact' className='btn-primary'>
            Get a Free Quote
          </Link>
        </motion.div>
      </section>

      {/* ─── Service Detail Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal && activeDetails && (
          <motion.div
            className='modal-backdrop'
            key='backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            aria-hidden='true'
          >
            <motion.div
              key='modal'
              className='channel-modal'
              role='dialog'
              aria-modal='true'
              aria-labelledby='modal-heading'
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className='modal-close'
                onClick={closeModal}
                aria-label='Close modal'
              >
                ✕
              </button>

              <div className='modal-header'>
                <div>
                  <h2 id='modal-heading'>{activeDetails.headline}</h2>
                  <p className='modal-subheadline'>
                    {activeDetails.subheadline}
                  </p>
                </div>
                <div className='modal-icon'>
                  <img src={activeDetails.icon} alt={activeDetails.headline} />
                </div>
              </div>

              <div className='modal-highlights'>
                {activeDetails.highlights.map((h, i) => (
                  <div key={i} className='modal-highlight-item'>
                    <span className='modal-highlight-emoji'>{h.icon}</span>
                    <strong>{h.stat}</strong>
                    <span>{h.label}</span>
                  </div>
                ))}
              </div>

              <div className='modal-body'>
                {activeDetails.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className='modal-footer'>
                <Link
                  to='/contact'
                  className='btn-primary'
                  onClick={closeModal}
                >
                  Start Your {activeDetails.headline} Project
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebDevelopment;
