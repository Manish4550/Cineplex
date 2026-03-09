import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import './Navbar.css'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(s => s.auth)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">CINEPLEX</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/movies" className={isActive('/movies') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link to="/tv" className={isActive('/tv') ? 'active' : ''} onClick={() => setMenuOpen(false)}>TV Shows</Link>
          {user && <Link to="/favorites" className={isActive('/favorites') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Favorites</Link>}
          {user && <Link to="/history" className={isActive('/history') ? 'active' : ''} onClick={() => setMenuOpen(false)}>History</Link>}
          {user?.role === 'admin' && <Link to="/admin" className={`admin-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Admin</Link>}
        </div>

        <div className="nav-right">
          <form onSubmit={handleSearch} className="nav-search">
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit">⌕</button>
          </form>

          {user ? (
            <div className="nav-user">
              <div className="user-avatar">{user.username?.[0]?.toUpperCase()}</div>
              <div className="user-menu">
                <span className="user-name">{user.username}</span>
                <button className="logout-btn" onClick={() => { dispatch(logout()); navigate('/') }}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-gold">Join Free</Link>
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
