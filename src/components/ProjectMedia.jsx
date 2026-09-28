import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { embedSrc, MAX_IMAGE_WIDTH, optimised, optimisedVideo, srcSetFor } from '../lib/media'

// Renders one canonical media item (see src/lib/media.js) as an <img>, a muted
// looping <video>, or an iframe for a YouTube/Vimeo link.
//
// `motionProps` is optional: the grid card passes its shared-layout props so the
// screenshot itself is what grows into the detail view. Without it the plain
// element is rendered, which is what the gallery wants.
//
// `widths` are the pixel widths this image is painted at (a card, the gallery, a
// rail thumbnail), used to build a srcset; `sizes` is the matching sizes()
// string. `videoWidth` is the same idea for a video, which has no srcset.
// `priority` marks the one image worth fetching before everything else, and
// `active` says which slide of a carousel this is — a carousel that plays every
// slide at once is a lot of decode for one frame you can see.
export default function ProjectMedia({
  item,
  motionProps,
  controls = true,
  alt = '',
  eager = false,
  priority = false,
  active,
  widths,
  sizes,
  videoWidth,
}) {
  const videoRef = useRef(null)
  // A card video is the most expensive thing on the page by a wide margin, and
  // the grid can put five of them on screen at once. Only fetch and play the
  // ones you can actually see: an off-screen one is left on its poster, which
  // is what it looks like anyway before its first frame arrives.
  const inView = useInView(videoRef, { margin: '25% 0px' })
  // A gallery slide is told which one it is instead; everything else goes by
  // whether it is on screen.
  const playing = active ?? inView

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (playing) {
      // Muted and inline, so no gesture is needed; a browser that still says no
      // just leaves the poster up.
      el.play?.()?.catch?.(() => {})
    } else {
      el.pause?.()
    }
  }, [playing])

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
    // No autoplay attribute: playback is driven by the observer above, so a card
    // that has been scrolled past (or never reached) costs nothing at all.
    return (
      <Video
        {...motionProps}
        ref={videoRef}
        src={optimisedVideo(item.src, { width: videoWidth })}
        poster={optimised(item.poster, { width: MAX_IMAGE_WIDTH })}
        muted
        loop
        playsInline
        preload={playing ? 'auto' : 'none'}
      />
    )
  }

  const Img = tag('img')
  // The gallery asks for eager: its slides sit outside the viewport until the
  // track moves, so a lazy one would only start loading as it slid in. The
  // first card is the other one worth fetching straight away — it is the largest
  // thing in the first screen, and so the usual LCP element.
  return (
    <Img
      {...motionProps}
      src={optimised(item.src, { width: MAX_IMAGE_WIDTH })}
      srcSet={srcSetFor(item.src, widths)}
      sizes={sizes}
      alt={label}
      loading={eager || priority ? 'eager' : 'lazy'}
      // Lower case on purpose: React 18 does not know the camelCase spelling of
      // this attribute and warns about it, and a lowercase attribute is passed
      // straight through to the DOM in every React version.
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
