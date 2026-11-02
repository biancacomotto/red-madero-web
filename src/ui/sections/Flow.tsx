import { useEffect, useRef, type CSSProperties } from 'react'
import { useSectionDock } from '@/hooks/useSectionDock'
import { STEPS, type FlowStep } from '@/lib/content'
import { SCREEN_LABELS } from '@/screens'
import { useAppStore } from '@/store/useAppStore'
import { PhoneFrame } from '@/ui/components/PhoneFrame'

/** A tint behind the phone for each step: sky, blue, turquoise and one pink. */
const TINTS = ['#D8F0FB', '#D9E7F7', '#CDEFF0', '#F9D9EC', '#DCEBFF', '#C9ECF5']

interface FlowProps {
  mobile: boolean
}

/** How a repair gets requested, one viewport per step; on wide screens one 3D phone follows along. */
export function Flow({ mobile }: FlowProps) {
  return mobile ? <FlowMobile /> : <FlowDesktop />
}

function FlowDesktop() {
  const wrapper = useRef<HTMLElement>(null)
  const setViewport = useAppStore((state) => state.setFlowViewport)
  const setEnabled = useAppStore((state) => state.setFlowEnabled)
  const setVisible = useAppStore((state) => state.setFlowVisible)
  const step = useAppStore((state) => state.flowStep)
  const current = STEPS[step] ?? STEPS[0]

  useEffect(() => {
    const element = wrapper.current
    if (!element) return
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true)
          nearby.disconnect()
        }
      },
      { rootMargin: '600px' },
    )
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    })
    nearby.observe(element)
    observer.observe(element)
    return () => {
      nearby.disconnect()
      observer.disconnect()
      setVisible(false)
    }
  }, [setEnabled, setVisible])

  return (
    <section
      ref={wrapper}
      id="como-funciona"
      className="relative bg-surface-soft text-ink"
      aria-label="Cómo funciona"
    >
      {/* The stage stays put while the steps scroll past; the phone in it changes screen with each step. */}
      <div className="pointer-events-none sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-[0.9fr_1.1fr] px-14 lg:px-20">
          <div />
          <div className="relative flex items-center justify-center">
            <span
              aria-hidden="true"
              className="flow-tint"
              style={{ '--tint': TINTS[step % TINTS.length] } as CSSProperties}
            />
            <div
              ref={setViewport}
              data-flow-stage
              role="img"
              aria-label={`Un iPhone 3D con ${SCREEN_LABELS[current.screen]}`}
              className="relative h-[min(84svh,820px)] w-full max-w-[560px] select-none"
            />
            <ol className="flow-progress" aria-label="Pasos">
              {STEPS.map((item, index) => (
                <li key={item.id} data-active={index === step} data-done={index < step} />
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="relative -mt-[100svh]">
        {STEPS.map((item, index) => (
          <Step key={item.id} step={item} index={index} active={index === step} />
        ))}
      </div>
    </section>
  )
}

interface StepProps {
  step: FlowStep
  index: number
  active: boolean
}

function Step({ step, index, active }: StepProps) {
  const ref = useRef<HTMLElement>(null)
  const setFlowStep = useAppStore((state) => state.setFlowStep)
  useSectionDock(ref)

  // The step whose box contains the middle of the viewport is the active one.
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFlowStep(index)
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [index, setFlowStep])

  return (
    <article
      ref={ref}
      id={`paso-${index + 1}`}
      data-active={active}
      className="step grid h-svh grid-cols-[0.9fr_1.1fr] items-center px-14 lg:px-20"
      aria-labelledby={`paso-${index + 1}-titulo`}
    >
      <div className="step-text max-w-md">
        <p className="eyebrow">
          Cómo funciona · {index + 1} de {STEPS.length}
        </p>
        <h2
          id={`paso-${index + 1}-titulo`}
          className="mt-4 text-[clamp(2.1rem,3.8vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance"
        >
          {step.title}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-lg">{step.text}</p>
        <img
          src={step.mascot.src}
          alt={step.mascot.alt}
          className="mt-8 h-24 w-auto"
          loading="lazy"
          decoding="async"
        />
      </div>
    </article>
  )
}

function FlowMobile() {
  return (
    <section
      id="como-funciona"
      className="relative bg-surface-soft px-6 pt-16 pb-10 text-ink"
      aria-label="Cómo funciona"
    >
      <p className="eyebrow">Cómo funciona</p>
      <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-[-0.03em] text-balance">
        Pedir un arreglo, paso a paso.
      </h2>
      <ol className="mt-4">
        {STEPS.map((step, index) => (
          <li
            key={step.id}
            className="grid grid-cols-[1fr_112px] items-center gap-5 border-b border-border-soft py-8 last:border-0"
          >
            <div>
              <p className="eyebrow">Paso {index + 1}</p>
              <h3 className="mt-2 text-xl leading-tight font-bold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
            </div>
            <PhoneFrame screen={step.screen} className="w-full" />
          </li>
        ))}
      </ol>
    </section>
  )
}
