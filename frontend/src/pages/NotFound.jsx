import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      textAlign: 'center',
      padding: 40
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px, 15vw, 160px)', color: 'var(--accent-gold)', lineHeight: 1 }}>
        404
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 360 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{
        marginTop: 10,
        padding: '12px 28px',
        background: 'var(--accent-gold)',
        color: '#080b14',
        borderRadius: 'var(--radius)',
        fontWeight: 700,
        fontSize: 15
      }}>
        Back to Home
      </Link>
    </div>
  )
}
