import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import './SocialMedia.css';

// ─── Modal content for Platforms — in DOM at all times for SEO crawlability ───
const platformDetails = {
  Facebook: {
    icon: '/images/i_facebook.png',
    headline: 'Facebook Marketing',
    subheadline: 'Build communities that drive real business results.',
    body: [
      'With nearly 3 billion monthly active users, Facebook remains the most powerful platform for building communities, running targeted ads, and connecting with audiences through meaningful content and conversations.',
      'We help you create Facebook strategies that go beyond posting — we build engaged communities, run data-driven ad campaigns, and develop content that sparks conversation. From organic reach strategies to sophisticated ad targeting, we handle every aspect of your Facebook presence.',
      "Our approach focuses on building genuine relationships with your audience while driving measurable business outcomes. Whether you're looking to increase brand awareness, generate leads, or drive sales, we create Facebook campaigns that deliver results.",
    ],
    highlights: [
      { icon: '👥', stat: '2.96B', label: 'monthly active users' },
      { icon: '📱', stat: '1.9B', label: 'daily active users' },
      { icon: '💰', stat: '88%', label: 'of marketers use Facebook ads' },
    ],
  },
  Instagram: {
    icon: '/images/i_instagram.png',
    headline: 'Instagram Marketing',
    subheadline: 'Visual storytelling that captivates and converts.',
    body: [
      'Instagram is where visual storytelling meets business results. With over 1 billion monthly active users, this platform is essential for brands that want to showcase their personality, products, and culture through stunning visuals.',
      'We craft Instagram strategies that leverage posts, stories, reels, and IGTV to tell your brand story in authentic and engaging ways. From aesthetic grid planning to viral-worthy reels content, we help you stand out in a crowded feed.',
      "Our approach combines creative content with strategic hashtag research, engagement tactics, and Instagram Shopping features to turn followers into customers. We don't just grow your following — we build a community that cares about your brand.",
    ],
    highlights: [
      { icon: '📸', stat: '1B+', label: 'monthly active users' },
      { icon: '🎥', stat: '50%', label: 'users follow a business' },
      { icon: '🛍️', stat: '130M', label: 'users tap on shopping posts' },
    ],
  },
  LinkedIn: {
    icon: '/images/i_linkedin.png',
    headline: 'LinkedIn Marketing',
    subheadline: 'B2B networking and thought leadership at scale.',
    body: [
      "LinkedIn is the world's largest professional network, making it essential for B2B companies, professional services, and businesses targeting decision-makers. With over 800 million members, it's where professional relationships are built and deals are made.",
      'We develop LinkedIn strategies that establish your brand as a thought leader, connect you with industry professionals, and generate high-quality B2B leads. From company page optimization to employee advocacy programs, we help you leverage every aspect of the platform.',
      'Our LinkedIn services include content creation, engagement strategies, LinkedIn Ads management, and sales navigator optimization — all designed to help you reach the right professionals at the right time with the right message.',
    ],
    highlights: [
      { icon: '💼', stat: '800M+', label: 'members worldwide' },
      { icon: '🎯', stat: '4x', label: 'higher response rate than email' },
      { icon: '📊', stat: '80%', label: 'of B2B leads come from LinkedIn' },
    ],
  },
  TikTok: {
    icon: '/images/i_tiktok.png',
    headline: 'TikTok Marketing',
    subheadline: 'Short-form video that reaches the next generation.',
    body: [
      "TikTok has exploded into one of the most influential social platforms, with over 1 billion active users spending an average of 95 minutes per day on the app. It's where trends are born and brands can achieve viral success overnight.",
      "We create TikTok strategies that embrace the platform's authentic, entertaining nature while aligning with your brand goals. From trend-hopping to original content creation, we help you connect with younger audiences in ways that feel natural, not forced.",
      "Our TikTok services include content ideation, production, posting schedules, hashtag strategies, and TikTok Ads management. We help you find your brand's unique voice on the platform and build a following that genuinely enjoys your content.",
    ],
    highlights: [
      { icon: '📱', stat: '1B+', label: 'active users' },
      { icon: '⏰', stat: '95min', label: 'average daily time spent' },
      { icon: '📈', stat: '67%', label: 'of users are inspired to shop' },
    ],
  },
  YouTube: {
    icon: '/images/i_youtube.png',
    headline: 'YouTube Marketing',
    subheadline: 'Long-form video that builds authority and trust.',
    body: [
      "YouTube is the second-largest search engine in the world, with over 2 billion logged-in monthly users. It's where people go to learn, be entertained, and make purchasing decisions — making it essential for brands that want to build authority through video content.",
      'We develop YouTube strategies that include channel optimization, content planning, video production guidance, and YouTube SEO. From educational tutorials to product reviews and brand stories, we help you create video content that ranks and resonates.',
      'Our YouTube services also include YouTube Ads management, helping you reach viewers through skippable and non-skippable ads, bumper ads, and discovery ads. We turn video viewers into customers through strategic content and advertising.',
    ],
    highlights: [
      { icon: '🎬', stat: '2B+', label: 'logged-in monthly users' },
      { icon: '🔍', stat: '2nd', label: 'largest search engine' },
      { icon: '📺', stat: '1B+', label: 'hours watched daily' },
    ],
  },
  Pinterest: {
    icon: '/images/i_pinterest.png',
    headline: 'Pinterest Marketing',
    subheadline: 'Visual discovery for lifestyle and shopping brands.',
    body: [
      "Pinterest is a visual discovery engine where users plan for the future — from home renovations and wedding planning to fashion inspiration and recipe saving. It's uniquely powerful for lifestyle, retail, and e-commerce brands.",
      "We create Pinterest strategies that leverage rich pins, buyable pins, and promoted pins to reach users at the planning stage — when they're most open to discovering new products and brands. Our approach focuses on keyword-rich descriptions, vertical imagery, and strategic board organization.",
      'With over 450 million monthly active users who come to Pinterest with a shopping mindset, we help you capture demand before it even exists. We optimize your presence to show up when users are actively planning their next purchase.',
    ],
    highlights: [
      { icon: '📌', stat: '450M+', label: 'monthly active users' },
      { icon: '🛍️', stat: '97%', label: 'of top searches are unbranded' },
      {
        icon: '💡',
        stat: '85%',
        label: 'of users say Pinterest helps start new projects',
      },
    ],
  },
};

// ─── Modal content for Services — in DOM at all times for SEO crawlability ───
const serviceDetails = {
  'Content Creation': {
    icon: '/images/i_contentCreation.png',
    headline: 'Content Creation',
    subheadline: 'Eye-catching content that stops the scroll.',
    body: [
      'Great content is the foundation of any successful social media strategy. It stops the scroll, sparks conversation, and builds brand affinity. But creating consistent, high-quality content across multiple platforms is challenging — especially while running a business.',
      'We handle the entire content creation process for you: strategic planning, graphic design, copywriting, video production, and editing. Every piece of content is tailored to your brand voice, optimized for each platform, and designed to drive engagement.',
      'From static posts and carousels to Reels, Stories, and long-form video, we create a steady stream of content that keeps your audience engaged, builds trust, and positions your brand as an authority in your industry.',
    ],
    highlights: [
      {
        icon: '📊',
        stat: '4.5x',
        label: 'more engagement with visual content',
      },
      {
        icon: '🎨',
        stat: '40%',
        label: 'higher conversion with custom graphics',
      },
      {
        icon: '⏱️',
        stat: '15hrs',
        label: 'saved per week on content creation',
      },
    ],
  },
  'Community Management': {
    icon: '/images/i_communityManagement.png',
    headline: 'Community Management',
    subheadline: 'Build relationships that turn followers into fans.',
    body: [
      'Posting content is only half the battle. Real social media success comes from the conversations that happen around your content. Community management is about building genuine relationships with your audience — responding to comments, answering questions, and engaging with user-generated content.',
      'We actively manage your social communities by monitoring comments, DMs, and mentions across all platforms. We respond promptly, engage authentically, and handle customer service issues with care. Our goal is to make every interaction feel personal and valuable.',
      "Strong community management turns casual followers into loyal brand advocates. We help you build a community that feels seen, heard, and valued — because people don't just buy products, they buy into brands that care about them.",
    ],
    highlights: [
      {
        icon: '💬',
        stat: '71%',
        label: 'more likely to recommend with fast responses',
      },
      {
        icon: '❤️',
        stat: '3x',
        label: 'higher loyalty with active engagement',
      },
      { icon: '📈', stat: '20%', label: 'increase in positive sentiment' },
    ],
  },
  'Social Advertising': {
    icon: '/images/i_socialAds.png',
    headline: 'Social Advertising',
    subheadline: 'Targeted ads that deliver measurable ROI.',
    body: [
      "Organic reach alone isn't enough anymore. Social advertising allows you to reach new audiences, retarget engaged users, and drive specific actions — from website visits to purchases. But running profitable ad campaigns requires strategy, testing, and constant optimization.",
      'We manage paid social campaigns across Facebook, Instagram, LinkedIn, TikTok, and Pinterest. From audience research and ad creation to bidding strategies and performance analysis, we handle every aspect of your paid social presence.',
      "Our data-driven approach ensures your ad spend delivers maximum ROI. We continuously test creative, targeting, and placements to lower your cost-per-acquisition and scale what works. Whether you're generating leads or driving sales, we build ad campaigns that deliver real business results.",
    ],
    highlights: [
      { icon: '🎯', stat: '2.5x', label: 'higher CTR with targeted ads' },
      { icon: '💰', stat: '3x', label: 'ROI from retargeting campaigns' },
      { icon: '📊', stat: '32%', label: 'lower CPA with optimization' },
    ],
  },
  'Analytics & Reporting': {
    icon: '/images/i_analytics.png',
    headline: 'Analytics & Reporting',
    subheadline: 'Data-driven decisions for continuous improvement.',
    body: [
      "You can't improve what you don't measure. Social media analytics provide the insights you need to understand what's working, what isn't, and where to invest your resources for maximum impact.",
      'We provide comprehensive analytics and reporting that track the metrics that actually matter to your business — not just likes and follows. Engagement rates, reach, click-through rates, conversions, ROI, and customer acquisition costs are all measured and analyzed.',
      "Our reports are clear, actionable, and focused on business outcomes. We don't just give you data — we give you insights and recommendations to continuously improve your social media performance. You'll always know exactly what's working and why.",
    ],
    highlights: [
      {
        icon: '📈',
        stat: '5x',
        label: 'faster growth with data-driven decisions',
      },
      { icon: '🎯', stat: '80%', label: 'better targeting with analytics' },
      { icon: '💰', stat: '25%', label: 'higher ROI with regular reporting' },
    ],
  },
};

