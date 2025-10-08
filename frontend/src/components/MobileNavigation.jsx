import { motion } from 'framer-motion'
import { Home, Search, Video, Utensils, ShoppingCart, User, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authEvents } from '../utils/authEvents'

function MobileNavigation() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Listen for auth events and storage changes
  useEffect(() => {
    const handleAuthChange = (data) => {
      setUser(data.user)
    }

    const handleStorageChange = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
    }

    // Subscribe to auth events
    const unsubscribe = authEvents.subscribe(handleAuthChange)

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const userType = localStorage.getItem('userType')

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    localStorage.removeItem('token')
    setUser(null)

    // Emit auth event to update all components
    authEvents.emit({ user: null, userType: null })

    navigate('/auth')
  }

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Explore', icon: Search, path: '/explore' },
    { name: 'Videos', icon: Video, path: '/videos' },
    { name: 'Restaurants', icon: Utensils, path: '/restaurants' },
    { name: 'Cart', icon: ShoppingCart, path: '/cart' },
    ...(userType === 'partner' ? [
      { name: 'Dashboard', icon: User, path: '/partner-dashboard' }
    ] : []),
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
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive
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

        {/* Logout button for logged in users */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-white/60 hover:text-white hover:bg-white/10"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <LogOut size={20} />
            </motion.div>
            <span className="text-xs font-medium">Logout</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default MobileNavigation