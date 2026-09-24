import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

// The inline script in index.html has already resolved the theme, so trust the
// attribute over any default here (it also covers OS preference on first visit).
const readTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

// Icons are inline rather than imported SVG files: they have to follow the
// theme's text colour, and an <img> can't inherit currentColor.
function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.5 5.5l1.6 1.6M16.9 16.9l1.6 1.6M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 15.3A8.6 8.6 0 0 1 8.7 3.5a8.6 8.6 0 1 0 11.8 11.8Z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Quota/unavailability is non-fatal — the theme still applies for this visit.
    }
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    // The icon shows the theme you'd switch *to*, not the one you're in.
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {next === 'light' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
