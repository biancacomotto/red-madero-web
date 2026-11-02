import type Lenis from 'lenis'
import { create } from 'zustand'

type Viewport = HTMLDivElement | null

interface AppState {
  /** 0..1, driven by Lenis. Read it with getState() inside useFrame, never via the hook. */
  scrollProgress: number
  setScrollProgress: (value: number) => void
  /** The smooth-scroll instance, for programmatic scrolling that follows the same easing. */
  lenis: Lenis | null
  setLenis: (lenis: Lenis | null) => void
  /** True once the loader has gone and the page can be scrolled. */
  entered: boolean
  setEntered: (entered: boolean) => void

  /** The hero's phone: the DOM rectangle it is drawn in and how far the hero has scrolled out (0..1). */
  heroViewport: Viewport
  heroReady: boolean
  heroExit: number
  setHeroViewport: (viewport: Viewport) => void
  setHeroReady: (ready: boolean) => void
  setHeroExit: (value: number) => void

  /** The step-by-step phone: mounted near the section, animated while visible, showing one step's screen. */
  flowViewport: Viewport
  flowEnabled: boolean
  flowVisible: boolean
  flowStep: number
  setFlowViewport: (viewport: Viewport) => void
  setFlowEnabled: (enabled: boolean) => void
  setFlowVisible: (visible: boolean) => void
  setFlowStep: (step: number) => void

  /** The professionals' pair of phones, cycling through PRO.pairs. */
  proViewport: Viewport
  proEnabled: boolean
  proVisible: boolean
  proReady: boolean
  proPair: number
  setProViewport: (viewport: Viewport) => void
  setProEnabled: (enabled: boolean) => void
  setProVisible: (visible: boolean) => void
  setProReady: (ready: boolean) => void
  setProPair: (pair: number) => void
}

export const useAppStore = create<AppState>()((set) => ({
  scrollProgress: 0,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  lenis: null,
  setLenis: (lenis) => set({ lenis }),
  entered: false,
  setEntered: (entered) => set({ entered }),

  heroViewport: null,
  heroReady: false,
  heroExit: 0,
  setHeroViewport: (heroViewport) => set({ heroViewport }),
  setHeroReady: (heroReady) => set({ heroReady }),
  setHeroExit: (heroExit) => set({ heroExit }),

  flowViewport: null,
  flowEnabled: false,
  flowVisible: false,
  flowStep: 0,
  setFlowViewport: (flowViewport) => set({ flowViewport }),
  setFlowEnabled: (flowEnabled) => set({ flowEnabled }),
  setFlowVisible: (flowVisible) => set({ flowVisible }),
  setFlowStep: (flowStep) => set({ flowStep }),

  proViewport: null,
  proEnabled: false,
  proVisible: false,
  proReady: false,
  proPair: 0,
  setProViewport: (proViewport) => set({ proViewport }),
  setProEnabled: (proEnabled) => set({ proEnabled }),
  setProVisible: (proVisible) => set({ proVisible }),
  setProReady: (proReady) => set({ proReady }),
  setProPair: (proPair) => set({ proPair }),
}))
