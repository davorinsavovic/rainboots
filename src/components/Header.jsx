import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

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
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 50 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`header ${scrolled ? 'header-scrolled' : 'header-transparent'}`}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className='mobile-menu-overlay'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            <motion.nav
              className='nav-mobile'
              variants={menuVariants}
              initial='closed'
              animate='open'
              exit='closed'
            >
              <div className='mobile-menu-header'>
                <span className='mobile-menu-title'>Menu</span>
                <button
                  className='mobile-menu-close'
                  onClick={toggleMobileMenu}
                  aria-label='Close menu'
                >
                  ×
                </button>
              </div>
              <div className='mobile-menu-links'>
                <motion.div custom={0} variants={menuItemVariants}>
                  <Link
                    to='/'
                    className={location.pathname === '/' ? 'active' : ''}
                    onClick={toggleMobileMenu}
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div custom={1} variants={menuItemVariants}>
                  <Link
                    to='/services'
                    className={
                      location.pathname === '/services' ? 'active' : ''
                    }
                    onClick={toggleMobileMenu}
                  >
                    Services
                  </Link>
                </motion.div>
                <motion.div custom={2} variants={menuItemVariants}>
                  <Link
                    to='/about'
                    className={location.pathname === '/about' ? 'active' : ''}
                    onClick={toggleMobileMenu}
                  >
                    About
                  </Link>
                </motion.div>
                <motion.div custom={3} variants={menuItemVariants}>
                  <Link
                    to='/contact'
                    className='mobile-cta'
                    onClick={toggleMobileMenu}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
