import { useMemo } from 'react'
import { motion } from 'framer-motion'

function FogBlob({ delay = 0, size = 400, color = 'rgba(255,255,255,0.06)' }) {
  const style = useMemo(() => ({
    width: size,
    height: size,
    background: `radial-gradient(circle at 30% 30%, ${color}, transparent 60%)`,
  }), [size, color])

  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={style}
      initial={{ opacity: 0.2, x: 0, y: 0 }}
      animate={{ opacity: 0.5, x: [0, 40, -20, 0], y: [0, -20, 30, 0] }}
      transition={{ duration: 20, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function FogBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,rgba(99,102,241,0.12),transparent),radial-gradient(900px_500px_at_110%_-10%,rgba(16,185,129,0.10),transparent),radial-gradient(1200px_700px_at_50%_120%,rgba(244,114,182,0.10),transparent)]" />
      <FogBlob delay={0} size={520} color="rgba(99,102,241,0.10)" />
      <FogBlob delay={5} size={420} color="rgba(16,185,129,0.08)" />
      <FogBlob delay={10} size={560} color="rgba(244,114,182,0.08)" />
    </div>
  )
}

export default FogBackground


