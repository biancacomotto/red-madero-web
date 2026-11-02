import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

gsap.registerPlugin(ScrollTrigger)

/** Smooth scroll (Lenis) ticked by GSAP, publishing progress to the store. */
export function useSmoothScroll(): void {
  const setScrollProgress = useAppStore((state) => state.setScrollProgress)
  const setLenis = useAppStore((state) => state.setLenis)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: !reducedMotion,
      anchors: { duration: reducedMotion ? 0 : 1.6 },
    })
    setLenis(lenis)
    lenis.on('scroll', (instance: Lenis) => {
      setScrollProgress(instance.progress)
      ScrollTrigger.update()
    })

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [setScrollProgress, setLenis])
}
