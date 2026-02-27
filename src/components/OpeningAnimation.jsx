import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import './OpeningAnimation.css';

const OpeningAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState('circle-growing'); // circle-growing, showing-words, transforming, bubbles
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['This', 'Is', 'What'];

  useEffect(() => {
    // Stage 1: Circle grows (0.5s)
    const circleTimer = setTimeout(() => {
      setStage('showing-words');
    }, 500);

    return () => clearTimeout(circleTimer);
  }, []);

  useEffect(() => {
    if (stage === 'showing-words') {
      // Stage 2: Show words one by one (0.33s each)
      if (currentWord < words.length) {
        const wordTimer = setTimeout(() => {
          setCurrentWord((prev) => prev + 1);
        }, 333);
        return () => clearTimeout(wordTimer);
      } else {
        // After last word, transform to triangle
        const transformTimer = setTimeout(() => {
          setStage('transforming');
        }, 333);

        // Then show bubbles
        const bubblesTimer = setTimeout(() => {
          setStage('bubbles');
        }, 833); // 333ms + 500ms for transform

        return () => {
          clearTimeout(transformTimer);
          clearTimeout(bubblesTimer);
        };
      }
    }
  }, [stage, currentWord, words.length]);

  // Generate random bubble positions and properties
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 20,
    distance: 150 + Math.random() * 100,
    size: 10 + Math.random() * 30,
    opacity: 0.2 + Math.random() * 0.6,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2,
  }));

  return (
    <div className='opening-animation'>
      {/* Background triangles */}
      <AnimatePresence>
        {stage === 'bubbles' && (
          <>
            <motion.div
              className='outline-triangle triangle-1'
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 0.3, rotate: 360 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.div
              className='outline-triangle triangle-2'
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 0.5, rotate: -360 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            <motion.div
              className='outline-triangle triangle-3'
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 0.4, rotate: 360 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Floating bubbles */}
      <AnimatePresence>
        {stage === 'bubbles' &&
          bubbles.map((bubble) => {
            const x = Math.cos(bubble.angle) * bubble.distance;
            const y = Math.sin(bubble.angle) * bubble.distance;

            return (
              <motion.div
                key={bubble.id}
                className='floating-bubble'
                initial={{
                  scale: 0,
                  opacity: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scale: [0, 1, 0.8, 1],
                  opacity: bubble.opacity,
                  x: [0, x * 0.5, x * 1.2, x],
                  y: [0, y * 0.5, y * 1.2, y],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: bubble.duration,
                  delay: bubble.delay,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
                style={{
                  width: bubble.size,
                  height: bubble.size,
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Main circle with transformation */}
      <motion.div
        className='main-circle'
        initial={{ scale: 0, filter: 'blur(20px)' }}
        animate={{
          scale: stage === 'circle-growing' ? 1 : 1,
          filter: stage === 'circle-growing' ? 'blur(20px)' : 'blur(0px)',
          borderRadius: stage === 'transforming' ? '20%' : '50%',
          rotate: stage === 'transforming' ? [0, 120, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.5, ease: 'easeOut' },
          filter: { duration: 0.5, ease: 'easeOut' },
          borderRadius: { duration: 0.5, ease: 'easeInOut' },
          rotate: { duration: 0.5, ease: 'easeInOut' },
        }}
      >
        {/* Words appearing */}
        <AnimatePresence mode='wait'>
          {stage !== 'circle-growing' && currentWord > 0 && (
            <motion.div
              key={currentWord}
              className='word'
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {words[currentWord - 1]}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OpeningAnimation;
