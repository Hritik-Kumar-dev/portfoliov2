import { useState } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '../lib/transitions'
import Splitter from './Splitter'
import ProjectLinks from './ProjectLinks'
import ProjectMedia from './ProjectMedia'

// Track shares taken from the 1440x1024 frame, so double-click resets to the design.
const DEFAULT_SIZES = {
  halves: 0.534, // bento-top's share of the full bento height
  topCol: 0.573, // bento-top left column share
  topRow: 0.454, // bento-top upper row share (left column only — card "e" spans both)
  bottomCol: 0.421, // bento-bottom left column share
  bottomRow: 0.749, // bento-bottom upper row share (right column only — card "d" spans both)
}

// Every draggable gutter. `gap` is the CSS gutter it sits in, which the drag
// maths needs so a fraction maps exactly onto the fr tracks.
const BOUNDARIES = {
  topCol: { axis: 'x', gap: 18, min: 0.3, max: 0.8, name: 'columns' },
  topRow: { axis: 'y', gap: 19, min: 0.25, max: 0.75, name: 'rows' },
  bottomCol: { axis: 'x', gap: 17, min: 0.25, max: 0.75, name: 'columns' },
  bottomRow: { axis: 'y', gap: 0, min: 0.5, max: 0.85, name: 'rows' },
  halves: { axis: 'y', gap: 16, min: 0.3, max: 0.75, name: 'sections' },
}

// One handle per resizable card edge, plus a corner wherever two meet. Handles
// live inside the grid they resize, so CSS can place them from the same shares.
const HANDLES = {
  top: [
    { className: 'bento-split--a-right', boundaries: ['topCol'], label: 'Resize the left column' },
    { className: 'bento-split--b-right', boundaries: ['topCol'], label: 'Resize the left column' },
    { className: 'bento-split--a-bottom', boundaries: ['topRow'], label: 'Resize the upper row' },
    {
      className: 'bento-split--top-corner',
      boundaries: ['topCol', 'topRow'],
      label: 'Resize the top-left card',
    },
  ],
  bottom: [
    { className: 'bento-split--d-right', boundaries: ['bottomCol'], label: 'Resize the featured column' },
    { className: 'bento-split--c-bottom', boundaries: ['bottomRow'], label: 'Resize the projects row' },
    {
      className: 'bento-split--bottom-corner',
      boundaries: ['bottomCol', 'bottomRow'],
      label: 'Resize the featured card',
    },
  ],
  bento: [
    {
      className: 'bento-split--halves',
      boundaries: ['halves'],
      label: 'Resize the top and bottom sections',
    },
  ],
}

// Track lists are passed as custom properties rather than inline grid-template-*
// declarations, so the responsive breakpoint can still switch the bento to its
// stacked layout (an inline style would win over the stylesheet).
const tracks = (value) => `${value}fr ${1 - value}fr`

function Chevron({ dir }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === 'left' ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

export default function ProjectGrid({ items, page, pageCount, onPage, onOpen, onDetailed }) {
  const [sizes, setSizes] = useState(DEFAULT_SIZES)
  const [resizing, setResizing] = useState(false)

  const top = items.slice(0, 3)
  const bottom = items.slice(3, 5)

  // While a splitter is dragged the cards have to track the pointer exactly, so
  // the shared-layout spring is swapped for an instant transition.
  const cardTransition = resizing ? { duration: 0 } : SPRING

  const splitters = (group) =>
    HANDLES[group].map(({ className, boundaries, label }) => (
      <Splitter
        key={className}
        className={className}
        label={label}
        axes={boundaries.map((key) => ({
          ...BOUNDARIES[key],
          value: sizes[key],
          onChange: (value) => setSizes((prev) => ({ ...prev, [key]: value })),
        }))}
        onReset={() =>
          setSizes((prev) => {
            const next = { ...prev }
            boundaries.forEach((key) => {
              next[key] = DEFAULT_SIZES[key]
            })
            return next
          })
        }
        onResizeStart={() => setResizing(true)}
        onResizeEnd={() => setResizing(false)}
      />
    ))

  // Slot classes map to the bento areas from the design.
  // Order: 1 top-left, 2 top-right (tall), 3 middle-left, 4 bottom-left (tall), 5 bottom-right.
  const slots = ['a', 'e', 'b', 'd', 'c']
  const card = (project, i) => {
    // The media carries the shared layoutId, so the screenshot — not the card's
    // text — is what grows into the detailed view.
    const mediaProps = {
      className: 'card-media',
      layoutId: `project-${project.id}`,
      transition: cardTransition,
    }

    return (
      <motion.article
        key={project.id}
        className="card"
        style={{ gridArea: slots[i] }}
        layout
        transition={cardTransition}
      >
        {/* Handles a still, a CDN video file, or a YouTube/Vimeo link alike. */}
        <ProjectMedia item={project.cardMedia} motionProps={mediaProps} controls={false} />

        <div className="card-scrim" aria-hidden="true" />

        <div className="card-meta">
          <div className="card-text">
            <h3 className="card-title">{project.title}</h3>
            <p className="card-desc">{project.description}</p>
          </div>
          <ProjectLinks project={project} className="card-actions" />
        </div>

        <button
          type="button"
          className="card-open"
          aria-label={`Open ${project.title}`}
          onClick={() => onOpen(project.id)}
        />
      </motion.article>
    )
  }

  if (items.length === 0) {
    return <p className="empty">No projects in this category yet.</p>
  }

  return (
    <div
      className="bento"
      style={{
        '--halves': sizes.halves,
        '--bento-rows': tracks(sizes.halves),
      }}
    >
      <div
        className="bento-top"
        style={{
          '--top-col': sizes.topCol,
          '--top-row': sizes.topRow,
          '--top-cols': tracks(sizes.topCol),
          '--top-rows': tracks(sizes.topRow),
        }}
      >
        {top.map((p, i) => card(p, i))}
        {splitters('top')}
      </div>

      <div
        className="bento-bottom"
        style={{
          '--bottom-col': sizes.bottomCol,
          '--bottom-row': sizes.bottomRow,
          '--bottom-cols': tracks(sizes.bottomCol),
          '--bottom-rows': tracks(sizes.bottomRow),
        }}
      >
        {bottom.map((p, i) => card(p, i + 3))}
        <div className="controls">
          <div className="pager">
            <button
              type="button"
              className="pager-btn"
              aria-label="Previous page"
              disabled={page === 0}
              onClick={() => onPage(page - 1)}
            >
              <Chevron dir="left" />
            </button>
            <span className="pager-count" aria-live="polite">
              <b>{page + 1}</b>
              <span className="pager-sep">/</span>
              {pageCount}
            </span>
            <button
              type="button"
              className="pager-btn"
              aria-label="Next page"
              disabled={page >= pageCount - 1}
              onClick={() => onPage(page + 1)}
            >
              <Chevron dir="right" />
            </button>
          </div>
          <button type="button" className="detailed" onClick={onDetailed}>
            Detailed view
            <Chevron dir="right" />
          </button>
        </div>
        {splitters('bottom')}
      </div>

      {splitters('bento')}
    </div>
  )
}
