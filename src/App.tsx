import { useRef } from 'react'
import { Experience } from '@/canvas/Experience'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

export function App() {
  const eventSource = useRef<HTMLDivElement>(null!)
  useSmoothScroll()

  return (
    <div ref={eventSource} className="relative">
      <Experience eventSource={eventSource} />
      <main className="relative z-10">
        <section className="flex min-h-svh flex-col items-center justify-center gap-lg px-md text-center">
          <img src="/LogoRedMadero.svg" alt="Red Madero" className="h-20 w-auto" />
          <h1 className="text-4xl font-bold text-primary">Oficios verificados en tu casa</h1>
          <p className="max-w-md text-ink-muted">Pronto.</p>
        </section>
      </main>
    </div>
  )
}
