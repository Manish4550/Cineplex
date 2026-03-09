import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHistory, clearHistory } from '../store/historySlice'
import MovieCard from '../components/MovieCard'
import { Spinner } from '../components/Skeleton'
import { showToast } from '../store/uiSlice'
import './MoviesPage.css'
import './FavoritesPage.css'

export default function HistoryPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.history)

  useEffect(() => {
    dispatch(fetchHistory())
  }, [])

  const handleClear = () => {
    dispatch(clearHistory())
    dispatch(showToast({ message: 'Watch history cleared', type: 'info' }))
  }

  const normalized = items.map(h => ({
    id: h.tmdbId,
    title: h.title,
    name: h.title,
    poster_path: h.posterPath,
    vote_average: h.rating,
    release_date: h.releaseDate,
    media_type: h.mediaType
  }))

  return (
    <div className="history-page">
      <div className="container">
        <div className="page-header fade-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>🕐 Watch History</h1>
            <p>{items.length} recently watched</p>
          </div>
          {items.length > 0 && (
            <button onClick={handleClear} style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.3)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: 6
            }}>
              Clear All
            </button>
          )}
        </div>

        {loading && items.length === 0 && <Spinner />}

        {!loading && items.length === 0 && (
          <div className="empty-state">
            <span>🎬</span>
            <h2>No watch history</h2>
            <p>Movies you view or play trailers for will appear here</p>
          </div>
        )}

        {normalized.length > 0 && (
          <div className="movies-grid stagger-children">
            {normalized.map(item => (
              <MovieCard key={`${item.id}-${item.media_type}`} item={item} type={item.media_type || 'movie'} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
