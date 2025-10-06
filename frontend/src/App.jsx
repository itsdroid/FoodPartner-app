import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './layout/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import Restaurants from './pages/Restaurants.jsx'
import Cart from './pages/Cart.jsx'
import Auth from './pages/Auth.jsx'
import Partner from './pages/Partner.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}> 
        <Route index element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
 )
}

export default App
