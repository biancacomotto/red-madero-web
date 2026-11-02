import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CanvasTexture, Group, Mesh } from 'three'
import { Lights } from '@/canvas/Lights'
import { useScreenTextures } from '@/canvas/materials/useScreenTextures'
import { DRACO_PATH, PHONE_MODEL, phoneRig } from '@/canvas/phoneRig'
import { usePointerTilt } from '@/canvas/usePointerTilt'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PRO } from '@/lib/content'
import type { ScreenId } from '@/screens'
import { useAppStore } from '@/store/useAppStore'

/** Every screen of every pair, once; `pairIndex` maps a pair back into it. */
const SCREENS: readonly ScreenId[] = [...new Set(PRO.pairs.flat())]
const pairIndex = (pair: number, side: 0 | 1) => SCREENS.indexOf(PRO.pairs[pair][side])

const PHONE_HEIGHT = 3.4
/** Where each phone rests, left to right: one low, one high, both turned toward the middle. */
const LAYOUT = [
  { x: -0.98, y: -0.34, z: -0.1, roll: 0.03, yaw: 0.44, pitch: -0.1 },
  { x: 1, y: 0.42, z: 0.15, roll: -0.03, yaw: -0.4, pitch: -0.05 },
]
const INTRO_SECONDS = 2
const SWING = { turn: 0.4, lift: 0.14, stagger: 0.2 }
/** Seconds a pair of screens stays before the phones swing to the next pair, and how long one swing takes. */
export const PRO_HOLD_SECONDS = 3.6
export const PRO_TRANSITION_SECONDS = 1.6
const SHADOW_DEPTH = 0.8
const SHADOW_OFFSET = { x: 0.05, y: -0.16 }
const SHADOW_CANVAS = { width: 384, height: 704, core: { width: 176, height: 352 }, blur: 40 }
const PARALLAX = { yaw: 0.1, pitch: 0.06, drift: 0.05 }

/** A blurred rounded rectangle, the soft shadow a floating phone throws on a wall behind it. */
function shadowTexture(): CanvasTexture {
  const { width, height, core, blur } = SHADOW_CANVAS
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Draw the shape off-canvas so only its blurred shadow lands on the texture.
    ctx.shadowColor = '#0b1a3a'
    ctx.shadowBlur = blur
    ctx.shadowOffsetX = 1000
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.roundRect(
      (width - core.width) / 2 - 1000,
      (height - core.height) / 2,
      core.width,
      core.height,
      36,
    )
    ctx.fill()
  }
  return new CanvasTexture(canvas)
}

/** Two phones floating side by side; every few seconds they swing round to the next pair of screens. */
export function ProPhonesScene() {
  const { scene } = useGLTF(PHONE_MODEL, DRACO_PATH)
  const textures = useScreenTextures(SCREENS)
  const reduced = useReducedMotion()
  const visible = useAppStore((state) => state.proVisible)
  const viewport = useAppStore((state) => state.proViewport)
  const ready = useAppStore((state) => state.proReady)
  const setReady = useAppStore((state) => state.setProReady)
  const activePair = useAppStore((state) => state.proPair)
  const setPair = useAppStore((state) => state.setProPair)
  const invalidate = useThree((state) => state.invalidate)
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  const phones = useRef<(Group | null)[]>([])
  const shadows = useRef<(Mesh | null)[]>([])
  const entrance = useRef(LAYOUT.map(() => ({ lift: 0, lean: 0 })))
  const intro = useRef<gsap.core.Tween | null>(null)
  const swing = useRef(LAYOUT.map(() => 0))
  const shownPair = useRef<number | null>(null)
  const firstHold = useRef(true)
  const presented = useRef(false)
  const presentationFrame = useRef(0)
  const tilt = usePointerTilt(viewport, reduced)

  const rigs = useMemo(
    () =>
      ([0, 1] as const).map((side) => phoneRig(scene, textures[pairIndex(0, side)], PHONE_HEIGHT)),
    [scene, textures],
  )
  const shadow = useMemo(() => shadowTexture(), [])
  useEffect(() => () => rigs.forEach((rig) => rig.dispose()), [rigs])
  useEffect(() => () => shadow.dispose(), [shadow])

  useEffect(
    () => () => {
      cancelAnimationFrame(presentationFrame.current)
      presented.current = false
      setReady(false)
    },
    [setReady],
  )

  // Entrance: the phones rise from below one after the other and settle into their lean.
  useLayoutEffect(() => {
    entrance.current.forEach((item, index) => {
      item.lift = reduced ? 0 : -3 - index * 0.5
      item.lean = reduced ? 0 : index === 0 ? -0.16 : 0.16
    })
    if (reduced) {
      invalidate()
      return
    }
    const tween = gsap.to(entrance.current, {
      lift: 0,
      lean: 0,
      duration: INTRO_SECONDS,
      ease: 'power3.out',
      stagger: 0.18,
      paused: true,
      onUpdate: invalidate,
    })
    intro.current = tween
    return () => {
      intro.current = null
      tween.kill()
    }
  }, [reduced, invalidate])

  // Swing both phones toward the camera and sweep the next screens across their displays.
  useLayoutEffect(() => {
    const previous = shownPair.current
    shownPair.current = activePair
    const targets = ([0, 1] as const).map((side) => textures[pairIndex(activePair, side)])
    const settle = () => {
      rigs.forEach((rig, index) => rig.display.show(targets[index]))
      swing.current.fill(0)
      invalidate()
    }
    if (previous === null || previous === activePair || reduced) {
      settle()
      return
    }
    const sources = ([0, 1] as const).map((side) => textures[pairIndex(previous, side)])
    const tweens = rigs.map((rig, index) => {
      rig.display.sweep(sources[index], targets[index])
      const state = { progress: 0 }
      return gsap.to(state, {
        progress: 1,
        duration: PRO_TRANSITION_SECONDS,
        delay: index * SWING.stagger,
        ease: 'power2.inOut',
        onUpdate: () => {
          rig.display.progress(state.progress)
          swing.current[index] = Math.sin(state.progress * Math.PI)
          invalidate()
        },
        onComplete: () => {
          rig.display.show(targets[index])
          swing.current[index] = 0
          invalidate()
        },
      })
    })
    return () => {
      tweens.forEach((tween) => tween.kill())
      settle()
    }
  }, [activePair, textures, rigs, reduced, invalidate])

  // The screens move on by themselves while the stage is on screen.
  useEffect(() => {
    if (!visible || !ready || !pageVisible) return
    const wait = PRO_HOLD_SECONDS + (firstHold.current && !reduced ? INTRO_SECONDS : 0)
    const timer = window.setTimeout(() => {
      firstHold.current = false
      setPair((activePair + 1) % PRO.pairs.length)
    }, wait * 1000)
    return () => window.clearTimeout(timer)
  }, [visible, ready, pageVisible, reduced, activePair, setPair])

  useEffect(() => {
    const update = () => {
      setPageVisible(!document.hidden)
      intro.current?.paused(!visible || document.hidden || !presented.current)
      if (visible && !document.hidden) invalidate()
    }
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [visible, invalidate])

  useFrame((state, delta) => {
    if (!visible || document.hidden) return
    if (!presented.current) {
      presented.current = true
      // Start the entrance only after the phones' first real frame has been drawn.
      presentationFrame.current = requestAnimationFrame(() => {
        setReady(true)
        intro.current?.paused(!useAppStore.getState().proVisible || document.hidden)
        invalidate()
      })
    }
    const time = state.clock.elapsedTime
    const lean = tilt.update(delta)
    LAYOUT.forEach((slot, index) => {
      const phone = phones.current[index]
      const wall = shadows.current[index]
      const enter = entrance.current[index]
      const rig = rigs[index]
      if (!phone || !wall || !rig) return
      rig.display.tick(time)
      const arc = swing.current[index]
      const float = reduced ? 0 : Math.sin(time * 0.8 + index * 2.4) * 0.04
      const sway = reduced ? 0 : Math.sin(time * 0.6 + index * 1.7) * 0.01
      const x = slot.x + lean.x * PARALLAX.drift
      const y = slot.y + enter.lift + float + arc * SWING.lift - lean.y * PARALLAX.drift * 0.6
      phone.position.set(x, y, slot.z)
      phone.rotation.set(
        slot.pitch * (1 - arc) - lean.y * PARALLAX.pitch + sway,
        slot.yaw - Math.sign(slot.yaw) * SWING.turn * arc + lean.x * PARALLAX.yaw,
        slot.roll + enter.lean,
      )
      // The shadow slides the other way, as if the light stayed put while the phone moved.
      wall.position.set(
        x + SHADOW_OFFSET.x - lean.x * 0.08,
        y + SHADOW_OFFSET.y,
        slot.z - SHADOW_DEPTH,
      )
      wall.rotation.z = slot.roll + enter.lean
    })
    // Pull back on narrow stages so both phones stay inside the frame.
    const aspect = viewport ? viewport.clientWidth / viewport.clientHeight : 1
    state.camera.position.set(0, 0, Math.max(7.5, 6.6 / aspect))
    state.camera.lookAt(0, 0, 0)
    if (!reduced || tilt.settling) invalidate()
  })

  return (
    <>
      <Lights />
      {rigs.map((rig, index) => (
        <group key={index}>
          <group
            ref={(element) => {
              phones.current[index] = element
            }}
          >
            <primitive object={rig.object} dispose={null} />
          </group>
          <mesh
            ref={(element) => {
              shadows.current[index] = element
            }}
            position={[LAYOUT[index].x, LAYOUT[index].y, LAYOUT[index].z - SHADOW_DEPTH]}
          >
            <planeGeometry
              args={[
                rig.width * (SHADOW_CANVAS.width / SHADOW_CANVAS.core.width),
                PHONE_HEIGHT * (SHADOW_CANVAS.height / SHADOW_CANVAS.core.height),
              ]}
            />
            <meshBasicMaterial
              map={shadow}
              transparent
              opacity={0.15}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  )
}
