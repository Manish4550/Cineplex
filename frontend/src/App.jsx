import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe } from './store/authSlice'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import TrailerModal from './components/TrailerModal'
import Home from './pages/Home'
import MoviesPage from './pages/MoviesPage'
import TVPage from './pages/TVPage'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'
import PersonPage from './pages/PersonPage'
import FavoritesPage from './pages/FavoritesPage'
import HistoryPage from './pages/HistoryPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import NotFound from './pages/NotFound'

const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector(s => s.auth)
  if (!token) return <Navigate to="/login" />
  return children
}

const AdminRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth)
  if (user?.role !== 'admin') return <Navigate to="/" />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const { token } = useSelector(s => s.auth)
  const { toast } = useSelector(s => s.ui)
  const { trailerModal } = useSelector(s => s.ui)

  useEffect(() => {
    if (token) dispatch(fetchMe())
  }, [token])

  return (
    <Router>
      <Navbar />
      <main style={{ paddingTop: '72px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/:type/:id" element={<DetailPage />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminPage /></AdminRoute></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {toast && <Toast />}
      {trailerModal.open && <TrailerModal />}
    </Router>
  )
}
