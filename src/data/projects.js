import project1 from '../assets/projectimages/project-01.png'
import project2 from '../assets/projectimages/project-02.png'
import project3 from '../assets/projectimages/project-03.png'
import project4 from '../assets/projectimages/project-04.png'

// Add your own projects here.
//   title/description  shown on the card and in the detailed view
//   thumb              card image + detailed-view rail image
//   cardVideo          optional; replaces `thumb` on the card with a muted loop
//   media              detailed-view gallery, each item:
//                      { type: 'image' | 'video', src, orientation: 'landscape' | 'portrait' }
//   repo / live        GitHub and deployed URLs; the chip only renders when set
export const CATEGORIES = ['All', 'Full Stack', 'UIUx']

// TODO: point `repo` at each project's own repository. It currently falls back
// to the profile URL, and `live` is left null so no dead "Live" chip ships —
// set it and the chip appears.
const REPO_PLACEHOLDER = 'https://github.com/Hritik-Kumar-dev'

// Thumbnail aspect ratios taken from the Figma list.
const ratios = ['420 / 189', '420 / 185', '420 / 204', '420 / 189', '420 / 189']

// Screenshots in src/assets/projectimages are wired to the first four projects
// in filename order (project-01 -> the first project below, and so on).
const base = [
  {
    title: 'veltrix',
    category: 'Full Stack',
    description:
      'Veltrix is not an artistic photo editor — it’s a precision instrument for the unglamorous, repetitive work of getting images and documents into the exact shape institutions demand.',
    thumb: project1,
  },
  {
    title: 'Project 02',
    category: 'UIUx',
    description: 'Short description of this project.',
    thumb: project2,
  },
  {
    title: 'Project 03',
    category: 'Full Stack',
    description: 'Short description of this project.',
    thumb: project3,
  },
  {
    title: 'Project 04',
    category: 'UIUx',
    description: 'Short description of this project.',
    thumb: project4,
  },
  { title: 'Project 05', category: 'Full Stack', description: 'Short description of this project.' },
  { title: 'Project 06', category: 'Full Stack', description: 'Short description of this project.' },
  { title: 'Project 07', category: 'UIUx', description: 'Short description of this project.' },
  { title: 'Project 08', category: 'Full Stack', description: 'Short description of this project.' },
  { title: 'Project 09', category: 'UIUx', description: 'Short description of this project.' },
  { title: 'Project 10', category: 'Full Stack', description: 'Short description of this project.' },
]

export const projects = base.map((p, index) => {
  const thumb = p.thumb ?? null
  // Fall back to the card image so the detailed view is never empty.
  const media =
    p.media ?? (thumb ? [{ type: 'image', src: thumb, orientation: 'landscape' }] : [{ orientation: 'landscape' }])

  return {
    id: `p${index + 1}`,
    repo: REPO_PLACEHOLDER,
    live: null,
    ...p,
    thumb,
    thumbAspect: p.thumbAspect ?? ratios[index % ratios.length],
    media,
  }
})
