import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import ProjectsHeader from './ProjectsHeader'
import ProjectLinks from './ProjectLinks'
import { SPRING } from '../lib/transitions'

function Gallery({ project }) {
  const media = project.media?.length ? project.media : [{ orientation: 'landscape' }]
  const [index, setIndex] = useState(0)
  const item = media[index]
  const many = media.length > 1

  const go = (step) => setIndex((i) => (i + step + media.length) % media.length)
  const onKeyDown = (e) => {
    if (!many) return
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  return (
    <>
      {/* Shares its layoutId with the matching grid card, so clicking a card
          grows it into this frame (and shrinks it back on Back). */}
      <motion.div
        className={`preview ${item.orientation === 'portrait' ? 'portrait' : 'landscape'}`}
        layoutId={`project-${project.id}`}
        transition={SPRING}
        tabIndex={many ? 0 : -1}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${project.title} media`}
        onKeyDown={onKeyDown}
      >
        {item.src &&
          (item.type === 'video' ? (
            <video src={item.src} autoPlay muted loop playsInline />
          ) : (
            <img src={item.src} alt={item.alt ?? `${project.title} screenshot ${index + 1}`} />
          ))}
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
          <Gallery key={selected.id} project={selected} />
        ) : (
          <p className="empty">No projects in this category yet.</p>
        )}
      </section>
    </motion.div>
  )
})

export default ProjectDetail
