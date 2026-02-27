import { motion } from 'framer-motion';
import './ServiceCard.css';

const ServiceCard = ({ icon, title, description, delay = 0 }) => {
  const isImage = icon.startsWith('/') || icon.startsWith('http');

  return (
    <motion.div
      className='service-card'
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
    >
      <div className='service-icon'>
        {isImage ? (
          <img src={icon} alt={title} className='glass-icon' />
        ) : (
          <div className='glass-icon'>{icon}</div>
        )}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

export default ServiceCard;
