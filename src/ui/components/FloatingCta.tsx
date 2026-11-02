import { QrCode } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTravel } from '@/hooks/useTravel'

/** A small pill that follows the page and jumps to the QR, hidden over the hero and the download section. */
export function FloatingCta() {
  const travel = useTravel()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const target = document.getElementById('descargar')
      const overTarget = target
        ? target.getBoundingClientRect().top < window.innerHeight * 0.6
        : false
      setShown(window.scrollY > window.innerHeight * 0.9 && !overTarget)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <a
      href="#descargar"
      onClick={travel}
      data-visible={shown}
      className="float-cta"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
    >
      <QrCode size={18} aria-hidden="true" />
      <span>Descargar la app</span>
    </a>
  )
}
