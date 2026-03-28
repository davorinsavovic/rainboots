import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './Testimonials.css';

// Testimonials data - collected from real client websites you've built
const TESTIMONIALS = [
  // Vector RE Corp - Commercial Real Estate
  {
    id: 1,
    client: 'Vector RE Corp',
    website: 'vectorrecorp.com',
    logo: '🏗️',
    industry: 'Commercial Real Estate',
    quote:
      'The team at Rainboots understood exactly what we needed—a website that communicates credibility to institutional investors and Fortune 500 tenants. They delivered a clean, professional site that showcases our industrial portfolio perfectly. The custom SVG icon system and project pages have been invaluable for our marketing efforts.',
    author: 'Tyler Litzenberger',
    role: 'Principal',
    image: null,
    rating: 5,
    projectType: 'WordPress Website + Logo Design',
    featured: true,
  },

  // DCM Contractors - Dental/Medical Construction
  {
    id: 2,
    client: 'DCM Contractors',
    website: 'dcmcontractors.com',
    logo: '🔨',
    industry: 'Construction',
    quote:
      'Rainboots built us a clean, modern website that reflects the quality of work we do. The single-page design with smooth anchor navigation is exactly what we needed—simple, professional, and effective. Our clients in the dental and medical fields immediately recognize the level of craftsmanship we bring to every project.',
    author: 'DCM Team',
    role: 'Principal',
    image: null,
    rating: 5,
    projectType: 'WordPress Website + Logo Design',
    featured: true,
  },

  // Partizan Hoops - Youth Basketball
  {
    id: 3,
    client: 'Partizan Hoops',
    website: 'partizanhoops.com',
    logo: '🏀',
    industry: 'Youth Sports',
    quote:
      "Rainboots built a full-stack platform for us that handles everything—player registration, camp enrollment, coach profiles, and tournament organization. It's like having a custom sports management system without the SportsEngine subscription. Parents love how easy it is to sign up, and our staff loves the CMS. This project has completely transformed how we run our program.",
    author: 'Zlatko Savovic',
    role: 'President & Co-Founder',
    image: null,
    rating: 5,
    projectType: 'React Full-Stack Platform',
    featured: true,
  },

  // Northville Cabinetry - RTA Cabinets
  {
    id: 4,
    client: 'Northville Cabinetry',
    website: 'northvillecabinetry.com',
    logo: '🚪',
    industry: 'Home Improvement',
    quote:
      'We needed a professional e-commerce presence for our ready-to-assemble cabinet company. Rainboots delivered a clean, modern website that showcases our product lines beautifully. They turned around our BuildExpo materials in 24 hours—we were blown away by the speed and quality. The trade show flyers and brochures were a huge hit at the expo.',
    author: 'Northville Team',
    role: 'Owner',
    image: null,
    rating: 5,
    projectType: 'E-Commerce + Print Collateral',
    featured: false,
  },

  // Bothell Select Basketball
  {
    id: 5,
    client: 'Bothell Select Basketball',
    website: 'bothellselect.com',
    logo: '🏀',
    industry: 'Youth Sports',
    quote:
      'Rainboots built us a professional platform that handles everything from tournament registration to team management. The custom CMS lets us update events, schedules, and rosters without any technical knowledge. The site looks amazing and has given us the credibility we needed to grow our program. We referred Partizan Hoops to them because we were so impressed with their work.',
    author: 'Bothell Select Staff',
    role: 'Program Director',
    image: null,
    rating: 5,
    projectType: 'React Platform + CMS',
    featured: false,
  },

  // InvestWorkshop - Real Estate Education
  {
    id: 6,
    client: 'InvestWorkshop',
    website: 'investworkshop.com',
    logo: '📚',
    industry: 'Education',
    quote:
      "Rainboots built a comprehensive education platform that integrates seamlessly with Teachable for course delivery. The custom video player, live event listings, and blog have been essential for growing our student base. We're getting great feedback on the user experience—students love how easy it is to navigate through the courses and sign up for live workshops.",
    author: 'Edis Kulaga',
    role: 'Founder & Lead Instructor',
    image: null,
    rating: 5,
    projectType: 'Education Platform + CMS',
    featured: false,
  },

  // Schippers & Crew - Electronics Manufacturing
  {
    id: 7,
    client: 'Schippers & Crew',
    website: 'schippers.com',
    logo: '⚡',
    industry: 'Manufacturing',
    quote:
      'We needed a website that could handle our complex service catalog and communicate our certifications (ISO 9001, AS9100, ISO 13485, ITAR). Rainboots created an organized, clean site that makes it easy for OEM buyers to understand our capabilities. The trade show banners they designed have been a hit at industry events.',
    author: 'Schippers Team',
    role: 'Operations',
    image: null,
    rating: 5,
    projectType: 'WordPress + Trade Show Materials',
    featured: false,
  },

  // Vector RE Corp - Additional testimonial
  {
    id: 8,
    client: 'Vector RE Corp',
    website: 'vectorrecorp.com',
    logo: '🏗️',
    industry: 'Commercial Real Estate',
    quote:
      'From the initial wireframes to the final launch, Rainboots was a pleasure to work with. They understood the commercial real estate space and delivered a website that speaks directly to our target audience—investors, tenants, and development partners. The project pages for American Lake Logistics and Canyon East Logistics are exactly what we needed to showcase our work.',
    author: 'Max Cordell',
    role: 'Principal',
    image: null,
    rating: 5,
    projectType: 'WordPress Website',
    featured: false,
  },

  // Dominis Stone
  {
    id: 9,
    client: 'Dominis Stone',
    website: 'dominisstone.com',
    logo: '🪨',
    industry: 'Natural Stone',
    quote:
      'Rainboots designed a beautiful website and print materials for our natural stone showroom. The product category pages for Quartz, Dekton, and Granite are clean and easy to navigate. The trifold brochure they designed has been a great sales tool for our team. The brand identity they created communicates the premium quality of our stone products.',
    author: 'Dominis Stone Team',
    role: 'Owner',
    image: null,
    rating: 5,
    projectType: 'Website + Print Collateral + Logo',
    featured: false,
  },

  // Alchemy of Yoga
  {
    id: 10,
    client: 'Alchemy of Yoga',
    website: 'alchemyofyoga.com',
    logo: '🧘',
    industry: 'Wellness',
    quote:
      "Rainboots built a WordPress site that serves as the hub for our 200-hour Yoga Alliance teacher training. The site handles three distinct training tracks—self-paced online, live cohort, and Bali immersion retreats—all connected to Teachable for enrollment. Students from 25+ countries use the site to discover and enroll in our programs. We couldn't be happier with the result.",
    author: 'Silvia Mordini',
    role: 'Founder & Lead Instructor',
    image: null,
    rating: 5,
    projectType: 'WordPress + Teachable Integration',
    featured: true,
  },

  // TSI Inc.
  {
    id: 11,
    client: 'TSI Inc.',
    website: 'tsi-inc.net',
    logo: '🏭',
    industry: 'Industrial Machinery',
    quote:
      'Rainboots built a clean, authoritative website for our industrial machinery company. We needed to communicate complex technical information to buyers across the global wood processing industry, and they delivered a site that balances technical depth with professional presentation. The timeline feature showing our 30+ years of innovation has been particularly effective.',
    author: 'TSI Team',
    role: 'President',
    image: null,
    rating: 5,
    projectType: 'WordPress Corporate Site',
    featured: false,
  },

  // Meraka - Real Estate
  {
    id: 12,
    client: 'Meraka',
    website: 'meraka.com',
    logo: '🏠',
    industry: 'Real Estate',
    quote:
      'Rainboots designed and built our WordPress site from the ground up. They captured our mission—transforming homes and revitalizing communities—perfectly. The property listing pages and inquiry flow have already generated quality leads. The clean, community-focused design reflects who we are as a company.',
    author: 'Meraka Team',
    role: 'Founder',
    image: null,
    rating: 5,
    projectType: 'WordPress Website',
    featured: false,
  },

  {
    id: 13,
    client: 'Oregon Rule Co.',
    website: 'oregonrule.com',
    logo: '📏',
    quote:
      'Rainboots migrated our 2,000+ SKU catalog from WooCommerce to Shopify seamlessly. The new site handles our dual-market needs—industrial/commercial and forensics—and the checkout experience is now fast and reliable. Clients like Boeing, Tesla, and Nike now have a premium experience.',
    author: 'Oregon Rule Co. Team',
    role: 'Owner',
    rating: 5,
    projectType: 'E-Commerce + Migration',
  },
  {
    id: 14,
    client: 'Live Love Flow Studios',
    website: 'liveloveflowstudios.com',
    logo: '🧘‍♀️',
    quote:
      "Rainboots designed our logo and original WordPress site that captured the 'I Am' philosophy perfectly. The clean white-and-blue aesthetic reflects the grounding, confident energy we bring to every class. It was a pleasure working with them.",
    author: 'Live Love Flow Team',
    role: 'Founder',
    rating: 5,
    projectType: 'Branding + WordPress',
  },
  {
    id: 15,
    client: 'GraphiCode Inc.',
    website: 'graphicode.com',
    logo: '💿',
    quote:
      'Rainboots designed our website, product packaging, and marketing collateral for our GC-PowerPlatform CAM software suite. They understood our technical B2B audience and delivered a professional presence that serves our global electronics manufacturing customers.',
    author: 'GraphiCode Team',
    role: 'Marketing Director',
    rating: 5,
    projectType: 'Branding + Website Design and Development',
  },
  {
    id: 16,
    client: 'Simply Sweet',
    website: 'simplysweetwa.com',
    logo: '🧁',
    quote:
      'Rainboots built our original WordPress website that captured the warmth of our Snohomish bakery. The site handled our walk-in shop, custom wedding cakes, and party space beautifully. A true community partner since 2009!',
    author: 'Simply Sweet Team',
    role: 'Owner',
    rating: 5,
    projectType: 'WordPress Website ',
  },
  {
    id: 17,
    client: 'Sarajevo Lounge',
    website: 'sarajevonightclub.com',
    logo: '🎵',
    quote:
      "Rainboots designed our event flyers, posters, and marketing materials for Greek Nite, Balkan Night, Euro Saturdays, and more. They captured the high-energy vibe of Seattle's #1 nightclub perfectly. The design work commands attention every time.",
    author: 'Sarajevo Team',
    role: 'Owner',
    rating: 5,
    projectType: 'Branding',
  },
  {
    id: 18,
    client: 'Nova-Tech Engineering',
    website: 'novatech-eng.com',
    logo: '✈️',
    quote:
      'Rainboots reorganized our complex technical content into a clean, navigable WordPress site. They understood our aerospace audience—Boeing, Northrop Grumman—and delivered a site that communicates engineering excellence without clutter.',
    author: 'Nova-Tech Team',
    role: 'Engineering Director',
    rating: 5,
    projectType: 'Corporate Website Design & Development',
  },
  {
    id: 19,
    client: 'AM Ruyle LLC',
    website: 'amruylellc.com',
    logo: '🔨',
    quote:
      'Rainboots designed our diamond-plate logo, business cards, and brand identity. The dark, industrial aesthetic communicates the toughness and precision of our general contracting work. Aaron and Shane loved the final result.',
    author: 'Aaron Ruyle',
    role: 'President',
    rating: 5,
    projectType: 'Branding + Website',
  },
  {
    id: 20,
    client: "Asha Women's Spa & Boutique",
    website: 'ashaspandboutique.com',
    logo: '🌸',
    quote:
      "Rainboots delivered a complete brand identity—logo, trifold brochure, service menus, and business cards. The hot pink and black palette is elegant and confident, exactly what a women's spa needs to stand out.",
    author: 'Asha Team',
    role: 'Owner',
    rating: 5,
    projectType: 'Branding',
  },
  {
    id: 21,
    client: 'Nelson Cabinetry',
    website: 'nelsonkb.com',
    logo: '🚪',
    industry: 'Home Improvement',
    quote:
      "Rainboots built our large-scale WordPress WooCommerce platform that handles 11+ cabinet collections, 150,000+ cabinets sold, and 5 distribution centers nationwide. The free 3D kitchen design tool and 1-minute quote engine have been game-changers for our customers. We're now integrated with Wayfair, AllModern, and Bed Bath & Beyond. Couldn't be happier with the results.",
    author: 'Nelson Cabinetry Team',
    role: 'Owner',
    rating: 5,
    projectType: 'WooCommerce Enterprise Platform',
    featured: true,
  },
  {
    id: 22,
    client: 'Cabinets.Deals',
    website: 'cabinets.deals',
    logo: '🚪',
    industry: 'Home Improvement',
    quote:
      "Rainboots built our dealer-exclusive e-commerce platform from the ground up. The custom system handles multiple cabinet lines (Elements, Northville, Prismora), free 3D kitchen design, and nationwide installer network. Our customers love the quality—we're getting 5-star reviews consistently. The Wayfair and AllModern integrations have expanded our reach dramatically.",
    author: 'Cabinets.Deals Team',
    role: 'Owner',
    rating: 5,
    projectType: 'Custom E-Commerce Platform',
    featured: false,
  },
  {
    id: 23,
    client: 'Alpha Construction',
    website: 'alphawa.com',
    logo: '🏠',
    industry: 'Construction',
    quote:
      'Rainboots designed our WordPress website and brand identity from the ground up—full wireframes, sitemap, and custom design that stands out in the Seattle market. They captured our commitment to quality and precision perfectly. The site showcases our custom homes, remodels, and commercial work (including Nike Town Seattle) beautifully. Our clients love the clean, modern look.',
    author: 'Alpha Construction Team',
    role: 'Owner',
    rating: 5,
    projectType: 'WordPress Website + Branding',
    featured: false,
  },
];

