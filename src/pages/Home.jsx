import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import HeroAnimation from '../components/HeroAnimation';
import WaterDrops from '../components/WaterDrops';
import './Home.css';

const servicesData = [
  {
    icon: '/images/i_outbound.png',
    title: 'Outbound Marketing',
    description:
      'Email, SMS, and push notifications. Launch or optimize your programs to reach more customers, drive revenue, and keep them coming back.',
    link: '/outbound',
  },
  {
    icon: '/images/i_webDesign.png',
    title: 'Web Development',
    description:
      "Custom design, development, and SEO. Whether you're building a new site or optimizing an existing one, we create fast, beautiful, search-friendly websites that represent your brand and convert visitors into customers.",
    link: '/web-development',
  },
  {
    icon: '/images/i_acquisition.png',
    title: 'Customer Acquisition',
    description:
      'Grow your business with new customers. From Google Search ads to targeted display advertising, we help you reach the right people at the right time and turn clicks into customers.',
    link: '/acquisition',
  },
  {
    icon: '/images/i_lifecycle.png',
    title: 'Lifecycle Strategy',
    description:
      "The right message at the right moment. We create personalized customer experiences that activate new customers, drive engagement, build loyalty, and win back those who've drifted away.",
    link: '/lifecycle',
  },
  {
    icon: '/images/i_social.png',
    title: 'Social Media Marketing',
    description:
      "Meet your customers where they spend their time. Whether you're looking to attract new customers or deepen relationships with existing ones, we help you show up consistently and make an impact on social media.",
    link: '/social',
  },
  {
    icon: '/images/i_branding.png',
    title: 'Brand Identity',
    description:
      'Make a lasting first impression. From logo design and brand identity to visual assets and messaging, we help you define who you are, stand out from competitors, and connect with your audience.',
    link: '/branding',
  },
];

const statsData = [
  { value: '25+', label: 'Years Combined Experience' },
  { value: '500+', label: 'Campaigns Launched' },
  { value: '98%', label: 'Client Retention Rate' },
  { value: '$10M+', label: 'Revenue Generated' },
];

const Home = ({
  initialAnimationState,
  hasAnimationPlayed,
  onAnimationPlayed,
}) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [showHeroImage, setShowHeroImage] = useState(false);

  useEffect(() => {
    if (hasAnimationPlayed) {
      console.log(
        'Animation already played in this session, showing hero image',
      );
      setIsAnimationComplete(true);
      setShowHeroImage(true);
      return;
    }

    if (initialAnimationState) {
      console.log('Home received animation state:', initialAnimationState);

      if (
        initialAnimationState.isAnimating === false ||
        initialAnimationState.stage === 'scene5-done'
      ) {
        console.log(
          'Animation already complete, showing hero image immediately',
        );
        setIsAnimationComplete(true);
        setShowHeroImage(true);
        onAnimationPlayed();
      }
    }
  }, [initialAnimationState, hasAnimationPlayed, onAnimationPlayed]);

  const handleAnimationComplete = () => {
    console.log('Animation completed in Home component');
    setIsAnimationComplete(true);
    setShowHeroImage(true);
    onAnimationPlayed();
  };

  const shouldShowAnimation = !hasAnimationPlayed && !isAnimationComplete;

  return (
    <div className='home'>
      {/* Hero Section */}
      <section className='hero'>
        <motion.div
          className='hero-content'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1>
            Marketing Made <span className='highlight'>Easy</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            We're not your typical marketing agency. We dive deep into strategy,
            make waves with execution, and keep your business dry when things
            get stormy.
          </motion.p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link to='/contact' className='btn-primary'>
              Start Your Journey
            </Link>
            <Link to='/services' className='btn-secondary'>
              Explore Services
            </Link>
          </motion.div>
        </motion.div>

        {/* Animation and Hero Image Container */}
        <div className='hero-visual-container'>
          {shouldShowAnimation && (
            <div className='hero-animation-wrapper'>
              <div className='animation-responsive-container'>
                <HeroAnimation
                  onAnimationComplete={handleAnimationComplete}
                  initialStage={initialAnimationState}
                  isInSplash={false}
                />
              </div>
            </div>
          )}

          {(showHeroImage || hasAnimationPlayed) && (
            <motion.div
              className='hero-image-container'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <img
                src='../images/heros.png'
                alt='Hero Illustration'
                className='hero-image'
                onError={(e) => {
                  console.error('Failed to load image:', e.target.src);
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log('Hero image loaded successfully')}
              />
              <WaterDrops />
            </motion.div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className='services' id='services'>
        <div className='section-header'>
          <motion.span
            className='section-tag'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Marketing Solutions for your Business
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From email to acquisition, branding to retention, we handle it all
            so you can focus on what matters most.
          </motion.p>
        </div>

        <div className='services-grid'>
          {servicesData.map((service, index) => (
            <Link
              to={service.link}
              key={index}
              style={{ textDecoration: 'none' }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                delay={index * 0.1}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className='stats'>
        <div className='stats-grid'>
          {statsData.map((stat, index) => (
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

      {/* CTA Section */}
      <section className='cta-section'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to make a splash?</h2>
          <p>
            Let's talk about your marketing goals and how we can help you
            achieve them. Schedule a free consultation today.
          </p>
          <Link to='/contact' className='btn-primary'>
            Schedule Consultation
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
