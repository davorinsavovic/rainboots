import { motion } from 'framer-motion';
import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    businessType: '',
    services: [],
    budget: '',
    timeline: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        services: checked
          ? [...prev.services, value]
          : prev.services.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert("Thank you for your inquiry! We'll get back to you soon.");
  };

  return (
    <div className='contact-page'>
      <section className='contact-hero'>
        <motion.div
          className='contact-hero-content'
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
            Get In Touch
          </motion.span>
          <h1>Let's Start a Conversation</h1>
          <p>
            We're here to assist you with any questions, inquiries, or project
            requests you may have.
          </p>
        </motion.div>
      </section>

      <section className='contact-content'>
        <div className='contact-container'>
          <motion.div
            className='contact-info'
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Contact Information</h2>
            <p>
              Whether you're a small business looking to establish a strong
              online presence or a larger organization seeking to enhance your
              marketing strategy, Rainboots is here to&nbsp;help.
            </p>

            {/* Hero Image with Super Hero Animation */}
            <motion.div
              className='hero-image-wrapper'
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              whileInView={{
                scale: 1,
                rotate: 0,
                opacity: 1,
                transition: {
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  duration: 1.2,
                },
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.08,
                rotate: [0, -3, 3, -2, 2, 0],
                transition: { duration: 0.6 },
              }}
            >
              {/* Enhanced flying effect - SINGLE container */}
              <motion.div
                className='flying-effects'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Speed lines */}
                <motion.div
                  className='speed-line speed-line-1'
                  animate={{
                    x: [-100, 100],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.3,
                  }}
                />
                <motion.div
                  className='speed-line speed-line-2'
                  animate={{
                    x: [-120, 120],
                    opacity: [0, 0.4, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                />

                {/* Energy sparks - each with different behavior */}
                <motion.div
                  className='spark spark-1'
                  animate={{
                    scale: [0, 1.2, 0.8, 0],
                    x: [0, 40, 20, 60],
                    y: [0, -30, -50, -80],
                    opacity: [0, 1, 0.8, 0],
                    rotate: [0, 45, 90, 180],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: 0.1,
                    ease: 'easeOut',
                  }}
                />

                <motion.div
                  className='spark spark-2'
                  animate={{
                    scale: [0, 1, 0.6, 0],
                    x: [0, 60, 100, 80],
                    y: [0, -20, -60, -100],
                    opacity: [0, 0.8, 0.4, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: 'easeIn',
                  }}
                />

                <motion.div
                  className='spark spark-3'
                  animate={{
                    scale: [0, 1.3, 0.4, 0.8, 0],
                    x: [0, 30, -20, 50, 80],
                    y: [0, -40, -60, -30, -90],
                    opacity: [0, 0.9, 0.6, 0.3, 0],
                    rotate: [0, 90, 180, 270, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.2,
                    ease: 'anticipate',
                  }}
                />

                <motion.div
                  className='spark spark-4'
                  animate={{
                    scale: [0, 0.8, 0.4, 0],
                    x: [0, 25, 45, 30],
                    y: [0, -15, -35, -50],
                    opacity: [0, 0.7, 0.3, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: 0.4,
                    ease: 'easeOut',
                  }}
                />

                <motion.div
                  className='spark spark-5'
                  animate={{
                    scale: [0, 1.1, 0.5, 0],
                    x: [0, 50, 90, 130],
                    y: [0, -10, -40, -70],
                    opacity: [0, 0.9, 0.5, 0],
                    rotate: [0, 30, 60, 90],
                  }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    delay: 0.7,
                    ease: 'backOut',
                  }}
                />

                <motion.div
                  className='spark spark-9'
                  animate={{
                    scale: [0, 0.7, 0.3, 0],
                    x: [0, 35, 65, 95],
                    y: [0, -20, -45, -75],
                    opacity: [0, 0.6, 0.3, 0],
                  }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: 0.8,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>

              <img
                src='/images/hero.png'
                alt='Rainboots Marketing'
                className='hero-image'
              />

              {/* Subtle rim light effect */}
              <motion.div
                className='rim-light'
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>

          <motion.form
            className='contact-form'
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Send us a message</h3>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='name'>Name *</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email *</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='company'>Company</label>
              <input
                type='text'
                id='company'
                name='company'
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='businessType'>Business Type</label>
              <select
                id='businessType'
                name='businessType'
                value={formData.businessType}
                onChange={handleChange}
              >
                <option value=''>Select your business type</option>
                <option value='advertising'>Advertising and Marketing</option>
                <option value='travel'>Transport and Travel</option>
                <option value='hospitality'>Hotel and Catering</option>
                <option value='food'>Food and Beverage</option>
                <option value='beauty'>Health and Beauty</option>
                <option value='fashion'>Fashion</option>
                <option value='sports'>Sports and Leisure</option>
                <option value='tech'>Technology and Apps</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className='form-group'>
              <label>Services Interested In</label>
              <div className='checkbox-group'>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    name='services'
                    value='strategy'
                    onChange={handleChange}
                  />
                  Marketing Strategy Development
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    name='services'
                    value='digital'
                    onChange={handleChange}
                  />
                  Digital Marketing
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    name='services'
                    value='branding'
                    onChange={handleChange}
                  />
                  Branding and Creative Services
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    name='services'
                    value='content'
                    onChange={handleChange}
                  />
                  Content Marketing
                </label>
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='budget'>Budget Range</label>
                <select
                  id='budget'
                  name='budget'
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value=''>Select budget range</option>
                  <option value='under10k'>Under $10,000</option>
                  <option value='10k-25k'>$10,000 - $25,000</option>
                  <option value='25k-50k'>$25,000 - $50,000</option>
                  <option value='50k-100k'>$50,000 - $100,000</option>
                  <option value='over100k'>Over $100,000</option>
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor='timeline'>Timeline</label>
                <select
                  id='timeline'
                  name='timeline'
                  value={formData.timeline}
                  onChange={handleChange}
                >
                  <option value=''>Select timeline</option>
                  <option value='immediate'>Immediate (1-2 weeks)</option>
                  <option value='short'>Short-term (1-3 months)</option>
                  <option value='medium'>Medium-term (3-6 months)</option>
                  <option value='long'>Long-term (6+ months)</option>
                </select>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='message'>Message</label>
              <textarea
                id='message'
                name='message'
                rows='5'
                value={formData.message}
                onChange={handleChange}
                placeholder='Tell us about your project...'
              ></textarea>
            </div>

            <button type='submit' className='submit-button'>
              Send Message
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
