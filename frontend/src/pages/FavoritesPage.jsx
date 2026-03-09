import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFavorites } from '../store/favoritesSlice'
import MovieCard from '../components/MovieCard'
import { Spinner } from '../components/Skeleton'
import './MoviesPage.css'
import './FavoritesPage.css'

export default function FavoritesPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.favorites)

  useEffect(() => {
    dispatch(fetchFavorites())
  }, [])

  // Normalize to match MovieCard expected format
  const normalized = items.map(f => ({
    id: f.tmdbId,
    title: f.title,
    name: f.title,
    poster_path: f.posterPath,
    vote_average: f.rating,
    release_date: f.releaseDate,
    media_type: f.mediaType
  }))

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>♥ My Favorites</h1>
          <p>{items.length} saved movie{items.length !== 1 ? 's' : ''}</p>
        </div>

        {loading && items.length === 0 && <Spinner />}

        {!loading && items.length === 0 && (
          <div className="empty-state">
            <span>♡</span>
            <h2>No favorites yet</h2>
            <p>Browse movies and click the heart icon to save them here</p>
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
