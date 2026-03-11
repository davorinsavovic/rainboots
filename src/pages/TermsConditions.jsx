import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './TermsConditions.css';

const TermsConditions = () => {
  return (
    <div className='terms-page'>
      <section className='terms-hero'>
        <motion.div
          className='terms-hero-content'
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
            Legal
          </motion.span>
          <h1>Terms & Conditions</h1>
          <p>
            Please read these terms and conditions carefully before using our
            website or services.
          </p>
        </motion.div>
      </section>

      <section className='terms-content'>
        <div className='terms-container'>
          <div className='terms-section'>
            <p className='intro-text'>
              These terms and conditions outline the rules and regulations for
              the use of our website and services provided by{' '}
              <strong>Rainboots Digital Marketing</strong>.
            </p>
            <p>
              By accessing this website and using our services, you accept these
              terms and conditions in full. If you disagree with these terms and
              conditions or any part of these terms and conditions, you must not
              use this website or our services.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Intellectual Property Rights</h2>
            <p>
              Unless otherwise stated, we own the intellectual property rights
              for all material on Rainboots Digital Marketing. All intellectual
              property rights are reserved. You may view and/or print pages from
              this website for your own personal use subject to restrictions set
              in these terms and conditions.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Restrictions</h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul className='restrictions-list'>
              <li>
                Using our website or services in any way that is or may be
                damaging to the website or services;
              </li>
              <li>
                Using our website or services in any way that impacts user
                access to the website or services;
              </li>
              <li>
                Using our website or services contrary to applicable laws and
                regulations, or in any way that may cause harm to the website,
                services, or any person or business entity;
              </li>
              <li>
                Engaging in any data mining, data harvesting, data extracting,
                or any other similar activity in relation to this website or
                services.
              </li>
            </ul>
          </div>

          <div className='terms-section'>
            <h2>No Warranties</h2>
            <p>
              This website and services are provided “as is,” with all faults,
              and Rainboots Digital Marketing makes no express or implied
              representations or warranties, of any kind related to this website
              or services or the materials contained on this website or
              services.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall Rainboots Digital Marketing, nor any of its
              officers, directors, and employees, be liable to you for anything
              arising out of or in any way connected with your use of this
              website or services, whether such liability is under contract,
              tort, or otherwise, and Rainboots Digital Marketing, including its
              officers, directors, and employees shall not be liable for any
              indirect, consequential, or special liability arising out of or in
              any way related to your use of this website or services.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Indemnification</h2>
            <p>
              You hereby indemnify to the fullest extent Rainboots Digital
              Marketing from and against any and all liabilities, costs,
              demands, causes of action, damages, and expenses (including
              reasonable attorney’s fees) arising out of or in any way related
              to your breach of any of the provisions of these terms.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Severability</h2>
            <p>
              If any provision of these terms is found to be unenforceable or
              invalid under any applicable law, such unenforceability or
              invalidity shall not render these terms unenforceable or invalid
              as a whole, and such provisions shall be deleted without affecting
              the remaining provisions herein.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Variation of Terms</h2>
            <p>
              Rainboots Digital Marketing is permitted to revise these terms at
              any time as it sees fit, and by using this website or services you
              are expected to review such terms regularly to ensure you
              understand all terms and conditions governing the use of this
              website and services.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Assignment</h2>
            <p>
              Rainboots Digital Marketing shall be permitted to assign,
              transfer, and subcontract its rights and/or obligations under
              these terms without any notification or consent required. However,
              you shall not be permitted to assign, transfer, or subcontract any
              of your rights and/or obligations under these terms.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Entire Agreement</h2>
            <p>
              These terms constitute the entire agreement between Rainboots
              Digital Marketing and you in relation to your use of this website
              and services and supersede all prior agreements and
              understandings.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Governing Law & Jurisdiction</h2>
            <p>
              These terms will be governed by and interpreted in accordance with
              the laws of Rainboots Digital Marketing, and you submit to the
              non-exclusive jurisdiction of the state and federal courts for the
              resolution of any disputes.
            </p>
          </div>

          <div className='terms-section'>
            <h2>Contact Information</h2>
            <p>
              If you have any questions or concerns regarding these terms and
              conditions, please contact us at{' '}
              <a href='mailto:info@rainbootsmarketing.com'>
                info@rainbootsmarketing.com
              </a>
              .
            </p>
          </div>

          <div className='terms-footer'>
            <p>
              By using our website and services, you acknowledge that you have
              read, understood, and agree to be bound by these terms and
              conditions.
            </p>
            <p className='last-updated'>Last updated: March 2025</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
