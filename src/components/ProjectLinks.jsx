import githubIcon from '../assets/icons/github.svg'
import externalIcon from '../assets/icons/external.svg'

// Both links always render so the actions are visible and discoverable. Until a
// URL is set in src/data/projects.json the chip is inert rather than a dead link.
const LINKS = [
  { key: 'repo', icon: githubIcon, w: 13, h: 13, label: 'GitHub', hint: 'repository URL' },
  { key: 'live', icon: externalIcon, w: 10, h: 10, label: 'Live', hint: 'live preview URL' },
]

export default function ProjectLinks({ project, solid = false, className = '' }) {
  return (
    <div className={className}>
      {LINKS.map((link) => {
        const href = project[link.key]
        const chipClass = `chip${solid ? ' chip--solid' : ''}`
        const content = (
          <>
            <img src={link.icon} alt="" width={link.w} height={link.h} />
            {link.label}
          </>
        )

        return href ? (
          <a key={link.key} className={chipClass} href={href} target="_blank" rel="noreferrer">
            {content}
          </a>
        ) : (
          <span
            key={link.key}
            className={`${chipClass} chip--pending`}
            aria-disabled="true"
            title={`Add this project's ${link.hint} in src/data/projects.json`}
          >
            {content}
          </span>
        )
      })}
    </div>
  )
}
