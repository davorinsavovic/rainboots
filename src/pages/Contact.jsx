import { motion } from 'framer-motion'
import { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    businessType: '',
    services: [],
    budget: '',
    timeline: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        services: checked 
          ? [...prev.services, value]
          : prev.services.filter(s => s !== value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add your form submission logic here
    alert('Thank you for your inquiry! We\'ll get back to you soon.')
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <motion.div
          className="contact-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Get In Touch
          </motion.span>
          <h1>Let's Start a Conversation</h1>
          <p>
            We're here to assist you with any questions, inquiries, or project requests you may have.
          </p>
        </motion.div>
      </section>

      <section className="contact-content">
        <div className="contact-container">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Contact Information</h2>
            <p>
              Whether you're a small business looking to establish a strong online presence 
              or a larger organization seeking to enhance your marketing strategy, Rainboots 
              is here to help.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:hello@rainbootsmarketing.com">hello@rainbootsmarketing.com</a>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Location</h4>
                  <p>Seattle, Washington</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">⏰</span>
                <div>
                  <h4>Business Hours</h4>
                  <p>Monday - Friday: 9am - 5pm PST</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3>Send us a message</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="businessType">Business Type</label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
              >
                <option value="">Select your business type</option>
                <option value="advertising">Advertising and Marketing</option>
                <option value="travel">Transport and Travel</option>
                <option value="hospitality">Hotel and Catering</option>
                <option value="food">Food and Beverage</option>
                <option value="beauty">Health and Beauty</option>
                <option value="fashion">Fashion</option>
                <option value="sports">Sports and Leisure</option>
                <option value="tech">Technology and Apps</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Services Interested In</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="services"
                    value="strategy"
                    onChange={handleChange}
                  />
                  Marketing Strategy Development
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="services"
                    value="digital"
                    onChange={handleChange}
                  />
                  Digital Marketing
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="services"
                    value="branding"
                    onChange={handleChange}
                  />
                  Branding and Creative Services
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="services"
                    value="content"
                    onChange={handleChange}
                  />
                  Content Marketing
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget">Budget Range</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="">Select budget range</option>
                  <option value="under10k">Under $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="over100k">Over $100,000</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="timeline">Timeline</label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (1-2 weeks)</option>
                  <option value="short">Short-term (1-3 months)</option>
                  <option value="medium">Medium-term (3-6 months)</option>
                  <option value="long">Long-term (6+ months)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project..."
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  )
}

export default Contact
