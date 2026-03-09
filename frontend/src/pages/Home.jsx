import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchTrending, fetchPopularMovies, fetchPopularTV } from '../store/moviesSlice'
import { openTrailer } from '../store/uiSlice'
import { addToHistory } from '../store/historySlice'
import MovieCard from '../components/MovieCard'
import { CardGridSkeleton, HeroSkeleton } from '../components/Skeleton'
import { getImageUrl, getTrailerKey, formatYear } from '../utils/tmdb'
import tmdb from '../utils/tmdb'
import './Home.css'

export default function Home() {
  const dispatch = useDispatch()
  const { trending, popularMovies, popularTV } = useSelector(s => s.movies)
  const { user } = useSelector(s => s.auth)
  const [heroItem, setHeroItem] = useState(null)
  const [heroVideos, setHeroVideos] = useState([])
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    dispatch(fetchTrending('all'))
    dispatch(fetchPopularMovies(1))
    dispatch(fetchPopularTV(1))
  }, [])

  useEffect(() => {
    if (trending.length > 0) {
      const item = trending[0]
      setHeroItem(item)
      setHeroLoading(false)
      const type = item.media_type === 'tv' ? 'tv' : 'movie'
      tmdb.get(`/${type}/${item.id}/videos`).then(({ data }) => setHeroVideos(data.results)).catch(() => {})
    }
  }, [trending])

  const handleWatchTrailer = () => {
    if (!heroItem) return
    const key = getTrailerKey(heroVideos)
    dispatch(openTrailer({ videoKey: key, title: heroItem.title || heroItem.name }))
    if (user) {
      dispatch(addToHistory({
        tmdbId: String(heroItem.id),
        mediaType: heroItem.media_type || 'movie',
        title: heroItem.title || heroItem.name || '',
        posterPath: heroItem.poster_path || '',
        overview: heroItem.overview || '',
        rating: heroItem.vote_average || 0,
        releaseDate: heroItem.release_date || heroItem.first_air_date || ''
      }))
    }
  }

  return (
    <div className="home">
      {/* Hero */}
      {heroLoading ? <HeroSkeleton /> : heroItem && (
        <section className="hero fade-in">
          <div className="hero-bg">
            <img
              src={getImageUrl(heroItem.backdrop_path, 'original')}
              alt={heroItem.title || heroItem.name}
              onError={e => e.target.style.display = 'none'}
            />
            <div className="hero-gradient" />
          </div>
          <div className="hero-content">
            <div className="hero-badge">
              {heroItem.media_type === 'tv' ? '📺 TV Show' : '🎬 Movie'} · Trending Now
            </div>
            <h1 className="hero-title">{heroItem.title || heroItem.name}</h1>
            <div className="hero-meta">
              <span className="hero-rating">★ {heroItem.vote_average?.toFixed(1)}</span>
              <span>{formatYear(heroItem.release_date || heroItem.first_air_date)}</span>
              {heroItem.genre_ids?.slice(0, 2).map(g => <span key={g} className="hero-genre-pill">Genre</span>)}
            </div>
            <p className="hero-overview">{heroItem.overview || 'No description available.'}</p>
            <div className="hero-actions">
              <button className="btn-play" onClick={handleWatchTrailer}>
                ▶ Watch Trailer
              </button>
              <Link
                to={`/${heroItem.media_type || 'movie'}/${heroItem.id}`}
                className="btn-info"
              >
                ⓘ More Info
              </Link>
            </div>
          </div>
          {/* Trending pills */}
          <div className="hero-trending">
            <span className="trending-label">Trending</span>
            <div className="trending-pills">
              {trending.slice(1, 5).map(item => (
                <Link key={item.id} to={`/${item.media_type || 'movie'}/${item.id}`} className="trending-pill">
                  <img
                    src={getImageUrl(item.poster_path, 'w500')}
                    alt={item.title || item.name}
                    onError={e => e.target.style.display = 'none'}
                  />
                  <span>{item.title || item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Section */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2>🔥 Trending This Week</h2>
            <Link to="/movies" className="see-all">See all →</Link>
          </div>
          {trending.length === 0 ? (
            <CardGridSkeleton count={10} />
          ) : (
            <div className="movies-grid stagger-children">
              {trending.slice(0, 10).map(item => (
                <MovieCard key={item.id} item={item} type={item.media_type || 'movie'} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="home-section alt">
        <div className="container">
          <div className="section-header">
            <h2>🎬 Popular Movies</h2>
            <Link to="/movies" className="see-all">See all →</Link>
          </div>
          {popularMovies.results.length === 0 ? (
            <CardGridSkeleton count={10} />
          ) : (
            <div className="movies-grid stagger-children">
              {popularMovies.results.slice(0, 10).map(item => (
                <MovieCard key={item.id} item={item} type="movie" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular TV */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2>📺 Popular TV Shows</h2>
            <Link to="/tv" className="see-all">See all →</Link>
          </div>
          {popularTV.results.length === 0 ? (
            <CardGridSkeleton count={10} />
          ) : (
            <div className="movies-grid stagger-children">
              {popularTV.results.slice(0, 10).map(item => (
                <MovieCard key={item.id} item={item} type="tv" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
