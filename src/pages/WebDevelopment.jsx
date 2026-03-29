import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './WebDevelopment.css';

const WebDevelopment = () => {
  const services = [
    {
      icon: '/images/i_customDesign.png',
      title: 'Custom Web Design',
      description:
        'Unique, brand-aligned designs that capture your vision and create memorable first impressions.',
    },
    {
      icon: '/images/i_responsiveDesign.png',
      title: 'Responsive Development',
      description:
        'Websites that look and function perfectly on all devices - from mobile phones to desktop screens.',
    },
    {
      icon: '/images/i_ecommerce.png',
      title: 'E-Commerce Solutions',
      description:
        'Custom online stores with secure payment processing, inventory management, and seamless checkout.',
    },
    {
      icon: '/images/i_cms.png',
      title: 'CMS Integration',
      description:
        'Easy-to-use content management systems that let you update your site without technical knowledge.',
    },
    {
      icon: '/images/i_seo.png',
      title: 'SEO Optimization',
      description:
        'Built-in search engine optimization to help your site rank higher and attract more visitors.',
    },
    {
      icon: '/images/i_performanceOptimization.png',
      title: 'Performance Optimization',
      description:
        'Fast-loading, optimized code that keeps visitors engaged and improves conversion rates.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description:
        'We learn about your business, goals, and audience to create a strategic plan for your website.',
    },
    {
      step: '02',
      title: 'Design & Prototyping',
      description:
        'We create wireframes and visual designs that bring your brand to life and ensure great user experience.',
    },
    {
      step: '03',
      title: 'Development & Testing',
      description:
        'Our developers build your site with clean, efficient code while continuously testing for quality.',
    },
    {
      step: '04',
      title: 'Launch & Support',
      description:
        'We deploy your site and provide ongoing support, maintenance, and optimization.',
    },
  ];

  const technologies = [
    { name: 'React', icon: '/images/i_react.png' },
    { name: 'Vue.js', icon: '/images/i_vue.png' },
    { name: 'Node.js', icon: '/images/i_node.png' },
    { name: 'WordPress', icon: '/images/i_wordpress.png' },
    { name: 'WooCommerce', icon: '/images/i_woo.png' },
    { name: 'Shopify', icon: '/images/i_shopify.png' },
    { name: 'Figma', icon: '/images/i_figma.png' },
    { name: 'Adobe XD', icon: '/images/i_xd.png' },
  ];

  const features = [
    {
      title: 'Mobile-First Approach',
      description:
        'We design for mobile first, ensuring your site works perfectly on every device.',
    },
    {
      title: 'Fast Loading Times',
      description:
        'Optimized code and images mean your site loads quickly, keeping visitors engaged.',
    },
    {
      title: 'SEO Ready',
      description:
        'Built with search engines in mind, helping you rank higher and attract more traffic.',
    },
    {
      title: 'Scalable Architecture',
      description:
        'Your site can grow with your business, easily adding new features and pages.',
    },
  ];

  const stats = [
    { value: '0.1s', label: 'Faster load time reduces bounce rate by 8%' },
    { value: '75%', label: 'Of users judge credibility by website design' },
    { value: '88%', label: 'Less likely to return after a bad experience' },
    { value: '2x', label: 'Higher conversions with custom design' },
  ];

  return (
    <div className='webdev-page'>
      <Helmet>
        <title>Web Design & Development Seattle | Rainboots Marketing</title>
        <meta
          name='description'
          content='Custom websites built for speed, SEO and conversions. Seattle web design and development agency — we build fast, beautiful, search-friendly sites that convert visitors into customers.'
        />
        <meta
          property='og:title'
          content='Web Design & Development | Rainboots Marketing Seattle'
        />
        <meta
          property='og:description'
          content="Whether you're building a new site or optimizing an existing one, we create fast, beautiful, search-friendly websites that represent your brand."
        />
        <link
          rel='canonical'
          href='https://rainbootsmarketing.com/web-development'
        />
      </Helmet>
      {/* Hero Section */}
      <section className='webdev-hero' data-header-theme='light'>
        <motion.div
          className='webdev-hero-content'
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
            Web Development & Design
          </motion.span>
          <h1>Beautiful Websites That Drive Results</h1>
          <p>
            Custom-designed, fast-loading websites that represent your brand,
            engage visitors, and convert them into loyal customers.
          </p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to='/contact' className='btn-primary'>
              Start Your Project
            </Link>
            <Link to='/work' className='btn-secondary'>
              View Our Work
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className='webdev-hero-image'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src='/images/i_webDesign.png' alt='Web Development' />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='webdev-stats'>
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

      {/* Services Section */}
      <section className='webdev-services'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Build
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Custom solutions tailored to your unique needs
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

      {/* Process Section */}
      <section className='webdev-process'>
        <div className='process-container'>
          <motion.div
            className='process-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Our Process</span>
            <h2>From Concept to Launch</h2>
            <p>
              We follow a proven, collaborative process to ensure your website
              meets your goals and exceeds expectations.
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

      {/* Technologies Section */}
      <section className='tech-section'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Technologies We Use
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Modern tools and frameworks for powerful, scalable websites
          </motion.p>
        </div>

        <div className='tech-grid'>
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className='tech-item'
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <img src={tech.icon} alt={tech.name} />
              <p>{tech.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className='features-section'>
        <div className='features-container'>
          {/* <motion.div
            className='features-image'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src='/images/webdev-features.png' alt='Features' />
          </motion.div> */}

          <motion.div
            className='features-content'
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Why Choose Us</span>
            <h2>Websites That Work</h2>
            <p>
              We don't just build websites - we build digital experiences that
              engage users and drive business growth.
            </p>

            <div className='features-list'>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className='feature-item'
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className='feature-icon'>✓</div>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to='/work' className='btn-primary'>
              See Our Work
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='webdev-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Start Your Website Project?</h2>
          <p>
            Let's discuss your vision and create a website that stands out,
            engages visitors, and drives results for your business.
          </p>
          <Link to='/contact' className='btn-primary'>
            Get a Free Quote
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default WebDevelopment;
