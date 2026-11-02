import { Canvas } from '@react-three/fiber'
import { Suspense, type RefObject } from 'react'

interface ExperienceProps {
  /** The canvas sits behind the DOM, so pointer events are read from this wrapper. */
  eventSource: RefObject<HTMLDivElement>
}

/**
 * The single WebGL canvas, fixed full-screen behind the page. Scenes go in
 * `canvas/scenes/`, each clipped to its section with drei's `<View>`.
 * `frameloop="demand"`: it only renders when something invalidates.
 */
export function Experience({ eventSource }: ExperienceProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 42 }}
        eventSource={eventSource}
        eventPrefix="client"
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>{/* scenes */}</Suspense>
      </Canvas>
    </div>
  )
}
