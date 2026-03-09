import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchContent, clearSearch } from '../store/moviesSlice'
import MovieCard from '../components/MovieCard'
import { CardGridSkeleton, Spinner } from '../components/Skeleton'
import { useDebounce, useInfiniteScroll } from '../hooks'
import './SearchPage.css'

export default function SearchPage() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { search, loading } = useSelector(s => s.movies)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [loadingMore, setLoadingMore] = useState(false)

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    dispatch(clearSearch())
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery })
      dispatch(searchContent({ query: debouncedQuery, page: 1 }))
    }
  }, [debouncedQuery])

  const loadMore = useCallback(async () => {
    if (loadingMore || search.page >= search.totalPages || !search.query) return
    setLoadingMore(true)
    await dispatch(searchContent({ query: search.query, page: search.page + 1 }))
    setLoadingMore(false)
  }, [loadingMore, search.page, search.totalPages, search.query])

  const hasMore = search.page < search.totalPages
  const sentinelRef = useInfiniteScroll(loadMore, hasMore)

  const filtered = search.results.filter(r => r.media_type !== 'person' || r.profile_path)

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-box fade-in">
          <div className="search-input-wrap">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search movies, TV shows, people..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && <button className="clear-btn" onClick={() => { setQuery(''); dispatch(clearSearch()) }}>✕</button>}
          </div>
        </div>

        {!query && (
          <div className="search-empty">
            <span>🔍</span>
            <h2>Search for anything</h2>
            <p>Find movies, TV shows, and people you love</p>
          </div>
        )}

        {query && loading.search && search.results.length === 0 && <CardGridSkeleton count={12} />}

        {search.results.length > 0 && (
          <>
            <div className="search-info fade-in">
              Results for <strong>"{search.query}"</strong> · {search.results.length} found
            </div>
            <div className="movies-grid stagger-children">
              {filtered.map(item => (
                <MovieCard key={`${item.id}-${item.media_type}`} item={item} type={item.media_type || 'movie'} />
              ))}
            </div>
          </>
        )}

        {query && !loading.search && search.results.length === 0 && search.query && (
          <div className="search-empty">
            <span>😔</span>
            <h2>No results found</h2>
            <p>Try searching with different keywords</p>
          </div>
        )}

        {loadingMore && <Spinner />}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  )
}