// Categories for filtering
const CATEGORIES = [
  { value: 'all', label: 'All Testimonials' },
  { value: 'websites', label: 'Websites' },
  { value: 'platforms', label: 'Full Platforms' },
  { value: 'branding', label: 'Branding' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'print', label: 'Print Collateral' },
];

// Helper to get category based on project type
function getTestimonialCategory(testimonial) {
  const type = testimonial.projectType.toLowerCase();
  if (type.includes('platform') || type.includes('react')) return 'platforms';
  if (type.includes('e-commerce') || type.includes('woocommerce'))
    return 'ecommerce';
  if (type.includes('logo') || type.includes('brand')) return 'branding';
  if (type.includes('print') || type.includes('collateral')) return 'print';
  return 'websites';
}

// Star Rating Component
function StarRating({ rating }) {
  return (
    <div className='testimonial-stars'>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
}

// Individual Testimonial Card
function TestimonialCard({ testimonial, index, onClick }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const category = getTestimonialCategory(testimonial);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`testimonial-card ${testimonial.featured ? 'featured' : ''}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.5s ease ${index * 0.05}s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s`,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onClick(testimonial)}
    >
      <div className='testimonial-card__header'>
        <div
          className='testimonial-card__logo'
          style={{ '--tc-color': testimonial.featured ? '#f7d50f' : '#2b5ce6' }}
        >
          {testimonial.logo}
        </div>
        <div className='testimonial-card__client-info'>
          <h3 className='testimonial-card__client'>{testimonial.client}</h3>
          <p className='testimonial-card__website'>{testimonial.website}</p>
        </div>
        {testimonial.featured && (
          <span className='testimonial-card__featured-badge'>Featured</span>
        )}
      </div>

      <div className='testimonial-card__quote'>
        <span className='quote-mark'>"</span>
        <p>
          {testimonial.quote.length > 280
            ? `${testimonial.quote.substring(0, 280)}...`
            : testimonial.quote}
        </p>
      </div>

      <div className='testimonial-card__footer'>
        <StarRating rating={testimonial.rating} />
        <div className='testimonial-card__author'>
          <strong>{testimonial.author}</strong>
          <span>{testimonial.role}</span>
        </div>
        <span className='testimonial-card__project-type'>
          {testimonial.projectType}
        </span>
      </div>
    </motion.div>
  );
}

