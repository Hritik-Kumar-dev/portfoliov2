import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import ProjectsHeader from './components/ProjectsHeader'
import ProjectGrid from './components/ProjectGrid'
import ProjectDetail from './components/ProjectDetail'
import { projects } from './data/projects'

const PAGE_SIZE = 5

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'detail'
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
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

  useEffect(() => {
    if (view !== 'detail') return
    const onKey = (e) => e.key === 'Escape' && setView('home')
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view])

  if (view === 'detail') {
    return (
      <ProjectDetail
        projects={filtered}
        selected={selected}
        onSelect={setSelectedId}
        onBack={() => setView('home')}
        filter={filter}
        onFilter={changeFilter}
      />
    )
  }

  return (
    <div className="home">
      <Sidebar />
      <main className="right">
        <ProjectsHeader filter={filter} onFilter={changeFilter} />
        <ProjectGrid
          items={pageItems}
          page={page}
          pageCount={pageCount}
          onPage={setPage}
          onOpen={openDetail}
          onDetailed={() => openDetail()}
        />
      </main>
    </div>
  )
}
