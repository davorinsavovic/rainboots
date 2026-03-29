import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ServiceCard from '../components/ServiceCard';
import HeroAnimation from '../components/HeroAnimation';
import WaterDrops from '../components/WaterDrops';
import { Helmet } from 'react-helmet-async';
import './Home.css';

// Testimonials data
const TESTIMONIALS_DATA = [
  {
    id: 1,
    client: 'Vector RE Corp',
    website: 'vectorrecorp.com',
    logo: '🏗️',
    quote:
      'Rainboots understood exactly what we needed—a website that communicates credibility to institutional investors. They delivered a clean, professional site that showcases our industrial portfolio perfectly.',
    author: 'Tyler Litzenberger',
    role: 'Principal',
    rating: 5,
  },
  {
    id: 2,
    client: 'DCM Contractors',
    website: 'dcmcontractors.com',
    logo: '🔨',
    quote:
      'Rainboots built us a clean, modern website that reflects the quality of work we do. The single-page design with smooth navigation is exactly what we needed—simple, professional, and effective.',
    author: 'DCM Team',
    role: 'Principal',
    rating: 5,
  },
  {
    id: 3,
    client: 'Partizan Hoops',
    website: 'partizanhoops.com',
    logo: '🏀',
    quote:
      "Rainboots built a full-stack platform that handles everything—player registration, camp enrollment, coach profiles, and tournament organization. It's like having a custom sports management system.",
    author: 'Zlatko Savovic',
    role: 'President & Co-Founder',
    rating: 5,
  },
  {
    id: 4,
    client: 'Northville Cabinetry',
    website: 'northvillecabinetry.com',
    logo: '🚪',
    quote:
      'We needed a professional e-commerce presence. Rainboots delivered a clean, modern website that showcases our product lines beautifully. The trade show materials were a huge hit at BuildExpo.',
    author: 'Northville Team',
    role: 'Owner',
    rating: 5,
  },
  {
    id: 5,
    client: 'Bothell Select Basketball',
    website: 'bothellselect.com',
    logo: '🏀',
    quote:
      'Rainboots built us a professional platform that handles everything from tournament registration to team management. We referred Partizan Hoops to them because we were so impressed.',
    author: 'Bothell Select Staff',
    role: 'Program Director',
    rating: 5,
  },
  {
    id: 6,
    client: 'InvestWorkshop',
    website: 'investworkshop.com',
    logo: '📚',
    quote:
      'Rainboots built a comprehensive education platform that integrates seamlessly with Teachable for course delivery. The custom video player and live event listings have been essential.',
    author: 'Edis Kulaga',
    role: 'Founder & Lead Instructor',
    rating: 5,
  },
  {
    id: 7,
    client: 'Alchemy of Yoga',
    website: 'alchemyofyoga.com',
    logo: '🧘',
    quote:
      'Rainboots built a WordPress site that serves as the hub for our 200-hour Yoga Alliance teacher training. Students from 25+ countries use the site to discover and enroll in our programs.',
    author: 'Silvia Mordini',
    role: 'Founder & Lead Instructor',
    rating: 5,
  },
  {
    id: 8,
    client: 'Dominis Stone',
    website: 'dominisstone.com',
    logo: '🪨',
    quote:
      'Rainboots designed a beautiful website and print materials for our natural stone showroom. The product category pages are clean and easy to navigate.',
    author: 'Dominis Stone Team',
    role: 'Owner',
    rating: 5,
  },
  {
    id: 9,
    client: 'Schippers & Crew',
    website: 'schippers.com',
    logo: '⚡',
    quote:
      'Rainboots created an organized, clean site that makes it easy for OEM buyers to understand our capabilities. The trade show banners they designed have been a hit at industry events.',
    author: 'Schippers Team',
    role: 'Operations',
    rating: 5,
  },
];

// Star Rating Component
const StarRating = ({ rating }) => (
  <div className='home-testimonial-stars'>
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ))}
  </div>
);

