import { forwardRef, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Chevron from './Chevron'
import ProjectsHeader from './ProjectsHeader'
import ProjectLinks from './ProjectLinks'
import ProjectMedia from './ProjectMedia'
import { SLIDE, SPRING } from '../lib/transitions'
import { useSwipe } from '../lib/useSwipe'

// Long enough to actually look at a screenshot, short enough not to feel stuck.
// Any manual move restarts it, because the timer is keyed on the slide index.
const AUTO_ADVANCE_MS = 4000

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
                alt={item.alt ?? `${project.title} screenshot ${i + 1}`}
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
        <p>{project.description}</p>
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
  return (
    <motion.div className="detail" ref={ref} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
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
                onClick={() => onSelect(project.id)}
                // The selected project already owns `project-<id>` on the big
                // preview, so only the other thumbs morph into the rail.
                layout
                layoutId={isSelected ? undefined : `project-${project.id}`}
                transition={SPRING}
              >
                {project.thumb && <img src={project.thumb} alt="" loading="lazy" />}
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
            onSelect={onSelect}
          />
        ) : (
          <p className="empty">No projects in this category yet.</p>
        )}
      </section>
    </motion.div>
  )
})

export default ProjectDetail