// Full Testimonial Modal
function TestimonialModal({ testimonial, onClose }) {
  const category = getTestimonialCategory(testimonial);

  return (
    <motion.div
      className='testimonial-modal-overlay'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className='testimonial-modal'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className='testimonial-modal__close' onClick={onClose}>
          ✕
        </button>

        <div className='testimonial-modal__header'>
          <div
            className='testimonial-modal__logo'
            style={{
              '--tc-color': testimonial.featured ? '#f7d50f' : '#2b5ce6',
            }}
          >
            {testimonial.logo}
          </div>
          <div>
            <h2>{testimonial.client}</h2>
            <p className='testimonial-modal__website'>{testimonial.website}</p>
            <div className='testimonial-modal__meta'>
              <span className='testimonial-modal__category'>{category}</span>
              <span className='testimonial-modal__project'>
                {testimonial.projectType}
              </span>
            </div>
          </div>
        </div>

        <div className='testimonial-modal__quote'>
          <span className='quote-mark-large'>"</span>
          <p>{testimonial.quote}</p>
        </div>

        <div className='testimonial-modal__footer'>
          <StarRating rating={testimonial.rating} />
          <div className='testimonial-modal__author'>
            <strong>{testimonial.author}</strong>
            <span>{testimonial.role}</span>
          </div>
          {testimonial.website && (
            <a
              href={`https://${testimonial.website}`}
              target='_blank'
              rel='noopener noreferrer'
              className='testimonial-modal__visit'
            >
              Visit {testimonial.client} →
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Testimonials Component
export default function Testimonials() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [filteredTestimonials, setFilteredTestimonials] =
    useState(TESTIMONIALS);

  useEffect(() => {
    let filtered = TESTIMONIALS;
    if (activeCategory !== 'all') {
      filtered = TESTIMONIALS.filter(
        (t) => getTestimonialCategory(t) === activeCategory,
      );
    }
    setFilteredTestimonials(filtered);
  }, [activeCategory]);

  // Calculate stats
  const featuredCount = TESTIMONIALS.filter((t) => t.featured).length;
  const avgRating = (
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length
  ).toFixed(1);
  const uniqueClients = TESTIMONIALS.length;

  return (
    <div className='testimonials-page'>
      <Helmet>
        <title>
          Client Testimonials — What Our Clients Say | Rainboots Marketing
        </title>
        <meta
          name='description'
          content="Read what our clients say about working with Rainboots Marketing. Real testimonials from businesses we've helped with websites, branding, and digital marketing."
        />
        <link
          rel='canonical'
          href='https://rainbootsmarketing.com/testimonials'
        />
      </Helmet>

      {/* Hero Section */}
      <section className='testimonials-hero'>
        <div className='testimonials-hero__bg' />
        <div className='testimonials-hero__grid' />
        <div className='testimonials-hero__content'>
          <motion.div
            className='testimonials-hero__eyebrow'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Client Love
          </motion.div>
          <motion.h1
            className='testimonials-hero__title'
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            What Our Clients
            <br />
            <em>Say About Us</em>
          </motion.h1>
          <motion.p
            className='testimonials-hero__sub'
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Don't just take our word for it. Here's what businesses we've worked
            with have to say about their experience with Rainboots Marketing.
          </motion.p>

          {/* Stats */}
          <motion.div
            className='testimonials-stats'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <div className='testimonials-stat'>
              <span className='testimonials-stat-number'>{uniqueClients}+</span>
              <span className='testimonials-stat-label'>Happy Clients</span>
            </div>
            <div className='testimonials-stat'>
              <span className='testimonials-stat-number'>{avgRating}</span>
              <span className='testimonials-stat-label'>Average Rating</span>
            </div>
            <div className='testimonials-stat'>
              <span className='testimonials-stat-number'>{featuredCount}</span>
              <span className='testimonials-stat-label'>Featured Stories</span>
            </div>
          </motion.div>
        </div>

        {/* Rain Drops */}
        <div className='testimonials-hero__drops'>
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className='testimonials-hero__drop'
              style={{
                left: `${5 + i * 8}%`,
                height: `${25 + (i % 5) * 18}px`,
                animationDelay: `${i * 0.25}s`,
                animationDuration: `${1 + (i % 3) * 0.3}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Filter Bar */}
      <div className='testimonials-filters'>
        <div className='testimonials-filters__inner'>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`testimonials-filter-btn ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
              {activeCategory === cat.value && cat.value !== 'all' && (
                <span className='testimonials-filter-count'>
                  {
                    TESTIMONIALS.filter(
                      (t) => getTestimonialCategory(t) === cat.value,
                    ).length
                  }
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <section className='testimonials-grid-section'>
        <div className='testimonials-grid-inner'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeCategory}
              className='testimonials-grid'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredTestimonials.map((testimonial, idx) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={idx}
                  onClick={setSelectedTestimonial}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className='testimonials-cta'>
        <motion.div
          className='testimonials-cta__inner'
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className='testimonials-cta__tag'>Ready to get started?</span>
          <h2>
            Want to be our next
            <br />
            <em>success story?</em>
          </h2>
          <p>
            Whether you need a new website, brand identity, or full digital
            platform, we'd love to hear about your project.
          </p>
          <Link to='/contact' className='btn-primary testimonials-cta__btn'>
            Start a Project →
          </Link>
          <div className='testimonials-cta__links'>
            <Link to='/work' className='testimonials-cta__link'>
              See Our Work →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <TestimonialModal
            testimonial={selectedTestimonial}
            onClose={() => setSelectedTestimonial(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
