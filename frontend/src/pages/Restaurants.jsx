import GlassCard from '../ui/GlassCard.jsx'

function Restaurants() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Restaurants</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <GlassCard key={i} className="p-5">
            <div className="h-32 rounded-xl bg-gradient-to-br from-white/10 to-white/5" />
            <div className="mt-4">
              <div className="font-medium">Restaurant</div>
              <div className="text-sm text-white/60">Cuisine</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default Restaurants


