import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import workData from '../data/workData.json';
import './Work.css';

// Category icon component
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

// Placeholder card component
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

// Case Study Panel
function CaseStudyPanel({ item }) {
  return (
    <div className='case-study'>
      <div className='case-study__tags'>
        {item.ongoing && (
          <span className='case-study__tag case-study__tag--ongoing'>
            ● Ongoing
          </span>
        )}
        {item.tags?.map((t) => (
          <span
            key={t}
            className='case-study__tag'
            style={{ '--cs-color': item.color }}
          >
            {t}
          </span>
        ))}
      </div>

      <p className='case-study__desc'>{item.description}</p>

      <div className='case-study__features'>
        {item.features?.map((f) => (
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

// Zoom Overlay (keep as is from your original)
function ZoomOverlay({ src, alt, onClose }) {
  // ... (copy from your original ZoomOverlay component)
  // Keeping it minimal here - you can copy the full ZoomOverlay from your original
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.96)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.12)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          color: '#fff',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          cursor: 'pointer',
        }}
      >
        ✕
      </button>
    </div>
  );
}

// Lightbox Component
function Lightbox({ item, onClose, onPrev, onNext, total, current }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const isEnriched = Boolean(item.description && item.features);

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

  return (
    <>
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
          <div
            className='lightbox__header'
            style={{ '--lb-color': item.color }}
          >
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

          {isEnriched ? (
            <div className='lightbox__enriched-body'>
              <div
                className='lightbox__image-wrap lightbox__image-wrap--side'
                style={{ background: item.color + '12' }}
              >
                {imgError ? (
                  <PlaceholderCard item={item} />
                ) : (
                  <img
                    src={item.srcFull || item.src}
                    alt={item.title}
                    className={`lightbox__img ${item.aspect}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    style={{ opacity: imgLoaded ? 1 : 0 }}
                  />
                )}
                {imgLoaded && !imgError && (
                  <button
                    className='lightbox__zoom-btn'
                    onClick={() => setZoomed(true)}
                  >
                    View full image
                  </button>
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
              {imgError ? (
                <PlaceholderCard item={item} />
              ) : (
                <img
                  src={item.srcFull || item.src}
                  alt={item.title}
                  className={`lightbox__img ${item.aspect}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  style={{ opacity: imgLoaded ? 1 : 0 }}
                />
              )}
            </div>
          )}

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

      {zoomed && (
        <ZoomOverlay
          src={item.srcFull || item.src}
          alt={item.title}
          onClose={() => setZoomed(false)}
        />
      )}
    </>
  );
}

// Work Card Component
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

// Main Work Component
const Work = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);
  const WORK_ITEMS = workData.workItems;
  const CATEGORIES = workData.categories;

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

      {/* Hero Section */}
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

      {/* Filter Bar */}
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

      {/* Masonry Grid */}
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

      {/* CTA Section */}
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

      {/* Lightbox */}
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
