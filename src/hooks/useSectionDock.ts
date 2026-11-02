import type Lenis from 'lenis'
import { useEffect, type RefObject } from 'react'
import { MOBILE_QUERY } from '@/hooks/useIsMobile'
import { useAppStore } from '@/store/useAppStore'

/** Seconds to settle a section at the top of the viewport. */
const DOCK_SECONDS = 0.9
/** Seconds to travel to another section. */
const TRAVEL_SECONDS = 1.5
/** Eases in and out, so a journey starts and lands gently instead of snapping. */
const EASE = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
/** Wheel or touch events closer together than this belong to one gesture (trackpad inertia, swipes). */
const GESTURE_GAP_MS = 160
/** Accumulated delta that counts as one deliberate gesture. */
const STEP_DELTA = 40

/** Every section the page travels between, docking or not. */
const stops = new Set<HTMLElement>()
// Shared by every docked section: only one holds the page at a time.
let docked: HTMLElement | null = null
let busyUntil = 0
let destination: HTMLElement | null = null
let destinationUntil = 0

function orderedStops(): HTMLElement[] {
  return [...stops].sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )
}

function neighbourOf(element: HTMLElement, direction: 1 | -1): HTMLElement | null {
  const list = orderedStops()
  const index = list.indexOf(element)
  return index === -1 ? null : (list[index + direction] ?? null)
}

/** Lets the page go and scrolls to `target`; a docking section arriving at the top takes over from there. */
export function travelTo(lenis: Lenis, target: number, toward: HTMLElement | null = null): void {
  docked = null
  destination = toward
  destinationUntil = performance.now() + TRAVEL_SECONDS * 1000 + 300
  busyUntil = performance.now() + TRAVEL_SECONDS * 1000 + 150
  lenis.start()
  lenis.scrollTo(target, {
    duration: TRAVEL_SECONDS,
    easing: EASE,
    lock: true,
    onComplete: () => {
      destination = null
    },
  })
}

/** Registers a section as a stop of the one-section-at-a-time travel without docking it (the hero). */
export function useTravelStop(section: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const element = section.current
    if (!element) return
    stops.add(element)
    return () => {
      stops.delete(element)
    }
  }, [section])
}

/**
 * Makes a viewport-tall section dock at the top of the screen when it arrives there. Once docked the
 * page stops scrolling, and the next wheel, trackpad, swipe or arrow-key gesture travels to the
 * neighbouring stop instead, so the page moves one section at a time.
 */
export function useSectionDock(section: RefObject<HTMLElement | null>): void {
  const lenis = useAppStore((state) => state.lenis)
  useTravelStop(section)

  useEffect(() => {
    const element = section.current
    // Phones scroll freely: their sections flow at natural height, so there is nothing to dock.
    if (!element || !lenis || window.matchMedia(MOBILE_QUERY).matches) return
    let previousTop = element.getBoundingClientRect().top
    let lastInput = 0
    let gestureSpent = false
    let accumulated = 0
    const top = () => element.getBoundingClientRect().top + window.scrollY

    const dock = () => {
      docked = element
      destination = null
      const distance = Math.abs(element.getBoundingClientRect().top)
      const immediate = distance < 2
      busyUntil = performance.now() + (immediate ? 0 : DOCK_SECONDS * 1000) + 150
      // The gesture that brought the section here must not also send it on.
      gestureSpent = true
      accumulated = 0
      lenis.scrollTo(top(), {
        duration: DOCK_SECONDS,
        easing: EASE,
        immediate,
        lock: true,
        force: true,
        onComplete: () => {
          if (docked === element) lenis.stop()
        },
      })
    }

    const leave = (direction: 1 | -1) => {
      const neighbour = neighbourOf(element, direction)
      if (!neighbour) {
        docked = null
        lenis.start()
        return
      }
      const rect = neighbour.getBoundingClientRect()
      const target =
        direction > 0
          ? rect.top + window.scrollY
          : rect.bottom + window.scrollY - window.innerHeight
      travelTo(lenis, target, neighbour)
    }

    // Dock when the section's top crosses the top of the viewport from either side, unless the page is
    // travelling somewhere else. A docked section that was dragged away (scrollbar, anchor) lets go.
    const watch = () => {
      const current = element.getBoundingClientRect().top
      const previous = previousTop
      previousTop = current
      const now = performance.now()
      if (docked === element) {
        if (Math.abs(current) > 2 && now > busyUntil) {
          docked = null
          lenis.start()
        }
        return
      }
      if (docked) return
      const expected = destination === null || destination === element || now > destinationUntil
      if (!expected) return
      // A jump that lands well past the section (scrollbar drag, keyboard) must not pull the page back.
      const near = window.innerHeight / 2
      if (
        (previous > 1 && current <= 1 && current > -near) ||
        (previous < -1 && current >= -1 && current < near)
      ) {
        dock()
      }
    }

    // Lenis keeps reporting gestures while stopped; the inertia tail of a gesture is ignored until the input pauses.
    const input = ({ deltaY }: { deltaY: number }) => {
      if (docked !== element) return
      const now = performance.now()
      const paused = now - lastInput > GESTURE_GAP_MS
      lastInput = now
      if (paused) {
        gestureSpent = false
        accumulated = 0
      }
      if (gestureSpent || now < busyUntil) return
      accumulated += deltaY
      if (Math.abs(accumulated) < STEP_DELTA) return
      gestureSpent = true
      leave(accumulated > 0 ? 1 : -1)
    }

    const keys = (event: KeyboardEvent) => {
      if (docked !== element || performance.now() < busyUntil) return
      const focus = document.activeElement
      if (focus && focus !== document.body && element.contains(focus)) return
      const down = ['ArrowDown', 'PageDown', ' '].includes(event.key)
      const up = ['ArrowUp', 'PageUp'].includes(event.key)
      if (!down && !up) return
      event.preventDefault()
      leave(down ? 1 : -1)
    }

    // A resize can move the section; keep it aligned while docked.
    const realign = () => {
      if (docked === element) lenis.scrollTo(top(), { immediate: true, force: true })
    }

    lenis.on('scroll', watch)
    lenis.on('virtual-scroll', input)
    window.addEventListener('keydown', keys)
    window.addEventListener('resize', realign)
    // A reload can land with the section already in place.
    if (!docked && Math.abs(previousTop) <= 1) dock()
    return () => {
      lenis.off('scroll', watch)
      lenis.off('virtual-scroll', input)
      window.removeEventListener('keydown', keys)
      window.removeEventListener('resize', realign)
      if (docked === element) {
        docked = null
        lenis.start()
      }
    }
  }, [section, lenis])
}
