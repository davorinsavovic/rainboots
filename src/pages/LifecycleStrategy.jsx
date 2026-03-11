import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './LifecycleStrategy.css';

const LifecycleStrategy = () => {
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

  return (
    <div className='lifecycle-page'>
      {/* Hero Section */}
      <section className='lifecycle-hero'>
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

        <motion.div
          className='lifecycle-hero-image'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src='/images/i_lifecycle.png' alt='Lifecycle Strategy' />
        </motion.div>
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

      {/* Lifecycle Stages Section */}
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
              className='stage-card'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className='stage-icon'>
                <img src={stage.icon} alt={stage.title} />
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
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
    </div>
  );
};

export default LifecycleStrategy;
