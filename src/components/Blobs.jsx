import { motion } from 'framer-motion'
import './Blobs.css'

const Blobs = () => {
  return (
    <>
      <motion.div
        className="blob blob-1"
        animate={{
          borderRadius: [
            '40% 60% 70% 30% / 40% 50% 60% 50%',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '50% 40% 60% 40% / 40% 70% 50% 60%',
            '40% 60% 70% 30% / 40% 50% 60% 50%'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="blob blob-2"
        animate={{
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '40% 60% 70% 30% / 40% 50% 60% 50%',
            '50% 40% 60% 40% / 40% 70% 50% 60%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '60% 40% 30% 70% / 60% 30% 70% 40%'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5
        }}
      />
    </>
  )
}

export default Blobs
