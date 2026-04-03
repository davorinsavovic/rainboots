import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import BrandProcessAnimation from './BrandProcessAnimation';
import './BrandIdentity.css';

// ─── Modal content for Services — in DOM at all times for SEO crawlability ───
const serviceDetails = {
  'Logo Design': {
    icon: '/images/i_logoDesign.png',
    headline: 'Logo Design',
    subheadline: 'A logo that captures your brand essence.',
    body: [
      "Your logo is the face of your brand — it's often the first thing people see and the symbol they remember. A great logo communicates who you are, what you stand for, and what makes you different, all in a single, memorable mark.",
      'We design custom logos that are distinctive, scalable, and timeless. Every logo we create starts with deep discovery — understanding your business, audience, values, and competitive landscape. From there, we explore multiple concepts before refining the direction that best captures your brand essence.',
      'You receive a complete logo package with primary and secondary lockups, horizontal and vertical variations, color versions, and black-and-white options — all delivered in multiple file formats for every application, from websites to signage to business cards.',
    ],
    highlights: [
      {
        icon: '🎨',
        stat: '75%',
        label: 'of consumers recognize a brand by its logo',
      },
      {
        icon: '⏱️',
        stat: '10s',
        label: 'to form a first impression of a logo',
      },
      { icon: '💡', stat: '5-7', label: 'logo concepts explored per project' },
    ],
  },
  'Color Palette': {
    icon: '/images/i_colorPalette.png',
    headline: 'Color Palette',
    subheadline: 'Strategic colors that evoke the right emotions.',
    body: [
      'Color is one of the most powerful tools in branding. Different colors evoke different emotions, influence perceptions, and can even drive purchasing decisions. The right color palette makes your brand instantly recognizable and emotionally resonant.',
      'We develop custom color palettes based on color psychology, your industry, target audience, and brand personality. Every palette includes primary, secondary, and accent colors with hex, RGB, CMYK, and Pantone values for consistent application across digital and print.',
      'Our color strategies ensure accessibility, contrast, and versatility — your brand will look great on screens, in print, and everywhere in between. We also provide guidance on color usage rules to maintain consistency across all touchpoints.',
    ],
    highlights: [
      {
        icon: '🎨',
        stat: '85%',
        label: 'of shoppers cite color as primary reason for buying',
      },
      {
        icon: '🧠',
        stat: '62-90%',
        label: 'of assessment based on color alone',
      },
      {
        icon: '🚀',
        stat: '80%',
        label: 'increase in brand recognition with consistent color',
      },
    ],
  },
  Typography: {
    icon: '/images/i_typography.png',
    headline: 'Typography',
    subheadline: 'Fonts that communicate your brand voice.',
    body: [
      'Typography is the voice of your brand — it communicates personality, sets tone, and affects readability. The right font choices make your brand feel professional, friendly, elegant, or bold, while the wrong choices can undermine your message.',
      'We curate custom typography systems that pair perfectly together and work across all applications. Every system includes primary and secondary fonts for headlines, body copy, and accents, with weights, styles, and usage guidelines.',
      'We consider legibility, scalability, web performance, and licensing in every typography recommendation. Whether you need custom fonts or carefully selected web-safe alternatives, we ensure your brand looks beautiful and reads clearly everywhere it appears.',
    ],
    highlights: [
      { icon: '✒️', stat: '95%', label: 'of web design is typography' },
      { icon: '📖', stat: '40%', label: 'faster reading with good typography' },
      {
        icon: '🎯',
        stat: '3x',
        label: 'higher trust with professional typography',
      },
    ],
  },
  'Brand Guidelines': {
    icon: '/images/i_brandGuidelines.png',
    headline: 'Brand Guidelines',
    subheadline: 'Your brand bible for consistent application.',
    body: [
      'Brand guidelines are the instruction manual for your brand — they ensure everyone who creates on your behalf maintains consistency, quality, and alignment with your brand strategy. Without guidelines, your brand risks becoming fragmented and confusing.',
      'We create comprehensive brand guidelines that cover logo usage, color palette, typography, imagery style, tone of voice, and application examples. Our guidelines are practical, easy to follow, and designed to be used by designers, marketers, and partners alike.',
      'You receive a beautifully designed PDF brand guide that can be shared internally and externally. We also provide quick-reference one-sheets for common applications like social media, email signatures, and presentations.',
    ],
    highlights: [
      {
        icon: '📘',
        stat: '3-5x',
        label: 'higher brand recognition with guidelines',
      },
      {
        icon: '🎯',
        stat: '23%',
        label: 'revenue increase with consistent branding',
      },
      { icon: '⏱️', stat: '50%', label: 'less time spent on design decisions' },
    ],
  },
  'Stationery Design': {
    icon: '/images/i_stationery.png',
    headline: 'Stationery Design',
    subheadline: 'Print materials that make professional impressions.',
    body: [
      'Business cards, letterheads, and envelopes are often the first physical touchpoints people have with your brand. Well-designed stationery signals professionalism, attention to detail, and builds credibility before you even say a word.',
      'We design complete stationery packages that extend your brand identity to print. Every piece is thoughtfully crafted with proper bleeds, paper recommendations, and printing specifications for professional results.',
      'Your stationery package includes business cards (standard and premium options), letterhead, envelopes, notecards, and mailing labels. We provide print-ready files and can coordinate with printers for you, ensuring your materials look exactly as designed.',
    ],
    highlights: [
      {
        icon: '💳',
        stat: '72%',
        label: 'judge company by business card quality',
      },
      {
        icon: '📬',
        stat: '82%',
        label: 'open direct mail from professional sources',
      },
      {
        icon: '✉️',
        stat: '27%',
        label: 'higher response with branded envelopes',
      },
    ],
  },
  'Marketing Collateral': {
    icon: '/images/i_marketingCollateral.png',
    headline: 'Marketing Collateral',
    subheadline: 'Sales materials designed to impress and convert.',
    body: [
      'Brochures, flyers, sales sheets, and presentation decks are critical tools for your sales team. Well-designed collateral supports your message, builds credibility, and helps close deals — while poor design can undermine even the best sales pitch.',
      'We design marketing collateral that aligns with your brand identity and supports your sales process. Every piece is strategically structured to guide prospects through your value proposition and call to action.',
      'Our collateral services include brochures, sell sheets, case study templates, presentation decks, trade show materials, and sales kits. We provide both print-ready and digital versions, optimized for professional printing or easy sharing via email and web.',
    ],
    highlights: [
      { icon: '📊', stat: '65%', label: 'of people are visual learners' },
      {
        icon: '📈',
        stat: '43%',
        label: 'higher conversion with professional collateral',
      },
      {
        icon: '⏱️',
        stat: '4x',
        label: 'faster decisions with visual sales materials',
      },
    ],
  },
};

