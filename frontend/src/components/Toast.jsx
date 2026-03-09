import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '../store/uiSlice'

export default function Toast() {
  const dispatch = useDispatch()
  const toast = useSelector(s => s.ui.toast)

  useEffect(() => {
    const timer = setTimeout(() => dispatch(hideToast()), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  if (!toast) return null
  return (
    <div className={`toast ${toast.type || 'info'}`} onClick={() => dispatch(hideToast())}>
      {toast.message}
    </div>
  )
}
