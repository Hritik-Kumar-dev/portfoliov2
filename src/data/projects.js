// Sample data — replace with your own projects.
// category: 'Full Stack' | 'UIUx'
// thumb:    image for the grid card + detailed-view list (optional)
// media:    gallery for the detailed view; each item is
//           { src, orientation: 'landscape' | 'portrait' } (src optional)
export const CATEGORIES = ['All', 'Full Stack', 'UIUx']

const landscape = (n) => Array.from({ length: n }, () => ({ orientation: 'landscape' }))

// Thumbnail aspect ratios taken from the Figma list.
const ratios = ['420 / 189', '420 / 185', '420 / 204', '420 / 189', '420 / 189']

const base = [
  {
    title: 'veltrix',
    category: 'Full Stack',
    description:
      'Veltrix is not an artistic photo editor — it’s a precision instrument for the unglamorous, repetitive work of getting images and documents into the exact shape institutions demand.',
    media: landscape(12),
  },
  {
    title: 'Project 02',
    category: 'UIUx',
    description: 'Short description of this project.',
    media: [{ orientation: 'portrait' }],
  },
  { title: 'Project 03', category: 'Full Stack', description: 'Short description of this project.' },
  { title: 'Project 04', category: 'UIUx', description: 'Short description of this project.' },
  { title: 'Project 05', category: 'Full Stack', description: 'Short description of this project.' },
  { title: 'Project 06', category: 'Full Stack', description: 'Short description of this project.' },
  { title: 'Project 07', category: 'UIUx', description: 'Short description of this project.' },
  { title: 'Project 08', category: 'Full Stack', description: 'Short description of this project.' },
  { title: 'Project 09', category: 'UIUx', description: 'Short description of this project.' },
  { title: 'Project 10', category: 'Full Stack', description: 'Short description of this project.' },
]

export const projects = base.map((p, i) => ({
  id: `p${i + 1}`,
  thumb: null,
  thumbAspect: ratios[i % ratios.length],
  media: [{ orientation: 'landscape' }],
  ...p,
}))
