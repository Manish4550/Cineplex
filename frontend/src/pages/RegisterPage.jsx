import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../store/authSlice'
import './AuthPage.css'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user } = useSelector(s => s.auth)
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  useEffect(() => {
    if (user) navigate('/')
    return () => dispatch(clearError())
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(form))
  }

  return (
    <div className="auth-page">
      <div className="auth-card scale-in">
        <div className="auth-logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">CINEPLEX</span>
        </div>
        <h1>Create Account</h1>
        <p className="auth-sub">Join CinePlex and discover your next favorite movie</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="moviefan123" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required minLength={3} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