// Random Testimonial Tile Component
const RandomTestimonialTile = ({ testimonial, index }) => {
  return (
    <motion.div
      className='home-testimonial-tile'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className='testimonial-tile-header'>
        <div className='testimonial-tile-logo'>{testimonial.logo}</div>
        <div className='testimonial-tile-client-info'>
          <h4>{testimonial.client}</h4>
          <p>{testimonial.website}</p>
        </div>
      </div>
      <div className='testimonial-tile-quote'>
        <span className='quote-mark'>"</span>
        <p>
          {testimonial.quote.length > 180
            ? `${testimonial.quote.substring(0, 180)}...`
            : testimonial.quote}
        </p>
      </div>
      <div className='testimonial-tile-footer'>
        <StarRating rating={testimonial.rating} />
        <div className='testimonial-tile-author'>
          <strong>{testimonial.author}</strong>
          <span>{testimonial.role}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Main Home Component
const Home = ({
  initialAnimationState,
  hasAnimationPlayed,
  onAnimationPlayed,
}) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [showHeroImage, setShowHeroImage] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 800 : false,
  );

  // State for random testimonials (3 random ones that refresh)
  const [randomTestimonials, setRandomTestimonials] = useState([]);
  const [rotationInterval, setRotationInterval] = useState(null);

  // Get random testimonials
  const getRandomTestimonials = () => {
    const shuffled = [...TESTIMONIALS_DATA];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  };

  // Initialize random testimonials
  useEffect(() => {
    setRandomTestimonials(getRandomTestimonials());
  }, []);

  // Rotate testimonials every 10 seconds
  useEffect(() => {
    if (isMobile) return; // Don't auto-rotate on mobile to save battery

    const interval = setInterval(() => {
      setRandomTestimonials(getRandomTestimonials());
    }, 10000);

    setRotationInterval(interval);
    return () => clearInterval(interval);
  }, [isMobile]);

  const refreshTestimonials = () => {
    setRandomTestimonials(getRandomTestimonials());
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsAnimationComplete(true);
      setShowHeroImage(false);
      return;
    }

    if (hasAnimationPlayed) {
      setIsAnimationComplete(true);
      setShowHeroImage(true);
      return;
    }

    if (initialAnimationState) {
      if (
        initialAnimationState.isAnimating === false ||
        initialAnimationState.stage === 'scene5-done'
      ) {
        setIsAnimationComplete(true);
        setShowHeroImage(true);
        onAnimationPlayed();
      }
    }
  }, [initialAnimationState, hasAnimationPlayed, onAnimationPlayed, isMobile]);

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
    setShowHeroImage(true);
    onAnimationPlayed();
  };

  const shouldShowAnimation =
    !isMobile && !hasAnimationPlayed && !isAnimationComplete;

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
        "Custom design, development, and SEO. Whether you're building a new site or optimizing an existing one, we create fast, beautiful, search-friendly websites.",
      link: '/web-development',
    },
    {
      icon: '/images/i_acquisition.png',
      title: 'Customer Acquisition',
      description:
        'Grow your business with new customers. From Google Search ads to targeted display advertising, we help you reach the right people at the right time.',
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
        "Meet your customers where they spend their time. Whether you're looking to attract new customers or deepen relationships with existing ones, we help you show up consistently.",
      link: '/social',
    },
    {
      icon: '/images/i_branding.png',
      title: 'Brand Identity',
      description:
        'Make a lasting first impression. From logo design and brand identity to visual assets and messaging, we help you define who you are and connect with your audience.',
      link: '/branding',
    },
  ];

  const statsData = [
    { value: '25+', label: 'Years Combined Experience' },
    { value: '500+', label: 'Campaigns Launched' },
    { value: '98%', label: 'Client Retention Rate' },
  ];

  return (
    <div className='home'>
      <Helmet>
        <title>Rainboots Marketing — Seattle Digital Marketing Agency</title>
        <meta
          name='description'
          content='Seattle-based digital marketing agency specializing in email, SMS, lifecycle marketing, customer acquisition, web development and branding. 25+ years combined experience.'
        />
        <meta
          property='og:title'
          content='Rainboots Marketing — Seattle Digital Marketing Agency'
        />
        <meta
          property='og:description'
          content="We're not your typical marketing agency. We dive deep into strategy, make waves with execution, and keep your business dry when things get stormy."
        />
        <meta property='og:url' content='https://rainbootsmarketing.com' />
        <link rel='canonical' href='https://rainbootsmarketing.com' />
      </Helmet>

      {/* Hero Section */}
      <section className='hero' data-header-theme='light'>
        <motion.div
          className='hero-content'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1>
            Making <span className='highlight'>Waves</span> in Marketing
          </h1>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            We help businesses consistently get new customers and keep them
            coming back.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            We're not your typical marketing agency. We dive deep into strategy,
            make waves with execution, and keep your business dry when things
            get stormy.
          </motion.p>
          <motion.div
            className='hero-buttons'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Link to='/contact' className='btn-primary'>
              Start Your Journey
            </Link>
            <Link to='/services' className='btn-secondary'>
              Explore Services
            </Link>
          </motion.div>
        </motion.div>

        {/* Animation and Hero Image Container - Hidden on mobile */}
        {!isMobile && (
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
                />
                <WaterDrops />
              </motion.div>
            )}
          </div>
        )}
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

        <div className={`services-grid ${isMobile ? 'mobile-stack' : ''}`}>
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

      {/* TESTIMONIALS SECTION - NEW */}
      <section className='home-testimonials'>
        <div className='testimonials-bg-watermark'>💧</div>
        <div className='section-header'>
          <motion.span
            className='section-tag'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Client Love
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Don't just take our word for it. Here's what businesses we've worked
            with have to say.
          </motion.p>
        </div>

        <div className='testimonials-grid'>
          {randomTestimonials.map((testimonial, index) => (
            <RandomTestimonialTile
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        <div className='testimonials-footer'>
          <button
            className='refresh-testimonials-btn'
            onClick={refreshTestimonials}
            aria-label='Refresh testimonials'
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
              <circle cx='12' cy='12' r='3' />
            </svg>
            Show More Stories
          </button>
          <Link to='/testimonials' className='view-all-testimonials-btn'>
            See All Testimonials →
          </Link>
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
