import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addFavorite, removeFavorite } from '../store/favoritesSlice'
import { showToast } from '../store/uiSlice'
import { getImageUrl, formatYear } from '../utils/tmdb'
import './MovieCard.css'

export default function MovieCard({ item, type = 'movie' }) {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { items: favorites } = useSelector(s => s.favorites)
  const [imgErr, setImgErr] = useState(false)

  const mediaType = item.media_type || type
  const title = item.title || item.name || 'Unknown Title'
  const date = item.release_date || item.first_air_date || ''
  const rating = item.vote_average?.toFixed(1) || 'N/A'
  const poster = item.poster_path && !imgErr ? getImageUrl(item.poster_path) : null
  const isFav = favorites.some(f => f.tmdbId === String(item.id))
  const linkTo = mediaType === 'person' ? `/person/${item.id}` : `/${mediaType}/${item.id}`

  const toggleFav = (e) => {
    e.preventDefault()
    if (!user) { dispatch(showToast({ message: 'Sign in to save favorites', type: 'info' })); return }
    if (isFav) {
      dispatch(removeFavorite(String(item.id)))
      dispatch(showToast({ message: 'Removed from favorites', type: 'info' }))
    } else {
      dispatch(addFavorite({
        tmdbId: String(item.id),
        mediaType,
        title,
        posterPath: item.poster_path || item.profile_path || '',
        overview: item.overview || '',
        rating: item.vote_average || 0,
        releaseDate: date
      }))
      dispatch(showToast({ message: 'Added to favorites!', type: 'success' }))
    }
  }

  return (
    <Link to={linkTo} className="movie-card">
      <div className="card-poster">
        {poster ? (
          <img src={poster} alt={title} loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <div className="poster-placeholder">
            <span>🎬</span>
            <p>{title}</p>
          </div>
        )}
        <div className="card-overlay">
          <div className="card-actions">
            {mediaType !== 'person' && (
              <button className={`fav-btn ${isFav ? 'active' : ''}`} onClick={toggleFav} title={isFav ? 'Remove favorite' : 'Add to favorites'}>
                {isFav ? '♥' : '♡'}
              </button>
            )}
          </div>
        </div>
        {rating !== 'N/A' && (
          <div className="card-rating">
            <span className="star">★</span> {rating}
          </div>
        )}
      </div>
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        <div className="card-meta">
          {date && <span className="card-year">{formatYear(date)}</span>}
          <span className={`card-type ${mediaType}`}>{mediaType === 'tv' ? 'TV' : mediaType === 'person' ? 'Person' : 'Movie'}</span>
        </div>
      </div>
    </Link>
  )
}
