import { TECH_GAP, techRows } from '../data/tech'

export default function TechStack() {
  return (
    <section className="tech" aria-label="Tech stack" style={{ '--gap': `${TECH_GAP}px` }}>
      {techRows.map((row, i) => (
        <div
          key={i}
          // Rows 1 & 3 run the animation in reverse so they travel left -> right,
          // rows 2 & 4 travel right -> left, so the rows don't march in lockstep.
          className={`tech-row${i % 2 === 0 ? ' tech-row--reverse' : ''}`}
          style={{ '--mt': `${row.mt}px`, '--duration': `${row.duration}s` }}
        >
          {/* The list is rendered twice: the second pass lets the track reset at
              the -50% mark with no visible seam. */}
          <ul className="tech-track">
            {[...row.items, ...row.items].map((tech, j) => {
              const duplicate = j >= row.items.length
              return (
                <li key={`${tech.label}-${j}`} aria-hidden={duplicate}>
                  <img src={tech.src} alt={duplicate ? '' : tech.label} width={tech.w} height={tech.h} />
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </section>
  )
}
