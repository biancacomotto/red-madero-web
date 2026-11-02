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
import { STEPS } from '@/lib/content'
import type { ScreenId } from '@/screens'
import { useAppStore } from '@/store/useAppStore'

const SCREENS: readonly ScreenId[] = STEPS.map((step) => step.screen)
const PHONE_HEIGHT = 3.5
/** While its screen changes the phone squares up to the camera and lifts, then settles back. */
const SWING = { lift: 0.14 }
const TRANSITION_SECONDS = 1.4
const INTRO_SECONDS = 1.6
const PARALLAX = { yaw: 0.1, pitch: 0.06, drift: 0.05 }
/** The resting turn alternates with the step, so the phone swings a little further each time. */
const yawFor = (step: number) => (step % 2 === 0 ? -0.3 : 0.28)

/** The step-by-step phone: its display sweeps to the screen of whichever step is on screen. */
export function FlowPhoneScene() {
  const { scene } = useGLTF(PHONE_MODEL, DRACO_PATH)
  const textures = useScreenTextures(SCREENS)
  const reduced = useReducedMotion()
  const visible = useAppStore((state) => state.flowVisible)
  const viewport = useAppStore((state) => state.flowViewport)
  const step = useAppStore((state) => state.flowStep)
  const invalidate = useThree((state) => state.invalidate)
  const phone = useRef<Group>(null)
  const swing = useRef(0)
  const pose = useRef({ yaw: yawFor(0), lift: 0, lean: 0 })
  const shown = useRef<number | null>(null)
  const presented = useRef(false)
  const tilt = usePointerTilt(viewport, reduced)

  const rig = useMemo(() => phoneRig(scene, textures[0], PHONE_HEIGHT), [scene, textures])
  useEffect(() => () => rig.dispose(), [rig])

  // The first time the section shows, the phone rises from below the stage.
  useLayoutEffect(() => {
    if (reduced || presented.current) return
    pose.current.lift = -4
    pose.current.lean = 0.18
    invalidate()
  }, [reduced, invalidate])

  useEffect(() => {
    if (!visible || reduced || presented.current) return
    presented.current = true
    const tween = gsap.to(pose.current, {
      lift: 0,
      lean: 0,
      duration: INTRO_SECONDS,
      ease: 'power3.out',
      onUpdate: invalidate,
    })
    return () => {
      tween.kill()
    }
  }, [visible, reduced, invalidate])

  // Swing the phone toward the camera and sweep the new step's screen across its display.
  useLayoutEffect(() => {
    const previous = shown.current
    shown.current = step
    const target = textures[step] ?? textures[0]
    const settle = () => {
      rig.display.show(target)
      swing.current = 0
      invalidate()
    }
    if (previous === null || previous === step || reduced) {
      pose.current.yaw = yawFor(step)
      settle()
      return
    }
    rig.display.sweep(textures[previous] ?? target, target)
    const state = { progress: 0 }
    const sweep = gsap.to(state, {
      progress: 1,
      duration: TRANSITION_SECONDS,
      ease: 'power2.inOut',
      onUpdate: () => {
        rig.display.progress(state.progress)
        swing.current = Math.sin(state.progress * Math.PI)
        invalidate()
      },
      onComplete: settle,
    })
    const turn = gsap.to(pose.current, {
      yaw: yawFor(step),
      duration: TRANSITION_SECONDS,
      ease: 'power2.inOut',
      onUpdate: invalidate,
    })
    return () => {
      sweep.kill()
      turn.kill()
      settle()
    }
  }, [step, textures, rig, reduced, invalidate])

  useFrame((state, delta) => {
    const group = phone.current
    if (!group || !visible || document.hidden) return
    const time = state.clock.elapsedTime
    const lean = tilt.update(delta)
    rig.display.tick(time)
    const arc = swing.current
    const float = reduced ? 0 : Math.sin(time * 0.8) * 0.04
    const sway = reduced ? 0 : Math.sin(time * 0.6) * 0.01
    const { yaw, lift, lean: roll } = pose.current
    group.position.set(
      lean.x * PARALLAX.drift,
      lift + float + arc * SWING.lift - lean.y * PARALLAX.drift * 0.6,
      0,
    )
    // Mid-swing the phone faces the camera, so the new screen is seen head-on.
    group.rotation.set(
      -0.05 * (1 - arc) - lean.y * PARALLAX.pitch + sway,
      yaw * (1 - arc) + lean.x * PARALLAX.yaw,
      0.02 + roll,
    )
    const aspect = viewport ? viewport.clientWidth / viewport.clientHeight : 0.6
    state.camera.position.set(0, 0, Math.max(7, 4.3 / aspect))
    state.camera.lookAt(0, 0, 0)
    if (!reduced || tilt.settling) invalidate()
  })

  return (
    <>
      <Lights />
      <group ref={phone}>
        <primitive object={rig.object} dispose={null} />
      </group>
    </>
  )
}
