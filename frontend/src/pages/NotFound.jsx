import { NavLink } from 'react-router-dom'

function NotFound() {
  return (
    <div className="text-center space-y-4">
      <div className="text-6xl font-bold">404</div>
      <div className="text-white/70">This page could not be found.</div>
      <NavLink to="/" className="inline-block px-3 py-2 rounded-xl bg-white/10 border border-white/10">Go Home</NavLink>
    </div>
  )
}

export default NotFound


