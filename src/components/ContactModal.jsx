import { useEffect, useRef, useState } from 'react'
import { getCalApi } from '@calcom/embed-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'
import { SPRING } from '../lib/transitions'
import externalIcon from '../assets/icons/external.svg'

const { contact } = profile

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

const emailjsIds = contact.emailjs ?? {}
const emailjsReady = Boolean(
  emailjsIds.publicKey && emailjsIds.serviceId && emailjsIds.templateId,
)

// One sender is chosen from the config, in this order. All of them are
// browser-safe: the credential each uses is public by design and can only post
// to the inbox it was issued for. (A transactional-email key — Resend, SendGrid,
// … — is NOT public, so those would need a backend to keep it off the client.)
//
//   endpoint    explicit override, for any other browser-safe form endpoint
//   web3forms   one access key; the message lands in your inbox
//   emailjs     three ids from the EmailJS dashboard
//   (nothing)   the message is handed to the visitor's mail app instead
const SENDER = contact.endpoint
  ? { kind: 'endpoint', url: contact.endpoint }
  : contact.web3formsKey
    ? { kind: 'web3forms', key: contact.web3formsKey }
    : emailjsReady
      ? { kind: 'emailjs', ids: emailjsIds }
      : { kind: 'mailto' }

// Both Web3Forms and Formspree answer 200 with { success: false } when the key
// or the domain is rejected, so response.ok alone is not enough.
async function assertSent(response) {
  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message ?? `Request failed: ${response.status}`)
  }
}

// Posts the message with whichever sender the config selected. Throws on failure.
async function deliver({ email, message }) {
  const subject = `Portfolio enquiry from ${email}`

  if (SENDER.kind === 'emailjs') {
    // Imported on the first send, so the SDK stays out of the initial bundle.
    const { send } = await import('@emailjs/browser')
    return send(
      SENDER.ids.serviceId,
      SENDER.ids.templateId,
      {
        // These names have to match the {{variables}} in your EmailJS template.
        from_name: 'Portfolio contact form',
        from_email: email,
        reply_to: email,
        subject,
        message,
      },
      { publicKey: SENDER.ids.publicKey },
    )
  }

  if (SENDER.kind === 'web3forms') {
    // FormData with no Content-Type header, the shape the Web3Forms docs use:
    // multipart is a CORS-safelisted type, so this skips the preflight.
    const body = new FormData()
    body.append('access_key', SENDER.key)
    body.append('subject', subject)
    body.append('from_name', 'Portfolio contact form')
    // `email` is what Web3Forms uses as the reply-to, so replies reach them.
    body.append('email', email)
    body.append('message', message)

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    })
    return assertSent(response)
  }

  const response = await fetch(SENDER.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, subject, message }),
  })
  return assertSent(response)
}

// Fallback used both when nothing is configured and when a send fails, so a
// visitor never dead-ends on the form.
function mailtoHref(email, text) {
  const subject = encodeURIComponent(`Portfolio enquiry from ${email}`)
  const body = encodeURIComponent(`${text}\n\n— ${email}`)
  return `mailto:${contact.to}?subject=${subject}&body=${body}`
}

export default function ContactModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
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

      // The honeypot is excluded, or Tab would land on an off-screen field.
      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([data-trap]), textarea',
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

    // A person never sees this field, so anything in it came from a bot. Report
    // success and drop the message rather than teaching the bot what failed.
    if (honeypot) {
      setStatus('sent')
      return
    }

    // No sender configured: hand the message to the visitor's mail client, so
    // the form still works on static hosting with no keys and no backend.
    if (SENDER.kind === 'mailto') {
      window.location.href = mailtoHref(email, text)
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      await deliver({ email, message: text })
      setEmail('')
      setMessage('')
      setStatus('sent')
    } catch (error) {
      // The provider explains itself here (bad key, unverified domain, …) —
      // exactly what you need while setting the account up.
      console.error('[contact] send failed:', error?.text ?? error)
      setStatus('error')
    }
  }

  const sentNote =
    SENDER.kind === 'mailto' ? 'Opening your mail app…' : "Thanks — I'll get back to you shortly."

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
              {/* Honeypot: kept off-screen rather than display:none, so a bot
                  still fills it in while a person never notices it. */}
              <input
                className="field-trap"
                data-trap=""
                type="text"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />

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
                <p className={`contact-note${status === 'error' ? ' contact-note--error' : ''}`} role="status">
                  {status === 'sent' ? (
                    sentNote
                  ) : (
                    <>
                      That didn’t send.{' '}
                      <a href={mailtoHref(email, message.trim())}>Email me directly</a> instead.
                    </>
                  )}
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
