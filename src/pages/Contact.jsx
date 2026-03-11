import { motion, AnimatePresence } from 'framer-motion';
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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2)
          return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Please enter a valid email';
        return '';
      case 'company':
        if (value.trim() && value.trim().length < 2)
          return 'Company name must be at least 2 characters';
        return '';
      case 'message':
        if (value.trim() && value.trim().length < 10)
          return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

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

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      company: validateField('company', formData.company),
      message: validateField('message', formData.message),
    };

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 1000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('submitting');

    try {
      // Send form data to your API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      console.log('Form submitted successfully:', data);
      setSubmitStatus('success');

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          businessType: '',
          services: [],
          budget: '',
          timeline: '',
          message: '',
        });
        setTouched({});
        setErrors({});
        setSubmitStatus(null);
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus(null);
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const hasError = (fieldName) => touched[fieldName] && errors[fieldName];
  const isValid = (fieldName) =>
    touched[fieldName] && !errors[fieldName] && formData[fieldName];

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
          <h1>Summon Your Heroes</h1>
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
              Whether you need a sidekick for small tasks or a full league of
              heroes for an epic marketing campaign, Rainboots Justice League is
              standing by.
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
              {/* Enhanced flying effect */}
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

                {/* Energy sparks */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className={`spark spark-${i}`}
                    animate={{
                      scale: [0, 1.2, 0.8, 0],
                      x: [
                        0,
                        i % 2 === 0 ? 40 : -40,
                        i % 2 === 0 ? 20 : -20,
                        i % 2 === 0 ? 60 : -60,
                      ],
                      y: [0, -30, -50, -80],
                      opacity: [0, 1, 0.8, 0],
                      rotate: [0, 45, 90, 180],
                    }}
                    transition={{
                      duration: 1.2 + i * 0.1,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeOut',
                    }}
                  />
                ))}
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
            className={`contact-form ${submitStatus === 'error' ? 'form-shake' : ''}`}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            noValidate
          >
            <h3>Send a Signal</h3>

            <div className='form-row'>
              <div
                className={`form-group ${hasError('name') ? 'has-error' : ''} ${isValid('name') ? 'has-success' : ''}`}
              >
                <label htmlFor='name'>Your Hero Name *</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <AnimatePresence mode='wait'>
                  {hasError('name') && (
                    <motion.div
                      className='hero-error'
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {errors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
                {isValid('name') && (
                  <motion.div
                    className='success-indicator'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </div>

              <div
                className={`form-group ${hasError('email') ? 'has-error' : ''} ${isValid('email') ? 'has-success' : ''}`}
              >
                <label htmlFor='email'>Super Email *</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <AnimatePresence mode='wait'>
                  {hasError('email') && (
                    <motion.div
                      className='hero-error'
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {errors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
                {isValid('email') && (
                  <motion.div
                    className='success-indicator'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </div>

            <div
              className={`form-group ${hasError('company') ? 'has-error' : ''} ${isValid('company') ? 'has-success' : ''}`}
            >
              <label htmlFor='company'>Secret Headquarters (Company)</label>
              <input
                type='text'
                id='company'
                name='company'
                value={formData.company}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              <AnimatePresence mode='wait'>
                {hasError('company') && (
                  <motion.div
                    className='hero-error'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.company}
                  </motion.div>
                )}
              </AnimatePresence>
              {isValid('company') && (
                <motion.div
                  className='success-indicator'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </div>

            <div className='form-group'>
              <label htmlFor='businessType'>Superpower (Business Type)</label>
              <select
                id='businessType'
                name='businessType'
                value={formData.businessType}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              >
                <option value=''>Select your superpower</option>
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
              <label>Heroic Services Needed</label>
              <div className='checkbox-group'>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    name='services'
                    value='strategy'
                    onChange={handleChange}
                    checked={formData.services.includes('strategy')}
                    disabled={isSubmitting}
                  />
                  Marketing Strategy Development
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    name='services'
                    value='digital'
                    onChange={handleChange}
                    checked={formData.services.includes('digital')}
                    disabled={isSubmitting}
                  />
                  Digital Marketing
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    name='services'
                    value='branding'
                    onChange={handleChange}
                    checked={formData.services.includes('branding')}
                    disabled={isSubmitting}
                  />
                  Branding and Creative Services
                </label>
                <label className='checkbox-label'>
                  <input
                    type='checkbox'
                    name='services'
                    value='content'
                    onChange={handleChange}
                    checked={formData.services.includes('content')}
                    disabled={isSubmitting}
                  />
                  Content Marketing
                </label>
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='budget'>Power Level (Budget)</label>
                <select
                  id='budget'
                  name='budget'
                  value={formData.budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                >
                  <option value=''>Select power level</option>
                  <option value='under10k'>Sidekick Level (Under $10k)</option>
                  <option value='10k-25k'>Local Hero ($10k - $25k)</option>
                  <option value='25k-50k'>City Protector ($25k - $50k)</option>
                  <option value='50k-100k'>Avenger Level ($50k - $100k)</option>
                  <option value='over100k'>Justice League (Over $100k)</option>
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor='timeline'>Rescue Timeline</label>
                <select
                  id='timeline'
                  name='timeline'
                  value={formData.timeline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                >
                  <option value=''>Select timeline</option>
                  <option value='immediate'>Emergency! (1-2 weeks)</option>
                  <option value='short'>Quick Mission (1-3 months)</option>
                  <option value='medium'>
                    Strategic Campaign (3-6 months)
                  </option>
                  <option value='long'>Epic Saga (6+ months)</option>
                </select>
              </div>
            </div>

            <div
              className={`form-group ${hasError('message') ? 'has-error' : ''} ${isValid('message') ? 'has-success' : ''}`}
            >
              <label htmlFor='message'>Distress Signal (Message)</label>
              <textarea
                id='message'
                name='message'
                rows='5'
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='Tell us about your villain (marketing challenges)...'
                disabled={isSubmitting}
              ></textarea>
              <AnimatePresence mode='wait'>
                {hasError('message') && (
                  <motion.div
                    className='hero-error'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.message}
                  </motion.div>
                )}
              </AnimatePresence>
              {isValid('message') && (
                <motion.div
                  className='success-indicator'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </div>

            <AnimatePresence mode='wait'>
              {submitStatus === 'submitting' && (
                <motion.div
                  key='submitting'
                  className='submit-status submitting'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className='power-charging'>
                    <span>⚡</span>
                    <span>⚡</span>
                    <span>⚡</span>
                  </div>
                  <p>Summoning heroes...</p>
                </motion.div>
              )}

              {submitStatus === 'success' && (
                <motion.div
                  key='success'
                  className='submit-status success'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className='power-explosion'>💥</div>
                  <p>Heroes Assembled! We'll rescue you soon!</p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  key='error'
                  className='submit-status error'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className='power-fail'>💢</div>
                  <p>Signal interrupted! Check your super-info above.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type='submit'
              className='submit-button'
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={
                submitStatus === 'error'
                  ? {
                      x: [-10, 10, -10, 10, 0],
                      transition: { duration: 0.4 },
                    }
                  : {}
              }
            >
              {isSubmitting ? 'Assembling Heroes...' : 'Send Hero Signal ⚡'}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
