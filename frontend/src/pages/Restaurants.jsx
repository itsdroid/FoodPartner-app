import { useEffect, useState } from 'react'
import GlassCard from '../ui/GlassCard.jsx'
import axios from 'axios'

function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:3000/restaurants')
        setRestaurants(response.data.restaurants || [])
      } catch (error) {
        console.error('Error fetching restaurants:', error)
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [])

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Restaurants</h2>

      {loading && (
        <div className="text-white/70">Loading restaurants...</div>
      )}

      {!loading && restaurants.length === 0 && (
        <div className="text-white/60">No restaurants found.</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && restaurants.map((r) => (
          <GlassCard key={r.id} className="p-5">
            {r.image ? (
              <img
                src={r.image}
                alt={r.name}
                className="h-32 w-full object-cover rounded-xl"
              />
            ) : (
              <div className="h-32 rounded-xl bg-gradient-to-br from-white/10 to-white/5" />
            )}
            <div className="mt-4">
              <div className="font-medium">{r.name || r.partnerName}</div>
              <div className="text-sm text-white/60">{r.cuisine || 'Cuisine'}</div>
              {r.location && (
                <div className="text-xs text-white/50 mt-1">{r.location}</div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default Restaurants


