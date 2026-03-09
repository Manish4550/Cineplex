import { useState, useEffect, useCallback, useRef } from 'react'

// Debounce hook
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// Infinite scroll hook
export const useInfiniteScroll = (callback, hasMore) => {
  const observerRef = useRef(null)
  const sentinelRef = useCallback((node) => {
    if (!node) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) callback()
    }, { threshold: 0.1 })
    observerRef.current.observe(node)
  }, [callback, hasMore])
  return sentinelRef
}

// Toast hook
export const useToast = () => {
  const [toast, setToast] = useState(null)
  const show = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])
  return { toast, show }
}

// Click outside hook
export const useClickOutside = (callback) => {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) callback() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [callback])
  return ref
}
