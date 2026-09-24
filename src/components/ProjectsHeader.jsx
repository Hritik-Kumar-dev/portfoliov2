import { CATEGORIES } from '../data/projects'

export default function ProjectsHeader({ filter, onFilter }) {
  return (
    <header className="projects-header">
      <h2 className="projects-title">Projects</h2>
      <div className="filter" role="group" aria-label="Filter projects">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className="filter-btn"
            aria-pressed={filter === category}
            onClick={() => onFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </header>
  )
}
