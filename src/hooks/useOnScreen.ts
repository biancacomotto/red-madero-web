import { useEffect, useRef, useState } from 'react'

/** Whether a section has ever been reached (`entered`) and whether enough of it is on screen right now (`visible`). */
export function useOnScreen<T extends HTMLElement>(ratio = 0.15) {
  const ref = useRef<T>(null)
  const [entered, setEntered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const shown = entry.isIntersecting && entry.intersectionRatio >= ratio
        setVisible(shown)
        if (shown) setEntered(true)
      },
      { threshold: [0, ratio] },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ratio])

  return { ref, entered, visible }
}

/** False while the tab is in the background, so carousels do not advance unseen. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return visible
}
