import { motion } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import './WaterDrops.css';

const WaterDrops = () => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(500);

  // 🔒 Generate stable random drops ONCE
  const drops = useMemo(() => {
    return Array.from({ length: 80 }).map(() => ({
      leftPos: 5 + Math.random() * 85,
      duration: 0.5 + Math.random() * 2,
      delay: Math.random() * 3,
      height: 22 + Math.random() * 28,
      width: 0.5 + Math.random() * 1,
      opacity: 0.3 + Math.random() * 0.4,
      splashSize: 8 + Math.random() * 12,
    }));
  }, []);

  // 📏 Track container height safely
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        if (height > 0) {
          setContainerHeight(height);
        }
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div className='water-drops' ref={containerRef}>
      {drops.map((drop, index) => (
        <motion.div
          key={`drop-${index}-${containerHeight}`} // 🔥 prevents animation sticking
          className='drop-container'
          style={{
            left: `${drop.leftPos}%`,
            position: 'absolute',
            top: 0,
            willChange: 'transform',
          }}
        >
          {/* Falling Drop */}
          <motion.div
            className='drop'
            initial={{
              y: -drop.height * 2,
              opacity: drop.opacity,
              scale: 1,
            }}
            animate={{
              y: containerHeight - drop.height,
              opacity: [drop.opacity, drop.opacity, 0],
              scale: [1, 1, 0.8],
            }}
            transition={{
              duration: drop.duration,
              times: [0, 0.9, 1],
              repeat: Infinity,
              ease: 'linear',
              delay: drop.delay,
              repeatDelay: 0.2,
            }}
            style={{
              height: `${drop.height}px`,
              width: `${drop.width}px`,
              position: 'absolute',
              top: 0,
              willChange: 'transform',
            }}
          />

          {/* Splash */}
          <motion.div
            className='splash'
            initial={{
              y: containerHeight - 10,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              y: containerHeight - 5,
              scale: [0, 1, 1.5, 0],
              opacity: [0, 0.6, 0.3, 0],
            }}
            transition={{
              duration: 0.4,
              times: [0, 0.3, 0.6, 1],
              repeat: Infinity,
              ease: 'easeOut',
              delay: drop.delay + drop.duration * 0.9,
              repeatDelay: 0.2,
            }}
            style={{
              width: `${drop.splashSize}px`,
              height: `${drop.splashSize / 3}px`,
              position: 'absolute',
              top: 0,
              willChange: 'transform',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default WaterDrops;
