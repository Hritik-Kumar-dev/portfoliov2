import { motion } from 'framer-motion'
import { embedSrc } from '../lib/media'

// Renders one canonical media item (see src/lib/media.js) as an <img>, a muted
// looping <video>, or an iframe for a YouTube/Vimeo link.
//
// `motionProps` is optional: the grid card passes its shared-layout props so the
// screenshot itself is what grows into the detail view. Without it the plain
// element is rendered, which is what the gallery wants.
export default function ProjectMedia({ item, motionProps, controls = true, alt = '', eager = false }) {
  // Choosing the element this way keeps the animated and plain paths identical.
  const tag = (name) => (motionProps ? motion[name] : name)

  if (!item?.src) {
    // Nothing to show yet, but the card still needs its box (and its layout id).
    const Empty = tag('div')
    return <Empty {...motionProps} />
  }

  const label = item.alt ?? alt

  if (item.type === 'embed') {
    const frame = (
      <iframe
        className="media-embed"
        src={embedSrc(item.src, { controls })}
        title={label || 'Project video'}
        loading="lazy"
        tabIndex={-1}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    )
    // The card needs a wrapper to carry the shared-layout animation; in the
    // gallery the iframe sits straight in .preview, which already sizes it.
    if (!motionProps) return frame
    return <motion.div {...motionProps}>{frame}</motion.div>
  }

  if (item.type === 'video') {
    const Video = tag('video')
    return (
      <Video {...motionProps} src={item.src} poster={item.poster} autoPlay muted loop playsInline />
    )
  }

  const Img = tag('img')
  // The gallery asks for eager: its slides sit outside the viewport until the
  // track moves, so a lazy one would only start loading as it slid in.
  return <Img {...motionProps} src={item.src} alt={label} loading={eager ? 'eager' : 'lazy'} />
}
