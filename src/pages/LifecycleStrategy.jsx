import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import LifecycleProcessAnimation from './LifecycleProcessAnimation';
import './LifecycleStrategy.css';

// ─── Modal content — in DOM at all times for SEO crawlability ───
const stageDetails = {
  Awareness: {
    icon: '/images/i_awareness.png',
    headline: 'Awareness',
    subheadline: 'Attract new prospects and introduce them to your brand.',
    body: [
      'The customer journey starts here. At the awareness stage, potential customers are discovering your brand for the first time — often through search, social media, referrals, or content they find valuable.',
      'We help you create compelling first impressions with targeted content and campaigns that educate, inspire, and build trust. From blog posts and social content to video and display advertising, we ensure your brand shows up where your ideal customers are looking.',
      "The goal isn't to sell immediately — it's to start a relationship. We focus on delivering value first, so when prospects are ready to buy, your brand is the one they remember and trust.",
    ],
    highlights: [
      {
        icon: '👁️',
        stat: '84%',
        label: 'of consumers trust online reviews as much as friends',
      },
      {
        icon: '📊',
        stat: '47%',
        label: 'of buyers view 3-5 pieces of content before engaging',
      },
      {
        icon: '🎯',
        stat: '68%',
        label: 'of B2B buyers prefer researching independently',
      },
    ],
  },
  Acquisition: {
    icon: '/images/i_acquisition.png',
    headline: 'Acquisition',
    subheadline: 'Convert prospects into first-time customers.',
    body: [
      'Once someone knows about your brand, the next step is turning that awareness into action. The acquisition stage is where prospects become paying customers for the first time.',
      "We design seamless conversion experiences with compelling offers, friction-free checkout processes, and strategic calls-to-action that remove barriers to purchase. Whether it's a first-time buyer discount, a free trial, or a consultation booking, we optimize every step of the journey.",
      'Our acquisition strategies focus on making that first transaction as easy and rewarding as possible — because a great first purchase experience sets the foundation for long-term loyalty.',
    ],
    highlights: [
      {
        icon: '💰',
        stat: '5x',
        label: 'more expensive to acquire new customers than retain',
      },
      {
        icon: '🎯',
        stat: '65%',
        label: 'of business comes from existing customers',
      },
      {
        icon: '⚡',
        stat: '50%',
        label: 'more likely to try new products after first purchase',
      },
    ],
  },
  Activation: {
    icon: '/images/i_activation.png',
    headline: 'Activation',
    subheadline: "Guide new customers to experience your product's value.",
    body: [
      'Acquisition is just the beginning. Activation ensures new customers actually use your product or service and experience its core value — the "Aha!" moment that turns a buyer into a regular user.',
      "We build onboarding sequences that welcome new customers, guide them through key features, and help them achieve their first win with your product. From welcome emails and in-app tutorials to personalized check-ins, we reduce time-to-value and prevent buyer's remorse.",
      "Activation is critical for retention. Customers who never experience value won't stick around. We make sure they do — quickly and confidently.",
    ],
    highlights: [
      {
        icon: '🚀',
        stat: '60%',
        label: 'of trial users convert after proper onboarding',
      },
      { icon: '📧', stat: '3x', label: 'higher retention with welcome series' },
      {
        icon: '⏱️',
        stat: '72hrs',
        label: 'critical window for SaaS activation',
      },
    ],
  },
  Retention: {
    icon: '/images/i_retention.png',
    headline: 'Retention',
    subheadline: 'Keep customers engaged and coming back.',
    body: [
      'Acquiring a customer is an investment. Retention is how you earn that investment back — and then some. The retention stage focuses on keeping customers engaged, satisfied, and loyal over the long term.',
      'We build retention programs that reward repeat business, celebrate milestones, and solve problems before they become reasons to leave. From loyalty programs and VIP tiers to re-engagement campaigns and customer feedback loops, we keep your brand top-of-mind.',
      'A small increase in retention can dramatically impact your bottom line. We help you build the systems and strategies that turn one-time buyers into lifelong customers.',
    ],
    highlights: [
      {
        icon: '💎',
        stat: '5%',
        label: 'increase in retention = 25-95% more profit',
      },
      { icon: '🔁', stat: '65%', label: 'of revenue from repeat customers' },
      {
        icon: '⭐',
        stat: '14x',
        label: 'more revenue from retained vs acquired',
      },
    ],
  },
  Loyalty: {
    icon: '/images/i_loyalty.png',
    headline: 'Loyalty',
    subheadline: 'Transform satisfied customers into brand advocates.',
    body: [
      "Loyal customers don't just buy more — they bring others with them. The loyalty stage is about turning satisfied customers into passionate advocates who promote your brand to their networks.",
      'We build loyalty programs that genuinely reward engagement, referral systems that incentivize word-of-mouth marketing, and community experiences that make customers feel like insiders. The goal is to create emotional connection, not just transactional benefits.',
      'Loyal customers are your most powerful marketing channel. We help you earn their advocacy and give them the tools to spread the word effectively.',
    ],
    highlights: [
      {
        icon: '🗣️',
        stat: '90%',
        label: 'of people trust recommendations from people they know',
      },
      { icon: '📈', stat: '300%', label: 'ROI from lifecycle marketing' },
      { icon: '🏆', stat: '2x', label: 'more spending from loyal customers' },
    ],
  },
  'Win-Back': {
    icon: '/images/i_winback.png',
    headline: 'Win-Back',
    subheadline: "Re-engage inactive customers before they're gone for good.",
    body: [
      "Not every customer will stay forever — but many can be won back. The win-back stage targets customers who've gone inactive, addressing their reasons for leaving and giving them a reason to return.",
      'We design strategic win-back campaigns with personalized offers, feedback surveys, and re-engagement sequences that acknowledge past relationship and invite customers back. Timing and relevance are critical — we help you find the right moment and message.',
      'Recovering a past customer is often easier and cheaper than acquiring a new one. We help you build systematic win-back programs that recover revenue and rebuild relationships.',
    ],
    highlights: [
      {
        icon: '🔄',
        stat: '45%',
        label: 'of churned customers are open to returning',
      },
      { icon: '💰', stat: '5x', label: 'cheaper to win back than acquire new' },
      {
        icon: '📧',
        stat: '18%',
        label: 'avg. win-back campaign conversion rate',
      },
    ],
  },
};

