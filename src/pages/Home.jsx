import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import HeroAnimation from '../components/HeroAnimation';
import './Home.css';

const servicesData = [
  {
    icon: '/images/i_outbound.png',
    title: 'Outbound Marketing',
    description:
      'Launch or optimize email, SMS, and push notification programs with exceptional deliverability and intelligent automation.',
  },
  {
    icon: '/images/i_webDesign.png',
    title: 'Web Development',
    description:
      'Build digital experiences that captivate audiences and drive measurable business results.',
  },
  {
    icon: '/images/i_acquisition.png',
    title: 'Customer Acquisition',
    description:
      'Grow your business with targeted campaigns that deliver positive ROI and lasting brand awareness.',
  },
  {
    icon: '/images/i_lifecycle.png',
    title: 'Lifecycle Strategy',
    description:
      'Create journeys that engage, convert, retain, and re-engage at exactly the right moment.',
  },
  {
    icon: '/images/i_social.png',
    title: 'Social Media Marketing',
    description:
      'Acquire new customers and strengthen existing relationships through strategic social advertising and engaging content.',
  },
  {
    icon: '/images/i_branding.png',
    title: 'Brand Identity',
    description:
      'Stand out from competitors with authentic brand stories that resonate with your audience.',
  },
];

const statsData = [
  { value: '25+', label: 'Years Combined Experience' },
  { value: '500+', label: 'Campaigns Launched' },
  { value: '98%', label: 'Client Retention Rate' },
  { value: '$10M+', label: 'Revenue Generated' },
];

const Home = () => {
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
            Marketing made <span className='highlight'>easy</span>
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

        {/* Add the animation here */}
        <HeroAnimation />
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
            Full-Stack Marketing Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From email to acquisition, branding to retention—we handle it all so
            you can focus on what matters most.
          </motion.p>
        </div>

        <div className='services-grid'>
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={index * 0.1}
            />
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
