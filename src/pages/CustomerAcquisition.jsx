import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './CustomerAcquisition.css';
import { Helmet } from 'react-helmet-async';

const CustomerAcquisition = () => {
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
      {/* Hero Section */}
      <section className='acquisition-hero'>
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

      {/* Channels Section */}
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
              className='channel-card'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className='channel-icon'>
                <img src={channel.icon} alt={channel.title} />
              </div>
              <h3>{channel.title}</h3>
              <p>{channel.description}</p>
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
          {/* <motion.div
            className='strategies-image'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src='/images/acquisition-strategies.png'
              alt='Acquisition Strategies'
            />
          </motion.div> */}

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
    </div>
  );
};

export default CustomerAcquisition;
