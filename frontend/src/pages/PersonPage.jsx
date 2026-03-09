import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPersonDetails } from '../store/moviesSlice'
import MovieCard from '../components/MovieCard'
import { Spinner } from '../components/Skeleton'
import { getImageUrl, formatDate } from '../utils/tmdb'
import './PersonPage.css'

export default function PersonPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentPerson, loading } = useSelector(s => s.movies)

  useEffect(() => {
    dispatch(fetchPersonDetails(id))
  }, [id])

  if (!currentPerson) return <div style={{ paddingTop: 80 }}><Spinner /></div>

  const known = currentPerson.credits?.cast
    ?.filter(c => c.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 12) || []

  return (
    <div className="person-page fade-in">
      <div className="container">
        <div className="person-main">
          <div className="person-photo">
            {currentPerson.profile_path ? (
              <img src={getImageUrl(currentPerson.profile_path, 'w342')} alt={currentPerson.name} />
            ) : (
              <div className="photo-placeholder">👤</div>
            )}
          </div>
          <div className="person-info">
            <h1 className="person-name">{currentPerson.name}</h1>
            <div className="person-meta">
              {currentPerson.known_for_department && <span className="person-dept">{currentPerson.known_for_department}</span>}
              {currentPerson.birthday && <span>🎂 {formatDate(currentPerson.birthday)}</span>}
              {currentPerson.place_of_birth && <span>📍 {currentPerson.place_of_birth}</span>}
            </div>
            {currentPerson.biography && (
              <p className="person-bio">{currentPerson.biography}</p>
            )}
          </div>
        </div>

        {known.length > 0 && (
          <section className="person-filmography">
            <h2>Known For</h2>
            <div className="movies-grid stagger-children">
              {known.map(item => (
                <MovieCard key={`${item.id}-${item.media_type}`} item={item} type={item.media_type || 'movie'} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
