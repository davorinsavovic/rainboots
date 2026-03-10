import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`header ${scrolled ? 'header-scrolled' : 'header-transparent'}`}
    >
      <Link to='/' className='logo'>
        <img
          src='/images/rainboots_splashboot_icon.png'
          alt='Rainboots Marketing'
        />
      </Link>

      <nav className='nav'>
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
    </motion.header>
  );
};

export default Header;
