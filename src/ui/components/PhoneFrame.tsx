import { useEffect, useRef } from 'react'
import { paintScreen, SCREEN_LABELS, screensReady, type ScreenId } from '@/screens'

interface PhoneFrameProps {
  screen: ScreenId
  className?: string
  /** Replaces the default description of what the phone shows. */
  label?: string
}

/** A flat phone drawn with CSS whose display is painted by the same painters as the 3D phones. */
export function PhoneFrame({ screen, className = '', label }: PhoneFrameProps) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current
    if (!element) return
    let cancelled = false
    const paint = () => {
      void screensReady().then((assets) => {
        if (cancelled) return
        const context = element.getContext('2d')
        if (!context) return
        const scale = Math.min(2, window.devicePixelRatio || 1)
        const width = Math.max(1, Math.round((element.clientWidth || 390) * scale))
        element.width = width
        element.height = Math.round(width * (844 / 390))
        paintScreen(context, screen, assets)
      })
    }
    paint()
    const observer = new ResizeObserver(paint)
    observer.observe(element)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [screen])

  return (
    <div
      className={`m-phone relative ${className}`}
      role="img"
      aria-label={label ?? `Un teléfono con ${SCREEN_LABELS[screen]}`}
    >
      <div className="m-phone-screen">
        <canvas ref={canvas} className="absolute inset-0 size-full" />
      </div>
    </div>
  )
}
