import { BadgeCheck, Flag, HandCoins, Lock, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSectionDock } from '@/hooks/useSectionDock'
import { TRUST, type TrustItem } from '@/lib/content'

const ICONS: Record<TrustItem['icon'], LucideIcon> = { BadgeCheck, Flag, Lock, HandCoins }

/** Why it is safe to let someone in: verification, reporting, data and payments. */
export function Trust() {
  const section = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)
  useSectionDock(section)

  useEffect(() => {
    const element = section.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setEntered(true)
        observer.disconnect()
      },
      { threshold: 0.3 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={section}
      id="confianza"
      data-entered={entered}
      className="relative overflow-hidden bg-surface-soft text-ink md:h-svh"
      aria-labelledby="confianza-title"
    >
      <div className="mx-auto grid h-full max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:px-14 md:py-10 lg:px-20">
        <div
          className="reveal flex flex-col items-start gap-6"
          style={{ '--delay': '0ms' } as CSSProperties}
        >
          <img
            src="/mascota/avion.webp"
            alt="El castor de Red Madero lanza un avión de papel junto a una tilde de aprobado"
            className="w-[min(50vw,220px)] md:w-[min(18vw,260px)]"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="eyebrow">Confianza</p>
            <h2
              id="confianza-title"
              className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance"
            >
              Confianza en cada paso.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">
              Dejar entrar a alguien a tu casa pide más que una buena reseña. Por eso cada parte del
              recorrido está pensada para que sepas con quién tratás.
            </p>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2" aria-label="Medidas de seguridad">
          {TRUST.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <li
                key={item.title}
                className="trust-card reveal"
                style={{ '--delay': `${150 + index * 90}ms` } as CSSProperties}
              >
                <span className="trust-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={2} />
                </span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
