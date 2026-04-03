import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import './CustomerAcquisition.css';

// ─── Modal content — in DOM at all times for SEO crawlability ───
const channelDetails = {
  'Google Search Ads': {
    icon: '/images/i_googleAds.png',
    headline: 'Google Search Ads',
    subheadline: 'Reach customers actively searching for what you offer.',
    body: [
      "When someone searches for what you offer, you want to be the first result they see. Google Search Ads put your business directly in front of people who are actively looking for your products or services — at the exact moment they're ready to buy.",
      'We build and manage search campaigns that target high-intent keywords, optimize bids in real-time, and continuously refine ad copy to improve click-through rates. Our approach focuses on capturing demand efficiently while controlling costs.',
      'From keyword research and negative keyword management to ad extensions and audience targeting, we handle every aspect of your search campaigns so you get maximum ROI from every dollar spent.',
    ],
    highlights: [
      { icon: '🔍', stat: '46%', label: 'of all clicks go to top 3 ads' },
      { icon: '💰', stat: '200%', label: 'avg. ROI for search ads' },
      { icon: '🎯', stat: '65%', label: 'of high-intent clicks go to search' },
    ],
  },
  'Social Media Ads': {
    icon: '/images/i_socialAds.png',
    headline: 'Social Media Ads',
    subheadline: 'Meet your audience where they already spend their time.',
    body: [
      'Social media platforms have unparalleled data on user interests, behaviors, and demographics. We leverage that data to show your ads to the people most likely to become your customers — not just anyone with an internet connection.',
      'We create targeted campaigns across Facebook, Instagram, LinkedIn, and TikTok, matching creative and messaging to each platform. From eye-catching video ads to carousel product showcases, we test formats and targeting to find what drives results for your business.',
      'Our social advertising combines precise audience targeting with compelling creative to generate awareness, drive traffic, and convert users into customers — all while maintaining efficient cost-per-acquisition.',
    ],
    highlights: [
      {
        icon: '📱',
        stat: '4.9B+',
        label: 'active social media users worldwide',
      },
      {
        icon: '🎯',
        stat: '2.3×',
        label: 'higher engagement with targeted ads',
      },
      { icon: '📈', stat: '35%', label: 'lower CPA with lookalike audiences' },
    ],
  },
  'Retargeting Campaigns': {
    icon: '/images/i_strategicInsights.png',
    headline: 'Retargeting Campaigns',
    subheadline: 'Turn window shoppers into buyers.',
    body: [
      "Most visitors won't convert on their first visit. Retargeting gives you a second chance — and a third, and a fourth — to bring them back and close the sale.",
      "We set up strategic retargeting campaigns that show relevant ads to people who've already visited your site, viewed products, or abandoned carts. By staying top-of-mind as they browse elsewhere online, we increase the likelihood they'll return and complete their purchase.",
      "Our retargeting approach respects frequency caps and uses smart segmentation so you're not annoying potential customers — just reminding them of what they left behind. The result is higher conversion rates and lower customer acquisition costs.",
    ],
    highlights: [
      { icon: '🔄', stat: '200%', label: 'ROI increase with retargeting' },
      { icon: '🛒', stat: '70%', label: 'of cart abandoners return' },
      { icon: '💰', stat: '3×', label: 'higher CTR than standard display' },
    ],
  },
  'Lead Generation': {
    icon: '/images/i_leadGeneration.png',
    headline: 'Lead Generation',
    subheadline: 'Capture qualified leads at scale.',
    body: [
      'Not every customer is ready to buy immediately. Lead generation campaigns capture interest now so you can convert it into revenue later — building a pipeline of potential customers for your sales team.',
      'We design multi-channel lead generation campaigns with compelling offers, optimized landing pages, and friction-free forms that capture quality leads, not just email addresses. Every campaign includes proper tracking and lead scoring so you know which channels deliver the best opportunities.',
      'From B2B lead generation on LinkedIn to consumer lead gen on Facebook and Instagram, we build campaigns that fill your funnel with real prospects who are genuinely interested in what you offer.',
    ],
    highlights: [
      {
        icon: '📊',
        stat: '50%',
        label: 'lower cost per lead with optimization',
      },
      { icon: '🎯', stat: '3×', label: 'higher conversion with multi-channel' },
      {
        icon: '📝',
        stat: '75%',
        label: 'of leads require multiple touchpoints',
      },
    ],
  },
};

