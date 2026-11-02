import { useEffect, useState } from 'react'

/** The ring never jumps: it takes at least this long to go from empty to full. */
const FILL_DURATION_MS = 1400
/** The pause with the ring closed, before the page is revealed. */
const FULL_PAUSE_MS = 500
/** Geometry of the progress ring, in its own viewBox units. */
const RING_RADIUS = 56
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

interface LoaderProps {
  progress: number
  onComplete: () => void
}

/** The beaver waits inside a ring that closes as fonts, pictures and the 3D phones get ready. */
export function Loader({ progress, onComplete }: LoaderProps) {
  const [display, setDisplay] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const done = display >= 100

  // Real loading sets the destination; this animation only smooths the movement.
  useEffect(() => {
    let frame: number
    let previousTime: number | undefined
    const animate = (time: number) => {
      const delta = previousTime === undefined ? 0 : Math.min(time - previousTime, 64)
      previousTime = time
      setDisplay((current) => Math.min(progress, current + delta * (100 / FILL_DURATION_MS)))
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [progress])

  useEffect(() => {
    if (!done) return
    const timeout = window.setTimeout(() => setLeaving(true), FULL_PAUSE_MS)
    return () => window.clearTimeout(timeout)
  }, [done])

  return (
    <div
      className={`loader fixed inset-0 z-[100] grid place-items-center bg-white text-ink ${leaving ? 'loader-leaving' : ''}`}
      data-lenis-prevent
      data-done={done}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget) onComplete()
      }}
    >
      <div className="flex flex-col items-center gap-7">
        <div
          className="loader-badge"
          role="progressbar"
          aria-label={done ? 'Red Madero listo' : 'Cargando Red Madero'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.floor(display)}
        >
          <svg className="loader-ring" viewBox="0 0 128 128" aria-hidden="true">
            <circle cx="64" cy="64" r={RING_RADIUS} className="loader-ring-track" />
            <circle
              cx="64"
              cy="64"
              r={RING_RADIUS}
              className="loader-ring-fill"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - display / 100)}
            />
          </svg>
          <img src="/mascota/cara.webp" alt="" className="loader-face" draggable={false} />
        </div>
        <img src="/brand/logo.webp" alt="Red Madero" className="h-8 w-auto" />
        <p
          className="text-[11px] font-semibold tracking-[0.22em] text-ink-muted uppercase"
          aria-hidden="true"
        >
          Oficios verificados en tu casa
        </p>
      </div>
    </div>
  )
}
