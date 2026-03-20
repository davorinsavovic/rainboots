import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './BrandIdentity.css';
import { Helmet } from 'react-helmet-async';

const BrandIdentity = () => {
  const services = [
    {
      icon: '/images/i_logoDesign.png',
      title: 'Logo Design',
      description:
        'Distinctive, memorable logos that capture your brand essence and make a lasting impression.',
    },
    {
      icon: '/images/i_colorPalette.png',
      title: 'Color Palette',
      description:
        'Strategic color selections that evoke the right emotions and create visual consistency.',
    },
    {
      icon: '/images/i_typography.png',
      title: 'Typography',
      description:
        'Custom font selections and pairings that communicate your brand voice and personality.',
    },
    {
      icon: '/images/i_brandGuidelines.png',
      title: 'Brand Guidelines',
      description:
        'Comprehensive guides that ensure consistent brand application across all touchpoints.',
    },
    {
      icon: '/images/i_stationery.png',
      title: 'Stationery Design',
      description:
        'Business cards, letterheads, and envelopes that extend your brand to print materials.',
    },
    {
      icon: '/images/i_marketingCollateral.png',
      title: 'Marketing Collateral',
      description:
        'Brochures, flyers, and sales sheets designed to impress and convert.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery',
      description:
        'We dive deep into your business, audience, competitors, and vision to understand your brand essence.',
    },
    {
      step: '02',
      title: 'Concept Development',
      description:
        'Our designers create multiple concepts exploring different directions for your brand identity.',
    },
    {
      step: '03',
      title: 'Refinement',
      description:
        'We refine the chosen direction based on your feedback, perfecting every detail.',
    },
    {
      step: '04',
      title: 'Final Delivery',
      description:
        'You receive a complete brand package with all assets and guidelines for consistent application.',
    },
  ];

  const deliverables = [
    'Primary Logo',
    'Secondary Logos',
    'Color Palette',
    'Typography System',
    'Brand Guidelines PDF',
    'Business Card Design',
    'Letterhead Design',
    'Email Signature',
    'Social Media Kit',
    'Stationery Package',
  ];

  const benefits = [
    {
      title: 'Memorable First Impressions',
      description:
        'A strong visual identity helps you stand out and be remembered in a crowded marketplace.',
    },
    {
      title: 'Builds Trust & Credibility',
      description:
        'Consistent, professional branding signals reliability and builds customer confidence.',
    },
    {
      title: 'Emotional Connection',
      description:
        'Great branding creates an emotional bond with your audience, fostering loyalty.',
    },
    {
      title: 'Supports Marketing Efforts',
      description:
        'A cohesive identity makes all your marketing materials more effective and recognizable.',
    },
    {
      title: 'Attracts Ideal Customers',
      description:
        'The right visual identity appeals to your target audience and repels the wrong ones.',
    },
    {
      title: 'Increases Brand Value',
      description:
        'A strong brand becomes a valuable business asset that grows over time.',
    },
  ];

  const stats = [
    { value: '90%', label: 'Of purchasing decisions are subconscious' },
    { value: '33%', label: 'Price premium for strong brands' },
    { value: '77%', label: 'Consumers buy from brands they follow' },
    { value: '3-5x', label: 'Higher recognition with consistent branding' },
  ];

  return (
    <div className='brand-page'>
      <Helmet>
        <title>
          Brand Identity & Design Services Seattle | Rainboots Marketing
        </title>
        <meta
          name='description'
          content='Logo design, brand guidelines, typography and visual assets that make a lasting first impression. Seattle branding agency — Rainboots Marketing.'
        />
        <meta
          property='og:title'
          content='Brand Identity & Design | Rainboots Marketing'
        />
        <meta
          property='og:description'
          content='From logo design to complete brand packages — we help Seattle businesses define who they are and stand out from competitors.'
        />
        <link rel='canonical' href='https://rainbootsmarketing.com/branding' />
      </Helmet>
      {/* Hero Section */}
      <section className='brand-hero'>
        <motion.div
          className='brand-hero-content'
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
            Brand Identity
          </motion.span>
          <h1>Make a Lasting First Impression</h1>
          <p>
            From logo design and brand identity to visual assets and messaging,
            we help you define who you are, stand out from competitors, and
            connect with your audience.
          </p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to='/contact' className='btn-primary'>
              Build Your Brand
            </Link>
            <Link to='/services' className='btn-secondary'>
              View All Services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className='brand-hero-image'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src='/images/i_branding.png' alt='Brand Identity' />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='brand-stats'>
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
      <section className='brand-services'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Create
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Comprehensive brand identities that tell your story and connect with
            your audience
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
      <section className='brand-process'>
        <div className='process-container'>
          <motion.div
            className='process-header'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>Our Process</span>
            <h2>From Concept to Completion</h2>
            <p>
              A collaborative journey to create a brand identity that truly
              represents you
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

      {/* Deliverables Section */}
      <section className='deliverables-section'>
        <div className='deliverables-container'>
          <motion.div
            className='deliverables-content'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className='section-tag'>What You Get</span>
            <h2>Complete Brand Package</h2>
            <p>
              Everything you need to launch and maintain a consistent,
              professional brand identity across all platforms and materials.
            </p>

            <div className='deliverables-list'>
              {deliverables.map((item, index) => (
                <motion.div
                  key={index}
                  className='deliverable-item'
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className='deliverable-icon'>✓</div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            <Link to='/contact' className='btn-primary'>
              Start Your Brand Project
            </Link>
          </motion.div>

          {/* <motion.div
            className='deliverables-image'
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src='/images/brand-deliverables.png' alt='Brand Package' />
          </motion.div> */}
        </div>
      </section>

      {/* Benefits Section */}
      <section className='brand-benefits'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Brand Identity Matters
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Great branding is an investment that pays dividends for years to
            come
          </motion.p>
        </div>

        <div className='benefits-grid'>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className='benefit-card'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='brand-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Define Your Brand?</h2>
          <p>
            Let's create a brand identity that captures who you are, connects
            with your audience, and sets you apart from the competition.
          </p>
          <Link to='/contact' className='btn-primary'>
            Start Your Brand Journey
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default BrandIdentity;
