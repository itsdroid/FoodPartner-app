import { motion } from 'framer-motion'
import { Home, Search, Video, Utensils, ShoppingCart, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

function MobileNavigation() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Explore', icon: Search, path: '/explore' },
    { name: 'Videos', icon: Video, path: '/videos' },
    { name: 'Restaurants', icon: Utensils, path: '/restaurants' },
    { name: 'Cart', icon: ShoppingCart, path: '/cart' },
    { name: user ? 'Profile' : 'Login', icon: User, path: user ? '/profile' : '/auth' }
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <item.icon size={20} />
            </motion.div>
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default MobileNavigation