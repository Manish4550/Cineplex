import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPopularTV } from '../store/moviesSlice'
import MovieCard from '../components/MovieCard'
import { CardGridSkeleton, Spinner } from '../components/Skeleton'
import { useInfiniteScroll } from '../hooks'
import './MoviesPage.css'

export default function TVPage() {
  const dispatch = useDispatch()
  const { popularTV } = useSelector(s => s.movies)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    if (popularTV.results.length === 0) dispatch(fetchPopularTV(1))
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || popularTV.page >= popularTV.totalPages) return
    setLoadingMore(true)
    await dispatch(fetchPopularTV(popularTV.page + 1))
    setLoadingMore(false)
  }, [loadingMore, popularTV.page, popularTV.totalPages])

  const hasMore = popularTV.page < popularTV.totalPages
  const sentinelRef = useInfiniteScroll(loadMore, hasMore)

  return (
    <div className="tv-page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>📺 TV Shows</h1>
          <p>Stream popular and trending TV series</p>
        </div>

        {popularTV.results.length === 0 ? (
          <CardGridSkeleton count={20} />
        ) : (
          <div className="movies-grid stagger-children">
            {popularTV.results.map(show => (
              <MovieCard key={show.id} item={show} type="tv" />
            ))}
          </div>
        )}

        {loadingMore && <Spinner />}
        <div ref={sentinelRef} style={{ height: 1 }} />
        {!hasMore && popularTV.results.length > 0 && (
          <p className="end-message">You've reached the end! 📺</p>
        )}
      </div>
    </div>
  )
}
