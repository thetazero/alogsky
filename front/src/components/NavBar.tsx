import { Link, useLocation } from 'react-router-dom'

export function NavBar() {
  const location = useLocation()

  const linkClass = (path: string) => {
    const isActive = location.pathname === path
    return `px-4 py-2 rounded transition-colors ${
      isActive
        ? 'bg-blue-600 text-white font-semibold'
        : 'text-gray-300 hover:text-white hover:bg-level-1'
    }`
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-level-2 border-b border-gray-700 z-50">
      <div className="flex gap-2 px-6 py-3">
        <Link to="/" className={linkClass('/')}>
          Legacy
        </Link>
        <Link to="/new" className={linkClass('/new')}>
          Overview
        </Link>
        <Link to="/plan" className={linkClass('/plan')}>
          Plan
        </Link>
      </div>
    </nav>
  )
}
