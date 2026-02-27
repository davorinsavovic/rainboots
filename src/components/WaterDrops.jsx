import { motion } from 'framer-motion';
import './WaterDrops.css';

const WaterDrops = () => {
  const drops = Array.from({ length: 7 });

  return (
    <div className='water-drops'>
      {drops.map((_, index) => (
        <motion.div
          key={index}
          className='drop'
          initial={{ y: -100 }}
          animate={{ y: '100vh' }}
          transition={{
            duration: 3 + index * 0.3,
            repeat: Infinity,
            ease: 'linear',
            delay: index * 0.5,
          }}
          style={{
            left: `${10 + index * 12}%`,
          }}
        />
      ))}
    </div>
  );
};

export default WaterDrops;