const LifecycleStrategy = () => {
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

  const stages = [
    {
      icon: '/images/i_awareness.png',
      title: 'Awareness',
      description:
        'Attract new prospects and introduce them to your brand through targeted content and campaigns.',
    },
    {
      icon: '/images/i_acquisition.png',
      title: 'Acquisition',
      description:
        'Convert prospects into first-time customers with compelling offers and seamless experiences.',
    },
    {
      icon: '/images/i_activation.png',
      title: 'Activation',
      description:
        "Guide new customers to experience your product's value and complete key actions.",
    },
    {
      icon: '/images/i_retention.png',
      title: 'Retention',
      description:
        'Keep customers engaged and coming back with personalized communication and rewards.',
    },
    {
      icon: '/images/i_loyalty.png',
      title: 'Loyalty',
      description:
        'Transform satisfied customers into brand advocates who promote your business.',
    },
    {
      icon: '/images/i_winback.png',
      title: 'Win-Back',
      description:
        'Re-engage inactive customers with targeted campaigns designed to bring them back.',
    },
  ];

  const strategies = [
    {
      title: 'Personalized Communication',
      description:
        'Tailored messages based on customer behavior, preferences, and stage in the lifecycle.',
    },
    {
      title: 'Behavioral Triggers',
      description:
        'Automated campaigns triggered by specific customer actions or inactions.',
    },
    {
      title: 'Segmentation',
      description:
        'Divide your audience into meaningful groups for more relevant targeting.',
    },
    {
      title: 'Cross-Sell & Upsell',
      description:
        'Strategic recommendations for additional products or services based on purchase history.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Audit & Analysis',
      description:
        'We analyze your current customer data, identify gaps, and map the existing customer journey.',
    },
    {
      step: '02',
      title: 'Strategy Development',
      description:
        'Create a comprehensive lifecycle strategy with touchpoints for each customer stage.',
    },
    {
      step: '03',
      title: 'Implementation',
      description:
        'Set up automated campaigns, email flows, and tracking to execute the strategy.',
    },
    {
      step: '04',
      title: 'Optimization',
      description:
        'Continuous monitoring and refinement to improve engagement and ROI.',
    },
  ];

  const stats = [
    { value: '5x', label: 'Higher retention increases profits' },
    { value: '65%', label: 'Of business comes from existing customers' },
    { value: '50%', label: 'More likely to try new products' },
    { value: '300%', label: 'ROI from lifecycle marketing' },
  ];

  const channels = [
    {
      name: 'Email Marketing',
      description:
        'Personalized emails for each lifecycle stage, from welcome series to win-back campaigns.',
    },
    {
      name: 'SMS Marketing',
      description:
        'Timely text messages for high-engagement moments like order confirmations and special offers.',
    },
    {
      name: 'Push Notifications',
      description:
        'Re-engage users with relevant notifications based on their behavior and preferences.',
    },
    {
      name: 'In-App Messages',
      description:
        'Guide users through your product with contextual messages and prompts.',
    },
  ];

  const activeDetails = activeModal ? stageDetails[activeModal] : null;

  return (
    <div className='lifecycle-page'>
      <Helmet>
        <title>
          Lifecycle Marketing Strategy Seattle | Rainboots Marketing
        </title>
        <meta
          name='description'
          content='Personalized customer journeys that activate, engage, retain and win back customers. Seattle lifecycle marketing specialists — the right message at the right moment.'
        />
        <meta
          property='og:title'
          content='Lifecycle Marketing Strategy | Rainboots Marketing'
        />
        <meta
          property='og:description'
          content='We create personalized customer experiences that activate new customers, drive engagement, build loyalty, and win back those who have drifted away.'
        />
        <link rel='canonical' href='https://rainbootsmarketing.com/lifecycle' />
      </Helmet>

      {/* ─── SEO hidden content store ─────────────────────────────────────────
          Rendered in DOM always so crawlers index it. */}
      <div className='seo-content-store' aria-hidden='true'>
        {Object.entries(stageDetails).map(([key, detail]) => (
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
      <section className='lifecycle-hero' data-header-theme='light'>
        <motion.div
          className='lifecycle-hero-content'
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
            Lifecycle Strategy
          </motion.span>
          <h1>The Right Message at the Right Moment</h1>
          <p>
            Create personalized customer experiences that activate new
            customers, drive engagement, build loyalty, and win back those
            who've drifted away.
          </p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to='/contact' className='btn-primary'>
              Build Your Lifecycle Strategy
            </Link>
            <Link to='/services' className='btn-secondary'>
              View All Services
            </Link>
          </motion.div>
        </motion.div>

        <LifecycleProcessAnimation />
      </section>

      {/* Stats Section */}
      <section className='lifecycle-stats'>
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

      {/* Lifecycle Stages Section - NOW CLICKABLE */}
      <section className='lifecycle-stages'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Customer Lifecycle
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Every stage of the customer journey requires a different approach
          </motion.p>
        </div>

        <div className='stages-grid'>
          {stages.map((stage, index) => (
            <motion.div
              key={index}
              className='stage-card stage-card--clickable'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => openModal(stage.title)}
              role='button'
              tabIndex={0}
              aria-haspopup='dialog'
              aria-label={`Learn more about ${stage.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openModal(stage.title);
              }}
            >
              <div className='stage-icon'>
                <img src={stage.icon} alt={stage.title} />
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <span className='stage-card-cta'>
                Learn more <span className='stage-card-arrow'>→</span>
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Channels Section */}
      <section className='lifecycle-channels'>
        <div className='channels-container'>
          <motion.div
            className='channels-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Multi-Channel Approach</span>
            <h2>Reach Customers Where They Are</h2>
            <p>
              We use a combination of channels to engage customers at every
              stage of their journey, ensuring your message is seen at the right
              time and place.
            </p>

            <div className='channels-list'>
              {channels.map((channel, index) => (
                <motion.div
                  key={index}
                  className='channel-item'
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className='strategy-icon'>✓</div>
                  <div>
                    <h4>{channel.name}</h4>
                    <p>{channel.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className='strategies-content'
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Key Strategies</span>
            <h2>Maximize Customer Lifetime Value</h2>
            <p>
              Our lifecycle strategies focus on building lasting relationships
              that drive repeat business and turn customers into advocates.
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
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className='lifecycle-process'>
        <div className='process-container'>
          <motion.div
            className='process-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Our Process</span>
            <h2>Building Your Lifecycle Strategy</h2>
            <p>
              A systematic approach to creating personalized experiences that
              drive customer loyalty and maximize lifetime value.
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

          {/* <LifecycleProcessAnimation /> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className='lifecycle-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Transform Your Customer Experience?</h2>
          <p>
            Let's build a lifecycle strategy that turns first-time buyers into
            loyal, long-term customers who love your brand.
          </p>
          <Link to='/contact' className='btn-primary'>
            Schedule a Consultation
          </Link>
        </motion.div>
      </section>

      {/* ─── Stage Detail Modal ─────────────────────────────────────────────── */}
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
                  Build Your {activeDetails.headline} Strategy
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LifecycleStrategy;
