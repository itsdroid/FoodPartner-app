import { motion } from 'framer-motion'

function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard


