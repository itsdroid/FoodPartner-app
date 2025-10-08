import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Heart, Clock, Star, Edit, Camera, LogOut, ChefHat, Utensils } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState('user')
  const navigate = useNavigate()
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user')
    const userTypeData = localStorage.getItem('userType')
    
    if (userData) {
      setUser(JSON.parse(userData))
      setUserType(userTypeData || 'user')
    } else {
      // If no user data, redirect to auth
      navigate('/auth')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    localStorage.removeItem('token')
    navigate('/auth')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const orderHistory = [
    { id: 1, restaurant: 'Tony\'s Pizza', items: 'Pizza Margherita x2', total: 24.99, date: '2 days ago', status: 'Delivered' },
    { id: 2, restaurant: 'Burger Palace', items: 'Burger Combo', total: 18.50, date: '1 week ago', status: 'Delivered' },
    { id: 3, restaurant: 'Sakura Sushi', items: 'Sushi Platter', total: 35.00, date: '2 weeks ago', status: 'Delivered' }
  ]

  const favoriteRestaurants = [
    { id: 1, name: 'Tony\'s Pizza', rating: 4.8, cuisine: 'Italian', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop' },
    { id: 2, name: 'Burger Palace', rating: 4.6, cuisine: 'American', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop' },
    { id: 3, name: 'Sakura Sushi', rating: 4.9, cuisine: 'Japanese', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop' }
  ]

  const partnerStats = {
    totalOrders: 156,
    totalRevenue: 12500,
    averageRating: 4.8,
    totalFoods: 24
  }

  const tabs = userType === 'partner' ? [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'dashboard', name: 'Dashboard', icon: ChefHat },
    { id: 'orders', name: 'Orders', icon: Clock },
    { id: 'settings', name: 'Settings', icon: Settings }
  ] : [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'orders', name: 'Orders', icon: Clock },
    { id: 'favorites', name: 'Favorites', icon: Heart },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="relative h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative h-full flex items-end p-8">
          <div className="flex items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white/20 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                <Camera size={16} className="text-white" />
              </button>
            </div>
            <div className="text-white mb-4">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-white/80 mb-4">{user.email}</p>
              <div className="flex items-center gap-6 text-sm">
                {userType === 'partner' ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Utensils size={16} />
                      <span>{partnerStats.totalFoods} foods</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} />
                      <span>{partnerStats.averageRating} rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{partnerStats.totalOrders} orders</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>45 orders</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={16} />
                      <span>12 favorites</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} />
                      <span>$1250 spent</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-white/20 text-white' 
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm">Full Name</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-white/70 text-sm">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
              {userType === 'partner' && (
                <>
                  <div>
                    <label className="text-white/70 text-sm">Contact Name</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={user.contactName || ''}
                        readOnly
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                      />
                      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Phone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="tel"
                        value={user.phone || ''}
                        readOnly
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                      />
                      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={user.address || ''}
                        readOnly
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                      />
                      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Account Stats</h3>
            <div className="space-y-4">
              {userType === 'partner' ? (
                <>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/70">Total Orders</span>
                    <span className="text-xl font-bold">{partnerStats.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/70">Total Revenue</span>
                    <span className="text-xl font-bold">${partnerStats.totalRevenue}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/70">Average Rating</span>
                    <span className="text-xl font-bold">{partnerStats.averageRating}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/70">Total Foods</span>
                    <span className="text-xl font-bold">{partnerStats.totalFoods}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/70">Total Orders</span>
                    <span className="text-xl font-bold">45</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/70">Favorite Restaurants</span>
                    <span className="text-xl font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/70">Total Spent</span>
                    <span className="text-xl font-bold">$1250</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <span className="text-white/70">Member Since</span>
                    <span className="text-xl font-bold">Jan 2024</span>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Dashboard Tab (Partner only) */}
      {activeTab === 'dashboard' && userType === 'partner' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{partnerStats.totalOrders}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/20">
                  <Clock size={24} className="text-blue-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">${partnerStats.totalRevenue}</p>
                </div>
                <div className="p-3 rounded-full bg-green-500/20">
                  <Star size={24} className="text-green-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Average Rating</p>
                  <p className="text-2xl font-bold">{partnerStats.averageRating}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <Star size={24} className="text-yellow-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Foods</p>
                  <p className="text-2xl font-bold">{partnerStats.totalFoods}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Utensils size={24} className="text-purple-400" />
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/partner-dashboard')}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
            >
              Manage Foods
            </button>
            <button
              onClick={() => navigate('/partner-dashboard')}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
            >
              View Analytics
            </button>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orderHistory.map((order) => (
            <GlassCard key={order.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{order.restaurant}</h3>
                  <p className="text-white/70">{order.items}</p>
                  <p className="text-white/60 text-sm">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${order.total}</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'Preparing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Favorites Tab (User only) */}
      {activeTab === 'favorites' && userType === 'user' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRestaurants.map((restaurant) => (
            <GlassCard key={restaurant.id} className="p-6">
              <div className="aspect-video rounded-xl bg-white/5 mb-4 overflow-hidden">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
              <p className="text-white/70 text-sm mb-2">{restaurant.cuisine}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-sm">{restaurant.rating}</span>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm">
                  View Menu
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span>Order Updates</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-white/5 border border-white/10" />
              </label>
              <label className="flex items-center justify-between">
                <span>Promotional Emails</span>
                <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border border-white/10" />
              </label>
              <label className="flex items-center justify-between">
                <span>SMS Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-white/5 border border-white/10" />
              </label>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all text-red-400"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

export default Profile