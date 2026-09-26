import { image, toMedia, video, warnAboutMedia } from '../lib/media'
import project1 from '../assets/projectimages/project-01.png'
import project2 from '../assets/projectimages/project-02.png'
import project3 from '../assets/projectimages/project-03.png'
import project4 from '../assets/projectimages/project-04.png'

// ════════════════════════════════════════════════════════════════════════════
//  ADD YOUR PROJECTS HERE
//  ---------------------------------------------------------------------------
//  One object per project, in the order you want them shown. Only `title` and
//  `category` are required — everything else has a sensible fallback.
//
//    title        string
//    category     must appear in CATEGORIES below to be filterable
//    description  string; clipped to 3 lines on the card, shown in full in the
//                 detail view, so a longer one is fine
//    thumb        card image and thumbnail-rail image. Either a bundled import
//                 (import shot from '../assets/projectimages/x.png') or a CDN
//                 URL ('https://cdn.example.com/x.webp') — same syntax either
//                 way, just paste the link when you move to a CDN.
//    cardVideo    optional. Plays on the card *instead of* `thumb`, muted and
//                 looping. Works with a direct file ('https://cdn/x.mp4') or a
//                 YouTube/Vimeo link ('https://youtu.be/xxxx'), and the thumb is
//                 used as its poster frame.
//    media        optional detail-view gallery. Anything you leave out falls back
//                 to `thumb`, so the view is never empty. Entries may be:
//                   'https://cdn/x.png'                     bare URL = image
//                   video('https://cdn/demo.mp4')           playable file
//                   video('https://youtu.be/xxxxx')         embed (autodetected)
//                   image('https://cdn/x.png', 'portrait')  portrait image
//                   { src, orientation, poster, alt, type } full control; set
//                     `type` only to force a kind the URL doesn't reveal
//                 The kind is detected from the URL, so pasting a link is enough
//                 — you never have to say "this is a video".
//    repo         GitHub URL; falls back to the profile URL until you set it
//    live         deployed URL; leave it null and the chip renders inert
//    thumbAspect  optional CSS aspect-ratio for the rail thumb, e.g. '16 / 9'
// ════════════════════════════════════════════════════════════════════════════
export const CATEGORIES = ['All', 'Full Stack', 'UIUx']

const MY_PROJECTS = [
  {
    title: 'veltrix',
    category: 'Full Stack',
    description:
      'Veltrix is not an artistic photo editor — it’s a precision instrument for the unglamorous, repetitive work of getting images and documents into the exact shape institutions demand.',
    thumb: project1,
    // repo: 'https://github.com/Hritik-Kumar-dev/veltrix',
    // live: 'https://veltrix.example.com',
    // cardVideo: 'https://cdn.example.com/veltrix-loop.mp4',
    // media: [image(project1), video('https://cdn.example.com/veltrix-demo.mp4')],
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

// TODO: point each project's `repo` at its own repository. Until then it falls
// back to the profile URL, so the chip always looks live.
const REPO_PLACEHOLDER = 'https://github.com/Hritik-Kumar-dev'

// Thumbnail aspect ratios taken from the Figma list, by position.
const ratios = ['420 / 189', '420 / 185', '420 / 204', '420 / 189', '420 / 189']

// Everything below just fills in the gaps — you shouldn't need to edit it.
export const projects = MY_PROJECTS.map((p, index) => {
  warnAboutMedia(p, `#${index + 1}`)

  const thumb = p.thumb ?? null
  // The card shows the video when there is one, else the still.
  const cardMedia =
    toMedia(p.cardVideo, { poster: thumb, alt: p.title }) ??
    toMedia(thumb, { alt: p.title })

  // Fall back to the card image so the detailed view is never empty.
  const media = (p.media?.length ? p.media.map((entry) => toMedia(entry)) : [toMedia(thumb)]).filter(
    Boolean,
  )

  return {
    id: `p${index + 1}`,
    repo: REPO_PLACEHOLDER,
    live: null,
    ...p,
    thumb,
    thumbAspect: p.thumbAspect ?? ratios[index % ratios.length],
    cardMedia,
    media: media.length ? media : [{ type: 'image', src: null, orientation: 'landscape' }],
  }
})
