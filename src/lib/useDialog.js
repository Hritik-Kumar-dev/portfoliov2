import { useEffect } from 'react'

// Everything both of the site's dialogs need and nothing they don't:
//
//   - Esc closes
//   - Tab cycles inside the panel instead of escaping to the page behind
//   - the page behind stops scrolling while it is open
//   - focus returns to whatever opened it, so keyboard users are not dropped
//     back at the top of the document
//
// `panelRef` must point at the element carrying role="dialog". `autofocus` is an
// optional selector for the element to focus on open — without one, focus lands
// on the first focusable thing in the panel so Esc works straight away.
export function useDialog({ open, onClose, panelRef, autofocus }) {
  useEffect(() => {
    if (!open) return undefined

    const opener = document.activeElement
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([tabindex="-1"]), textarea:not([tabindex="-1"])'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(focusableSelector)
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const target = autofocus ? panelRef.current?.querySelector(autofocus) : null
    if (target) target.focus()
    else panelRef.current?.querySelector(focusableSelector)?.focus()

    window.addEventListener('keydown', onKeyDown)

    // Restored to whatever it was, so opening a dialog from a scrolled page
    // leaves the page exactly as it was.
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      opener?.focus?.()
    }
  }, [open, onClose, panelRef, autofocus])
}
