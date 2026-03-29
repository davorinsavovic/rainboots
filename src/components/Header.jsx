import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import useHeaderTheme from '../hooks/useHeaderTheme';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { theme, scrolled } = useHeaderTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 35,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 35,
      },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 0.3 },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.06,
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    }),
  };

  const menuItems = [
    { path: '/', label: 'Home', bold: true },
    { path: '/services', label: 'Services', bold: true },
    { path: '/about', label: 'About', bold: true },
    { path: '/contact', label: 'Get Started', isCta: true, bold: true },
  ];

  // Log for debugging
  useEffect(() => {
    console.log('Header state - scrolled:', scrolled, 'theme:', theme);
  }, [scrolled, theme]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`header ${scrolled ? 'header-scrolled' : `header-${theme}`}`}
      >
        <Link to='/' className='logo' onClick={() => setMobileMenuOpen(false)}>
          <img
            src='/images/rainboots_splashboot_icon.png'
            alt='Rainboots Marketing'
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className='nav-desktop'>
          <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link
            to='/services'
            className={location.pathname === '/services' ? 'active' : ''}
          >
            Services
          </Link>
          <Link
            to='/about'
            className={location.pathname === '/about' ? 'active' : ''}
          >
            About
          </Link>
          <Link to='/contact' className='cta-button'>
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label='Toggle menu'
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className='mobile-menu-overlay'
            variants={overlayVariants}
            initial='closed'
            animate='open'
            exit='closed'
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            ref={menuRef}
            className='nav-mobile'
            variants={menuVariants}
            initial='closed'
            animate='open'
            exit='closed'
          >
            <div className='menu-decoration'>
              <div className='decoration-circle'></div>
              <div className='decoration-dots'></div>
              <div className='decoration-wave'></div>
            </div>

            <div className='mobile-menu-header'>
              <div className='menu-header-content'>
                <span className='menu-title'>Menu</span>
                <span className='menu-subtitle'>NAVIGATE</span>
              </div>
            </div>

            <div className='mobile-menu-links'>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  custom={index}
                  variants={menuItemVariants}
                  className='menu-item-wrapper'
                >
                  <Link
                    to={item.path}
                    className={`menu-link ${location.pathname === item.path ? 'active' : ''} ${item.isCta ? 'menu-cta' : ''}`}
                    onClick={toggleMobileMenu}
                  >
                    <span className={`menu-label ${item.bold ? 'bold' : ''}`}>
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className='mobile-menu-footer'>
              <div className='footer-content'>
                <p className='footer-text'>
                  Let's create something amazing together
                </p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
