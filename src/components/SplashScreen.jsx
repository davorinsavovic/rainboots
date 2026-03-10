import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroAnimation from './HeroAnimation';
import './SplashScreen.css';

const SplashScreen = ({ onClose }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [startLogoTransition, setStartLogoTransition] = useState(false);
  const animationStateRef = useRef(null);
  const splashLogoRef = useRef(null);

  // Auto-close after animation completes (safety net)
  useEffect(() => {
    const totalAnimationTime = 38000; // 38 seconds

    const timer = setTimeout(() => {
      console.log('Safety timer triggered');
      if (showSplash && !isClosing) {
        handleClose();
      }
    }, totalAnimationTime);

    return () => clearTimeout(timer);
  }, [showSplash, isClosing]);

  const handleAnimationStateChange = (state) => {
    animationStateRef.current = state;
    console.log('Animation state updated:', state?.stage);
  };

  const handleAnimationComplete = (finalState) => {
    console.log('Animation completed naturally with state:', finalState);
    animationStateRef.current = finalState;
    setStartLogoTransition(true);

    // Close the splash screen
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleClose = () => {
    console.log('Closing splash with state:', animationStateRef.current);
    setIsClosing(true);
    setStartLogoTransition(true);

    const currentState = animationStateRef.current;

    setTimeout(() => {
      setShowSplash(false);
      if (onClose) {
        onClose(currentState);
      }
    }, 500);
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
    <AnimatePresence mode='wait'>
      {showSplash && (
        <motion.div
          className='splash-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Splash Screen Logo */}
          <motion.div
            className='splash-logo-container'
            ref={splashLogoRef}
            initial={{ scale: 1, opacity: 1 }}
            animate={
              startLogoTransition
                ? {
                    scale: 0,
                    opacity: 0,
                    transition: {
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }
                : {}
            }
          >
            <img
              src='/images/rainboots_logo.png'
              alt='Rainboots Marketing'
              className='splash-logo'
            />
          </motion.div>

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

          {/* Progress Bar */}
          <motion.div
            className='splash-progress'
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 38, ease: 'linear' }}
          />

          {/* Skip Hint */}
          <motion.div
            className='splash-hint'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 3, duration: 0.5 }}
          >
            Click the X to skip
          </motion.div>

          {/* The Animation */}
          <div className='splash-content'>
            <div className='animation-responsive-container'>
              <HeroAnimation
                onStateChange={handleAnimationStateChange}
                onAnimationComplete={handleAnimationComplete}
                isInSplash={true}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
