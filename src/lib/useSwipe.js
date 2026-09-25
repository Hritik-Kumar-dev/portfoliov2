import { useRef, useState } from 'react'

// Left/right drag detection built on pointer events, so touch, pen and mouse all
// take the same path — a trackpad drag works on desktop just as a swipe does on
// a phone.
//
// A press ends as one of three things:
//   - a swipe, when it travelled at least `threshold` px and was more horizontal
//     than vertical
//   - a tap, when it barely moved at all
//   - nothing, in the band between the two — which is what stops a slightly
//     sloppy tap from flinging you into the next project
//
// A mostly-vertical drag is ignored so page scrolling still feels normal.
export function useSwipe({ onSwipe, onTap, threshold = 40, tapSlop = 12 }) {
  const origin = useRef(null)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    // Capture, so a drag that ends outside the element still reports its end —
    // otherwise the element would stay stuck in `dragging`.
    event.currentTarget.setPointerCapture?.(event.pointerId)
    origin.current = { x: event.clientX, y: event.clientY }
    setDragging(true)
  }

  const finish = (event) => {
    const from = origin.current
    origin.current = null
    setDragging(false)
    if (!from) return

    const dx = event.clientX - from.x
    const dy = event.clientY - from.y
    if (Math.abs(dx) < Math.abs(dy)) return

    if (Math.abs(dx) >= threshold) onSwipe?.(dx < 0 ? 'left' : 'right', dx)
    else if (Math.abs(dx) <= tapSlop) onTap?.()
  }

  const onPointerCancel = () => {
    origin.current = null
    setDragging(false)
  }

  return {
    dragging,
    handlers: { onPointerDown, onPointerUp: finish, onPointerCancel },
  }
}
