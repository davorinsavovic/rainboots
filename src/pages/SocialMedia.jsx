import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './SocialMedia.css';

const SocialMedia = () => {
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

  return (
    <div className='social-page'>
      {/* Hero Section */}
      <section className='social-hero'>
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

      {/* Platforms Section */}
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
              className='platform-card'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className='platform-icon'>
                <img src={platform.icon} alt={platform.name} />
              </div>
              <h3>{platform.name}</h3>
              <p>{platform.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
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
              className='service-card'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className='service-icon'>
                <img src={service.icon} alt={service.title} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className='benefits-section'>
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
    </div>
  );
};

export default SocialMedia;
