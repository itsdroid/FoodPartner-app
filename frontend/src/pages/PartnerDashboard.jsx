import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, Star, Clock, DollarSign, Upload, X, Video, Image, Save, Building2, Hash, MapPin } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'
import axios from 'axios'

function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddFood, setShowAddFood] = useState(false)
  const [showAddReel, setShowAddReel] = useState(false)
  const [showRestaurantForm, setShowRestaurantForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [foodItems, setFoodItems] = useState([])
  const [partnerProfile, setPartnerProfile] = useState(null)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [newFood, setNewFood] = useState({
    foodname: '',
    description: '',
    price: '',
    category: '',
    ingredients: '',
    image: null,
    thumbnail: null,
    isAvailable: true
  })
  const [newReel, setNewReel] = useState({
    foodname: '',
    description: '',
    price: '',
    category: '',
    ingredients: '',
    video: null,
    thumbnail: null,
    hashtags: '',
    location: ''
  })
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    description: '',
    cuisine: '',
    location: ''
  })
  const [restaurantImage, setRestaurantImage] = useState(null)

  // Use real data from API or fallback to mock data
  const stats = dashboardStats || {
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalFoods: 0
  }

  // Fetch data from backend
  useEffect(() => {
    fetchFoodItems()
    fetchPartnerProfile()
    fetchDashboardStats()
    testAuth()
  }, [])

  const testAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Current token:', token)

      // Test partner auth specifically
      const partnerResponse = await axios.get('http://localhost:3000/test-partner-auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('Partner auth test response:', partnerResponse.data)

    } catch (error) {
      console.error('Partner auth test error:', error.response?.data || error.message)
    }
  }

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/food/items')
      setFoodItems(response.data.foodItems || [])
    } catch (error) {
      console.error('Error fetching food items:', error)
      // Mock data for testing
      setFoodItems([
        {
          id: 1,
          foodname: 'Pizza Margherita',
          price: 12.99,
          category: 'Pizza',
          rating: 4.8,
          orders: 45,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          isAvailable: true,
          description: 'Classic Italian pizza with fresh mozzarella and basil',
          ingredients: 'Fresh mozzarella, tomato sauce, basil, olive oil'
        },
        {
          id: 2,
          foodname: 'Burger Deluxe',
          price: 15.99,
          category: 'Burger',
          rating: 4.6,
          orders: 32,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
          isAvailable: true,
          description: 'Beef patty with cheese, lettuce, tomato, and special sauce',
          ingredients: 'Beef patty, cheese, lettuce, tomato, special sauce, bun'
        },
        {
          id: 3,
          foodname: 'Pasta Carbonara',
          price: 18.99,
          category: 'Pasta',
          rating: 4.9,
          orders: 28,
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
          isAvailable: false,
          description: 'Creamy pasta with eggs, cheese, and pancetta',
          ingredients: 'Pasta, eggs, parmesan cheese, pancetta, black pepper'
        }
      ])
    }
  }

  const fetchPartnerProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/foodPartner/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setPartnerProfile(response.data.foodPartner)
    } catch (error) {
      console.error('Error fetching partner profile:', error)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setDashboardStats(response.data.stats)
      setRecentOrders(response.data.recentOrders || [])
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Use mock data as fallback
      setDashboardStats({
        totalOrders: 156,
        totalRevenue: 12500,
        averageRating: 4.8,
        totalFoods: 24
      })
    }
  }

  const handleRestaurantRegistration = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('name', restaurantData.name)
      formData.append('description', restaurantData.description)
      formData.append('cuisine', restaurantData.cuisine)
      formData.append('location', restaurantData.location)
      if (restaurantImage) {
        formData.append('image', restaurantImage)
      }

      const response = await axios.post('http://localhost:3000/foodPartner/restaurant', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Restaurant registered successfully:', response.data)
      alert('Restaurant registered successfully!')
      setShowRestaurantForm(false)
      setRestaurantData({
        name: '',
        description: '',
        cuisine: '',
        location: ''
      })
      setRestaurantImage(null)
      fetchPartnerProfile() // Refresh profile
    } catch (error) {
      console.error('Error registering restaurant:', error)
      const errorMessage = error.response?.data?.message || 'Error registering restaurant. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFood = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!newFood.foodname.trim()) {
        alert('Food name is required')
        setLoading(false)
        return
      }

      if (!newFood.price || isNaN(parseFloat(newFood.price))) {
        alert('Please enter a valid price')
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append('foodname', newFood.foodname)
      formData.append('description', newFood.description)
      formData.append('price', parseFloat(newFood.price) || 0)
      formData.append('category', newFood.category)
      formData.append('ingredients', newFood.ingredients)
      formData.append('isAvailable', newFood.isAvailable)
      formData.append('mediaType', 'image')
      if (newFood.thumbnail) {
        formData.append('thumbnail', newFood.thumbnail)
      }

      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:3000/food/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Food added successfully:', response.data)
      alert('Food item added successfully!')
      setShowAddFood(false)
      setNewFood({
        foodname: '',
        description: '',
        price: '',
        category: '',
        ingredients: '',
        image: null,
        thumbnail: null,
        isAvailable: true
      })
      fetchFoodItems() // Refresh the list
    } catch (error) {
      console.error('Error adding food:', error)
      const errorMessage = error.response?.data?.message || 'Error adding food item. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // No image upload for food; only thumbnail

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewFood(prev => ({ ...prev, thumbnail: file }))
    }
  }

  const handleAddReel = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!newReel.foodname.trim()) {
        alert('Food name is required')
        setLoading(false)
        return
      }

      if (!newReel.price || isNaN(parseFloat(newReel.price))) {
        alert('Please enter a valid price')
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append('foodname', newReel.foodname)
      formData.append('description', newReel.description)
      formData.append('price', parseFloat(newReel.price) || 0)
      formData.append('category', newReel.category)
      formData.append('ingredients', newReel.ingredients)
      formData.append('hashtags', newReel.hashtags)
      formData.append('location', newReel.location)

      if (newReel.video) {
        formData.append('video', newReel.video)
      }
      if (newReel.thumbnail) {
        formData.append('thumbnail', newReel.thumbnail)
      }

      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:3000/food/reels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Food reel added successfully:', response.data)
      setShowAddReel(false)
      setNewReel({
        foodname: '',
        description: '',
        price: '',
        category: '',
        ingredients: '',
        video: null,
        thumbnail: null,
        hashtags: '',
        location: ''
      })
      fetchFoodItems() // Refresh the list
    } catch (error) {
      console.error('Error adding food reel:', error)
      alert('Error adding food reel. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:3000/food/${foodId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        fetchFoodItems() // Refresh the list
      } catch (error) {
        console.error('Error deleting food:', error)
        alert('Error deleting food item.')
      }
    }
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'restaurant', name: 'Restaurant', icon: '🏪' },
    { id: 'foods', name: 'My Foods', icon: '🍽️' },
    { id: 'reels', name: 'Food Reels', icon: '🎬' },
    { id: 'orders', name: 'Orders', icon: '📋' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Partner Dashboard</h1>
            <p className="text-white/70">
              {partnerProfile?.restaurant?.isRegistered
                ? `Managing ${partnerProfile.restaurant.name}`
                : 'Register your restaurant to get started'
              }
            </p>
          </div>
          <div className="flex gap-3">
            {!partnerProfile?.restaurant?.isRegistered && (
              <button
                onClick={() => setShowRestaurantForm(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
              >
                <Building2 size={20} />
                Register Restaurant
              </button>
            )}
            <button
              onClick={() => setShowAddFood(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
            >
              <Plus size={20} />
              Add Food Item
            </button>
            <button
              onClick={() => setShowAddReel(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
            >
              <Video size={20} />
              Add Reel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
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
                    <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-500/20">
                    <DollarSign size={24} className="text-green-400" />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Average Rating</p>
                    <p className="text-2xl font-bold">{stats.averageRating}</p>
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
                    <p className="text-2xl font-bold">{foodItems.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <Plus size={24} className="text-purple-400" />
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Recent Orders */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div>
                        <p className="font-medium">{order.user?.name || 'Customer'}</p>
                        <p className="text-white/70 text-sm">
                          {order.items?.map(item => `${item.foodItem?.foodname} x${item.quantity}`).join(', ') || 'Items'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.totalAmount}</p>
                        <p className={`text-sm ${order.status === 'delivered' ? 'text-green-400' :
                          order.status === 'preparing' ? 'text-yellow-400' :
                            order.status === 'pending' ? 'text-orange-400' :
                              'text-blue-400'
                          }`}>{order.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <p>No recent orders</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Restaurant Tab */}
        {activeTab === 'restaurant' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Restaurant Management</h2>

            {partnerProfile?.restaurant?.isRegistered ? (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Restaurant Information</h3>
                  <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                    <Edit size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white/70 text-sm">Restaurant Name</label>
                    <p className="text-lg font-medium">{partnerProfile.restaurant.name}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Cuisine Type</label>
                    <p className="text-lg font-medium">{partnerProfile.restaurant.cuisine}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Location</label>
                    <p className="text-lg font-medium">{partnerProfile.restaurant.location}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Registration Date</label>
                    <p className="text-lg font-medium">
                      {new Date(partnerProfile.restaurant.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-white/70 text-sm">Description</label>
                    <p className="text-lg font-medium">{partnerProfile.restaurant.description}</p>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-6 text-center">
                <Building2 size={64} className="mx-auto mb-4 text-white/50" />
                <h3 className="text-xl font-semibold mb-2">No Restaurant Registered</h3>
                <p className="text-white/70 mb-6">Register your restaurant to start adding food items and reels</p>
                <button
                  onClick={() => setShowRestaurantForm(true)}
                  className="px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                >
                  Register Restaurant
                </button>
              </GlassCard>
            )}
          </div>
        )}

        {/* Foods Tab */}
        {activeTab === 'foods' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Food Items</h2>
              <button
                onClick={() => setShowAddFood(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
              >
                <Plus size={18} />
                Add Food
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.map((food) => (
                <GlassCard key={food.id} className="p-6">
                  <div className="aspect-video rounded-xl bg-white/5 mb-4 overflow-hidden">
                    <img src={food.image} alt={food.foodname} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{food.foodname}</h3>
                  <p className="text-white/70 text-sm mb-2">{food.category}</p>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{food.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">${food.price}</span>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm">{food.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${food.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                      {food.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="text-white/60 text-sm">{food.orders} orders</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="flex-1 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="flex-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                      <Eye size={16} />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Reels Tab */}
        {activeTab === 'reels' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Food Reels</h2>
              <button
                onClick={() => setShowAddReel(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
              >
                <Video size={18} />
                Add Reel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems.filter(food => food.isReel).map((reel) => (
                <GlassCard key={reel.id} className="p-6">
                  <div className="aspect-video rounded-xl bg-white/5 mb-4 overflow-hidden">
                    <video
                      src={reel.video}
                      className="w-full h-full object-cover"
                      poster={reel.thumbnail}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{reel.foodname}</h3>
                  <p className="text-white/70 text-sm mb-2">{reel.category}</p>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{reel.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">${reel.price}</span>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm">{reel.likes || 0}</span>
                    </div>
                  </div>

                  {reel.reelData?.hashtags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {reel.reelData.hashtags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteFood(reel.id)}
                      className="flex-1 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="flex-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                      <Eye size={16} />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Add New Food Item</h2>
                <button
                  onClick={() => setShowAddFood(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddFood} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Food Name *</label>
                    <input
                      type="text"
                      value={newFood.foodname}
                      onChange={(e) => setNewFood(prev => ({ ...prev, foodname: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Enter food name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newFood.price}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                          setNewFood(prev => ({ ...prev, price: value }))
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Enter price (e.g., 12.99)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Category *</label>
                    <select
                      value={newFood.category}
                      onChange={(e) => setNewFood(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Burger">Burger</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Salad">Salad</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Appetizer">Appetizer</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Availability</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFood.isAvailable}
                          onChange={(e) => setNewFood(prev => ({ ...prev, isAvailable: e.target.checked }))}
                          className="w-4 h-4 rounded bg-white/5 border border-white/10"
                        />
                        <span className="text-white/80">Available for order</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/80">Description *</label>
                  <textarea
                    value={newFood.description}
                    onChange={(e) => setNewFood(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                    placeholder="Enter food description"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/80">Ingredients *</label>
                  <textarea
                    value={newFood.ingredients}
                    onChange={(e) => setNewFood(prev => ({ ...prev, ingredients: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                    placeholder="Enter ingredients (comma separated)"
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Thumbnail Image *</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="image-upload"
                        required
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Image size={20} />
                        Choose Thumbnail
                      </label>
                      {newFood.thumbnail && (
                        <span className="text-white/70 text-sm">{newFood.thumbnail.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Thumbnail Image</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Image size={20} />
                        Choose Thumbnail
                      </label>
                      {newFood.thumbnail && (
                        <span className="text-white/70 text-sm">{newFood.thumbnail.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddFood(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Add Food Item
                      </>
                    )}
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* Restaurant Registration Modal */}
      {showRestaurantForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Register Restaurant</h2>
                <button
                  onClick={() => setShowRestaurantForm(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleRestaurantRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Restaurant Name *</label>
                    <input
                      type="text"
                      value={restaurantData.name}
                      onChange={(e) => setRestaurantData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Enter restaurant name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Cuisine Type *</label>
                    <select
                      value={restaurantData.cuisine}
                      onChange={(e) => setRestaurantData(prev => ({ ...prev, cuisine: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                      required
                    >
                      <option value="">Select cuisine</option>
                      <option value="Italian">Italian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Indian">Indian</option>
                      <option value="Mexican">Mexican</option>
                      <option value="American">American</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Thai">Thai</option>
                      <option value="Mediterranean">Mediterranean</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-white/80">Location *</label>
                    <input
                      type="text"
                      value={restaurantData.location}
                      onChange={(e) => setRestaurantData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Enter restaurant location/address"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-white/80">Description *</label>
                    <textarea
                      value={restaurantData.description}
                      onChange={(e) => setRestaurantData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Describe your restaurant"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-white/80">Restaurant Image</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setRestaurantImage(e.target.files?.[0] || null)}
                        className="hidden"
                        id="restaurant-image-upload"
                      />
                      <label
                        htmlFor="restaurant-image-upload"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Image size={20} />
                        Choose Image
                      </label>
                      {restaurantImage && (
                        <span className="text-white/70 text-sm">{restaurantImage.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowRestaurantForm(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Building2 size={18} />
                        Register Restaurant
                      </>
                    )}
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* Add Reel Modal */}
      {showAddReel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Add Food Reel</h2>
                <button
                  onClick={() => setShowAddReel(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddReel} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Food Name *</label>
                    <input
                      type="text"
                      value={newReel.foodname}
                      onChange={(e) => setNewReel(prev => ({ ...prev, foodname: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Enter food name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newReel.price}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                          setNewReel(prev => ({ ...prev, price: value }))
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Enter price (e.g., 12.99)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Category *</label>
                    <select
                      value={newReel.category}
                      onChange={(e) => setNewReel(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Burger">Burger</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Salad">Salad</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Appetizer">Appetizer</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Location</label>
                    <input
                      type="text"
                      value={newReel.location}
                      onChange={(e) => setNewReel(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/80">Description *</label>
                  <textarea
                    value={newReel.description}
                    onChange={(e) => setNewReel(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                    placeholder="Enter food description"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/80">Ingredients *</label>
                  <textarea
                    value={newReel.ingredients}
                    onChange={(e) => setNewReel(prev => ({ ...prev, ingredients: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                    placeholder="Enter ingredients (comma separated)"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/80">Hashtags</label>
                  <input
                    type="text"
                    value={newReel.hashtags}
                    onChange={(e) => setNewReel(prev => ({ ...prev, hashtags: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                    placeholder="Enter hashtags (comma separated)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Reel Video *</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setNewReel(prev => ({ ...prev, video: e.target.files[0] }))}
                        className="hidden"
                        id="reel-video-upload"
                        required
                      />
                      <label
                        htmlFor="reel-video-upload"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Video size={20} />
                        Choose Video
                      </label>
                      {newReel.video && (
                        <span className="text-white/70 text-sm">{newReel.video.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Thumbnail Image</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewReel(prev => ({ ...prev, thumbnail: e.target.files[0] }))}
                        className="hidden"
                        id="reel-thumbnail-upload"
                        required
                      />
                      <label
                        htmlFor="reel-thumbnail-upload"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Image size={20} />
                        Choose Thumbnail
                      </label>
                      {newReel.thumbnail && (
                        <span className="text-white/70 text-sm">{newReel.thumbnail.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddReel(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Video size={18} />
                        Add Food Reel
                      </>
                    )}
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default PartnerDashboard