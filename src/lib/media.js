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

// ─── Delivery ──────────────────────────────────────────────────────────────
// The data file points at whatever was uploaded, which is full-size originals:
// a PNG screenshot several times wider than the 660px gallery, and the same
// file again for a 150px thumbnail in the rail. Cloudinary re-encodes and
// resizes on the fly, so the same URL is asked for a modern format at the size
// it is actually going to be painted at.

const CLOUDINARY_IMAGE = /^(https?:\/\/[^/]+\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/

// Largest an image is ever painted: the 660px gallery at 2x, plus a little
// slack. Caps the fallback for a browser that ignores srcset entirely.
export const MAX_IMAGE_WIDTH = 1400

// One transformation set for an image URL, or the URL untouched — anything that
// is not a Cloudinary image (a bundled import, another CDN) has to keep working
// exactly as it is.
export function optimised(src, { width } = {}) {
  if (typeof src !== 'string') return src
  const match = src.match(CLOUDINARY_IMAGE)
  if (!match) return src

  const [, prefix, rest] = match
  // An underscore in the first path segment is a transformation that is
  // already there (or a folder that happens to contain one). Either way,
  // leave the URL alone rather than transform it twice.
  if (rest.split('/')[0].includes('_')) return src

  const transforms = ['f_auto', 'q_auto']
  if (width) transforms.push('c_limit', `w_${width}`)

  return `${prefix}${transforms.join(',')}/${rest}`
}

// A srcset for the widths an image is really rendered at, so a 150px
// thumbnail never downloads the 660px gallery's file. Returns undefined when
// the URL cannot be resized, because a srcset of one repeated URL is worse than
// no srcset at all.
export function srcSetFor(src, widths) {
  if (typeof src !== 'string' || !widths?.length) return undefined
  if (optimised(src, { width: widths[0] }) === src) return undefined
  return widths.map((width) => `${optimised(src, { width })} ${width}w`).join(', ')
}

const CLOUDINARY_VIDEO = /^(https?:\/\/[^/]+\.cloudinary\.com\/[^/]+\/video\/upload\/)(.+)$/

// Video is by far the heaviest thing on the page: the card clip in the data
// file is a 15MB upload, and the grid can have two of them going at once. The
// same CDN re-encodes it on request — asking for H.264 at the width it is
// painted at takes that to a couple of hundred kilobytes, and needs no
// re-upload.
export function optimisedVideo(src, { width } = {}) {
  if (typeof src !== 'string') return src
  const match = src.match(CLOUDINARY_VIDEO)
  if (!match) return src

  const [, prefix, rest] = match
  if (rest.split('/')[0].includes('_')) return src

  const transforms = ['q_auto', 'vc_h264']
  // c_scale, not c_limit: a video is scaled to the width asked for, and the
  // letterboxing c_limit would add is not wanted on a full-bleed card.
  if (width) transforms.push('c_scale', `w_${width}`)

  return `${prefix}${transforms.join(',')}/${rest}`
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
