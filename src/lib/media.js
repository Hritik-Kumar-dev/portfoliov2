// Single source of truth for project media: what a source *is*, how to turn a
// hand-written entry into a canonical item, and the small helpers the data file
// uses. Cards and the detail gallery both render through this, so a project can
// mix bundled imports, CDN URLs and video links without either view caring.

// 'image' | 'video' (a file we play ourselves) | 'embed' (a page we iframe)
export const MEDIA_TYPES = ['image', 'video', 'embed']

export const ORIENTATIONS = ['landscape', 'portrait']

const YOUTUBE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/
const VIDEO_FILE = /\.(mp4|webm|ogv|ogg|mov|m4v)(?:[?#]|$)/i

const youtubeId = (src) => src.match(YOUTUBE)?.[1] ?? null
const vimeoId = (src) => src.match(VIMEO)?.[1] ?? null

// A direct video file plays in a <video>; a YouTube/Vimeo page needs an <iframe>;
// anything else is treated as an image. Detection is by URL, so a link without a
// file extension can be pinned with an explicit `type`.
export function mediaKind(src) {
  if (!src) return null
  if (VIDEO_FILE.test(src)) return 'video'
  if (youtubeId(src) || vimeoId(src)) return 'embed'
  return 'image'
}

// Embed URL carrying the flags that make a shared link behave like a card video:
// muted, looping, no chrome. `controls` is only worth leaving on in the gallery.
export function embedSrc(src, { controls = true } = {}) {
  const yt = youtubeId(src)
  if (yt) {
    // YouTube only honours `loop` when `playlist` repeats the same id.
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: yt,
      controls: controls ? '1' : '0',
      playsinline: '1',
      modestbranding: '1',
      rel: '0',
    })
    return `https://www.youtube-nocookie.com/embed/${yt}?${params}`
  }

  const vimeo = vimeoId(src)
  if (vimeo) {
    const params = new URLSearchParams({
      autoplay: '1',
      muted: '1',
      loop: '1',
      controls: controls ? '1' : '0',
      // Vimeo's own name for the chromeless, cover-style playback.
      background: controls ? '0' : '1',
    })
    return `https://player.vimeo.com/video/${vimeo}?${params}`
  }

  return src
}

// Authoring sugar, so the data file reads as intent rather than shape.
export const image = (src, orientation = 'landscape', extra = {}) => ({
  type: 'image',
  src,
  orientation,
  ...extra,
})

export const video = (src, orientation = 'landscape', extra = {}) => ({
  type: 'video',
  src,
  orientation,
  ...extra,
})

// Accepts the long form, a bare URL string, or an image()/video() result and
// returns one canonical item: { type, src, orientation, poster, alt }.
export function toMedia(entry, defaults = {}) {
  if (!entry) return null

  if (typeof entry === 'string') {
    return { type: mediaKind(entry), src: entry, orientation: 'landscape', ...defaults }
  }

  if (typeof entry !== 'object' || !entry.src) return null

  const { src, type, orientation, poster, alt } = entry
  return {
    // An explicit type wins, so an extensionless CDN link can be forced.
    type: MEDIA_TYPES.includes(type) ? type : mediaKind(src),
    src,
    orientation: ORIENTATIONS.includes(orientation) ? orientation : 'landscape',
    poster: poster ?? defaults.poster,
    alt,
  }
}

// Dev-only guard rail for the hand-edited data file. Silently wrong media is the
// expensive kind of mistake to find in a browser, so say it in the console.
export function warnAboutMedia(project, where) {
  if (!import.meta.env.DEV) return

  if (!project.title) console.warn(`[projects] entry ${where} has no title`)
  if (project.thumb && mediaKind(project.thumb) !== 'image') {
    console.warn(
      `[projects] "${project.title}": thumb should be an image — use cardVideo for video "` +
        `${project.thumb}"`,
    )
  }
  if (project.cardVideo && mediaKind(project.cardVideo) === null) {
    console.warn(`[projects] "${project.title}": cardVideo is not a usable URL`)
  }
  for (const entry of project.media ?? []) {
    if (typeof entry === 'object' && entry && entry.src === undefined) {
      console.warn(`[projects] "${project.title}": a media entry has no src`, entry)
    }
    if (typeof entry === 'object' && entry && entry.src && !toMedia(entry)) {
      console.warn(`[projects] "${project.title}": unusable media entry`, entry)
    }
  }
}
