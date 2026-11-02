import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Group } from 'three'
import { Lights } from '@/canvas/Lights'
import { useScreenTextures } from '@/canvas/materials/useScreenTextures'
import { DRACO_PATH, PHONE_MODEL, phoneRig } from '@/canvas/phoneRig'
import { usePointerTilt } from '@/canvas/usePointerTilt'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { ScreenId } from '@/screens'
import { useAppStore } from '@/store/useAppStore'

/** The welcome screen on the left phone, the home on the right one. */
const HERO_SCREENS: readonly ScreenId[] = ['welcome', 'home']
const PHONE_HEIGHT = 3.3
/** Where each phone rests, left to right: one low, one high, both turned toward the middle. */
const LAYOUT = [
  { x: -0.92, y: -0.3, z: -0.1, roll: 0.03, yaw: 0.4, pitch: -0.08 },
  { x: 0.96, y: 0.36, z: 0.15, roll: -0.03, yaw: -0.36, pitch: -0.05 },
]
/** How far the pair tilts toward the pointer (radians) and drifts with it (units). */
const PARALLAX = { yaw: 0.12, pitch: 0.08, drift: 0.06 }
const INTRO_SECONDS = 1.8

/** The hero's two phones: they rise into place once the loader lifts, float, lean toward the pointer and tip away as the hero scrolls out. */
export function HeroPhoneScene() {
  const { scene } = useGLTF(PHONE_MODEL, DRACO_PATH)
  const textures = useScreenTextures(HERO_SCREENS)
  const reduced = useReducedMotion()
  const viewport = useAppStore((state) => state.heroViewport)
  const entered = useAppStore((state) => state.entered)
  const setReady = useAppStore((state) => state.setHeroReady)
  const invalidate = useThree((state) => state.invalidate)
  const phones = useRef<(Group | null)[]>([])
  const entrance = useRef(LAYOUT.map(() => ({ lift: 0, lean: 0 })))
  const reported = useRef(false)
  const tilt = usePointerTilt(viewport, reduced)

  const rigs = useMemo(
    () => textures.map((texture) => phoneRig(scene, texture, PHONE_HEIGHT)),
    [scene, textures],
  )
  useEffect(() => () => rigs.forEach((rig) => rig.dispose()), [rigs])

  // Before the loader lifts the phones wait below the stage; then they rise one after the other.
  useLayoutEffect(() => {
    entrance.current.forEach((item, index) => {
      item.lift = reduced ? 0 : -4.5 - index * 0.6
      item.lean = reduced ? 0 : index === 0 ? -0.2 : 0.2
    })
    invalidate()
  }, [reduced, invalidate])

  useEffect(() => {
    if (!entered || reduced) return
    const tween = gsap.to(entrance.current, {
      lift: 0,
      lean: 0,
      duration: INTRO_SECONDS,
      ease: 'power3.out',
      stagger: 0.16,
      onUpdate: invalidate,
    })
    return () => {
      tween.kill()
    }
  }, [entered, reduced, invalidate])

  useEffect(
    () => () => {
      reported.current = false
      setReady(false)
    },
    [setReady],
  )

  useFrame((state, delta) => {
    if (!reported.current) {
      reported.current = true
      // The loader waits for this first real frame, so the phones are on screen the moment the page appears.
      requestAnimationFrame(() => setReady(true))
    }
    const exit = useAppStore.getState().heroExit
    if (exit >= 1 || document.hidden) return
    const time = state.clock.elapsedTime
    const lean = tilt.update(delta)
    LAYOUT.forEach((slot, index) => {
      const phone = phones.current[index]
      const enter = entrance.current[index]
      const rig = rigs[index]
      if (!phone || !rig) return
      rig.display.tick(time)
      const float = reduced ? 0 : Math.sin(time * 0.8 + index * 2.4) * 0.045
      const sway = reduced ? 0 : Math.sin(time * 0.6 + index * 1.7) * 0.01
      // As the hero scrolls out the phones sink and lean back, following the card that shrinks around them.
      phone.position.set(
        slot.x + lean.x * PARALLAX.drift,
        slot.y + enter.lift + float - lean.y * PARALLAX.drift * 0.6 - exit * 1.4,
        slot.z,
      )
      phone.rotation.set(
        slot.pitch - lean.y * PARALLAX.pitch + sway - exit * 0.4,
        slot.yaw + lean.x * PARALLAX.yaw + Math.sign(slot.yaw) * exit * 0.5,
        slot.roll + enter.lean,
      )
    })
    // Pull back on narrow stages so both phones stay inside the frame.
    const aspect = viewport ? viewport.clientWidth / viewport.clientHeight : 0.8
    state.camera.position.set(0, 0, Math.max(7.6, 6.4 / aspect))
    state.camera.lookAt(0, 0, 0)
    if (!reduced || tilt.settling) invalidate()
  })

  return (
    <>
      <Lights />
      {rigs.map((rig, index) => (
        <group
          key={index}
          ref={(element) => {
            phones.current[index] = element
          }}
        >
          <primitive object={rig.object} dispose={null} />
        </group>
      ))}
    </>
  )
}
