import { useEffect, useState } from 'react'
import fallbackHeatmap from '../assets/img/heatmap.png'

// Free, no-auth contribution data: per-day { date, count, level } for the last 12 months.
const endpoint = (username) => `https://github-contributions-api.jogruber.de/v4/${username}?y=last`

const CACHE_KEY = 'gh-contrib-cache'
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

// Only the most recent weeks are drawn, which is what lets each day cell be
// large enough to read at a glance (~4 months).
const VISIBLE_WEEKS = 17
const VISIBLE_MONTHS = Math.round(VISIBLE_WEEKS / 4.345) // weeks per average month

function readCache(username) {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const { ts, username: cachedUsername, contributions } = JSON.parse(raw)
    if (cachedUsername !== username || !Array.isArray(contributions)) return null
    if (!ts || Date.now() - ts > CACHE_TTL) return null

    return contributions
  } catch {
    // localStorage can be unavailable (private mode) or hold junk — just refetch.
    return null
  }
}

function writeCache(username, contributions) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), username, contributions }))
  } catch {
    // Quota/availability errors are non-fatal: the graph still renders.
  }
}

// The API returns a flat chronological list. GitHub lays its graph out in week
// columns that start on Sunday, so bucket the days the same way. Days missing
// from the head/tail of the range stay null so the columns keep their 7 rows.
function toWeeks(days) {
  const weeks = []
  let week = new Array(7).fill(null)

  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00`).getDay()
    if (weekday === 0 && week.some(Boolean)) {
      weeks.push(week)
      week = new Array(7).fill(null)
    }
    week[weekday] = day
  }

  if (week.some(Boolean)) weeks.push(week)
  return weeks
}

const levelClass = (level) => `gh-cell gh-cell--${Math.min(4, Math.max(0, Number(level) || 0))}`

export default function GithubHeatmap({ username }) {
  const [days, setDays] = useState(() => readCache(username))
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (days) return undefined

    const controller = new AbortController()
    let active = true

    fetch(endpoint(username), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub contributions request failed: ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!active) return
        const contributions = Array.isArray(json.contributions) ? json.contributions : []
        if (!contributions.length) throw new Error('Empty contribution payload')

        writeCache(username, contributions)
        setDays(contributions)
      })
      .catch((error) => {
        if (!active || error.name === 'AbortError') return
        setFailed(true)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [username, days])

  // Can't reach the API — fall back to the static screenshot.
  if (failed) {
    return <img className="heatmap" src={fallbackHeatmap} alt={`GitHub contribution activity for ${username}`} />
  }

  const allWeeks = days ? toWeeks(days) : null
  const weeks = allWeeks ? allWeeks.slice(-VISIBLE_WEEKS) : null
  const columns = weeks ?? Array.from({ length: VISIBLE_WEEKS }, () => new Array(7).fill(null))
  // Total only the days actually on screen, so the label matches the graph.
  const total = weeks ? weeks.flat().reduce((sum, day) => sum + (day?.count ?? 0), 0) : null

  return (
    <div
      className={`gh-heatmap${weeks ? '' : ' gh-heatmap--loading'}`}
      role="group"
      aria-busy={weeks ? undefined : true}
      aria-label={
        total === null
          ? 'Loading recent GitHub contributions'
          : `GitHub contributions in the last ${VISIBLE_MONTHS} months: ${total}`
      }
    >
      {columns.map((week, w) => (
        <div className="gh-week" key={week[0]?.date ?? `week-${w}`}>
          {week.map((day, d) => (
            <span
              key={day?.date ?? `day-${w}-${d}`}
              className={weeks ? (day ? levelClass(day.level) : 'gh-cell gh-cell--blank') : 'gh-cell gh-cell--0'}
              title={day ? `${day.date}: ${day.count} contributions` : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
