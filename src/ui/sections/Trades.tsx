import {
  AirVent,
  CarFront,
  CircuitBoard,
  Cog,
  Flame,
  MonitorCog,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSectionDock } from '@/hooks/useSectionDock'
import { TRADES, VERIFICATION, type Palette, type Trade } from '@/lib/content'

const ICONS: Record<Trade['icon'], LucideIcon> = {
  Zap,
  Flame,
  AirVent,
  MonitorCog,
  CircuitBoard,
  Cog,
  CarFront,
}

/** Card colours per trade, from the app's label chips and info cards. */
const COLORS: Record<Palette, { bg: string; ink: string }> = {
  blue: { bg: 'var(--color-label-blue-bg)', ink: 'var(--color-label-blue)' },
  orange: { bg: 'var(--color-label-orange-bg)', ink: 'var(--color-label-orange)' },
  sky: { bg: 'var(--color-info-sky)', ink: 'var(--color-primary-dark)' },
  purple: { bg: 'var(--color-info-lilac)', ink: 'var(--color-label-purple)' },
  yellow: { bg: 'var(--color-label-yellow-bg)', ink: 'var(--color-label-yellow)' },
  mint: { bg: 'var(--color-info-mint)', ink: 'var(--color-label-green)' },
  pink: { bg: 'var(--color-info-pink)', ink: 'var(--color-label-pink)' },
}

/** The seven trades taught at the Instituto Madero and how a professional gets verified before working. */
export function Trades() {
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
      id="oficios"
      data-entered={entered}
      className="relative overflow-hidden bg-white text-ink md:h-svh"
      aria-labelledby="oficios-title"
    >
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-8 px-6 py-16 md:gap-10 md:px-14 md:py-10 lg:px-20">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-14">
          <div className="reveal" style={{ '--delay': '0ms' } as CSSProperties}>
            <p className="eyebrow">Oficios</p>
            <h2
              id="oficios-title"
              className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance"
            >
              Siete oficios, un mismo estándar.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">
              Todos egresados del Instituto Madero, el Centro de Formación Profesional N.° 405.
              Buscás por oficio y ves quién lo resuelve cerca tuyo.
            </p>
          </div>
          <ul className="trade-grid" aria-label="Oficios disponibles">
            {TRADES.map((trade, index) => {
              const Icon = ICONS[trade.icon]
              const colors = COLORS[trade.palette]
              return (
                <li
                  key={trade.name}
                  className="trade-card reveal"
                  style={
                    {
                      '--delay': `${120 + index * 60}ms`,
                      '--card-bg': colors.bg,
                      '--card-ink': colors.ink,
                    } as CSSProperties
                  }
                >
                  <span className="trade-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <span className="trade-text">
                    <strong>{trade.name}</strong>
                    {trade.full && <small>{trade.full}</small>}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="verification-panel reveal" style={{ '--delay': '560ms' } as CSSProperties}>
          <div className="verification-intro">
            <p className="eyebrow text-primary-sky">Verificación</p>
            <h3>Cada perfil, revisado uno por uno.</h3>
          </div>
          <ol className="verification" aria-label="Cómo verificamos a cada profesional">
            {VERIFICATION.map((item, index) => (
              <li key={item.title}>
                <span className="verification-num" aria-hidden="true">
                  {index + 1}
                </span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
          <img
            src="/mascota/lupa.webp"
            alt="El castor de Red Madero con una lupa"
            className="verification-mascot"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
