import { forwardRef, useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import Chevron from './Chevron'
import ProjectsHeader from './ProjectsHeader'
import ProjectLinks from './ProjectLinks'
import ProjectMedia from './ProjectMedia'
import { PUSH_IN, PUSH_OUT, PUSH_ROTATE, SLIDE, SPRING } from '../lib/transitions'
import { MAX_IMAGE_WIDTH, optimised, srcSetFor } from '../lib/media'
import { useMediaQuery } from '../lib/useMediaQuery'
import { useSwipe } from '../lib/useSwipe'

// Long enough to actually look at a screenshot, short enough not to feel stuck.
// Any manual move restarts it, because the timer is keyed on the slide index.
const AUTO_ADVANCE_MS = 4000

// Where the detail view is a single column — phones, and tablets held upright.
// Same breakpoint as the stacked layout in src/styles/responsive.css.
const STACKED = '(max-width: 1000px)'

// Gallery media, at the sizes the 660px frame is painted at (full width once
// the layout stacks), and the rail thumbnails at theirs.
const GALLERY_WIDTHS = [700, 1400]
const GALLERY_SIZES = '(max-width: 1000px) calc(100vw - 40px), 660px'
const THUMB_WIDTHS = [200, 420, 840]
const THUMB_SIZES = '(max-width: 640px) 150px, (max-width: 1000px) 220px, 420px'
// The gallery is the one place a video is watched rather than glanced at, so it
// gets the bigger encode.
const GALLERY_VIDEO_WIDTH = 1400

function Gallery({ project, projects, onSelect }) {
  const media = project.media?.length ? project.media : [{ orientation: 'landscape' }]
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  const many = media.length > 1
  const reduced = useReducedMotion()

  // The frame keeps one aspect ratio for the whole gallery, taken from the first
  // slide: following each slide's own orientation would resize the frame as the
  // track moves, squashing the image flying past it.
  const orientation = media[0]?.orientation === 'portrait' ? 'portrait' : 'landscape'

  const at = Math.max(0, projects.findIndex((p) => p.id === project.id))
  const previous = projects[at - 1]
  const next = projects[at + 1]
  const techStack = project.techStack ?? []

  const go = (step) => setIndex((i) => (i + step + media.length) % media.length)
  const openProject = (target) => target && onSelect(target.id)

  const onKeyDown = (e) => {
    if (!many) return
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  // Drags come in two sizes: a tap walks the gallery on, a swipe moves to the
  // neighbouring project, and the band in between does nothing — which is what
  // keeps a sloppy tap from skipping a whole project (see src/lib/useSwipe.js).
  const swipe = useSwipe({
    onTap: () => many && go(1),
    onSwipe: (direction) => openProject(direction === 'left' ? next : previous),
  })

  // Auto-advance only where there is more than one slide, and never while
  // someone is looking at the media: pointer or keyboard focus inside pauses it,
  // as does a drag in progress. 4s is well past the card-to-detail morph, so the
  // first slide gets its full turn.
  useEffect(() => {
    if (!many || reduced || paused || swipe.dragging || !tabVisible) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % media.length), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [many, reduced, paused, swipe.dragging, tabVisible, index, media.length])

  // A backgrounded tab should not come back showing a different slide.
  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // With nothing to swipe or tap — a single slide and no neighbouring project —
  // the layer stays off, which leaves embedded video controls usable.
  const interactive = Boolean(many || previous || next)

  return (
    <>
      {/* Shares its layoutId with the matching grid card, so clicking a card
          grows it into this frame (and shrinks it back on Back). */}
      <motion.div
        className={`preview ${orientation}`}
        layoutId={`project-${project.id}`}
        transition={SPRING}
        tabIndex={many ? 0 : -1}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${project.title} media`}
        onKeyDown={onKeyDown}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        // relatedTarget is where focus went; still inside the frame means the
        // gallery is still being used, so it stays paused.
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
        }}
      >
        {/* One slide per frame, with the whole track translated by whole
            percentages, so it can only ever land flush on a slide edge. */}
        <motion.div className="slider" animate={{ x: `-${index * 100}%` }} transition={SLIDE}>
          {media.map((item, i) => (
            <div
              key={i}
              className="slide"
              aria-hidden={i !== index}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${media.length}`}
            >
              <ProjectMedia
                item={item}
                eager
                active={i === index}
                alt={item.alt ?? `${project.title} screenshot ${i + 1}`}
                widths={GALLERY_WIDTHS}
                sizes={GALLERY_SIZES}
                videoWidth={GALLERY_VIDEO_WIDTH}
              />
            </div>
          ))}
        </motion.div>

        {many && (
          <>
            <button
              type="button"
              className="slider-arrow slider-arrow--prev"
              aria-label="Previous image"
              onClick={() => go(-1)}
            >
              <Chevron dir="left" size={16} />
            </button>
            <button
              type="button"
              className="slider-arrow slider-arrow--next"
              aria-label="Next image"
              onClick={() => go(1)}
            >
              <Chevron dir="right" size={16} />
            </button>
          </>
        )}

        {/* Transparent, and above the media: a video or an embed iframe would
            otherwise swallow the gesture. It deliberately covers the whole
            frame rather than just the rim, because touch browsers reserve edge
            swipes for back/forward. */}
        {interactive && <div className="gesture" aria-hidden="true" {...swipe.handlers} />}
      </motion.div>

      {/* Row is always rendered so the title sits in the same place for single-image projects. */}
      <motion.div
        className="dots"
        style={many ? undefined : { visibility: 'hidden' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={SPRING}
      >
        {many &&
          media.map((_, i) => (
            <button
              key={i}
              type="button"
              className="dot"
              aria-label={`Show item ${i + 1} of ${media.length}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
      </motion.div>

      <motion.div
        className="info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={SPRING}
      >
        <h3>{project.title}</h3>
        {project.subtitle && <p className="info-subtitle">{project.subtitle}</p>}
        {project.description && <p>{project.description}</p>}
        {techStack.length > 0 && (
          <div className="info-tech">
            <span className="info-tech-label">Tech Stack</span>
            <p className="info-tech-list">{techStack.join(' · ')}</p>
          </div>
        )}
        <ProjectLinks project={project} solid className="info-links" />

        {/* The detail view's own prev/next, reusing the grid's pager so the two
            read as the same control. Clamped at the ends rather than wrapping,
            like the grid's: a disabled button says "this is the last one". */}
        <div className="detail-pager">
          <div className="pager">
            <button
              type="button"
              className="pager-btn"
              aria-label="Previous project"
              disabled={!previous}
              onClick={() => openProject(previous)}
            >
              <Chevron dir="left" />
            </button>
            <span className="pager-count" aria-live="polite">
              <b>{at + 1}</b>
              <span className="pager-sep">/</span>
              {projects.length}
            </span>
            <button
              type="button"
              className="pager-btn"
              aria-label="Next project"
              disabled={!next}
              onClick={() => openProject(next)}
            >
              <Chevron dir="right" />
            </button>
          </div>
          <button
            type="button"
            className="next-project"
            disabled={!next}
            onClick={() => openProject(next)}
          >
            Next project
            <Chevron dir="right" size={12} />
          </button>
        </div>
      </motion.div>
    </>
  )
}

// forwardRef so AnimatePresence's popLayout mode can measure the root element
// and hold the outgoing view in place while the incoming one animates in.
const ProjectDetail = forwardRef(function ProjectDetail(
  { projects, selected, onSelect, onBack, filter, onFilter },
  ref,
) {
  // Swiping between projects pushes the whole sheet sideways, which only reads
  // as a push in the single-column layout; on a wide screen the detail view is
  // a two-column sheet and sideways motion just looks like a glitch.
  const stacked = useMediaQuery(STACKED)
  const reduced = useReducedMotion()

  // Two motion values rather than variants, because a push is not a mount: the
  // sheet has to leave, the content has to be swapped behind it, and the next
  // one has to arrive — the animation straddles a state change.
  const x = useMotionValue(0)
  const rotate = useMotionValue(0)
  // One project at a time. A second swipe mid-push would swap the content out
  // from under the sheet that is on its way in.
  const pushing = useRef(false)

  const select = (id) => {
    // Mid-push there is nothing sensible to do: the sheet is on its way out of
    // the screen, and swapping the content now would put the new project in a
    // sheet that is still leaving.
    if (pushing.current) return
    if (!stacked || reduced || id === selected?.id) {
      onSelect(id)
      return
    }

    // +1 for the next project, -1 for the previous one: this sheet leaves
    // towards the far edge and the next one arrives from the near one.
    const here = projects.findIndex((p) => p.id === selected?.id)
    const dir = projects.findIndex((p) => p.id === id) > here ? 1 : -1
    // A full screen width, so the sheet is genuinely off-screen (and therefore
    // genuinely unseen) at the moment the content changes.
    const travel = window.innerWidth

    pushing.current = true
    Promise.all([
      animate(x, -dir * travel, PUSH_OUT),
      animate(rotate, -dir * PUSH_ROTATE, PUSH_OUT),
    ])
      .then(() => {
        // Swapped out of sight, which is what turns two projects into a push
        // instead of a cut.
        onSelect(id)
        x.set(dir * travel)
        rotate.set(dir * PUSH_ROTATE)
        return Promise.all([animate(x, 0, PUSH_IN), animate(rotate, 0, PUSH_IN)])
      })
      .finally(() => {
        pushing.current = false
      })
  }

  return (
    <motion.div
      className="detail"
      ref={ref}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      // transform-box/transform-origin put the turn's pivot at the bottom
      // centre of the *screen* rather than the bottom of the sheet, so the
      // sheet swings like a card held at its base however far down the page
      // you have scrolled.
      style={{ x, rotate, transformBox: 'view-box', transformOrigin: '50% 100vh' }}
    >
      <motion.button
        type="button"
        className="back"
        onClick={onBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={SPRING}
      >
        Back
      </motion.button>

      <ul className="thumbs" aria-label="Projects">
        {projects.map((project) => {
          const isSelected = selected?.id === project.id
          return (
            <motion.li
              key={project.id}
              layout
              transition={SPRING}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                type="button"
                className="thumb"
                style={{ aspectRatio: project.thumbAspect }}
                aria-label={project.title}
                aria-current={isSelected}
                onClick={() => select(project.id)}
                // The selected project already owns `project-<id>` on the big
                // preview, so only the other thumbs morph into the rail.
                layout
                layoutId={isSelected ? undefined : `project-${project.id}`}
                transition={SPRING}
              >
                {project.thumb && (
                  <img
                    src={optimised(project.thumb, { width: MAX_IMAGE_WIDTH })}
                    srcSet={srcSetFor(project.thumb, THUMB_WIDTHS)}
                    sizes={THUMB_SIZES}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </motion.button>
            </motion.li>
          )
        })}
      </ul>

      <section className="pane">
        <ProjectsHeader filter={filter} onFilter={onFilter} />
        {selected ? (
          <Gallery
            key={selected.id}
            project={selected}
            projects={projects}
            onSelect={select}
          />
        ) : (
          <p className="empty">No projects in this category yet.</p>
        )}
      </section>
    </motion.div>
  )
})

export default ProjectDetail
