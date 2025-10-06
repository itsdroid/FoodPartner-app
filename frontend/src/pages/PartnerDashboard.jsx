import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, Star, Clock, DollarSign, Upload, X, Video, Image, Save } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'
import axios from 'axios'

function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddFood, setShowAddFood] = useState(false)
  const [loading, setLoading] = useState(false)
  const [foodItems, setFoodItems] = useState([])
  const [newFood, setNewFood] = useState({
    foodname: '',
    description: '',
    price: '',
    category: '',
    ingredients: '',
    video: null,
    thumbnail: null,
    isAvailable: true
  })

  // Mock data for partner dashboard
  const stats = {
    totalOrders: 156,
    totalRevenue: 12500,
    averageRating: 4.8,
    totalFoods: 24
  }

  const recentOrders = [
    { id: 1, customer: 'John Doe', items: 'Pizza Margherita x2', total: 24.99, status: 'Delivered', time: '2 hours ago' },
    { id: 2, customer: 'Jane Smith', items: 'Burger Combo', total: 18.50, status: 'Preparing', time: '1 hour ago' },
    { id: 3, customer: 'Mike Johnson', items: 'Pasta Carbonara', total: 22.00, status: 'Out for delivery', time: '30 mins ago' }
  ]

  // Fetch food items from backend
  useEffect(() => {
    fetchFoodItems()
  }, [])

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

  const handleAddFood = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('foodname', newFood.foodname)
      formData.append('description', newFood.description)
      formData.append('price', newFood.price)
      formData.append('category', newFood.category)
      formData.append('ingredients', newFood.ingredients)
      formData.append('isAvailable', newFood.isAvailable)
      
      if (newFood.video) {
        formData.append('video', newFood.video)
      }
      if (newFood.thumbnail) {
        formData.append('thumbnail', newFood.thumbnail)
      }

      const response = await axios.post('http://localhost:3000/food/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('Food added successfully:', response.data)
      setShowAddFood(false)
      setNewFood({
        foodname: '',
        description: '',
        price: '',
        category: '',
        ingredients: '',
        video: null,
        thumbnail: null,
        isAvailable: true
      })
      fetchFoodItems() // Refresh the list
    } catch (error) {
      console.error('Error adding food:', error)
      alert('Error adding food item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewFood(prev => ({ ...prev, video: file }))
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewFood(prev => ({ ...prev, thumbnail: file }))
    }
  }

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`http://localhost:3000/food/${foodId}`)
        fetchFoodItems() // Refresh the list
      } catch (error) {
        console.error('Error deleting food:', error)
        alert('Error deleting food item.')
      }
    }
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'foods', name: 'My Foods', icon: '🍽️' },
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
            <p className="text-white/70">Manage your restaurant and food items</p>
          </div>
          <button
            onClick={() => setShowAddFood(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
          >
            <Plus size={20} />
            Add New Food
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
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
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-white/70 text-sm">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <p className={`text-sm ${
                        order.status === 'Delivered' ? 'text-green-400' :
                        order.status === 'Preparing' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
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
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      food.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
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
                      value={newFood.price}
                      onChange={(e) => setNewFood(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                      placeholder="Enter price"
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
                    <label className="text-sm text-white/80">Food Video *</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        id="video-upload"
                        required
                      />
                      <label
                        htmlFor="video-upload"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Video size={20} />
                        Choose Video
                      </label>
                      {newFood.video && (
                        <span className="text-white/70 text-sm">{newFood.video.name}</span>
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
    </div>
  )
}

export default PartnerDashboard