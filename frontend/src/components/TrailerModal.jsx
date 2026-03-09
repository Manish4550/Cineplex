import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeTrailer } from '../store/uiSlice'
import { getYoutubeEmbed } from '../utils/tmdb'
import './TrailerModal.css'

export default function TrailerModal() {
  const dispatch = useDispatch()
  const { videoKey, title } = useSelector(s => s.ui.trailerModal)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e) => { if (e.key === 'Escape') dispatch(closeTrailer()) }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [])

  return (
    <div className="modal-backdrop" onClick={() => dispatch(closeTrailer())}>
      <div className="modal-content scale-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={() => dispatch(closeTrailer())}>✕</button>
        </div>
        <div className="modal-video">
          {videoKey ? (
            <iframe
              src={getYoutubeEmbed(videoKey)}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="no-trailer">
              <span>🎬</span>
              <p>Trailer for this movie is currently unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
