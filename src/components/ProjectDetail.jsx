import { useState } from 'react'
import ProjectsHeader from './ProjectsHeader'

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
      <div
        className={`preview ${item.orientation === 'portrait' ? 'portrait' : 'landscape'}`}
        tabIndex={many ? 0 : -1}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${project.title} screenshots`}
        onKeyDown={onKeyDown}
      >
        {item.src && <img src={item.src} alt={item.alt ?? `${project.title} screenshot ${index + 1}`} />}
      </div>

      {/* Row is always rendered so the title sits in the same place for single-image projects. */}
      <div className="dots" style={many ? undefined : { visibility: 'hidden' }}>
        {many &&
          media.map((_, i) => (
            <button
              key={i}
              type="button"
              className="dot"
              aria-label={`Show image ${i + 1} of ${media.length}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
      </div>

      <div className="info">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </>
  )
}

export default function ProjectDetail({ projects, selected, onSelect, onBack, filter, onFilter }) {
  return (
    <div className="detail">
      <button type="button" className="back" onClick={onBack}>
        Back
      </button>

      <ul className="thumbs" aria-label="Projects">
        {projects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              className="thumb"
              style={{ aspectRatio: project.thumbAspect }}
              aria-label={project.title}
              aria-current={selected?.id === project.id}
              onClick={() => onSelect(project.id)}
            >
              {project.thumb && <img src={project.thumb} alt="" loading="lazy" />}
            </button>
          </li>
        ))}
      </ul>

      <section className="pane">
        <ProjectsHeader filter={filter} onFilter={onFilter} />
        {selected ? (
          <Gallery key={selected.id} project={selected} />
        ) : (
          <p className="empty">No projects in this category yet.</p>
        )}
      </section>
    </div>
  )
}