const CustomerAcquisition = () => {
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

  const channels = [
    {
      icon: '/images/i_googleAds.png',
      title: 'Google Search Ads',
      description:
        'Reach customers actively searching for your products or services with targeted search campaigns.',
    },
    {
      icon: '/images/i_socialAds.png',
      title: 'Social Media Ads',
      description:
        'Targeted campaigns on Facebook, Instagram, LinkedIn, and TikTok to reach your ideal audience.',
    },
    {
      icon: '/images/i_strategicInsights.png',
      title: 'Retargeting Campaigns',
      description:
        'Re-engage visitors who left your site without converting with strategic retargeting ads.',
    },
    {
      icon: '/images/i_leadGeneration.png',
      title: 'Lead Generation',
      description:
        'Multi-channel campaigns designed specifically to capture qualified leads for your business.',
    },
  ];

  const strategies = [
    {
      title: 'Audience Targeting',
      description:
        'Reach the right people with precision targeting based on demographics, interests, and behaviors.',
    },
    {
      title: 'Conversion Optimization',
      description:
        'Landing pages and funnels optimized to turn clicks into customers.',
    },
    {
      title: 'Budget Management',
      description:
        'Maximize ROI with strategic budget allocation across channels and campaigns.',
    },
    {
      title: 'A/B Testing',
      description:
        'Continuous testing of ads, landing pages, and audiences to improve performance.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Audience Research',
      description:
        'We identify your ideal customer profile and research where they spend their time online.',
    },
    {
      step: '02',
      title: 'Strategy Development',
      description:
        'Create a customized acquisition plan with the right channels, messaging, and budget.',
    },
    {
      step: '03',
      title: 'Campaign Launch',
      description:
        'Set up and launch campaigns with compelling creative and precise targeting.',
    },
    {
      step: '04',
      title: 'Monitor & Optimize',
      description:
        'Continuous monitoring and optimization to improve performance and reduce costs.',
    },
  ];

  const stats = [
    { value: '46%', label: 'Of all clicks go to top 3 ads' },
    { value: '200%', label: 'ROI increase with retargeting' },
    { value: '50%', label: 'Lower cost per lead with optimization' },
    { value: '3x', label: 'Higher conversion with multi-channel' },
  ];

  const platforms = [
    { name: 'Google Ads', icon: '/images/i_googleAds.png' },
    { name: 'Meta Ads', icon: '/images/i_metaAds.png' },
    { name: 'LinkedIn', icon: '/images/i_linkedin.png' },
    { name: 'TikTok', icon: '/images/i_tiktok.png' },
    { name: 'Pinterest', icon: '/images/i_pinterest.png' },
    { name: 'Instagram', icon: '/images/i_instagram.png' },
  ];

  const activeDetails = activeModal ? channelDetails[activeModal] : null;

  return (
    <div className='acquisition-page'>
      <Helmet>
        <title>
          Customer Acquisition Marketing Seattle | Rainboots Marketing
        </title>
        <meta
          name='description'
          content='Data-driven acquisition campaigns across Google, Meta, LinkedIn and more. Reach the right customers at the right time and grow your business with Rainboots Marketing.'
        />
        <meta
          property='og:title'
          content='Customer Acquisition Services | Rainboots Marketing'
        />
        <meta
          property='og:description'
          content='Multi-channel paid advertising and lead generation campaigns that turn prospects into paying customers. Seattle digital marketing agency.'
        />
        <link
          rel='canonical'
          href='https://rainbootsmarketing.com/acquisition'
        />
      </Helmet>

      {/* ─── SEO hidden content store ─────────────────────────────────────────
          Rendered in DOM always so crawlers index it. */}
      <div className='seo-content-store' aria-hidden='true'>
        {Object.entries(channelDetails).map(([key, detail]) => (
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
      <section className='acquisition-hero' data-header-theme='light'>
        <motion.div
          className='acquisition-hero-content'
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
            Customer Acquisition
          </motion.span>
          <h1>Turn Prospects into Paying Customers</h1>
          <p>
            Data-driven acquisition campaigns that reach the right people at the
            right time with the right message, maximizing your ROI and growing
            your customer base.
          </p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to='/contact' className='btn-primary'>
              Start Acquiring Customers
            </Link>
            <Link to='/services' className='btn-secondary'>
              View All Services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className='acquisition-hero-image'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src='/images/i_acquisition.png' alt='Customer Acquisition' />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='acquisition-stats'>
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

      {/* Channels Section - NOW CLICKABLE */}
      <section className='acquisition-channels'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Acquisition Channels
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Multi-channel approaches to reach customers wherever they are
          </motion.p>
        </div>

        <div className='channels-grid'>
          {channels.map((channel, index) => (
            <motion.div
              key={index}
              className='channel-card channel-card--clickable'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => openModal(channel.title)}
              role='button'
              tabIndex={0}
              aria-haspopup='dialog'
              aria-label={`Learn more about ${channel.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  openModal(channel.title);
              }}
            >
              <div className='channel-icon'>
                <img src={channel.icon} alt={channel.title} />
              </div>
              <h3>{channel.title}</h3>
              <p>{channel.description}</p>
              <span className='channel-card-cta'>
                Learn more <span className='channel-card-arrow'>→</span>
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platforms Section */}
      <section className='platforms-section-acquisition'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Platforms We Work With
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Certified expertise across major advertising platforms
          </motion.p>
        </div>

        <div className='platforms-grid'>
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              className='platform-item'
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <img src={platform.icon} alt={platform.name} />
              <p>{platform.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className='acquisition-process'>
        <div className='process-container'>
          <motion.div
            className='process-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Our Process</span>
            <h2>From Click to Customer</h2>
            <p>
              A systematic approach to acquiring customers that maximizes your
              advertising spend and delivers measurable results.
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

      {/* Strategies Section */}
      <section className='strategies-section'>
        <div className='strategies-container'>
          <motion.div
            className='strategies-content'
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Smart Strategies</span>
            <h2>Maximize Your Acquisition ROI</h2>
            <p>
              We combine data, creativity, and proven methodologies to acquire
              customers at the lowest possible cost.
            </p>

            <div className='strategies-list'>
              {strategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  className='strategy-item'
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className='strategy-icon'>✓</div>
                  <div>
                    <h4>{strategy.title}</h4>
                    <p>{strategy.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to='/contact' className='btn-primary'>
              Get Your Free Audit
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='acquisition-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Acquire More Customers?</h2>
          <p>
            Let's analyze your current acquisition efforts and build a custom
            strategy to grow your customer base efficiently.
          </p>
          <Link to='/contact' className='btn-primary'>
            Schedule a Consultation
          </Link>
        </motion.div>
      </section>

      {/* ─── Channel Detail Modal ─────────────────────────────────────────────── */}
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
                  Start Your {activeDetails.headline} Campaign
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerAcquisition;
