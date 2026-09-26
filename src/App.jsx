import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import ProjectsHeader from './components/ProjectsHeader'
import ProjectGrid from './components/ProjectGrid'
import ProjectDetail from './components/ProjectDetail'
import ContactModal from './components/ContactModal'
import CertificateModal from './components/CertificateModal'
import ThemeToggle from './components/ThemeToggle'
import { toMedia } from './lib/media'
import { FADE } from './lib/transitions'
import projectsData from './data/projects.json'

const PAGE_SIZE = 5

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'detail'
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [certificateOpen, setCertificateOpen] = useState(false)

  const prefersReducedMotion = useReducedMotion()
  const exitTransition = { duration: prefersReducedMotion ? 0 : FADE }

  // Process projects data from JSON to match expected format
  const processedProjects = useMemo(() => {
    return projectsData.map((project) => {
      // Determine thumb (first image or null)
      const thumb = (project.images && Array.isArray(project.images)) ? project.images[0] ?? null : null

      // Create cardMedia: videoUrl if exists and valid, otherwise thumb if valid
      const cardMediaOptions = []
      if (project.videoUrl && project.videoUrl.trim() !== '') {
        const videoMedia = toMedia(project.videoUrl, { poster: thumb, alt: project.title })
        if (videoMedia) cardMediaOptions.push(videoMedia)
      }
      if (thumb) {
        const thumbMedia = toMedia(thumb, { alt: project.title })
        if (thumbMedia) cardMediaOptions.push(thumbMedia)
      }
      const cardMedia = cardMediaOptions.find(Boolean) ?? toMedia(null, { alt: project.title, type: 'image' })

      // Create media array: video first (if exists and valid), then images (if valid)
      const mediaItems = []

      // Add video first if it exists and is valid
      if (project.videoUrl && project.videoUrl.trim() !== '') {
        const videoMedia = toMedia(project.videoUrl, { poster: thumb, alt: project.title })
        if (videoMedia) mediaItems.push(videoMedia)
      }

      // Add all valid images
      if (project.images && Array.isArray(project.images)) {
        project.images.forEach((imageUrl) => {
          if (imageUrl && imageUrl.trim() !== '') {
            const imageMedia = toMedia(imageUrl, { alt: project.title })
            if (imageMedia) mediaItems.push(imageMedia)
          }
        })
      }

      // Fallback: if no media items, use thumb if valid, otherwise empty media object
      const validMediaItems = mediaItems.filter(Boolean)
      const media = validMediaItems.length > 0
        ? validMediaItems
        : (thumb ? [toMedia(thumb, { alt: project.title })] : [{ type: 'image', src: null, orientation: 'landscape' }])

      return {
        id: project.id,
        repo: `https://github.com/Hritik-Kumar-dev/${project.id}`, // Default repo URL
        live: null, // deployed URL; leave it null and the chip renders inert
        title: project.title,
        description: project.description,
        category: project.category,
        thumb,
        thumbAspect: '16 / 9', // Default aspect ratio
        cardMedia,
        media,
        order: project.order ?? 0
      }
    })
  }, [projectsData])

  // Extract unique categories from processed projects
  const categories = useMemo(() => {
    const cats = [...new Set(processedProjects.map(p => p.category))];
    return ['All', ...cats.sort()];
  }, [processedProjects]);

  const filtered = useMemo(
    () => (filter === 'All' ? processedProjects : processedProjects.filter((p) => p.category === filter)),
    [filter, processedProjects],
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0]

  const changeFilter = (next) => {
    setFilter(next)
    setPage(0)
  }

  const openDetail = (id) => {
    setSelectedId(id ?? filtered[0]?.id ?? null)
    setView('detail')
    window.scrollTo(0, 0)
  }

  // Skipped while a dialog is open, so one Escape only closes the top layer.
  useEffect(() => {
    if (view !== 'detail' || contactOpen || certificateOpen) return
    const onKey = (e) => e.key === 'Escape' && setView('home')
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, contactOpen, certificateOpen])

  return (
    // reducedMotion="user" drops the layout/transform animation entirely for
    // anyone who asked for less motion, across every motion component below.
    <MotionConfig reducedMotion="user">
      {/* popLayout keeps the outgoing view in place (out of the flow) while the
          other takes over, and both stay mounted long enough for the shared
          layoutId cards to morph between the grid and the detailed view. */}
      <AnimatePresence mode="popLayout" initial={false}>
        {view === 'detail' ? (
          <ProjectDetail
            key="detail"
            projects={filtered}
            selected={selected}
            onSelect={setSelectedId}
            onBack={() => setView('home')}
            filter={filter}
            onFilter={changeFilter}
          />
        ) : (
          <motion.div key="home" className="home" exit={{ opacity: 0 }} transition={exitTransition}>
            <Sidebar
              onContact={() => setContactOpen(true)}
              onCertificate={() => setCertificateOpen(true)}
            />
            <main className="right">
              <ProjectsHeader 
                filter={filter} 
                onFilter={changeFilter}
                categories={categories}
              />
              <ProjectGrid
                items={pageItems}
                page={page}
                pageCount={pageCount}
                onPage={setPage}
                onOpen={openDetail}
                onDetailed={() => openDetail()}
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outside AnimatePresence: the sidebar animates with a transform, which
          would otherwise become the containing block for a fixed overlay. */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <CertificateModal open={certificateOpen} onClose={() => setCertificateOpen(false)} />

      {/* Fixed to the viewport corner, so it survives the home <-> detail swap. */}
      <ThemeToggle />
    </MotionConfig>
  )
}
