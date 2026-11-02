import type Lenis from 'lenis'
import { create } from 'zustand'

interface AppState {
  /** 0..1, driven by Lenis. Read it with getState() inside useFrame, never via the hook. */
  scrollProgress: number
  setScrollProgress: (value: number) => void
  /** The smooth-scroll instance, for programmatic scrolling that follows the same easing. */
  lenis: Lenis | null
  setLenis: (lenis: Lenis | null) => void
}

export const useAppStore = create<AppState>()((set) => ({
  scrollProgress: 0,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  lenis: null,
  setLenis: (lenis) => set({ lenis }),
}))
