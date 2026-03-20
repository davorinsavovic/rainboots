import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './Outbound.css';

const Outbound = () => {
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
      {/* Hero Section */}
      <section className='outbound-hero'>
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

        {/* Hero Image */}
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
            className='benefits-image'
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src='/images/outbound-benefits.png'
              alt='Outbound Marketing Benefits'
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
    </div>
  );
};

export default Outbound;
