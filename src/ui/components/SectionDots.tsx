import { useEffect, useState } from 'react'
import { useTravel } from '@/hooks/useTravel'
import { NAV } from '@/lib/content'

/**
 * One small dot per section, fixed at the left edge of the page. The dot of the section under the
 * viewport's centre grows and turns brand blue; the column only shows while one of them is on screen.
 */
export function SectionDots() {
  const travel = useTravel()
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const middle = window.innerHeight / 2
      let current: number | null = null
      NAV.forEach((item, index) => {
        const box = document.querySelector(item.href)?.getBoundingClientRect()
        if (box && box.top <= middle && box.bottom > middle) current = index
      })
      setActive(current)
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
    <nav
      aria-label="Ir a una sección"
      data-visible={active !== null}
      className="section-dots fixed top-1/2 left-2 z-40 -translate-y-1/2 md:left-5"
    >
      <ul className="flex flex-col gap-1">
        {NAV.map((item, index) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={travel}
              aria-label={`Ir a ${item.label}`}
              aria-current={active === index ? 'true' : undefined}
              className="grid size-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span
                className={`block size-1.5 rounded-full transition-[background-color,scale] duration-500 ease-out ${active === index ? 'scale-[1.8] bg-primary' : 'bg-ink/25 hover:bg-ink/45'}`}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
