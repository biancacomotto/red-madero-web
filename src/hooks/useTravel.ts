import { useCallback, type MouseEvent } from 'react'
import { travelTo } from '@/hooks/useSectionDock'
import { useAppStore } from '@/store/useAppStore'

/** Click handler for in-page links: travels through the smooth scroll, so sections passed on the way do not dock. */
export function useTravel() {
  const lenis = useAppStore((state) => state.lenis)
  return useCallback(
    (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      const href = event.currentTarget.getAttribute('href') ?? event.currentTarget.dataset.href
      if (!href?.startsWith('#')) return
      const target = document.querySelector<HTMLElement>(href)
      if (!target) return
      event.preventDefault()
      const top = target.getBoundingClientRect().top + window.scrollY
      if (lenis) travelTo(lenis, top, target)
      else window.scrollTo({ top, behavior: 'smooth' })
    },
    [lenis],
  )
}