const SocialMedia = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalType, setModalType] = useState(null); // 'platform' or 'service'

  const openPlatformModal = useCallback((title) => {
    setModalType('platform');
    setActiveModal(title);
  }, []);

  const openServiceModal = useCallback((title) => {
    setModalType('service');
    setActiveModal(title);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalType(null);
  }, []);

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

  const platforms = [
    {
      icon: '/images/i_facebook.png',
      name: 'Facebook',
      description:
        'Build communities, run targeted ads, and connect with audiences through content and conversations.',
    },
    {
      icon: '/images/i_instagram.png',
      name: 'Instagram',
      description:
        'Visual storytelling through posts, stories, reels, and IGTV to showcase your brand personality.',
    },
    {
      icon: '/images/i_linkedin.png',
      name: 'LinkedIn',
      description:
        'B2B networking, thought leadership content, and professional audience targeting.',
    },
    {
      icon: '/images/i_tiktok.png',
      name: 'TikTok',
      description:
        'Short-form video content that reaches younger audiences with trending, authentic content.',
    },
    {
      icon: '/images/i_youtube.png',
      name: 'YouTube',
      description:
        'Video content that builds brand awareness and drives traffic to your website.',
    },
    {
      icon: '/images/i_pinterest.png',
      name: 'Pinterest',
      description:
        'Visual discovery platform perfect for lifestyle, fashion, food, and DIY brands.',
    },
  ];

  const services = [
    {
      icon: '/images/i_contentCreation.png',
      title: 'Content Creation',
      description:
        'Eye-catching graphics, videos, and copy tailored to each platform and your brand voice.',
    },
    {
      icon: '/images/i_communityManagement.png',
      title: 'Community Management',
      description:
        'Daily engagement, responding to comments, and building relationships with your audience.',
    },
    {
      icon: '/images/i_socialAds.png',
      title: 'Social Advertising',
      description:
        'Targeted ad campaigns on all major platforms to reach new audiences and drive conversions.',
    },
    {
      icon: '/images/i_analytics.png',
      title: 'Analytics & Reporting',
      description:
        'Track performance, measure ROI, and gain insights to continuously improve your strategy.',
    },
  ];

  const benefits = [
    {
      title: 'Increased Brand Awareness',
      description:
        'Reach new audiences and get your brand in front of potential customers every day.',
    },
    {
      title: 'Direct Customer Engagement',
      description:
        'Build relationships through real conversations and meaningful interactions.',
    },
    {
      title: 'Drive Website Traffic',
      description:
        'Strategic content and calls-to-action that lead followers to your site.',
    },
    {
      title: 'Generate Leads & Sales',
      description:
        'Social commerce features and targeted campaigns that drive conversions.',
    },
    {
      title: 'Build Brand Loyalty',
      description:
        'Consistent, valuable content that keeps your audience engaged and coming back.',
    },
    {
      title: 'Competitive Intelligence',
      description:
        'Monitor competitors and industry trends to stay ahead of the curve.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Audit & Strategy',
      description:
        'We analyze your current presence, competitors, and audience to develop a custom strategy.',
    },
    {
      step: '02',
      title: 'Content Planning',
      description:
        'Create a content calendar with engaging posts, stories, and campaigns tailored to each platform.',
    },
    {
      step: '03',
      title: 'Implementation',
      description:
        'Schedule and publish content, engage with your audience, and manage your community.',
    },
    {
      step: '04',
      title: 'Analysis & Optimization',
      description:
        'Track performance metrics and continuously refine your strategy for better results.',
    },
  ];

  const stats = [
    { value: '4.9B', label: 'Social media users worldwide' },
    { value: '2h 24m', label: 'Average daily time spent on social' },
    { value: '73%', label: 'Marketers say social media is effective' },
    { value: '54%', label: 'Users research products on social media' },
  ];

  const activeDetails =
    modalType === 'platform'
      ? platformDetails[activeModal]
      : serviceDetails[activeModal];

  return (
    <div className='social-page'>
      <Helmet>
        <title>Social Media Marketing Seattle | Rainboots Marketing</title>
        <meta
          name='description'
          content='Strategic social media marketing that builds your brand and engages your audience. Seattle social media agency — meet your customers where they spend their time.'
        />
        <meta
          property='og:title'
          content='Social Media Marketing | Rainboots Marketing Seattle'
        />
        <meta
          property='og:description'
          content='Whether you want to attract new customers or deepen relationships with existing ones, we help you show up consistently and make an impact on social media.'
        />
        <link rel='canonical' href='https://rainbootsmarketing.com/social' />
      </Helmet>

      {/* ─── SEO hidden content store for Platforms ───────────────────────────── */}
      <div className='seo-content-store' aria-hidden='true'>
        <h2>Social Media Platforms We Master</h2>
        {Object.entries(platformDetails).map(([key, detail]) => (
          <article key={`platform-${key}`}>
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

        <h2>Social Media Services We Offer</h2>
        {Object.entries(serviceDetails).map(([key, detail]) => (
          <article key={`service-${key}`}>
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
      <section className='social-hero' data-header-theme='light'>
        <motion.div
          className='social-hero-content'
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
            Social Media Marketing
          </motion.span>
          <h1>Connect, Engage, and Grow on Social</h1>
          <p>
            Meet your customers where they spend their time. We help you show up
            consistently, build authentic connections, and make a real impact on
            social media.
          </p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to='/contact' className='btn-primary'>
              Start Your Social Strategy
            </Link>
            <Link to='/services' className='btn-secondary'>
              View All Services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className='social-hero-image'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src='/images/i_social.png' alt='Social Media Marketing' />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='social-stats'>
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

      {/* Platforms Section - CLICKABLE */}
      <section className='platforms-section-social'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Platforms We Master
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            We create platform-specific strategies that resonate with each
            unique audience
          </motion.p>
        </div>

        <div className='platforms-grid'>
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              className='platform-card platform-card--clickable'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => openPlatformModal(platform.name)}
              role='button'
              tabIndex={0}
              aria-haspopup='dialog'
              aria-label={`Learn more about ${platform.name} marketing`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  openPlatformModal(platform.name);
              }}
            >
              <div className='platform-icon'>
                <img src={platform.icon} alt={platform.name} />
              </div>
              <h3>{platform.name}</h3>
              <p>{platform.description}</p>
              <span className='platform-card-cta'>
                Learn more <span className='platform-card-arrow'>→</span>
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section - NOW CLICKABLE */}
      <section className='social-services'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Offer
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Comprehensive social media solutions tailored to your goals
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
              onClick={() => openServiceModal(service.title)}
              role='button'
              tabIndex={0}
              aria-haspopup='dialog'
              aria-label={`Learn more about ${service.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  openServiceModal(service.title);
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

      {/* Benefits Section */}
      <section className='benefits-section-social'>
        <div className='benefits-container'>
          <motion.div
            className='benefits-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Why Social Media?</span>
            <h2>The Power of Social Connection</h2>
            <p>
              Social media isn't just about posting content—it's about building
              relationships that turn followers into customers and customers
              into advocates.
            </p>
          </motion.div>

          <div className='benefits-grid'>
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className='benefit-card'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className='social-process'>
        <div className='process-container'>
          <motion.div
            className='process-header'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Our Process</span>
            <h2>How We Build Your Social Presence</h2>
            <p>
              A proven approach to creating and growing your brand on social
              media
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

      {/* CTA Section */}
      <section className='social-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Level Up Your Social Media?</h2>
          <p>
            Let's create a social media strategy that connects with your
            audience, builds your brand, and drives real business results.
          </p>
          <Link to='/contact' className='btn-primary'>
            Start Your Social Journey
          </Link>
        </motion.div>
      </section>

      {/* ─── Modal ─────────────────────────────────────────────────────────────── */}
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
                </div>{' '}
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
                  {modalType === 'platform'
                    ? `Start Your ${activeDetails.headline} Strategy`
                    : `Get ${activeDetails.headline} Services`}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialMedia;
