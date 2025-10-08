import { useState, useEffect } from 'react'
import GlassCard from '../ui/GlassCard.jsx'
import { motion } from 'framer-motion'
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react'
import api from '../utils/api'

function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [categories] = useState([
    'All', 'Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Beverage', 'Appetizer'
  ])

  useEffect(() => {
    fetchFoodItems()
  }, [selectedCategory])

  const fetchFoodItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory)
      }

      const response = await api.get(`/food/explore?${params}`)
      setFoodItems(response.data.foodItems || [])
    } catch (error) {
      console.error('Error fetching food items:', error)
      setFoodItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await api.get(`/food/search?query=${encodeURIComponent(searchQuery)}`)
      setFoodItems(response.data.results || [])
    } catch (error) {
      console.error('Error searching food:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = foodItems.filter(item =>
    !searchQuery ||
    item.foodname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-2xl font-semibold"
      >
        Explore Food
      </motion.h2>

      {/* Search Bar */}
      <GlassCard className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for food items..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
          >
            Search
          </button>
        </div>
      </GlassCard>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${selectedCategory === category
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-5 overflow-hidden">
                <div className="aspect-video rounded-xl bg-white/5 mb-4 overflow-hidden">
                  <img
                    src={item.image || item.thumbnail}
                    alt={item.foodname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{item.foodname}</h3>
                    <p className="text-sm text-white/70">{item.foodPartner?.restaurant?.name || item.foodPartner?.name || 'Restaurant'}</p>
                  </div>

                  <p className="text-sm text-white/60 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm">{item.rating || 4.5}</span>
                    </div>
                    <span className="text-lg font-bold">${item.price}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span className="px-2 py-1 rounded-full bg-white/10">{item.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      25-30 min
                    </span>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token')
                        if (!token) {
                          window.location.href = '/auth'
                          return
                        }
                        await api.post(`/user/cart`, { foodId: item._id || item.id, quantity: 1 }, {
                          headers: { 'Authorization': `Bearer ${token}` }
                        })
                        alert('Added to cart')
                      } catch (err) {
                        console.error('Add to cart error:', err)
                        alert(err.response?.data?.message || 'Failed to add to cart')
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-white/70">No food items found. Try a different search or category.</p>
        </div>
      )}
    </div>
  )
}

export default Explore