const BrandIdentity = () => {
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
      icon: '/images/i_logoDesign.png',
      title: 'Logo Design',
      description:
        'Distinctive, memorable logos that capture your brand essence and make a lasting impression.',
    },
    {
      icon: '/images/i_colorPalette.png',
      title: 'Color Palette',
      description:
        'Strategic color selections that evoke the right emotions and create visual consistency.',
    },
    {
      icon: '/images/i_typography.png',
      title: 'Typography',
      description:
        'Custom font selections and pairings that communicate your brand voice and personality.',
    },
    {
      icon: '/images/i_brandGuidelines.png',
      title: 'Brand Guidelines',
      description:
        'Comprehensive guides that ensure consistent brand application across all touchpoints.',
    },
    {
      icon: '/images/i_stationery.png',
      title: 'Stationery Design',
      description:
        'Business cards, letterheads, and envelopes that extend your brand to print materials.',
    },
    {
      icon: '/images/i_marketingCollateral.png',
      title: 'Marketing Collateral',
      description:
        'Brochures, flyers, and sales sheets designed to impress and convert.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery',
      description:
        'We dive deep into your business, audience, competitors, and vision to understand your brand essence.',
    },
    {
      step: '02',
      title: 'Concept Development',
      description:
        'Our designers create multiple concepts exploring different directions for your brand identity.',
    },
    {
      step: '03',
      title: 'Refinement',
      description:
        'We refine the chosen direction based on your feedback, perfecting every detail.',
    },
    {
      step: '04',
      title: 'Final Delivery',
      description:
        'You receive a complete brand package with all assets and guidelines for consistent application.',
    },
  ];

  const deliverables = [
    'Primary Logo',
    'Secondary Logos',
    'Color Palette',
    'Typography System',
    'Brand Guidelines PDF',
    'Business Card Design',
    'Letterhead Design',
    'Email Signature',
    'Social Media Kit',
    'Stationery Package',
  ];

  const benefits = [
    {
      title: 'Memorable First Impressions',
      description:
        'A strong visual identity helps you stand out and be remembered in a crowded marketplace.',
    },
    {
      title: 'Builds Trust & Credibility',
      description:
        'Consistent, professional branding signals reliability and builds customer confidence.',
    },
    {
      title: 'Emotional Connection',
      description:
        'Great branding creates an emotional bond with your audience, fostering loyalty.',
    },
    {
      title: 'Supports Marketing Efforts',
      description:
        'A cohesive identity makes all your marketing materials more effective and recognizable.',
    },
    {
      title: 'Attracts Ideal Customers',
      description:
        'The right visual identity appeals to your target audience and repels the wrong ones.',
    },
    {
      title: 'Increases Brand Value',
      description:
        'A strong brand becomes a valuable business asset that grows over time.',
    },
  ];

  const stats = [
    { value: '90%', label: 'Of purchasing decisions are subconscious' },
    { value: '33%', label: 'Price premium for strong brands' },
    { value: '77%', label: 'Consumers buy from brands they follow' },
    { value: '3-5x', label: 'Higher recognition with consistent branding' },
  ];

  const activeDetails = activeModal ? serviceDetails[activeModal] : null;

  return (
    <div className='brand-page'>
      <Helmet>
        <title>
          Brand Identity & Design Services Seattle | Rainboots Marketing
        </title>
        <meta
          name='description'
          content='Logo design, brand guidelines, typography and visual assets that make a lasting first impression. Seattle branding agency — Rainboots Marketing.'
        />
        <meta
          property='og:title'
          content='Brand Identity & Design | Rainboots Marketing'
        />
        <meta
          property='og:description'
          content='From logo design to complete brand packages — we help Seattle businesses define who they are and stand out from competitors.'
        />
        <link rel='canonical' href='https://rainbootsmarketing.com/branding' />
      </Helmet>

      {/* ─── SEO hidden content store ─────────────────────────────────────────
          Rendered in DOM always so crawlers index it. */}
      <div className='seo-content-store' aria-hidden='true'>
        <h2>Brand Identity Services We Offer</h2>
        {Object.entries(serviceDetails).map(([key, detail]) => (
          <article key={key}>
            <h3>{detail.headline}</h3>
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
      <section className='brand-hero' data-header-theme='light'>
        <motion.div
          className='brand-hero-content'
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
            Brand Identity
          </motion.span>
          <h1>Make a Lasting First Impression</h1>
          <p>
            From logo design and brand identity to visual assets and messaging,
            we help you define who you are, stand out from competitors, and
            connect with your audience.
          </p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to='/contact' className='btn-primary'>
              Build Your Brand
            </Link>
            <Link to='/services' className='btn-secondary'>
              View All Services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className='brand-hero-image'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src='/images/i_branding.png' alt='Brand Identity' />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='brand-stats'>
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

      {/* Services Section - NOW CLICKABLE */}
      <section className='brand-services'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Create
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Comprehensive brand identities that tell your story and connect with
            your audience
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
      <section className='brand-process'>
        <div className='process-container'>
          <motion.div
            className='process-header'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Our Process</span>
            <h2>From Concept to Completion</h2>
            <p>
              A collaborative journey to create a brand identity that truly
              represents you
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

          {/* <BrandProcessAnimation /> */}
        </div>
      </section>

      {/* Deliverables Section */}
      <section className='deliverables-section'>
        <div className='deliverables-container'>
          <motion.div
            className='deliverables-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>What You Get</span>
            <h2>Complete Brand Package</h2>
            <p>
              Everything you need to launch and maintain a consistent,
              professional brand identity across all platforms and materials.
            </p>

            <div className='deliverables-list'>
              {deliverables.map((item, index) => (
                <motion.div
                  key={index}
                  className='deliverable-item'
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className='deliverable-icon'>✓</div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            <Link to='/contact' className='btn-primary'>
              Start Your Brand Project
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='brand-benefits'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Brand Identity Matters
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Great branding is an investment that pays dividends for years to
            come
          </motion.p>
        </div>

        <div className='benefits-grid'>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className='benefit-card'
              // initial={{ opacity: 0, y: 30 }}
              // whileInView={{ opacity: 1, y: 0 }}
              // viewport={{ once: true }}
              // transition={{ delay: index * 0.1 }}
              // whileHover={{ y: -5 }}
            >
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='brand-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Define Your Brand?</h2>
          <p>
            Let's create a brand identity that captures who you are, connects
            with your audience, and sets you apart from the competition.
          </p>
          <Link to='/contact' className='btn-primary'>
            Start Your Brand Journey
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
                  Get {activeDetails.headline}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandIdentity;
