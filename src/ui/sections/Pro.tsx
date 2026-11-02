import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useOnScreen, usePageVisible } from '@/hooks/useOnScreen'
import { useSectionDock } from '@/hooks/useSectionDock'
import { PRO } from '@/lib/content'
import { SCREEN_LABELS } from '@/screens'
import { useAppStore } from '@/store/useAppStore'
import { PhonePair } from '@/ui/components/PhonePair'

const HOLD_MS = 5200

interface ProProps {
  mobile: boolean
}

/** What a professional gets: two phones with the requests, the budget editor, the agenda and the wallet. */
export function Pro({ mobile }: ProProps) {
  const section = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)
  const setViewport = useAppStore((state) => state.setProViewport)
  const setEnabled = useAppStore((state) => state.setProEnabled)
  const setVisible = useAppStore((state) => state.setProVisible)
  const ready = useAppStore((state) => state.proReady)
  const pair = useAppStore((state) => state.proPair)
  const [left, right] = PRO.pairs[pair] ?? PRO.pairs[0]
  useSectionDock(section)

  useEffect(() => {
    const element = section.current
    if (!element || mobile) return
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true)
          nearby.disconnect()
        }
      },
      { rootMargin: '600px' },
    )
    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          reveal.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.12),
      { threshold: [0, 0.12] },
    )
    nearby.observe(element)
    reveal.observe(element)
    observer.observe(element.querySelector('[data-pro-stage]') ?? element)
    return () => {
      nearby.disconnect()
      reveal.disconnect()
      observer.disconnect()
      setVisible(false)
    }
  }, [mobile, setEnabled, setVisible])

  return (
    <section
      ref={section}
      id="profesionales"
      className="relative bg-white text-ink md:h-svh"
      aria-labelledby="pro-title"
    >
      <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-8 overflow-hidden px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:grid-rows-[minmax(0,1fr)] md:gap-6 md:px-14 md:py-12 lg:px-20">
        <div
          className={`relative z-30 max-w-lg self-center transition-[opacity,transform] duration-1000 motion-reduce:transition-none ${entered || mobile ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <p className="eyebrow">Para profesionales</p>
          <h2
            id="pro-title"
            className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance"
          >
            {PRO.title}
          </h2>
          <ul className="mt-7 space-y-3">
            {PRO.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-base leading-relaxed text-ink-muted md:text-lg"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary-lighter text-primary"
                >
                  <Check size={14} strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex min-h-0 min-w-0 flex-col justify-center self-stretch">
          {mobile ? (
            <MobilePhones />
          ) : (
            <div
              ref={setViewport}
              data-pro-stage
              role="img"
              aria-label="Dos iPhone 3D con la app para profesionales; sus pantallas cambian solas cada pocos segundos."
              className="relative min-h-0 w-full flex-1 select-none md:max-h-[840px]"
            >
              <span aria-hidden="true" className="pro-blob pro-blob-a" />
              <span aria-hidden="true" className="pro-blob pro-blob-b" />
              {!ready && (
                <div className="absolute inset-0 grid place-items-center">
                  <span role="status" className="text-xs text-ink-faint">
                    Cargando…
                  </span>
                </div>
              )}
            </div>
          )}
          {!mobile && (
            <p className="sr-only" aria-live="polite">
              Pantallas {pair + 1} de {PRO.pairs.length}: {SCREEN_LABELS[left]} y{' '}
              {SCREEN_LABELS[right]}.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

/** Two flat phones that take turns through the same pairs of screens. */
function MobilePhones() {
  const { ref, entered, visible } = useOnScreen<HTMLDivElement>()
  const pageVisible = usePageVisible()
  const [active, setActive] = useState(0)
  const [left, right] = PRO.pairs[active]

  useEffect(() => {
    if (!entered || !visible || !pageVisible) return
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % PRO.pairs.length),
      HOLD_MS,
    )
    return () => window.clearTimeout(timer)
  }, [entered, visible, pageVisible, active])

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Dos teléfonos con la app para profesionales: ${SCREEN_LABELS[left]} y ${SCREEN_LABELS[right]}.`}
      className="relative mx-auto w-full max-w-sm"
    >
      <span aria-hidden="true" className="pro-blob pro-blob-a" />
      <span aria-hidden="true" className="pro-blob pro-blob-b" />
      {PRO.pairs.map(([first, second], index) => (
        <div
          key={index}
          aria-hidden={active !== index}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${active === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <PhonePair left={first} right={second} />
        </div>
      ))}
    </div>
  )
}
