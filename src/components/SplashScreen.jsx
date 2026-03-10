// components/SplashScreen.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroAnimation from './HeroAnimation';
import './SplashScreen.css';

const SplashScreen = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Auto-close after animation completes (backup timer in case animation doesn't trigger)
  useEffect(() => {
    // Total animation time from your stage controller as a safety net
    const totalAnimationTime = 38000; // 38 seconds

    const timer = setTimeout(() => {
      if (showSplash && !isClosing) {
        handleClose();
      }
    }, totalAnimationTime);

    return () => clearTimeout(timer);
  }, [showSplash, isClosing]);

  // Listen for animation completion from HeroAnimation
  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    // Small delay to allow exit animation
    setTimeout(() => {
      setShowSplash(false);
    }, 800);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showSplash && !isClosing) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showSplash, isClosing]);

  return (
    <>
      <AnimatePresence mode='wait'>
        {showSplash && (
          <motion.div
            className='splash-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Prominent Close Button */}
            <motion.button
              className='splash-close-btn'
              onClick={handleClose}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 1, duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label='Skip animation'
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M18 6L6 18M6 6L18 18'
                  stroke='currentColor'
                  strokeWidth='2.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>Skip</span>
            </motion.button>

            {/* Progress Bar - stops when animation completes */}
            <motion.div
              className='splash-progress'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: animationComplete ? 1 : 1 }}
              transition={{
                duration: 38,
                ease: 'linear',
                // Stop the animation if it completes early
                ...(animationComplete && { duration: 0 }),
              }}
            />

            {/* Skip Hint (appears after a few seconds) */}
            <motion.div
              className='splash-hint'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 3, duration: 0.5 }}
            >
              Click the X to skip
            </motion.div>

            {/* Animation Complete Indicator (optional) */}
            {animationComplete && (
              <motion.div
                className='animation-complete-indicator'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                ✓ Animation Complete
              </motion.div>
            )}

            {/* The Animation - now with onAnimationComplete callback */}
            <div className='splash-content'>
              <HeroAnimation onAnimationComplete={handleAnimationComplete} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - shown after splash closes */}
      <motion.div
        className='main-content'
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default SplashScreen;
