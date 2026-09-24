import { profile } from '../data/profile'
import TechStack from './TechStack'
import githubIcon from '../assets/icons/github.svg'
import linkedinIcon from '../assets/icons/linkedin.svg'
import xIcon from '../assets/icons/x.svg'
import mailIcon from '../assets/icons/mail.svg'
import downloadIcon from '../assets/icons/download.svg'
import externalIcon from '../assets/icons/external.svg'
import ibmLogo from '../assets/icons/ibm.svg'

export default function Sidebar() {
  const { name, photo, heatmap, links, bio, experience } = profile

  return (
    <aside className="sidebar">
      <div className="profile-top">
        <img className="photo" src={photo} alt={`Portrait of ${name}`} width="199" height="199" />
        <div className="identity">
          <h1 className="name">{name}</h1>
          <div className="links">
            <a className="btn" href={links.github} target="_blank" rel="noreferrer">
              <img src={githubIcon} alt="" width="13" height="13" />
              GitHub
            </a>
            <a className="btn" href={links.linkedin} target="_blank" rel="noreferrer">
              <img src={linkedinIcon} alt="" width="11" height="11" />
              Linkedin
            </a>
            <a className="btn" href={links.twitter} target="_blank" rel="noreferrer">
              <img src={xIcon} alt="" width="9" height="9" />
              Tweeter
            </a>
            <a className="btn" href={links.email}>
              <img src={mailIcon} alt="" width="12" height="9" />
              Contact
            </a>
            <a className="btn btn-download" href={links.resume} download>
              <img src={downloadIcon} alt="" width="18" height="15" />
              Download Resume
            </a>
            <a className="btn btn-download btn-download-accent" href={links.resume} download>
              <img src={downloadIcon} alt="" width="18" height="15" />
              Download Resume
            </a>
          </div>
        </div>
      </div>

      <div className="bio">
        {bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="experience">
        <h2>{experience.label}</h2>
        <img className="ibm" src={ibmLogo} alt="IBM" width="48" height="20" />
        <a className="cert" href={experience.certificateUrl} target="_blank" rel="noreferrer">
          view certificate
          <img src={externalIcon} alt="" width="10" height="10" />
        </a>
      </div>

      <img className="heatmap" src={heatmap} alt="GitHub contribution activity" />

      <TechStack />
    </aside>
  )
}
