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
  // ── Websites ──
  {
    id: 1,
    category: 'websites',
    title: 'Rainboots Marketing',
    subtitle: 'React · Vite · Framer Motion',
    src: '/images/work/web-rainboots.png',
    srcFull: '/images/work/web-rainboots-full.png',
    url: 'https://rainbootsmarketing.com',
    color: '#2b5ce6',
    aspect: 'wide',
  },
  {
    id: 2,
    category: 'websites',
    title: 'E-Commerce Store',
    subtitle: 'Shopify · Custom Theme',
    src: '/images/work/web-ecommerce.png',
    srcFull: '/images/work/web-ecommerce-full.png',
    url: null,
    color: '#059669',
    aspect: 'wide',
  },
  {
    id: 3,
    category: 'websites',
    title: 'SaaS Platform Landing',
    subtitle: 'Next.js · Tailwind',
    src: '/images/work/web-saas.png',
    srcFull: '/images/work/web-saas-full.png',
    url: null,
    color: '#7c3aed',
    aspect: 'wide',
  },
  {
    id: 4,
    category: 'websites',
    title: 'Restaurant Group',
    subtitle: 'WordPress · Custom Design',
    src: '/images/work/web-restaurant.png',
    srcFull: '/images/work/web-restaurant-full.png',
    url: null,
    color: '#d97706',
    aspect: 'wide',
  },
  // ── Logos ──
  {
    id: 5,
    category: 'logos',
    title: 'Rainboots Marketing',
    subtitle: 'Brand Identity',
    src: '/images/work/logo-rainboots.png',
    srcFull: '/images/work/logo-rainboots-full.png',
    url: null,
    color: '#2b5ce6',
    aspect: 'square',
  },
  {
    id: 6,
    category: 'logos',
    title: 'Pacific Northwest Coffee',
    subtitle: 'Logo & Icon System',
    src: '/images/work/logo-coffee.png',
    srcFull: '/images/work/logo-coffee-full.png',
    url: null,
    color: '#92400e',
    aspect: 'square',
  },
  {
    id: 7,
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
    id: 8,
    category: 'logos',
    title: 'Health & Wellness Brand',
    subtitle: 'Full Logo Suite',
    src: '/images/work/logo-wellness.png',
    srcFull: '/images/work/logo-wellness-full.png',
    url: null,
    color: '#059669',
    aspect: 'square',
  },
  // ── Branding ──
  {
    id: 9,
    category: 'branding',
    title: 'Professional Services Rebrand',
    subtitle: 'Complete Brand System',
    src: '/images/work/brand-professional.png',
    srcFull: '/images/work/brand-professional-full.png',
    url: null,
    color: '#be185d',
    aspect: 'wide',
  },
  {
    id: 10,
    category: 'branding',
    title: 'Restaurant Chain Identity',
    subtitle: 'Brand Guidelines · Signage',
    src: '/images/work/brand-restaurant.png',
    srcFull: '/images/work/brand-restaurant-full.png',
    url: null,
    color: '#d97706',
    aspect: 'wide',
  },
  {
    id: 11,
    category: 'branding',
    title: 'Tech Startup Brand Kit',
    subtitle: 'Colors · Typography · Assets',
    src: '/images/work/brand-tech.png',
    srcFull: '/images/work/brand-tech-full.png',
    url: null,
    color: '#7c3aed',
    aspect: 'wide',
  },
  // ── Print ──
  {
    id: 12,
    category: 'print',
    title: 'Business Card Suite',
    subtitle: 'Premium Foil Print',
    src: '/images/work/print-cards.png',
    srcFull: '/images/work/print-cards-full.png',
    url: null,
    color: '#0d1b2a',
    aspect: 'wide',
  },
  {
    id: 13,
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
    id: 14,
    category: 'print',
    title: 'Trade Show Displays',
    subtitle: 'Banner · Booth Graphics',
    src: '/images/work/print-tradeshow.png',
    srcFull: '/images/work/print-tradeshow-full.png',
    url: null,
    color: '#dc2626',
    aspect: 'wide',
  },
  // ── Email ──
  {
    id: 15,
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
    id: 16,
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
    id: 17,
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
        className='lightbox'
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

        {/* Image */}
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
      {/* Image */}
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
        {/* Hover overlay */}
        <div className='work-card__overlay'>
          <span className='work-card__zoom'>View ↗</span>
        </div>
        {/* Color bar */}
        <div className='work-card__bar' />
      </div>

      {/* Info */}
      <div className='work-card__info'>
        <div className='work-card__title'>{item.title}</div>
        <div className='work-card__subtitle'>{item.subtitle}</div>
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
      // Make sure item is in current filter
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
          {/* Category pills */}
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
        {/* Rain */}
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
