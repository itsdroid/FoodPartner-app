import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Trash2, ShoppingBag, CreditCard, MapPin, Clock } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Pizza Margherita',
      restaurant: 'Tony\'s Pizza',
      price: 12.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      description: 'Classic Italian pizza with fresh mozzarella and basil'
    },
    {
      id: 2,
      name: 'Burger Deluxe',
      restaurant: 'Burger Palace',
      price: 15.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      description: 'Beef patty with cheese, lettuce, tomato, and special sauce'
    }
  ])

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '123 Main St, City, State',
    phone: '+1 234 567 8900',
    instructions: ''
  })

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 2.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const handleCheckout = () => {
    console.log('Proceeding to checkout with:', { cartItems, deliveryInfo, total })
    // TODO: Implement checkout logic
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-12 text-center">
          <ShoppingBag size={64} className="mx-auto mb-4 text-white/30" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-white/70 mb-6">Add some delicious food to get started!</p>
          <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
            Browse Restaurants
          </button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <GlassCard key={item.id} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white/5 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-white/70 text-sm">{item.restaurant}</p>
                    <p className="text-white/60 text-sm mt-1">{item.description}</p>
                    <p className="text-xl font-bold mt-2">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Delivery Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-white/70">Delivery Address</label>
                  <input
                    type="text"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">Phone Number</label>
                  <input
                    type="tel"
                    value={deliveryInfo.phone}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">Special Instructions</label>
                  <textarea
                    value={deliveryInfo.instructions}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                    rows={3}
                    placeholder="Any special delivery instructions..."
                  />
                </div>
              </div>
            </GlassCard>

            {/* Order Summary */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Payment Options */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Method
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <input type="radio" name="payment" value="card" defaultChecked className="w-4 h-4" />
                  <CreditCard size={20} />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <input type="radio" name="payment" value="cash" className="w-4 h-4" />
                  <span>💰</span>
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <input type="radio" name="payment" value="digital" className="w-4 h-4" />
                  <span>📱</span>
                  <span>Digital Wallet</span>
                </label>
              </div>
            </GlassCard>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Clock size={20} />
              Place Order - ${total.toFixed(2)}
            </button>

            {/* Delivery Time */}
            <div className="text-center text-white/70 text-sm">
              <Clock size={16} className="inline mr-2" />
              Estimated delivery time: 25-35 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart