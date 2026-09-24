import { useCallback, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/**
 * A draggable boundary between bento tracks.
 *
 * `axes` holds one config for an edge, or two for a corner — a single drag then
 * moves both. Each config reports its track's size as a fraction (0-1) of the
 * container's free space (size minus gutter), so the value maps straight onto
 * `grid-template-*: <value>fr <1 - value>fr`.
 *
 * Arrow keys resize the focused handle, so the layout isn't pointer-only.
 */
export default function Splitter({
  axes,
  label,
  className = '',
  onResizeStart,
  onResizeEnd,
  onReset,
}) {
  const ref = useRef(null)
  const drag = useRef(null)
  const [dragging, setDragging] = useState(false)

  const kind = axes.length > 1 ? 'corner' : axes[0].axis === 'x' ? 'vertical' : 'horizontal'
  const primary = axes[0]

  const measure = useCallback(() => {
    // Every axis of a handle shares one container, so measure it once per drag.
    const container = ref.current?.offsetParent
    return container ? container.getBoundingClientRect() : null
  }, [])

  const onPointerDown = (event) => {
    const rect = measure()
    if (!rect) return

    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = rect
    setDragging(true)
    onResizeStart?.()
  }

  const onPointerMove = (event) => {
    const rect = drag.current
    if (!rect) return

    for (const axis of axes) {
      const available = (axis.axis === 'x' ? rect.width : rect.height) - axis.gap
      if (available <= 0) continue

      // The pointer sits in the middle of the gutter, so offset by half of it.
      const pointer =
        (axis.axis === 'x' ? event.clientX - rect.left : event.clientY - rect.top) - axis.gap / 2
      axis.onChange(clamp(pointer / available, axis.min, axis.max))
    }
  }

  const stop = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    onResizeEnd?.()
  }

  const onKeyDown = (event) => {
    const target = axes.find((axis) =>
      axis.axis === 'x'
        ? event.key === 'ArrowLeft' || event.key === 'ArrowRight'
        : event.key === 'ArrowUp' || event.key === 'ArrowDown',
    )
    if (!target) return

    event.preventDefault()
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const step = event.shiftKey ? 0.05 : 0.02
    target.onChange(clamp(target.value + (forward ? step : -step), target.min, target.max))
  }

  return (
    <div
      ref={ref}
      className={`bento-split bento-split--${kind}${dragging ? ' is-dragging' : ''} ${className}`.trim()}
      role="separator"
      tabIndex={0}
      aria-label={label}
      aria-orientation={primary.axis === 'x' ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(primary.value * 100)}
      aria-valuemin={Math.round(primary.min * 100)}
      aria-valuemax={Math.round(primary.max * 100)}
      aria-valuetext={axes.map((axis) => `${axis.name} ${Math.round(axis.value * 100)}%`).join(', ')}
      title={`${label} — drag, or double-click to reset`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      onDoubleClick={() => onReset?.()}
      onKeyDown={onKeyDown}
    />
  )
}
