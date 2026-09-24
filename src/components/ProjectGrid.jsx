export default function ProjectGrid({ items, page, pageCount, onPage, onOpen, onDetailed }) {
  const top = items.slice(0, 3)
  const bottom = items.slice(3, 5)

  // Slot classes map to the bento areas from the design.
  // Order: 1 top-left, 2 top-right (tall), 3 middle-left, 4 bottom-left (tall), 5 bottom-right.
  const slots = ['a', 'e', 'b', 'd', 'c']
  const card = (project, i) => (
    <button
      key={project.id}
      type="button"
      className="card"
      style={{ gridArea: slots[i] }}
      aria-label={`Open ${project.title}`}
      onClick={() => onOpen(project.id)}
    >
      {project.thumb && <img src={project.thumb} alt="" loading="lazy" />}
    </button>
  )

  if (items.length === 0) {
    return <p className="empty">No projects in this category yet.</p>
  }

  return (
    <div className="bento">
      <div className="bento-top">{top.map((p, i) => card(p, i))}</div>
      <div className="bento-bottom">
        {bottom.map((p, i) => card(p, i + 3))}
        <div className="controls">
          <div className="pager" aria-label="Pagination">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page === 0}
              onClick={() => onPage(page - 1)}
            >
              &lt;&lt;
            </button>
            <span aria-live="polite">
              {page + 1}/{pageCount}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled={page >= pageCount - 1}
              onClick={() => onPage(page + 1)}
            >
              &gt;&gt;
            </button>
          </div>
          <button type="button" className="detailed" onClick={onDetailed}>
            Detailed view
          </button>
        </div>
      </div>
    </div>
  )
}
