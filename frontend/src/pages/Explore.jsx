import GlassCard from '../ui/GlassCard.jsx'
import { motion } from 'framer-motion'

function Explore() {
  return (
    <div className="space-y-8">
      <motion.h2 initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.35}} className="text-2xl font-semibold">Explore</motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <GlassCard key={i} className="p-5">
            <div className="h-40 rounded-xl bg-gradient-to-br from-white/10 to-white/5" />
            <div className="mt-4">
              <div className="font-medium">Collection</div>
              <div className="text-sm text-white/60">Subtitle</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default Explore


