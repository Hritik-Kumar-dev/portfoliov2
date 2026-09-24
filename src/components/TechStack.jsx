import { techRows } from '../data/tech'

export default function TechStack() {
  return (
    <section className="tech" aria-label="Tech stack">
      {techRows.map((row, i) => (
        <ul
          key={i}
          className="tech-row"
          style={{ '--offset': `${row.offset}px`, '--width': `${row.width}px`, '--mt': `${row.mt}px` }}
        >
          {row.items.map((tech) => (
            <li key={tech.label}>
              <img src={tech.src} alt={tech.label} width={tech.w} height={tech.h} />
            </li>
          ))}
        </ul>
      ))}
    </section>
  )
}
