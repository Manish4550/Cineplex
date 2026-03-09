import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPopularMovies } from '../store/moviesSlice'
import MovieCard from '../components/MovieCard'
import { CardGridSkeleton, Spinner } from '../components/Skeleton'
import { useInfiniteScroll } from '../hooks'
import './MoviesPage.css'

const GENRES = [
  { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' }, { id: 878, name: 'Sci-Fi' }, { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' }, { id: 16, name: 'Animation' }
]

export default function MoviesPage() {
  const dispatch = useDispatch()
  const { popularMovies, loading } = useSelector(s => s.movies)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    if (popularMovies.results.length === 0) dispatch(fetchPopularMovies(1))
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || popularMovies.page >= popularMovies.totalPages) return
    setLoadingMore(true)
    await dispatch(fetchPopularMovies(popularMovies.page + 1))
    setLoadingMore(false)
  }, [loadingMore, popularMovies.page, popularMovies.totalPages])

  const hasMore = popularMovies.page < popularMovies.totalPages
  const sentinelRef = useInfiniteScroll(loadMore, hasMore)

  return (
    <div className="movies-page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>🎬 Movies</h1>
          <p>Discover popular and trending movies</p>
        </div>

        {popularMovies.results.length === 0 ? (
          <CardGridSkeleton count={20} />
        ) : (
          <div className="movies-grid stagger-children">
            {popularMovies.results.map(movie => (
              <MovieCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        )}

        {loadingMore && <Spinner />}
        <div ref={sentinelRef} style={{ height: 1 }} />
        {!hasMore && popularMovies.results.length > 0 && (
          <p className="end-message">You've reached the end! 🎬</p>
        )}
      </div>
    </div>
  )
}
