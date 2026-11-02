import { PerspectiveCamera, View } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { lazy, Suspense, useEffect, useMemo, type RefObject } from 'react'
import { HeroPhoneScene } from '@/canvas/scenes/HeroPhoneScene'
import { Warmup } from '@/canvas/Warmup'
import { useAppStore } from '@/store/useAppStore'

const FlowPhoneScene = lazy(() =>
  import('@/canvas/scenes/FlowPhoneScene').then((module) => ({ default: module.FlowPhoneScene })),
)
const ProPhonesScene = lazy(() =>
  import('@/canvas/scenes/ProPhonesScene').then((module) => ({ default: module.ProPhonesScene })),
)

interface ExperienceProps {
  /** The canvas sits above the DOM with pointer events off, so it reads them from this wrapper. */
  eventSource: RefObject<HTMLDivElement>
}

/** Keeps the shared canvas clean between the Views and redraws it whenever the page moves. */
function Housekeeping() {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    const update = () => invalidate()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [invalidate])
  useFrame((state) => {
    // View owns the render loop; clear its previous position before drawing the next frame.
    state.gl.setScissorTest(false)
    state.gl.setViewport(0, 0, state.size.width, state.size.height)
    state.gl.clear(true, true, true)
  })
  return null
}

function useTrack(viewport: HTMLDivElement | null) {
  return useMemo(() => (viewport ? { current: viewport } : undefined), [viewport])
}

/** The single WebGL canvas, fixed full-screen; each View clips its phones to the DOM stage it tracks. */
export function Experience({ eventSource }: ExperienceProps) {
  const heroTrack = useTrack(useAppStore((state) => state.heroViewport))
  const flowTrack = useTrack(useAppStore((state) => state.flowViewport))
  const flowEnabled = useAppStore((state) => state.flowEnabled)
  const flowVisible = useAppStore((state) => state.flowVisible)
  const proTrack = useTrack(useAppStore((state) => state.proViewport))
  const proEnabled = useAppStore((state) => state.proEnabled)
  const proVisible = useAppStore((state) => state.proVisible)

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 36 }}
        eventSource={eventSource}
        eventPrefix="client"
        gl={{ alpha: true, antialias: true }}
      >
        <Housekeeping />
        {heroTrack && (
          <View track={heroTrack} index={1}>
            <PerspectiveCamera makeDefault position={[0, 0, 7.6]} fov={36} />
            <Suspense fallback={null}>
              <HeroPhoneScene />
              <Warmup />
            </Suspense>
          </View>
        )}
        {flowTrack && flowEnabled && (
          <View track={flowTrack} visible={flowVisible} index={2}>
            <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={36} />
            <Suspense fallback={null}>
              <FlowPhoneScene />
              <Warmup />
            </Suspense>
          </View>
        )}
        {proTrack && proEnabled && (
          <View track={proTrack} visible={proVisible} index={3}>
            <PerspectiveCamera makeDefault position={[0, 0.25, 8.4]} fov={36} />
            <Suspense fallback={null}>
              <ProPhonesScene />
              <Warmup />
            </Suspense>
          </View>
        )}
      </Canvas>
    </div>
  )
}
