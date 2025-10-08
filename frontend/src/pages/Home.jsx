import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { ArrowRight, UtensilsCrossed, Star, Clock, MapPin, TrendingUp, Heart } from 'lucide-react'

function Home() {
  const featuredRestaurants = [
    {
      id: 1,
      name: "Tony's Pizza",
      cuisine: "Italian",
      rating: 4.8,
      deliveryTime: "25 min",
      distance: "0.5 km",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      priceRange: "$$",
      isOpen: true
    },
    {
      id: 2,
      name: "Burger Palace",
      cuisine: "American",
      rating: 4.6,
      deliveryTime: "20 min",
      distance: "0.8 km",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      priceRange: "$$",
      isOpen: true
    },
    {
      id: 3,
      name: "Sakura Sushi",
      cuisine: "Japanese",
      rating: 4.9,
      deliveryTime: "35 min",
      distance: "1.2 km",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      priceRange: "$$$",
      isOpen: true
    },
    {
      id: 4,
      name: "Spice Garden",
      cuisine: "Indian",
      rating: 4.7,
      deliveryTime: "30 min",
      distance: "1.0 km",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      priceRange: "$$",
      isOpen: false
    }
  ]

  const trendingDishes = [
    {
      id: 1,
      name: "Margherita Pizza",
      restaurant: "Tony's Pizza",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
      rating: 4.8,
      orders: 156
    },
    {
      id: 2,
      name: "Chicken Burger",
      restaurant: "Burger Palace",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
      rating: 4.6,
      orders: 89
    },
    {
      id: 3,
      name: "Salmon Sushi",
      restaurant: "Sakura Sushi",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
      rating: 4.9,
      orders: 67
    }
  ]

  const categories = [
    { name: "Pizza", icon: "🍕", count: 24 },
    { name: "Burger", icon: "🍔", count: 18 },
    { name: "Sushi", icon: "🍣", count: 12 },
    { name: "Pasta", icon: "🍝", count: 15 },
    { name: "Salad", icon: "🥗", count: 8 },
    { name: "Dessert", icon: "🍰", count: 20 }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Crave it. Tap it. Get it.
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Discover amazing restaurants and order your favorite food with just a few taps. 
            Fast delivery, great prices, and delicious meals await you.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <SearchBar />
        </motion.div>
      </section>

      {/* Categories */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold mb-6"
        >
          Browse by Category
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-white/60 text-sm">{category.count} restaurants</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl font-semibold">Featured Restaurants</h2>
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="p-0 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <div className="relative">
                  <div className="aspect-video bg-white/5">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                      <Heart size={16} className="text-white" />
                    </button>
                  </div>
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-red-500/80 text-white text-sm">
                        Closed
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <span className="text-sm text-white/60">{restaurant.priceRange}</span>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <Clock size={14} />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <MapPin size={14} />
                      <span>{restaurant.distance}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Dishes */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp size={24} />
            Trending Dishes
          </h2>
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white/5 overflow-hidden">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{dish.name}</h3>
                    <p className="text-white/70 text-sm mb-2">{dish.restaurant}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm">{dish.rating}</span>
                        <span className="text-white/60 text-sm">({dish.orders} orders)</span>
                      </div>
                      <span className="font-semibold">${dish.price}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <UtensilsCrossed size={16} />
                  Add to Cart
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <GlassCard className="p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their daily meals. 
            Fast delivery, fresh food, and great prices guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-semibold">
              Browse Restaurants
            </button>
            <button className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-semibold">
              Download App
            </button>
          </div>
        </GlassCard>
      </motion.section>
    </div>
  )
}

export default Home