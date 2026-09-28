import { useEffect, useState } from 'react'

// Matches a CSS media query from JS, for the couple of things CSS alone cannot
// express (which animation to run, not just how to style it). The breakpoint
// itself lives in src/styles/responsive.css — keep the two in step.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = () => setMatches(list.matches)
    // Catches a width change between the first render and this effect, so the
    // JS never disagrees with the layout it is about to animate.
    onChange()
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}
