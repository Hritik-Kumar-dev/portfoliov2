// Shared motion config so every animated element moves at the same pace/feel.
export const SPRING = { type: 'spring', stiffness: 260, damping: 28 }

// Duration of the home <-> detail cross-fade.
export const FADE = 0.3

// Media slider track. A tween rather than a spring: the track has to come to
// rest exactly on a slide edge, and a spring's overshoot reads as a wobble when
// the thing moving is a full-width screenshot. The easing spends its time at the
// start and settles early, so the image has stopped moving before it is read.
export const SLIDE = { type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }
