import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Bell, User, Settings, LogOut } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'
import { useNavigate } from 'react-router-dom'
import { authEvents } from '../utils/authEvents'

function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    localStorage.removeItem('token')
    setUser(null)
    setIsProfileOpen(false)

    // Emit auth event to update all components
    authEvents.emit({ user: null, userType: null })

    navigate('/auth')
  }

  const menuItems = [
    { name: 'Home', icon: '🏠', path: '/' },
    { name: 'Explore', icon: '🔍', path: '/explore' },
    { name: 'Videos', icon: '📹', path: '/videos' },
    { name: 'Restaurants', icon: '🍽️', path: '/restaurants' },
    { name: 'Cart', icon: '🛒', path: '/cart' },
    { name: 'Profile', icon: '👤', path: '/profile' }
  ]

  const profileItems = [
    { name: 'My Orders', icon: '📋' },
    { name: 'Favorites', icon: '❤️' },
    { name: 'Settings', icon: '⚙️' },
    { name: 'Help', icon: '❓' },
    { name: 'Logout', icon: '🚪' }
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="text-xl font-bold text-white">
            Zomato
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
              <Search size={20} className="text-white" />
            </button>

            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all relative">
              <Bell size={20} className="text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <User size={20} className="text-white" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              {isMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 h-full bg-black/90 backdrop-blur-xl border-r border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <X size={20} className="text-white" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-lg">{item.name}</span>
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.name || 'Guest'}</p>
                      <p className="text-white/60 text-sm">{user?.email || 'Not logged in'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 z-50"
          >
            <GlassCard className="w-64 p-4">
              <div className="space-y-2">
                {profileItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={item.name === 'Logout' ? handleLogout : undefined}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all text-white text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileHeader
