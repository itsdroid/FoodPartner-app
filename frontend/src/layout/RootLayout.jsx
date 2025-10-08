import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Search, UserRound, ChefHat, Video, Home, Utensils, LogOut } from 'lucide-react'
import FogBackground from '../ui/FogBackground.jsx'
import MobileHeader from '../components/MobileHeader.jsx'
import MobileNavigation from '../components/MobileNavigation.jsx'
import { useState, useEffect } from 'react'
import { authEvents } from '../utils/authEvents'

function RootLayout() {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState('user')
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const userTypeData = localStorage.getItem('userType')

    if (userData) {
      setUser(JSON.parse(userData))
      setUserType(userTypeData || 'user')
    }
  }, [])

  // Listen for auth events and storage changes
  useEffect(() => {
    const handleAuthChange = (data) => {
      setUser(data.user)
      setUserType(data.userType || 'user')
    }

    const handleStorageChange = () => {
      const userData = localStorage.getItem('user')
      const userTypeData = localStorage.getItem('userType')

      if (userData) {
        setUser(JSON.parse(userData))
        setUserType(userTypeData || 'user')
      } else {
        setUser(null)
        setUserType('user')
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
    setUserType('user')

    // Emit auth event to update all components
    authEvents.emit({ user: null, userType: null })

    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
      <FogBackground />

      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 inset-x-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl">
            <NavLink to="/" className="font-semibold tracking-tight text-white/90 text-lg">
              Zomato UI
            </NavLink>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <NavLink to="/explore" className={({ isActive }) => `hover:text-white/90 ${isActive ? 'text-white' : 'text-white/70'}`}>Explore</NavLink>
              <NavLink to="/restaurants" className={({ isActive }) => `hover:text-white/90 ${isActive ? 'text-white' : 'text-white/70'}`}>Restaurants</NavLink>
              <NavLink to="/videos" className={({ isActive }) => `hover:text-white/90 ${isActive ? 'text-white' : 'text-white/70'}`}>Videos</NavLink>
              {userType === 'partner' && (
                <NavLink to="/partner-dashboard" className={({ isActive }) => `hover:text-white/90 ${isActive ? 'text-white' : 'text-white/70'}`}>Dashboard</NavLink>
              )}
              <NavLink to="/partner" className={({ isActive }) => `hover:text-white/90 ${isActive ? 'text-white' : 'text-white/70'}`}>Partner</NavLink>
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <Search size={16} />
                <span className="text-xs">Search</span>
              </button>
              <NavLink to="/cart" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                <ShoppingCart size={18} />
              </NavLink>
              {user ? (
                <>
                  <NavLink to="/profile" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                    <UserRound size={18} />
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <NavLink to="/auth" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                  <UserRound size={18} />
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <MobileHeader />

      <main className="pt-20 lg:pt-28 pb-20 lg:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mx-auto max-w-7xl px-4"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Desktop Footer */}
      <footer className="hidden lg:block border-t border-white/10 py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between text-xs text-white/60">
          <span>© 2025 Zomato UI</span>
          <span className="flex items-center gap-2"><ChefHat size={14} /> Crafted UI</span>
        </div>
      </footer>
    </div>
  )
}

export default RootLayout