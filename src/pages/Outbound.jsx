import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import './Outbound.css';
import PaperPlane from './PaperPlane';

// ─── Modal content lives HERE in the source, fully crawlable by search engines ───
const channelDetails = {
  'Email Marketing': {
    icon: '/images/i_outbound.png',
    headline: 'Email Marketing',
    subheadline: 'Where real relationships are built.',
    body: [
      "Email isn't just another marketing channel—it's where real relationships are built.",
      "We help you connect with your audience in a way that feels personal, not pushy. Instead of blasting generic messages, we craft emails that sound like they came from a real person—because that's what people respond to. Whether it's a welcome sequence, a follow-up after someone shows interest, or a re-engagement campaign, every message has a purpose.",
      "We focus on timing, tone, and relevance—sending the right message to the right person at the right moment. That means your emails don't get ignored… they get opened, read, and acted on.",
      'From thoughtful copywriting to smart automation, we turn email into a consistent, reliable way to nurture leads, build trust, and drive real results for your business.',
    ],
    highlights: [
      { icon: '✉️', stat: '99%', label: 'of consumers check email daily' },
      { icon: '💰', stat: '$42', label: 'avg. ROI per $1 spent' },
      { icon: '🎯', stat: '3×', label: 'higher conversion vs social' },
    ],
  },
  'SMS Marketing': {
    icon: '/images/i_sms.png',
    headline: 'SMS Marketing',
    subheadline: 'Instant. Personal. Impossible to ignore.',
    body: [
      "SMS cuts through the noise like nothing else. With a 98% open rate, your message isn't competing with an inbox—it's arriving in the most personal space a customer has.",
      'We craft concise, compelling text campaigns that feel human, not robotic. Flash sales, appointment reminders, exclusive offers, abandoned cart nudges—we match the message to the moment.',
      'Our SMS strategies are compliant, consent-based, and built for conversion. We handle the technical setup so you can focus on results.',
    ],
    highlights: [
      { icon: '📱', stat: '98%', label: 'SMS open rate' },
      { icon: '⚡', stat: '3 min', label: 'avg. time to open' },
      { icon: '📈', stat: '45%', label: 'avg. response rate' },
    ],
  },
  'Push Notifications': {
    icon: '/images/i_push.png',
    headline: 'Push Notifications',
    subheadline: 'Bring them back — at exactly the right moment.',
    body: [
      "Push notifications are one of the most underutilized channels in digital marketing. When done right, they re-engage users who've already shown interest in your brand—without requiring them to check an inbox.",
      'We design web and mobile push campaigns that are timely, relevant, and never spammy. From breaking deals to personalized reminders, every notification is crafted to add value, not noise.',
      'We set up segmentation and automation so the right users get the right message based on their behavior—not a one-size-fits-all blast.',
    ],
    highlights: [
      { icon: '🔔', stat: '4×', label: 'higher engagement vs email' },
      { icon: '👆', stat: '40%', label: 'opt-in rate (web)' },
      { icon: '🔁', stat: '2×', label: 'return visit rate' },
    ],
  },
  'Lead Generation': {
    icon: '/images/i_leadGeneration.png',
    headline: 'Lead Generation',
    subheadline: 'Find your next customer before they find your competitor.',
    body: [
      'Every great customer relationship starts somewhere. We build multi-channel lead generation campaigns that identify, attract, and qualify the people most likely to buy from you.',
      'We combine targeted outreach, compelling landing pages, and smart follow-up sequences to turn cold prospects into warm conversations. No bought lists, no spray-and-pray—just strategic campaigns that fill your pipeline with real opportunities.',
      'We track every touchpoint so you know exactly where your best leads come from and how to get more of them.',
    ],
    highlights: [
      { icon: '🎯', stat: '3×', label: 'more qualified leads' },
      { icon: '📊', stat: '60%', label: 'lower cost per lead' },
      { icon: '🤝', stat: '80%', label: 'of leads need 5+ touchpoints' },
    ],
  },
  'Marketing Automation & Workflows': {
    icon: '/images/i_automation.png',
    headline: 'Marketing Automation & Workflows',
    subheadline: 'Work smarter — let your marketing run while you sleep.',
    body: [
      "The best marketing doesn't stop when you log off. We build automated workflows that keep your audience moving through the funnel 24/7 — without you lifting a finger.",
      'From welcome sequences and lead nurture flows to post-purchase follow-ups and re-engagement campaigns, we map out every touchpoint and automate it with precision. Each step is triggered by real behavior — a click, a visit, a form fill — so the right message always arrives at the right time.',
      'We work with the tools you already use — or help you choose the right platform — and build workflows that are clean, logical, and easy for your team to manage and scale.',
    ],
    highlights: [
      { icon: '⚙️', stat: '451%', label: 'increase in qualified leads' },
      { icon: '🕐', stat: '14hrs', label: 'saved per week on average' },
      { icon: '📈', stat: '77%', label: 'of companies see conversions rise' },
    ],
  },
  'Deliverability & Sender Reputation': {
    icon: '/images/i_senderReputation.png',
    headline: 'Deliverability & Sender Reputation',
    subheadline: 'Your message is only powerful if it actually arrives.',
    body: [
      "You can write the perfect email — but if it lands in spam, none of it matters. Deliverability is the foundation everything else is built on, and it's one of the most overlooked parts of outbound marketing.",
      'We audit your sending infrastructure, clean your lists, set up proper authentication (SPF, DKIM, DMARC), and monitor your sender reputation so your emails consistently land in the inbox — not the junk folder.',
      "Whether you're starting fresh or recovering from deliverability issues, we put the right technical foundations in place and keep a close eye on the metrics that matter: bounce rates, spam complaints, inbox placement, and domain health.",
    ],
    highlights: [
      { icon: '📬', stat: '97%+', label: 'inbox placement rate' },
      { icon: '🛡️', stat: '100%', label: 'SPF / DKIM / DMARC coverage' },
      { icon: '📉', stat: '<0.1%', label: 'target spam complaint rate' },
    ],
  },
};

