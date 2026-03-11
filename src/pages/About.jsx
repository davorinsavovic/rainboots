import { motion } from 'framer-motion';
import './About.css';

const teamMembers = [
  {
    name: 'Steven Utt',
    role: 'Co-founder, Principal Marketer',
    icon: '/images/i_steven.png',
  },
  {
    name: 'Davorin Savovic',
    role: 'Co-founder, Sr. Marketing Specialist, Software Engineer, Designer',
    icon: '/images/i_davorin.png',
  },
  // {
  //   name: 'Joey Atkins',
  //   role: 'Co-founder, Mobile Marketing Manager',
  //   emoji: '📱',
  // },
  // {
  //   name: 'Thomas Olson',
  //   role: 'Co-founder, Software Engineer, Designer',
  //   emoji: '🎨',
  // },
  // {
  //   name: 'Matt Strzelecki',
  //   role: 'Sr. Email Deliverability Manager',
  //   emoji: '📧',
  // },
  // { name: 'Elizabeth Martin', role: 'Director of Marketing', emoji: '📊' },
  // { name: 'Robert Martin', role: 'Sr. Software Engineer', emoji: '⚙️' },
];

const values = [
  {
    title: 'Strategic Insights',
    description:
      'Our team brings wealth of industry knowledge and strategic insights. We understand your business goals, target audience, and market dynamics to develop customized strategies.',
    icon: '/images/i_strategicInsights.png',
  },
  {
    title: 'Creative Solutions',
    description:
      'Creativity is at the heart of everything we do. We combine strategic thinking with innovative ideas to deliver engaging marketing solutions that resonate with your audience.',
    icon: '/images/i_creativeSolutions.png',
  },
  {
    title: 'Data-Driven Approach',
    description:
      'We believe in the power of data-driven decision-making. Using advanced analytics and market research, we leverage insights to optimize strategies and ensure maximum ROI.',
    icon: '/images/i_dataDriven.png',
  },
  {
    title: 'Collaborative Partnership',
    description:
      'We view our clients as partners. We work collaboratively every step of the way, providing transparent communication and actionable insights to empower informed decisions.',
    icon: '/images/i_partnership.png',
  },
];

const About = () => {
  return (
    <div className='about-page'>
      <section className='about-hero'>
        <motion.div
          className='about-hero-content'
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
            About Us
          </motion.span>
          <h1>We're Here to Help You Grow</h1>
          <p>
            Rooted in Seattle, Rainboots is a group of seasoned marketers,
            developers, and engineers with expertise spanning across all
            marketing channels, website optimization, design, analytics, and
            beyond.
          </p>
        </motion.div>
      </section>

      <section className='mission-section'>
        <motion.div
          className='mission-content'
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Our Mission</h2>
          <p>
            Our mission is simple: help businesses achieve their goals and drive
            sustainable growth through strategic and innovative marketing
            solutions. Whether you're looking to drive more traffic to your
            website or improve customer conversion and retention, we're here to
            provide the expertise, creativity, and strategic guidance you need
            to succeed.
          </p>
        </motion.div>
      </section>

      <section className='values-section'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose Rainboots?
          </motion.h2>
        </div>

        <div className='values-grid'>
          {values.map((value, index) => (
            <motion.div
              key={index}
              className='value-card'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={value.icon}
                alt={value.title}
                className='glass-icon-large'
              />
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className='team-section' id='team'>
        <div className='section-header'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Experienced professionals dedicated to your success
          </motion.p>
        </div>

        <div className='team-grid'>
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className='team-card'
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className='team-emoji'>
                <img src={member.icon} alt={member.name} className='' />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
