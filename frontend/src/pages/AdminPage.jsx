import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import './AdminPage.css'

const TABS = ['Dashboard', 'Movies', 'Users']

export default function AdminPage() {
  const { user } = useSelector(s => s.auth)
  const [tab, setTab] = useState('Dashboard')
  const [stats, setStats] = useState(null)
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [movieForm, setMovieForm] = useState({ title: '', posterUrl: '', description: '', tmdbId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'movie', rating: '' })
  const [editingMovie, setEditingMovie] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(null)

  const notify = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    if (tab === 'Dashboard') loadStats()
    if (tab === 'Movies') loadMovies()
    if (tab === 'Users') loadUsers()
  }, [tab])

  const loadStats = async () => {
    try { const { data } = await api.get('/admin/stats'); setStats(data) } catch {}
  }

  const loadMovies = async () => {
    setLoading(true)
    try { const { data } = await api.get('/admin/movies'); setMovies(data.movies) } catch {}
    setLoading(false)
  }

  const loadUsers = async () => {
    setLoading(true)
    try { const { data } = await api.get('/admin/users'); setUsers(data.users) } catch {}
    setLoading(false)
  }

  const handleMovieSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...movieForm, genre: movieForm.genre.split(',').map(s => s.trim()).filter(Boolean) }
    try {
      if (editingMovie) {
        await api.put(`/admin/movies/${editingMovie._id}`, payload)
        notify('Movie updated!')
      } else {
        await api.post('/admin/movies', payload)
        notify('Movie added!')
      }
      setShowForm(false); setEditingMovie(null)
      setMovieForm({ title: '', posterUrl: '', description: '', tmdbId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'movie', rating: '' })
      loadMovies()
    } catch (err) {
      notify(err.response?.data?.message || 'Error saving movie', 'error')
    }
  }

  const deleteMovie = async (id) => {
    if (!confirm('Delete this movie?')) return
    try { await api.delete(`/admin/movies/${id}`); notify('Movie deleted'); loadMovies() } catch {}
  }

  const editMovie = (movie) => {
    setEditingMovie(movie)
    setMovieForm({ ...movie, genre: (movie.genre || []).join(', ') })
    setShowForm(true)
  }

  const toggleBan = async (userId) => {
    try { const { data } = await api.patch(`/admin/users/${userId}/ban`); notify(data.message); loadUsers() } catch {}
  }

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return
    try { await api.delete(`/admin/users/${userId}`); notify('User deleted'); loadUsers() } catch {}
  }

  return (
    <div className="admin-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <div className="container">
        <div className="admin-header fade-in">
          <h1>⚡ Admin Dashboard</h1>
          <p>Welcome back, <strong>{user?.username}</strong></p>
        </div>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* DASHBOARD */}
        {tab === 'Dashboard' && stats && (
          <div className="stats-grid fade-in">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Active Users', value: stats.activeUsers, icon: '✅' },
              { label: 'Banned Users', value: stats.bannedUsers, icon: '🚫' },
              { label: 'Custom Movies', value: stats.totalMovies, icon: '🎬' }
            ].map(s => (
              <div key={s.label} className="stat-card">
                <span className="stat-icon">{s.icon}</span>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* MOVIES */}
        {tab === 'Movies' && (
          <div className="admin-section fade-in">
            <div className="section-actions">
              <h2>Manage Movies</h2>
              <button className="btn-add" onClick={() => { setShowForm(!showForm); setEditingMovie(null); setMovieForm({ title: '', posterUrl: '', description: '', tmdbId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'movie', rating: '' }) }}>
                {showForm ? '✕ Cancel' : '+ Add Movie'}
              </button>
            </div>

            {showForm && (
              <form className="movie-form scale-in" onSubmit={handleMovieSubmit}>
                <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
                <div className="form-grid">
                  {[
                    { key: 'title', label: 'Movie Title *', placeholder: 'Inception', required: true },
                    { key: 'posterUrl', label: 'Poster Image URL', placeholder: 'https://...' },
                    { key: 'tmdbId', label: 'TMDB Movie ID', placeholder: '27205' },
                    { key: 'releaseDate', label: 'Release Date', placeholder: '2010-07-16', type: 'date' },
                    { key: 'trailerUrl', label: 'YouTube Trailer Key', placeholder: 'YoHD9XEInc0' },
                    { key: 'genre', label: 'Genres (comma-separated)', placeholder: 'Action, Sci-Fi' },
                    { key: 'rating', label: 'Rating (0-10)', placeholder: '8.8', type: 'number' },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label>{f.label}</label>
                      <input type={f.type || 'text'} placeholder={f.placeholder} required={f.required}
                        value={movieForm[f.key]} onChange={e => setMovieForm({ ...movieForm, [f.key]: e.target.value })} />
                    </div>
                  ))}

                  <div className="form-group">
                    <label>Category</label>
                    <select value={movieForm.category} onChange={e => setMovieForm({ ...movieForm, category: e.target.value })}>
                      {['movie', 'tv', 'anime', 'documentary', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea rows={3} placeholder="Movie description..." value={movieForm.description}
                      onChange={e => setMovieForm({ ...movieForm, description: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn-save">{editingMovie ? 'Save Changes' : 'Add Movie'}</button>
              </form>
            )}

            {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div> : (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Rating</th>
                      <th>Trailer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No custom movies yet</td></tr>
                    ) : movies.map(movie => (
                      <tr key={movie._id}>
                        <td>
                          <div className="movie-row">
                            {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="movie-thumb" onError={e => e.target.style.display = 'none'} />}
                            <div>
                              <div className="movie-row-title">{movie.title}</div>
                              <div className="movie-row-date">{movie.releaseDate}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge">{movie.category}</span></td>
                        <td><span className="rating-val">★ {movie.rating || '—'}</span></td>
                        <td>
                          {movie.trailerUrl ? (
                            <a href={`https://youtube.com/watch?v=${movie.trailerUrl}`} target="_blank" rel="noreferrer" className="trailer-link">▶ View</a>
                          ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>None</span>}
                        </td>
                        <td>
                          <div className="row-actions">
                            <button className="btn-edit" onClick={() => editMovie(movie)}>Edit</button>
                            <button className="btn-delete" onClick={() => deleteMovie(movie._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS */}
        {tab === 'Users' && (
          <div className="admin-section fade-in">
            <h2>Manage Users</h2>
            {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div> : (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className={u.isBanned ? 'banned-row' : ''}>
                        <td>
                          <div className="user-row">
                            <div className="user-avatar-sm">{u.username?.[0]?.toUpperCase()}</div>
                            <span>{u.username}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                        <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                        <td><span className={`status-badge ${u.isBanned ? 'banned' : 'active'}`}>{u.isBanned ? 'Banned' : 'Active'}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          {u.role !== 'admin' && (
                            <div className="row-actions">
                              <button className={u.isBanned ? 'btn-edit' : 'btn-ban'} onClick={() => toggleBan(u._id)}>
                                {u.isBanned ? 'Unban' : 'Ban'}
                              </button>
                              <button className="btn-delete" onClick={() => deleteUser(u._id)}>Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
