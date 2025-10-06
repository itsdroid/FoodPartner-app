import { useState } from 'react'
import GlassCard from '../ui/GlassCard.jsx'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ToggleLeft, ToggleRight } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Auth() {
  const [isLogin, setIsLogin] = useState(false)
  const [isPartner, setIsPartner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    try {
      const endpoint = isPartner ? "foodPartner/login" : "user/login"
      const response = await axios.post(`http://localhost:3000/${endpoint}`, {
        email: data.email,
        password: data.password
      })
      
      console.log('Login successful:', response.data)
      setSuccess('Login successful!')
      
      // Store user data if available
      const userData = response.data.user || response.data.foodPartner
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('userType', isPartner ? 'partner' : 'user')
        localStorage.setItem('token', response.data.token || 'logged-in')
      }
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/')
      }, 1000)
      
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message)
      setError(error.response?.data?.message || error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    try {
      const endpoint = isPartner ? "foodPartner/register" : "user/register"
      const response = await axios.post(`http://localhost:3000/${endpoint}`, {
        name: data.name,
        email: data.email,
        password: data.password,
        ...(isPartner && {
          contactName: data.contactName,
          phone: data.phone,
          address: data.address
        })
      })
      
      console.log('Registration successful:', response.data)
      setSuccess('Registration successful! Please login.')
      setIsLogin(true)
      
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message)
      setError(error.response?.data?.message || error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome to Zomato</h1>
        <p className="text-white/70">Sign in to your account or create a new one</p>
      </motion.div>

      {/* User Type Toggle */}
      <div className="flex justify-center mb-8">
        <GlassCard className="p-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPartner(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                !isPartner ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <User size={18} />
              <span>User</span>
            </button>
            <button
              onClick={() => setIsPartner(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isPartner ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <User size={18} />
              <span>Food Partner</span>
            </button>
          </div>
        </GlassCard>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center"
        >
          {success}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sign In Form */}
        <GlassCard className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {isPartner ? 'Partner Sign In' : 'User Sign In'}
            </h2>
            <p className="text-white/70 text-sm">Welcome back!</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all font-medium disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </GlassCard>

        {/* Sign Up Form */}
        <GlassCard className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {isPartner ? 'Partner Registration' : 'User Sign Up'}
            </h2>
            <p className="text-white/70 text-sm">
              {isPartner ? 'Join as a food partner' : 'Create your account'}
            </p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">
                {isPartner ? 'Restaurant Name' : 'Name'}
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  placeholder={isPartner ? "Enter restaurant name" : "Enter your name"}
                />
              </div>
            </div>

            {isPartner && (
              <div className="space-y-2">
                <label className="text-sm text-white/80">Contact Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    name="contactName"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>
            )}

            {isPartner && (
              <div className="space-y-2">
                <label className="text-sm text-white/80">Phone</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            )}

            {isPartner && (
              <div className="space-y-2">
                <label className="text-sm text-white/80">Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                    placeholder="Enter restaurant address"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-white/80">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all font-medium disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : (isPartner ? 'Register as Partner' : 'Sign Up')}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}

export default Auth