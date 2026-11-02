import { useGSAP } from '@gsap/react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { MathUtils } from 'three'
import { HeroMaterial, type HeroMaterialImpl } from '@/canvas/materials/HeroMaterial'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** The picture is blurry by nature, so it is drawn at a fraction of the screen resolution and upscaled. */
const PIXEL_RATIO = 0.5
/** How fast the scroll uniform catches up with the page, so a flick does not jump the colours. */
const SCROLL_DAMPING = 6

interface HeroGradientProps {
  /** Element whose scroll range turns the colour wheel. Without it the gradient only drifts. */
  scrollTrigger?: HTMLElement | null
}

/** Flowing pastel gradient that fills its positioned parent, drawn by a shader on its own small canvas. */
export function HeroGradient({ scrollTrigger }: HeroGradientProps) {
  const container = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [onScreen, setOnScreen] = useState(true)
  const reduced = useReducedMotion()

  // Stop drawing once the card has scrolled away; the sections below have their own canvas work.
  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      if (!scrollTrigger) return
      ScrollTrigger.create({
        trigger: scrollTrigger,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progress.current = self.progress
        },
      })
    },
    { scope: container, dependencies: [scrollTrigger] },
  )

  const frameloop = reduced ? 'demand' : onScreen ? 'always' : 'never'

  return (
    <div ref={container} aria-hidden className="absolute inset-0 bg-white">
      <Canvas
        frameloop={frameloop}
        dpr={PIXEL_RATIO}
        flat
        gl={{
          antialias: false,
          alpha: false,
          depth: false,
          stencil: false,
          powerPreference: 'low-power',
        }}
        className="absolute inset-0"
      >
        <GradientQuad progress={progress} />
      </Canvas>
    </div>
  )
}

function GradientQuad({ progress }: { progress: RefObject<number> }) {
  const material = useRef<HeroMaterialImpl>(null)

  // Per-frame work mutates the material through its ref; no React state here or it re-renders 60 times a second.
  useFrame((state, delta) => {
    const mat = material.current
    if (!mat) return
    mat.uTime = state.clock.elapsedTime
    mat.uAspect = state.size.width / state.size.height
    mat.uScroll = MathUtils.damp(mat.uScroll, progress.current, SCROLL_DAMPING, delta)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <heroMaterial key={HeroMaterial.key} ref={material} />
    </mesh>
  )
}
