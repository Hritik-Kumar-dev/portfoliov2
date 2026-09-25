import { useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'
import { SPRING } from '../lib/transitions'
import { useDialog } from '../lib/useDialog'

const { experience } = profile

// Shows the internship certificate at a readable size, over the page rather than
// in a new tab. Rendered by App, outside the animating views: the sidebar
// animates with a transform, which would otherwise become the containing block
// for this fixed overlay (same reason the contact dialog lives up there).
export default function CertificateModal({ open, onClose }) {
  const panelRef = useRef(null)
  const reduced = useReducedMotion()

  useDialog({ open, onClose, panelRef })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cert-overlay"
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
            className="cert-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-title"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={reduced ? { duration: 0 } : SPRING}
          >
            <h2 id="cert-title" className="cert-title">
              {experience.certificateTitle}
            </h2>
            <button type="button" className="cert-close" onClick={onClose} aria-label="Close certificate">
              ×
            </button>
            <img
              className="cert-image"
              src={experience.certificate}
              alt={experience.certificateAlt}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
