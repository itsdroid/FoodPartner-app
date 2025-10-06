import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'
import { ArrowRight, UtensilsCrossed } from 'lucide-react'
import NavLinkButton from '../components/NavLinkButton.jsx'

function Home() {
  return (
    <div className="space-y-10">
      <section className="text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-semibold tracking-tight"
        >
          Crave it. Tap it. Get it.
        </motion.h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Discover nearby favorites and trending dishes with a modern, immersive UI.
        </p>
        <div className="flex items-center justify-center gap-3">
          <NavLinkButton to="/explore">Explore</NavLinkButton>
          <NavLinkButton to="/restaurants">Restaurants</NavLinkButton>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <GlassCard key={i} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/60">Featured</div>
                <div className="font-medium">Delicious Item</div>
              </div>
              <UtensilsCrossed className="text-white/50" size={20} />
            </div>
            <div className="h-36 mt-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5" />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-white/70">$—</span>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">
                Add <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>
        ))}
      </section>
    </div>
  )
}

export default Home


