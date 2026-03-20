import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import './Portfolio.css';

// ── Portfolio data ─────────────────────────────────────────────────────────
// Replace placeholder text with your real case studies.
// Add real screenshots to /public/images/portfolio/
const PROJECTS = [
  {
    id: 1,
    client: 'E-commerce Retailer',
    industry: 'Fashion & Apparel',
    service: 'Email Marketing',
    tag: 'email',
    headline: 'Rebuilt a dead email program from 12% to 38% open rates',
    description:
      'A national fashion retailer had seen engagement collapse after a sender reputation crisis. We rebuilt their authentication stack, re-permissioned the list, and redesigned their lifecycle flows from the ground up.',
    metrics: [
      { value: '38%', label: 'Open rate' },
      { value: '3.2x', label: 'Revenue lift' },
      { value: '94%', label: 'Inbox placement' },
    ],
    tags: ['Email Marketing', 'Deliverability', 'Lifecycle'],
    color: '#2b5ce6',
    featured: true,
    image: '/images/portfolio/case-email.png',
    duration: '6 months',
    result: '+$420K incremental revenue',
  },
  {
    id: 2,
    client: 'SaaS Platform',
    industry: 'Technology',
    service: 'Lifecycle Marketing',
    tag: 'lifecycle',
    headline: 'Reduced churn by 34% with a smarter onboarding sequence',
    description:
      "A B2B SaaS company was losing trial users before they hit their 'aha moment'. We mapped the full customer journey and built a 12-touch onboarding flow that guided users to activation within 7 days.",
    metrics: [
      { value: '34%', label: 'Churn reduction' },
      { value: '67%', label: 'Trial-to-paid rate' },
      { value: '12', label: 'Touch sequence' },
    ],
    tags: ['Lifecycle', 'Marketing Automation', 'Email Marketing'],
    color: '#7c3aed',
    featured: false,
    image: '/images/portfolio/case-lifecycle.png',
    duration: '3 months',
    result: '34% reduction in monthly churn',
  },
  {
    id: 3,
    client: 'Health & Wellness Brand',
    industry: 'Health',
    service: 'Deliverability',
    tag: 'deliverability',
    headline: 'Rescued a blacklisted domain and restored full inbox access',
    description:
      'After a third-party vendor caused a mass spam complaint event, this brand found themselves on 4 major blacklists with 22% inbox placement. We executed an emergency remediation plan over 8 weeks.',
    metrics: [
      { value: '22%→96%', label: 'Inbox placement' },
      { value: '4', label: 'Blacklists cleared' },
      { value: '8 wks', label: 'Recovery time' },
    ],
    tags: ['Deliverability', 'Email Marketing'],
    color: '#0e9aa7',
    featured: false,
    image: '/images/portfolio/case-deliverability.png',
    duration: '8 weeks',
    result: '96% inbox placement restored',
  },
  {
    id: 4,
    client: 'Regional Restaurant Chain',
    industry: 'Food & Beverage',
    service: 'SMS & Push',
    tag: 'sms',
    headline: 'SMS loyalty program driving $2.1M in attributable revenue',
    description:
      'Built a full SMS marketing program from zero — list growth strategy, compliance framework, segmentation, and automated campaigns tied to location-based triggers and purchase behavior.',
    metrics: [
      { value: '$2.1M', label: 'Attributed revenue' },
      { value: '41K', label: 'Subscribers in 90 days' },
      { value: '8.4%', label: 'Click-through rate' },
    ],
    tags: ['SMS & Push', 'Acquisition', 'Lifecycle'],
    color: '#d97706',
    featured: false,
    image: '/images/portfolio/case-sms.png',
    duration: '90 days',
    result: '$2.1M attributable revenue',
  },
  {
    id: 5,
    client: 'Professional Services Firm',
    industry: 'Legal & Finance',
    service: 'Branding',
    tag: 'branding',
    headline: 'Complete rebrand that increased qualified lead volume by 58%',
    description:
      'A 15-year-old professional services firm needed to modernize its identity without alienating existing clients. We built a new brand system that felt established and trustworthy while appealing to a younger demographic.',
    metrics: [
      { value: '58%', label: 'More qualified leads' },
      { value: '100%', label: 'Brand consistency score' },
      { value: '12', label: 'Deliverables' },
    ],
    tags: ['Branding', 'Web Development'],
    color: '#be185d',
    featured: false,
    image: '/images/portfolio/case-branding.png',
    duration: '10 weeks',
    result: '58% increase in qualified leads',
  },
  {
    id: 6,
    client: 'D2C Supplement Brand',
    industry: 'Health & Wellness',
    service: 'Acquisition',
    tag: 'acquisition',
    headline: 'Scaled Google + Meta spend from $10K to $85K/month profitably',
    description:
      'Started with a failing ad account spending $10K/month at 0.8x ROAS. Rebuilt the campaign architecture, creative strategy, and attribution model. Scaled to $85K/month while maintaining 2.4x ROAS.',
    metrics: [
      { value: '2.4x', label: 'ROAS at scale' },
      { value: '8.5x', label: 'Spend increase' },
      { value: '62%', label: 'Lower CPA' },
    ],
    tags: ['Acquisition', 'Marketing Automation'],
    color: '#0284c7',
    featured: false,
    image: '/images/portfolio/case-acquisition.png',
    duration: '5 months',
    result: '2.4x ROAS at $85K/month spend',
  },
  {
    id: 7,
    client: 'Fintech Startup',
    industry: 'Financial Technology',
    service: 'Web Development',
    tag: 'web',
    headline: 'New site drove 3x more demo requests in the first 30 days',
    description:
      'Rebuilt a confusing, slow website for a fintech startup. Focused entirely on conversion — clear value prop, streamlined demo flow, and A/B tested CTAs. Core Web Vitals went from failing to 98/100.',
    metrics: [
      { value: '3x', label: 'More demo requests' },
      { value: '98', label: 'Core Web Vitals score' },
      { value: '1.8s', label: 'Page load time' },
    ],
    tags: ['Web Development', 'Acquisition'],
    color: '#059669',
    featured: false,
    image: '/images/portfolio/case-web.png',
    duration: '8 weeks',
    result: '3x demo conversion rate',
  },
  {
    id: 8,
    client: 'Subscription Box Company',
    industry: 'E-commerce',
    service: 'Retention',
    tag: 'retention',
    headline: 'Win-back campaign recovered 18% of churned subscribers',
    description:
      'Built a 5-touch win-back sequence for subscribers who had cancelled. Personalized by cancel reason, time since cancellation, and historical purchase value. Deployed across email and SMS.',
    metrics: [
      { value: '18%', label: 'Win-back rate' },
      { value: '$340', label: 'Avg recovered LTV' },
      { value: '5', label: 'Touch sequence' },
    ],
    tags: ['Retention', 'Email Marketing', 'SMS & Push'],
    color: '#dc2626',
    featured: false,
    image: '/images/portfolio/case-retention.png',
    duration: '4 weeks',
    result: '18% of churned subscribers recovered',
  },
];

