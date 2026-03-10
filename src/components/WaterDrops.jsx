import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import './WaterDrops.css';

const WaterDrops = () => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(500);
  const drops = Array.from({ length: 80 }); // Fewer drops for performance with splash effects

  // Get the actual container height on mount and resize
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
      {drops.map((_, index) => {
        // Random values for natural variation
        const leftPos = 5 + Math.random() * 85;
        const duration = 0.5 + Math.random() * 2;
        const delay = Math.random() * 3;
        const height = 22 + Math.random() * 28;
        const width = 0.5 + Math.random() * 1;
        const opacity = 0.3 + Math.random() * 0.4;
        const splashSize = 8 + Math.random() * 12;

        return (
          <motion.div
            key={index}
            className='drop-container'
            style={{
              left: `${leftPos}%`,
              position: 'absolute',
              top: 0,
            }}
          >
            {/* The falling drop */}
            <motion.div
              className='drop'
              initial={{
                y: -height * 2,
                opacity: opacity,
                scale: 1,
              }}
              animate={{
                y: containerHeight - height,
                opacity: [opacity, opacity, 0],
                scale: [1, 1, 0.8],
              }}
              transition={{
                duration: duration,
                times: [0, 0.9, 1],
                repeat: Infinity,
                ease: 'linear',
                delay: delay,
                repeatDelay: 0.2,
              }}
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
                top: 0,
              }}
            />

            {/* Splash effect when drop hits bottom */}
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
                delay: delay + duration * 0.9,
                repeatDelay: 0.2,
              }}
              style={{
                width: `${splashSize}px`,
                height: `${splashSize / 3}px`,
                position: 'absolute',
                top: 0,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default WaterDrops;
