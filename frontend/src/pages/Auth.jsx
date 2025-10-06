import { useState } from 'react'
import GlassCard from '../ui/GlassCard.jsx'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react'
import axios from 'axios';


function Auth() {
  const [isLogin, setIsLogin] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    console.log('Login data:', data)

    
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    console.log('Register data:', data)

    axios.post("http://localhost:3000/foodPartner/register", {
        name: data.name,
        contactName: data.contactName,
        phone: data.phone,
        address: data.address,
        email: data.email,
        password: data.password
      })
      .then(response => {
        console.log('Registration successful:', response.data)
        alert('Registration successful!')
      })
      .catch(error => {
        console.error('Registration failed:', error.response?.data || error.message)
        alert('Registration failed: ' + (error.response?.data?.message || error.message))
      })
    }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to Zomato</h1>
        <p className="text-white/70">Sign in to your account or create a new one</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sign In Form */}
        <GlassCard className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
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
                  type="password"
                  name="password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all font-medium"
            >
              Sign In
            </button>
          </form>
        </GlassCard>

        {/* Sign Up Form */}
        <GlassCard className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>
            <p className="text-white/70 text-sm">Create your account</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Restaurant Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  placeholder="Enter restaurant name"
                />
              </div>
            </div>

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
                  type="password"
                  name="password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all font-medium"
            >
              Sign Up
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}

export default Auth


