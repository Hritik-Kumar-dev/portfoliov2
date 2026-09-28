// Shared motion config so every animated element moves at the same pace/feel.
export const SPRING = { type: 'spring', stiffness: 260, damping: 28 }

// Duration of the home <-> detail cross-fade.
export const FADE = 0.3

// Media slider track. A tween rather than a spring: the track has to come to
// rest exactly on a slide edge, and a spring's overshoot reads as a wobble when
// the thing moving is a full-width screenshot. The easing spends its time at the
// start and settles early, so the image has stopped moving before it is read.
export const SLIDE = { type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }

// Stacked (single-column) hand-off between projects. The whole detail view is
// pushed off the side of the screen and turned a few degrees on the way, around
// a point at the bottom of the screen (see the transform-origin in
// ProjectDetail.jsx). Two tweens rather than one spring, because the sheet
// leaves under its own steam and then settles into place: a single spring would
// overshoot the last few degrees and leave the sheet rocking as it came to
// rest.
export const PUSH_OUT = { duration: 0.2, ease: [0.4, 0, 1, 1] }
export const PUSH_IN = { duration: 0.32, ease: [0, 0, 0.2, 1] }

// How far the sheet turns on its way off, in degrees. Small on purpose: enough
// to read as a card being flicked over, not enough to hide the content.
export const PUSH_ROTATE = 6
