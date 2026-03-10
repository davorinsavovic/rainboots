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
  const closeButtonRef = useRef(null);

  // Auto-close after animation completes (safety net)
  useEffect(() => {
    const totalAnimationTime = 38000; // 38 seconds

    const timer = setTimeout(() => {
      console.log('Safety timer triggered');
      if (showSplash && !isClosing) {
        closeSplash();
      }
    }, totalAnimationTime);

    return () => clearTimeout(timer);
  }, [showSplash, isClosing]);

  const handleAnimationStateChange = (state) => {
    animationStateRef.current = state;
  };

  const handleAnimationComplete = (finalState) => {
    console.log('Animation completed naturally');
    animationStateRef.current = finalState;
    setStartLogoTransition(true);
    setTimeout(() => {
      closeSplash();
    }, 500);
  };

  const closeSplash = () => {
    if (isClosing || !showSplash) return;

    console.log('Closing splash screen');
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

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showSplash && !isClosing) {
        console.log('ESC pressed - closing splash');
        closeSplash();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showSplash, isClosing]);

  // Log mount/unmount
  useEffect(() => {
    console.log('SplashScreen mounted');
    return () => console.log('SplashScreen unmounted');
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {showSplash && (
        <motion.div
          className='splash-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={(e) => {
            // Only close if clicking the overlay itself, not its children
            if (e.target === e.currentTarget) {
              console.log('Overlay clicked');
              closeSplash();
            }
          }}
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
          <button
            ref={closeButtonRef}
            className='splash-close-btn'
            onClick={(e) => {
              e.stopPropagation();
              console.log('Close button clicked');
              closeSplash();
            }}
            disabled={isClosing}
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
          </button>

          {/* Progress Bar */}
          <div className='splash-progress'>
            <motion.div
              className='splash-progress-bar'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 38, ease: 'linear' }}
            />
          </div>

          {/* Skip Hint */}
          <div className='splash-hint'>Press ESC to skip</div>

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
