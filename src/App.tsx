import { useCallback, useEffect, useRef, useState } from 'react'
import { Experience } from '@/canvas/Experience'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { screensReady } from '@/screens'
import { useAppStore } from '@/store/useAppStore'
import { FloatingCta } from '@/ui/components/FloatingCta'
import { Loader } from '@/ui/components/Loader'
import { SectionDots } from '@/ui/components/SectionDots'
import { Download } from '@/ui/sections/Download'
import { Flow } from '@/ui/sections/Flow'
import { Hero } from '@/ui/sections/Hero'
import { Pro } from '@/ui/sections/Pro'
import { Trades } from '@/ui/sections/Trades'
import { Trust } from '@/ui/sections/Trust'

/** Resources the loader waits for besides the 3D phone: fonts, the wordmark and the screens' pictures. */
const ASSET_COUNT = 3
/** If the 3D phone never reports (no WebGL, a blocked model), the page opens anyway after this long. */
const SCENE_TIMEOUT_MS = 9000

export function App() {
  const [assetsReady, setAssetsReady] = useState(0)
  const [sceneTimedOut, setSceneTimedOut] = useState(false)
  const mobile = useIsMobile()
  const entered = useAppStore((state) => state.entered)
  const setEntered = useAppStore((state) => state.setEntered)
  const heroReady = useAppStore((state) => state.heroReady)

  useEffect(() => {
    let cancelled = false
    const logo = new Image()
    logo.src = '/brand/logo.webp'
    // Failed resources also settle, so a network error cannot trap the loader.
    const track = async (task: Promise<unknown>) => {
      try {
        await task
      } catch {
        // The page still opens; whatever failed shows its fallback.
      } finally {
        if (!cancelled) setAssetsReady((count) => count + 1)
      }
    }
    void track(document.fonts.ready)
    void track(logo.decode())
    void track(screensReady())
    const timeout = window.setTimeout(() => setSceneTimedOut(true), SCENE_TIMEOUT_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [])

  // Mount the other phone scenes one by one once the page is open, so their models, textures and shaders
  // are ready long before a scroll travel reaches them.
  useEffect(() => {
    if (!entered || mobile) return
    const { setFlowEnabled, setProEnabled } = useAppStore.getState()
    const timers = [setFlowEnabled, setProEnabled].map((enable, index) =>
      window.setTimeout(() => enable(true), 1200 + index * 1500),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [entered, mobile])

  useEffect(() => {
    if (entered) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [entered])

  const sceneReady = mobile || heroReady || sceneTimedOut
  const progress = Math.min(100, ((assetsReady + Number(sceneReady)) / (ASSET_COUNT + 1)) * 100)
  const handleComplete = useCallback(() => setEntered(true), [setEntered])

  // The canvas sits above the DOM with pointer events off, so it reads them from this wrapper.
  const eventSource = useRef<HTMLDivElement>(null!)
  useSmoothScroll()

  return (
    <div ref={eventSource} className="relative">
      {!entered && <Loader progress={progress} onComplete={handleComplete} />}
      {!mobile && <Experience eventSource={eventSource} />}
      {entered && !mobile && <SectionDots />}
      {entered && <FloatingCta />}
      <main className="relative z-10" inert={!entered}>
        <Hero mobile={mobile} />
        <Flow mobile={mobile} />
        <Trades />
        <Pro mobile={mobile} />
        <Trust />
        <Download mobile={mobile} />
      </main>
    </div>
  )
}
