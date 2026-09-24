import { useEffect, useRef, useState } from 'react'
import { getCalApi } from '@calcom/embed-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'
import { SPRING } from '../lib/transitions'
import externalIcon from '../assets/icons/external.svg'

const { contact } = profile

export default function ContactModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const panelRef = useRef(null)
  const reduced = useReducedMotion()

  // Wires up the Cal.com element-click embed. Loaded lazily on first open so
  // embed.js is never fetched for visitors who never touch the calendar.
  useEffect(() => {
    if (!open || !contact.cal) return undefined

    let cancelled = false
    ;(async () => {
      const cal = await getCalApi({ namespace: contact.cal.namespace })
      if (cancelled) return
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
    })()

    return () => {
      cancelled = true
    }
  }, [open])

  // Esc closes, Tab stays inside, and focus returns to whatever opened it.
  useEffect(() => {
    if (!open) return undefined

    const opener = document.activeElement
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea',
      )
      if (!focusable?.length) return

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

    window.addEventListener('keydown', onKeyDown)
    panelRef.current?.querySelector('input')?.focus()

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      opener?.focus?.()
    }
  }, [open, onClose])

  const onSubmit = async (event) => {
    event.preventDefault()
    const text = message.trim()

    // No endpoint configured: hand the message to the visitor's mail client.
    // Keeps the form working on static hosting with no keys or backend.
    if (!contact.endpoint) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${email}`)
      const body = encodeURIComponent(`${text}\n\n— ${email}`)
      window.location.href = `mailto:${contact.to}?subject=${subject}&body=${body}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(contact.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, message: text }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setEmail('')
      setMessage('')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const notes = {
    sent: contact.endpoint ? "Thanks — I'll get back to you shortly." : 'Opening your mail app…',
    error: 'That did not send. Please email me directly.',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="contact-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.div
            ref={panelRef}
            className="contact-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={reduced ? { duration: 0 } : SPRING}
          >
            <div className="contact-head">
              <h2 id="contact-title">Let’s talk</h2>
              <p className="contact-sub">Send a message, or grab a slot on my calendar.</p>
            </div>
            <button type="button" className="contact-close" onClick={onClose} aria-label="Close contact form">
              ×
            </button>

            {/* Top billing: the paid fast lane is deliberately the loudest thing
                in the dialog, ahead of the slower form below it. */}
            <div className="contact-instant">
              <div className="contact-instant-top">
                <h3>Instant contact</h3>
                <span className="contact-instant-price">{contact.instant.price} one-time</span>
              </div>
              <p className="contact-instant-note">
                Skip the queue — a direct ping straight to me, answered today.
              </p>
              {contact.instant.url ? (
                <a
                  className="contact-instant-btn"
                  href={contact.instant.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get an instant reply
                </a>
              ) : (
                <span
                  className="contact-instant-btn is-disabled"
                  aria-disabled="true"
                  title="Add contact.instant.url in src/data/profile.js"
                >
                  Get an instant reply
                </span>
              )}
            </div>

            <p className="contact-or">or send a message</p>

            <form className="contact-form" onSubmit={onSubmit}>
              <label className="field">
                <span>Your email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className="field">
                <span>Message</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="What would you like to build?"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </label>

              <div className="contact-actions">
                <button type="submit" className="contact-submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>

                {contact.cal ? (
                  // data-cal-* is read by the embed script: clicking opens the
                  // booking popup without leaving the page.
                  <button
                    type="button"
                    className="contact-schedule"
                    data-cal-namespace={contact.cal.namespace}
                    data-cal-link={contact.cal.link}
                    data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                  >
                    Schedule a call
                  </button>
                ) : contact.scheduleUrl ? (
                  <a
                    className="contact-schedule"
                    href={contact.scheduleUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={externalIcon} alt="" width="10" height="10" />
                    Schedule a call
                  </a>
                ) : (
                  <span
                    className="contact-schedule is-disabled"
                    aria-disabled="true"
                    title="Add contact.scheduleUrl in src/data/profile.js"
                  >
                    <img src={externalIcon} alt="" width="10" height="10" />
                    Schedule a call
                  </span>
                )}
              </div>

              {(status === 'sent' || status === 'error') && (
                <p className="contact-note" role="status">
                  {notes[status]}
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
