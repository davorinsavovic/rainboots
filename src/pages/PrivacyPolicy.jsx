import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className='privacy-page'>
      <section className='privacy-hero'>
        <motion.div
          className='privacy-hero-content'
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
          <h1>Privacy Policy</h1>
          <p>
            Your privacy is important to us. Learn how we collect, use, and
            protect your information when you visit our website.
          </p>
        </motion.div>
      </section>

      <section className='privacy-content'>
        <div className='privacy-container'>
          <div className='privacy-section'>
            <h2>Who We Are</h2>
            <p>
              Our website address is:{' '}
              <a
                href='https://rainbootsmarketing.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://rainbootsmarketing.com
              </a>
            </p>
          </div>

          <div className='privacy-section'>
            <h2>Cookies</h2>
            <p>
              If you leave a comment on our site you may opt-in to saving your
              name, email address and website in cookies. These are for your
              convenience so that you do not have to fill in your details again
              when you leave another comment. These cookies will last for one
              year.
            </p>
            <p>
              If you visit our login page, we will set a temporary cookie to
              determine if your browser accepts cookies. This cookie contains no
              personal data and is discarded when you close your browser.
            </p>
            <p>
              When you log in, we will also set up several cookies to save your
              login information and your screen display choices. Login cookies
              last for two days, and screen options cookies last for a year. If
              you select "Remember Me", your login will persist for two weeks.
              If you log out of your account, the login cookies will be removed.
            </p>
            <p>
              If you edit or publish an article, an additional cookie will be
              saved in your browser. This cookie includes no personal data and
              simply indicates the post ID of the article you just edited. It
              expires after 1 day.
            </p>
          </div>

          <div className='privacy-section'>
            <h2>Who We Share Your Data With</h2>
            <p>
              If you request a password reset, your IP address will be included
              in the reset email.
            </p>
          </div>

          <div className='privacy-section'>
            <h2>How Long We Retain Your Data</h2>
            <p>
              If you leave a comment, the comment and its metadata are retained
              indefinitely. This is so we can recognize and approve any
              follow-up comments automatically instead of holding them in a
              moderation queue.
            </p>
            <p>
              For users that register on our website (if any), we also store the
              personal information they provide in their user profile. All users
              can see, edit, or delete their personal information at any time
              (except they cannot change their username). Website administrators
              can also see and edit that information.
            </p>
          </div>

          <div className='privacy-section'>
            <h2>Where Your Data Is Sent</h2>
            <p>
              Visitor comments may be checked through an automated spam
              detection service.
            </p>
          </div>

          <div className='privacy-footer'>
            <p>
              If you have any questions about this privacy policy, please{' '}
              <Link to='/contact'>contact us</Link>.
            </p>
            <p className='last-updated'>Last updated: March 2025</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