const Outbound = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = useCallback((title) => setActiveModal(title), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  const channels = [
    {
      icon: '/images/i_outbound.png',
      title: 'Email Marketing',
      description:
        'Personalized email campaigns that nurture leads and drive conversions with compelling copy and strategic timing.',
    },
    {
      icon: '/images/i_sms.png',
      title: 'SMS Marketing',
      description:
        'Reach customers instantly with text messages. High open rates and immediate engagement for time-sensitive offers.',
    },
    {
      icon: '/images/i_push.png',
      title: 'Push Notifications',
      description:
        'Web and mobile push notifications that bring users back to your site with relevant, timely updates.',
    },
    {
      icon: '/images/i_leadGeneration.png',
      title: 'Lead Generation',
      description:
        'Multi-channel lead generation campaigns that identify and qualify potential customers.',
    },
    {
      icon: '/images/i_automation.png',
      title: 'Marketing Automation & Workflows',
      description:
        'Smart automated workflows that nurture leads, trigger perfectly timed messages, and keep your funnel moving around the clock.',
    },
    {
      icon: '/images/i_senderReputation.png',
      title: 'Deliverability & Sender Reputation',
      description:
        'Technical foundations — authentication, list hygiene, and reputation monitoring — that ensure your emails actually reach the inbox.',
    },
  ];

  const benefits = [
    {
      title: 'Targeted Reach',
      description:
        'Reach specific audiences based on demographics, behavior, and interests.',
    },
    {
      title: 'Measurable Results',
      description:
        'Track opens, clicks, conversions, and ROI with detailed analytics.',
    },
    {
      title: 'Scalable Campaigns',
      description:
        'Start small and scale up as you see results. Perfect for businesses of any size.',
    },
    {
      title: 'Quick Implementation',
      description:
        'Launch campaigns quickly and start seeing results in days, not months.',
    },
  ];

  const stats = [
    { value: '99%', label: 'Of consumers check email daily' },
    { value: '98%', label: 'SMS open rate' },
    { value: '4x', label: 'Higher engagement with push notifications' },
    { value: '$42', label: 'Average ROI per $1 spent on email' },
  ];

  const process = [
    {
      step: '01',
      title: 'Strategy Development',
      description:
        'We analyze your audience, goals, and market to create a customized outbound strategy.',
    },
    {
      step: '02',
      title: 'Campaign Creation',
      description:
        'Our team crafts compelling messages, designs assets, and sets up your campaign infrastructure.',
    },
    {
      step: '03',
      title: 'Launch & Monitor',
      description:
        'We launch your campaign and monitor performance in real-time, making adjustments as needed.',
    },
    {
      step: '04',
      title: 'Analyze & Optimize',
      description:
        'Deep dive into analytics to understand what worked and optimize future campaigns.',
    },
  ];

  const activeDetails = activeModal ? channelDetails[activeModal] : null;

  return (
    <div className='outbound-page'>
      <Helmet>
        <title>
          Email, SMS & Push Notification Marketing Seattle | Rainboots
        </title>
        <meta
          name='description'
          content='Targeted email, SMS and push notification campaigns that drive engagement and revenue. Seattle outbound marketing specialists with 25+ years combined experience.'
        />
        <meta
          property='og:title'
          content='Outbound Marketing Services | Rainboots Marketing'
        />
        <meta
          property='og:description'
          content='Connect with prospects and customers through targeted email, SMS and push notification campaigns that drive engagement and revenue.'
        />
        <link rel='canonical' href='https://rainbootsmarketing.com/outbound' />
      </Helmet>

      {/* ─── SEO HIDDEN CONTENT ──────────────────────────────────────────────────
          All modal text is rendered in the DOM at all times so search engines
          can crawl and index it. It is visually hidden using a CSS class
          (.seo-content-store) that uses clip/position tricks rather than
          display:none or visibility:hidden, both of which Google may discount. */}
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
      <section className='outbound-hero' data-header-theme='light'>
        <motion.div
          className='outbound-hero-content'
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
            Outbound Marketing
          </motion.span>
          <h1>Reach Customers Where They Are</h1>
          <p>
            Connect with prospects and customers through targeted email, SMS,
            and push notification campaigns that drive engagement and revenue.
          </p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to='/contact' className='btn-primary'>
              Start Your Campaign
            </Link>
            <Link to='/services' className='btn-secondary'>
              View All Services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className='outbound-hero-image'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src='/images/i_outbound.png' alt='Outbound Marketing' />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='outbound-stats'>
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

      {/* Channels Section */}
      <section className='channels-section'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Outbound Channels
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Multi-channel approaches that reach your audience wherever they are
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

      {/* Benefits Section */}
      <section className='benefits-section-outbound'>
        <div className='benefits-container'>
          <motion.div
            className='benefits-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Why Outbound?</span>
            <h2>Drive Real Results with Outbound Marketing</h2>
            <p>
              Outbound marketing puts you in control. Instead of waiting for
              customers to find you, you can proactively reach out to qualified
              leads and start conversations that matter.
            </p>

            <div className='benefits-list'>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className='benefit-item'
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className='benefit-icon'>✓</div>
                  <div>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* <motion.div
            className='features-image'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src='/images/outboundMarketing.png'
              alt='Drive Real Results with Outbound Marketing'
            />
          </motion.div> */}
        </div>
      </section>

      {/* Process Section */}
      <section className='process-section'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            A proven approach to outbound marketing success
          </motion.p>
        </div>

        <div className='process-grid'>
          {process.map((item, index) => (
            <motion.div
              key={index}
              className='process-card'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className='process-step'>{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Paper Plane Animation */}
      <PaperPlane />

      {/* CTA Section */}
      <section className='outbound-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Start Your Outbound Campaign?</h2>
          <p>
            Let's discuss your goals and create a customized outbound strategy
            that reaches the right people at the right time.
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
            {/* Stop clicks on the panel from bubbling up to the backdrop */}
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
              {/* Close button */}
              <button
                className='modal-close'
                onClick={closeModal}
                aria-label='Close modal'
              >
                ✕
              </button>

              {/* Header */}
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

              {/* Highlights strip */}
              <div className='modal-highlights'>
                {activeDetails.highlights.map((h, i) => (
                  <div key={i} className='modal-highlight-item'>
                    <span className='modal-highlight-emoji'>{h.icon}</span>
                    <strong>{h.stat}</strong>
                    <span>{h.label}</span>
                  </div>
                ))}
              </div>

              {/* Body paragraphs */}
              <div className='modal-body'>
                {activeDetails.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* CTA */}
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

export default Outbound;
