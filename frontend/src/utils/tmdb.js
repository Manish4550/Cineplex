import axios from 'axios'

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY'
const TMDB_BASE = 'https://api.themoviedb.org/3'

export const IMG_BASE = 'https://image.tmdb.org/t/p'
export const IMG_W500 = `${IMG_BASE}/w500`
export const IMG_W780 = `${IMG_BASE}/w780`
export const IMG_ORIGINAL = `${IMG_BASE}/original`

export const PLACEHOLDER = '/placeholder.png'

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return PLACEHOLDER
  return `${IMG_BASE}/${size}${path}`
}

export const getYoutubeEmbed = (key) => `https://www.youtube.com/embed/${key}?autoplay=1&rel=0`

export const getTrailerKey = (videos) => {
  if (!videos?.length) return null
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    || videos.find(v => v.site === 'YouTube')
  return trailer?.key || null
}

export const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const formatYear = (dateStr) => dateStr ? dateStr.slice(0, 4) : '?'

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: TMDB_KEY, language: 'en-US' }
})

export default tmdb
