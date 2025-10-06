import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Filter, MapPin, Clock, Star } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    cuisine: '',
    priceRange: '',
    rating: '',
    deliveryTime: ''
  })

  const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'American']
  const priceRanges = ['$', '$$', '$$$', '$$$$']
  const ratings = ['4.5+', '4.0+', '3.5+', '3.0+']
  const deliveryTimes = ['Under 30 min', '30-45 min', '45-60 min', '60+ min']

  const searchResults = [
    {
      id: 1,
      name: 'Tony\'s Pizza',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: '25 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      distance: '0.5 km'
    },
    {
      id: 2,
      name: 'Burger Palace',
      cuisine: 'American',
      rating: 4.6,
      deliveryTime: '20 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      distance: '0.8 km'
    },
    {
      id: 3,
      name: 'Sakura Sushi',
      cuisine: 'Japanese',
      rating: 4.9,
      deliveryTime: '35 min',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
      distance: '1.2 km'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery, 'with filters:', filters)
    // TODO: Implement search logic
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
        <input
          type="text"
          placeholder="Search for restaurants, cuisines, or dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-all"
          >
            <X size={16} className="text-white/50" />
          </button>
        )}
      </div>

      {/* Search Results & Filters */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <GlassCard className="p-6 max-h-96 overflow-y-auto">
              {/* Filters */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">Cuisine</label>
                    <select
                      value={filters.cuisine}
                      onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                    >
                      <option value="">All Cuisines</option>
                      {cuisines.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-white/70 mb-2 block">Price Range</label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                    >
                      <option value="">Any Price</option>
                      {priceRanges.map(price => (
                        <option key={price} value={price}>{price}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-white/70 mb-2 block">Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                    >
                      <option value="">Any Rating</option>
                      {ratings.map(rating => (
                        <option key={rating} value={rating}>{rating}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-white/70 mb-2 block">Delivery Time</label>
                    <select
                      value={filters.deliveryTime}
                      onChange={(e) => setFilters(prev => ({ ...prev, deliveryTime: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                    >
                      <option value="">Any Time</option>
                      {deliveryTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                {searchResults.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{restaurant.name}</h4>
                      <p className="text-white/70 text-sm">{restaurant.cuisine}</p>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span>{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{restaurant.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{restaurant.priceRange}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search Button */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSearch}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-medium"
                >
                  Search
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