const FILTERS = [
  { label: 'All Work', value: 'all' },
  { label: 'Email', value: 'email' },
  { label: 'Deliverability', value: 'deliverability' },
  { label: 'Lifecycle', value: 'lifecycle' },
  { label: 'SMS & Push', value: 'sms' },
  { label: 'Acquisition', value: 'acquisition' },
  { label: 'Retention', value: 'retention' },
  { label: 'Branding', value: 'branding' },
  { label: 'Web Dev', value: 'web' },
];

const STATS = [
  { value: '500+', label: 'Campaigns launched' },
  { value: '$10M+', label: 'Revenue generated' },
  { value: '98%', label: 'Client retention' },
  { value: '25+', label: 'Years experience' },
];

// ── Case study modal ────────────────────────────────────────────────────────
function CaseModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      className='portfolio-modal-overlay'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className='portfolio-modal'
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        style={{ '--modal-color': project.color }}
      >
        {/* Modal header */}
        <div className='modal-header' style={{ background: project.color }}>
          <div className='modal-header-content'>
            <div className='modal-tag'>{project.service}</div>
            <h2 className='modal-title'>{project.headline}</h2>
            <div className='modal-meta'>
              <span>🏢 {project.client}</span>
              <span>🏷️ {project.industry}</span>
              <span>⏱️ {project.duration}</span>
            </div>
          </div>
          <button className='modal-close' onClick={onClose} aria-label='Close'>
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div className='modal-body'>
          {/* Key result callout */}
          <div className='modal-result-callout'>
            <span className='modal-result-icon'>🎯</span>
            <span className='modal-result-text'>{project.result}</span>
          </div>

          {/* Metrics */}
          <div className='modal-metrics'>
            {project.metrics.map((m, i) => (
              <div key={i} className='modal-metric'>
                <div className='modal-metric-value'>{m.value}</div>
                <div className='modal-metric-label'>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className='modal-section'>
            <h3 className='modal-section-title'>The Challenge & Approach</h3>
            <p className='modal-description'>{project.description}</p>
          </div>

          {/* Services used */}
          <div className='modal-section'>
            <h3 className='modal-section-title'>Services Involved</h3>
            <div className='modal-tags'>
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className='modal-tag-pill'
                  style={{
                    background: project.color + '18',
                    color: project.color,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className='modal-cta'>
            <p>Want results like this for your business?</p>
            <Link
              to='/contact'
              className='btn-primary modal-cta-btn'
              onClick={onClose}
            >
              Let's Talk
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project card ────────────────────────────────────────────────────────────
function ProjectCard({ project, index, onOpen }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`portfolio-card ${project.featured ? 'portfolio-card--featured' : ''}`}
      style={{
        '--card-color': project.color,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.55s ease ${(index % 3) * 0.08}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${(index % 3) * 0.08}s`,
      }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      onClick={() => onOpen(project)}
    >
      {/* Color accent bar */}
      <div className='portfolio-card__bar' />

      {/* Image / placeholder */}
      <div
        className='portfolio-card__image'
        style={{
          background: `linear-gradient(135deg, ${project.color}22 0%, ${project.color}44 100%)`,
        }}
      >
        <img
          src={project.image}
          alt={project.headline}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div
          className='portfolio-card__placeholder'
          style={{ display: 'none' }}
        >
          <span className='portfolio-card__placeholder-icon'>📊</span>
          <span className='portfolio-card__placeholder-label'>
            {project.service}
          </span>
        </div>
        {project.featured && (
          <div className='portfolio-card__featured-badge'>Featured</div>
        )}
        <div className='portfolio-card__result-badge'>{project.result}</div>
      </div>

      {/* Body */}
      <div className='portfolio-card__body'>
        <div className='portfolio-card__top'>
          <span
            className='portfolio-card__service'
            style={{ color: project.color, background: project.color + '15' }}
          >
            {project.service}
          </span>
          <span className='portfolio-card__industry'>{project.industry}</span>
        </div>

        <h3 className='portfolio-card__headline'>{project.headline}</h3>

        {/* Metrics row */}
        <div className='portfolio-card__metrics'>
          {project.metrics.slice(0, 3).map((m, i) => (
            <div key={i} className='portfolio-card__metric'>
              <div
                className='portfolio-card__metric-value'
                style={{ color: project.color }}
              >
                {m.value}
              </div>
              <div className='portfolio-card__metric-label'>{m.label}</div>
            </div>
          ))}
        </div>

        <div className='portfolio-card__footer'>
          <div className='portfolio-card__tags'>
            {project.tags.slice(0, 2).map((t, i) => (
              <span key={i} className='portfolio-card__tag'>
                {t}
              </span>
            ))}
          </div>
          <span className='portfolio-card__cta'>
            View case study <span className='portfolio-card__arrow'>→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Portfolio page ─────────────────────────────────────────────────────
const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered =
    activeFilter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.tag === activeFilter);

  return (
    <div className='portfolio-page'>
      <Helmet>
        <title>Portfolio & Case Studies | Rainboots Marketing Seattle</title>
        <meta
          name='description'
          content='Real results from real campaigns. See how Rainboots Marketing has driven revenue growth, improved deliverability, and built lasting brands for clients across industries.'
        />
        <link rel='canonical' href='https://rainbootsmarketing.com/portfolio' />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className='portfolio-hero'>
        <div className='portfolio-hero__bg' />
        <div className='portfolio-hero__grid' />

        <div className='portfolio-hero__content'>
          <motion.div
            className='portfolio-hero__eyebrow'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Work
          </motion.div>

          <motion.h1
            className='portfolio-hero__title'
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Results that
            <br />
            <em>speak for themselves</em>
          </motion.h1>

          <motion.p
            className='portfolio-hero__sub'
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Real campaigns. Real clients. Real numbers. No vanity metrics — just
            the outcomes that actually matter to your business.
          </motion.p>

          {/* Stats strip */}
          <motion.div
            className='portfolio-hero__stats'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            {STATS.map((s, i) => (
              <div key={i} className='portfolio-hero__stat'>
                <div className='portfolio-hero__stat-value'>{s.value}</div>
                <div className='portfolio-hero__stat-label'>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Decorative rain */}
        <div className='portfolio-hero__drops'>
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className='portfolio-hero__drop'
              style={{
                left: `${8 + i * 9}%`,
                height: `${28 + (i % 4) * 20}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${1.1 + (i % 4) * 0.4}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <div className='portfolio-filters'>
        <div className='portfolio-filters__inner'>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`portfolio-filter-btn ${activeFilter === f.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
              {activeFilter === f.value && f.value !== 'all' && (
                <span className='portfolio-filter-count'>
                  {PROJECTS.filter((p) => p.tag === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      <section className='portfolio-grid-section'>
        <div className='portfolio-grid-inner'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeFilter}
              className='portfolio-grid'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onOpen={setSelectedProject}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className='portfolio-empty'>
              <span>🔍</span>
              <p>No projects in this category yet.</p>
              <button onClick={() => setActiveFilter('all')}>
                View all work
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Process strip ─────────────────────────────────────────────────── */}
      <section className='portfolio-process'>
        <div className='portfolio-process__inner'>
          <motion.div
            className='portfolio-process__header'
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>How We Work</span>
            <h2>Our approach to every engagement</h2>
          </motion.div>

          <div className='portfolio-process__steps'>
            {[
              {
                num: '01',
                title: 'Audit & Diagnose',
                desc: "We start by understanding exactly where you are — what's working, what isn't, and what the biggest opportunities are.",
              },
              {
                num: '02',
                title: 'Strategy & Planning',
                desc: 'We build a custom plan with clear milestones, channel priorities, and measurable goals tied to your business objectives.',
              },
              {
                num: '03',
                title: 'Execute & Test',
                desc: 'We move fast, test everything, and iterate based on real data — not assumptions.',
              },
              {
                num: '04',
                title: 'Measure & Scale',
                desc: "Once we've found what works, we scale it systematically and report on the metrics that actually matter.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className='portfolio-process__step'
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className='portfolio-process__num'>{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className='portfolio-cta'>
        <motion.div
          className='portfolio-cta__inner'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className='portfolio-cta__tag'>Start a project</span>
          <h2>
            Ready to be our next <em>case study?</em>
          </h2>
          <p>
            Let's talk about your goals and what kind of results we can drive
            together.
          </p>
          <Link to='/contact' className='btn-primary portfolio-cta__btn'>
            Schedule a Free Consultation
          </Link>
        </motion.div>
      </section>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <CaseModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
