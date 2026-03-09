import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovieDetails, clearCurrentItem } from '../store/moviesSlice'
import { addFavorite, removeFavorite } from '../store/favoritesSlice'
import { addToHistory } from '../store/historySlice'
import { openTrailer, showToast } from '../store/uiSlice'
import MovieCard from '../components/MovieCard'
import { Spinner } from '../components/Skeleton'
import { getImageUrl, getTrailerKey, formatDate, formatRuntime } from '../utils/tmdb'
import './DetailPage.css'

export default function DetailPage() {
  const { type, id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentItem, loading } = useSelector(s => s.movies)
  const { user } = useSelector(s => s.auth)
  const { items: favorites } = useSelector(s => s.favorites)

  const isFav = favorites.some(f => f.tmdbId === id)

  useEffect(() => {
    if (type && id) dispatch(fetchMovieDetails({ id, type }))
    return () => dispatch(clearCurrentItem())
  }, [type, id])

  useEffect(() => {
    if (currentItem && user) {
      dispatch(addToHistory({
        tmdbId: String(currentItem.id),
        mediaType: currentItem.mediaType || type,
        title: currentItem.title || currentItem.name || '',
        posterPath: currentItem.poster_path || '',
        overview: currentItem.overview || '',
        rating: currentItem.vote_average || 0,
        releaseDate: currentItem.release_date || currentItem.first_air_date || ''
      }))
    }
  }, [currentItem?.id])

  if (loading.details) return <div style={{ paddingTop: 80 }}><Spinner /></div>
  if (!currentItem) return null

  const title = currentItem.title || currentItem.name || 'Unknown'
  const date = currentItem.release_date || currentItem.first_air_date
  const trailerKey = getTrailerKey(currentItem.videos)

  const handleTrailer = () => {
    dispatch(openTrailer({ videoKey: trailerKey, title }))
  }

  const handleFav = () => {
    if (!user) { dispatch(showToast({ message: 'Sign in to save favorites', type: 'info' })); return }
    if (isFav) {
      dispatch(removeFavorite(id))
      dispatch(showToast({ message: 'Removed from favorites', type: 'info' }))
    } else {
      dispatch(addFavorite({
        tmdbId: id,
        mediaType: type,
        title,
        posterPath: currentItem.poster_path || '',
        overview: currentItem.overview || '',
        rating: currentItem.vote_average || 0,
        releaseDate: date
      }))
      dispatch(showToast({ message: 'Added to favorites!', type: 'success' }))
    }
  }

  return (
    <div className="detail-page fade-in">
      {/* Backdrop */}
      <div className="detail-backdrop">
        <img src={getImageUrl(currentItem.backdrop_path, 'original')} alt={title} onError={e => e.target.style.display = 'none'} />
        <div className="detail-backdrop-grad" />
      </div>

      <div className="container">
        <div className="detail-main">
          {/* Poster */}
          <div className="detail-poster">
            <img
              src={getImageUrl(currentItem.poster_path)}
              alt={title}
              onError={e => { e.target.src = ''; e.target.parentElement.classList.add('no-poster') }}
            />
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-genres">
              {currentItem.genres?.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
            </div>

            <h1 className="detail-title">{title}</h1>

            <div className="detail-meta">
              {currentItem.vote_average > 0 && (
                <span className="meta-rating">★ {currentItem.vote_average.toFixed(1)}</span>
              )}
              {date && <span>{formatDate(date)}</span>}
              {currentItem.runtime && <span>⏱ {formatRuntime(currentItem.runtime)}</span>}
              {currentItem.number_of_seasons && <span>📺 {currentItem.number_of_seasons} Season{currentItem.number_of_seasons !== 1 ? 's' : ''}</span>}
              {currentItem.status && <span className="meta-status">{currentItem.status}</span>}
            </div>

            <p className="detail-overview">{currentItem.overview || 'Description not available.'}</p>

            <div className="detail-actions">
              <button className="btn-trailer" onClick={handleTrailer}>
                ▶ {trailerKey ? 'Watch Trailer' : 'No Trailer Available'}
              </button>
              <button className={`btn-fav ${isFav ? 'active' : ''}`} onClick={handleFav}>
                {isFav ? '♥ Favorited' : '♡ Add to Favorites'}
              </button>
            </div>

            {/* Cast */}
            {currentItem.credits?.cast?.length > 0 && (
              <div className="detail-cast">
                <h3>Cast</h3>
                <div className="cast-list">
                  {currentItem.credits.cast.slice(0, 8).map(person => (
                    <Link to={`/person/${person.id}`} key={person.id} className="cast-item">
                      <div className="cast-avatar">
                        {person.profile_path ? (
                          <img src={getImageUrl(person.profile_path, 'w185')} alt={person.name} />
                        ) : (
                          <span>👤</span>
                        )}
                      </div>
                      <div className="cast-name">{person.name}</div>
                      <div className="cast-char">{person.character}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {currentItem.similar?.length > 0 && (
          <section className="detail-similar">
            <h2>More Like This</h2>
            <div className="movies-grid">
              {currentItem.similar.slice(0, 8).map(item => (
                <MovieCard key={item.id} item={item} type={type} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
