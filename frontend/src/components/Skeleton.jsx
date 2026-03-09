import './Skeleton.css'

export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="skeleton poster-sk" />
      <div className="sk-info">
        <div className="skeleton title-sk" />
        <div className="skeleton meta-sk" />
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 20 }) {
  return (
    <div className="movies-grid">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="hero-skeleton">
      <div className="skeleton hero-bg-sk" />
      <div className="hero-content-sk">
        <div className="skeleton hero-title-sk" />
        <div className="skeleton hero-desc-sk" />
        <div className="skeleton hero-desc-sk short" />
        <div className="hero-btns-sk">
          <div className="skeleton btn-sk" />
          <div className="skeleton btn-sk small" />
        </div>
      </div>
    </div>
  )
}

export function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  )
}
