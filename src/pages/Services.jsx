import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Add this import
import ServiceCard from '../components/ServiceCard';
import './Services.css';

const servicesData = [
  {
    icon: '/images/i_outbound.png',
    title: 'Outbound Marketing',
    description:
      'Build high-performing outbound programs across email, SMS, and push notifications. We can handle everything from launch to optimization, ensuring a smooth customer experience that drives resuls for your business.',
    features: [
      'Email Marketing & Campaign Strategy',
      'SMS & Push Notification Programs',
      'Marketing Automation & Workflows',
      'Deliverability & Sender Reputation',
      'Program Health & Performance Analytics',
    ],
    link: '/outbound',
  },
  {
    icon: '/images/i_webDesign.png',
    title: 'Web Design & Development',
    description:
      'Build a standout digital presence or breathe new life into your existing site. We craft conversion-optimized websites that reflect your brand, rank in search engines, and deliver exceptional user experiences across all devices.',
    features: [
      'New Website Development & Redesigns',
      'Strategic Branding & Visual Design',
      'Technical SEO & Site Performance',
      'Conversion Rate Optimization (CRO)',
      'Mobile-Responsive Development',
    ],
    link: '/web-development',
  },
  {
    icon: '/images/i_acquisition.png',
    title: 'Customer Acquisition',
    description:
      'Accelerate growth with customers who convert. Capture active buyers with Google Search Ads, expand your reach through targeted display campaigns, and build your owned audience with strategic email acquisition.',
    features: [
      'Google Search Ads Management',
      'Display & Programmatic Advertising',
      'Email List Building & Lead Capture',
      'Audience Segmentation & Targeting',
      'Performance Tracking & Optimization',
    ],
    link: '/acquisition',
  },
  {
    icon: '/images/i_lifecycle.png',
    title: 'Lifecycle Optimization',
    description:
      'Transform one-time buyers into loyal advocates. We craft strategic experiences across activation, engagement, retention, and re-engagement—delivering the right message at the right moment throughout the customer journey.',
    features: [
      'New Customer Activation',
      'Active Engagement Campaigns',
      'Customer Retention Programs',
      'Win-back & Re-engagement',
      'Journey Analytics & Insights',
    ],
    link: '/lifecycle',
  },
  {
    icon: '/images/i_social.png',
    title: 'Social Media Marketing',
    description:
      'Turn social platforms into growth engines. Deploy targeted campaigns to attract new customers while nurturing existing relationships with authentic content that drives engagement and builds brand loyalty.',
    features: [
      'Social Advertising & Lead Generation',
      'Content Strategy & Creation',
      'Community Management & Engagement',
      'Audience Growth & Targeting',
      'Performance Tracking & Analytics',
    ],
    link: '/social',
  },
  {
    icon: '/images/i_branding.png',
    title: 'Branding & Design',
    description:
      'Establish a powerful brand presence that attracts customers. From logo creation and brand identity to strategic positioning and marketing materials, we build cohesive brands that stand out and drive results.',
    features: [
      'Logo Design & Brand Identity',
      'Brand Strategy & Positioning',
      'Graphic Design & Creative Services',
      'Marketing Collateral & Assets',
      'Brand Guidelines & Templates',
    ],
    link: '/branding',
  },
];

const Services = () => {
  return (
    <div className='services-page'>
      <section className='services-hero'>
        <motion.div
          className='services-hero-content'
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
            Our Services
          </motion.span>
          <h1>Everything you need to grow your business</h1>
          <p>
            Comprehensive marketing solutions designed to help businesses of all
            sizes achieve their goals and drive sustainable growth.
          </p>
        </motion.div>
      </section>

      <section className='services-list'>
        <div className='services-grid-detailed'>
          {servicesData.map((service, index) => (
            <Link
              to={service.link}
              key={index}
              style={{ textDecoration: 'none' }}
              className='service-card-link'
            >
              <motion.div
                className='service-card-detailed'
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
              >
                <div className='service-card-header'>
                  <div className='service-icon-large-wrapper'>
                    <img
                      src={service.icon}
                      alt={service.title}
                      className='glass-icon-large'
                    />
                  </div>
                  <div>
                    <h3>{service.title}</h3>
                    <p className='service-description'>{service.description}</p>
                  </div>
                </div>
                <ul className='service-features'>
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <span className='checkmark'>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className='services-cta'>
        <motion.div
          className='cta-content'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to get started?</h2>
          <p>Let's discuss which services are right for your business</p>
          <Link to='/contact' className='btn-primary'>
            Schedule a Consultation
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Services;
