import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useTravelStop } from '@/hooks/useSectionDock'
import { useTravel } from '@/hooks/useTravel'
import { SITE } from '@/lib/content'
import { useAppStore } from '@/store/useAppStore'
import { Nav } from '@/ui/components/Nav'
import { PhonePair } from '@/ui/components/PhonePair'
import { HeroGradient } from '@/ui/primitives/HeroGradient'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  mobile: boolean
}

/** The opening card: the claim, the gradient and the 3D phone showing the app's welcome screen. */
export function Hero({ mobile }: HeroProps) {
  const [track, setTrack] = useState<HTMLElement | null>(null)
  const trackRef = useRef<HTMLElement | null>(null)
  const setViewport = useAppStore((state) => state.setHeroViewport)
  const setHeroExit = useAppStore((state) => state.setHeroExit)
  const travel = useTravel()
  useTravelStop(trackRef)

  const assign = useCallback((element: HTMLElement | null) => {
    trackRef.current = element
    setTrack(element)
  }, [])

  useGSAP(
    () => {
      if (!track || mobile) return
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        // Tie the exit to the last stretch of the sticky card, before the manifesto arrives.
        const exit = gsap.timeline({
          scrollTrigger: { trigger: track, start: 'bottom 140%', end: 'bottom 35%', scrub: 0.8 },
        })
        exit.to('[data-hero-content]', { y: -35, autoAlpha: 0, ease: 'none' }, 0)
        exit.to('[data-hero-white]', { opacity: 1, ease: 'none' }, 0)
        exit.to('[data-hero-card]', { scale: 0.96, borderRadius: 56, ease: 'none' }, 0)
      })
      ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => setHeroExit(self.progress),
      })
      return () => media.revert()
    },
    { scope: track ?? undefined, dependencies: [track, mobile], revertOnUpdate: true },
  )

  // The height is rounded to whole pixels: 220svh is fractional on many screens, which would shift every
  // later section by that fraction and leave a hairline of the previous section showing once docked.
  return (
    <section
      ref={assign}
      id="top"
      className={`relative bg-white text-ink ${mobile ? '' : 'h-[220svh]'}`}
      style={mobile ? undefined : { height: 'round(220svh, 1px)' }}
      aria-label="Red Madero"
    >
      <div className={`${mobile ? '' : 'sticky top-0 h-svh'} p-2.5 md:p-4`}>
        <div
          data-hero-card
          className={`relative overflow-hidden rounded-[28px] md:rounded-[36px] ${mobile ? 'min-h-[calc(100svh-20px)]' : 'h-full'}`}
        >
          <HeroGradient scrollTrigger={mobile ? null : track} />
          <div
            data-hero-white
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white opacity-0"
          />
          {/* On phones the colours sit right behind the copy; a soft white veil keeps it readable. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-white/70 via-white/35 to-transparent md:hidden"
          />

          <div data-hero-content className="absolute top-5 left-5 z-10 md:top-7 md:left-9">
            <img src="/brand/logo.webp" alt="Red Madero" className="h-7 w-auto md:h-9" />
          </div>

          <Nav />

          <div className="relative grid h-full items-center gap-8 px-6 pt-24 pb-28 md:grid-cols-[1fr_1fr] md:px-14 md:pt-20 md:pb-14 lg:px-20">
            <div data-hero-content className="max-w-xl">
              <p className="eyebrow">Red Madero · Egresados del CFP N.° 405</p>
              <h1 className="mt-5 text-[clamp(2.5rem,5.4vw,5.2rem)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
                Oficios verificados en tu casa<span className="text-primary">.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">
                {SITE.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#descargar" onClick={travel} className="btn btn-dark">
                  Descargar la app
                </a>
                <a href="#como-funciona" onClick={travel} className="btn btn-glass">
                  Ver cómo funciona
                </a>
              </div>
            </div>

            <div className="relative flex justify-center md:justify-end">
              {mobile ? (
                <PhonePair left="welcome" right="home" className="max-w-sm" />
              ) : (
                <div
                  ref={setViewport}
                  data-hero-stage
                  role="img"
                  aria-label="Dos iPhone 3D con la bienvenida y el inicio de Red Madero"
                  className="relative h-[min(76svh,740px)] w-full max-w-[700px] select-none"
                />
              )}
            </div>
          </div>

          <div data-hero-content className="absolute bottom-7 left-9 hidden md:block">
            <a
              href="#como-funciona"
              onClick={travel}
              className="group flex items-center gap-3 rounded-full py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Seguí bajando
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-full border border-ink/20 transition-transform group-hover:translate-y-1"
              >
                <ArrowDown size={16} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
