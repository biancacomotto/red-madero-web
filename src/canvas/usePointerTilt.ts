import { useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { MathUtils } from 'three'

interface Tilt {
  x: number
  y: number
}

interface PointerTilt {
  /** True while the eased tilt is still moving toward the pointer. */
  readonly settling: boolean
  /** Eases toward the pointer; call once per frame and read the returned tilt. */
  update(delta: number): Tilt
  /** Where the pointer is over the viewport, -1..1 on each axis. Written by the listeners. */
  pointer: Tilt
}

/** Follows the pointer over `viewport` (-1..1 on each axis) and eases toward it, frame by frame. */
export function usePointerTilt(viewport: HTMLElement | null, disabled: boolean): PointerTilt {
  const invalidate = useThree((state) => state.invalidate)
  // One mutable object for the whole life of the scene: per-frame work writes it, React never reads it.
  const [api] = useState<PointerTilt>(() => {
    const lean: Tilt = { x: 0, y: 0 }
    const pointer: Tilt = { x: 0, y: 0 }
    let settling = false
    return {
      pointer,
      get settling() {
        return settling
      },
      update(delta) {
        lean.x = MathUtils.damp(lean.x, pointer.x, 4, delta)
        lean.y = MathUtils.damp(lean.y, pointer.y, 4, delta)
        settling = Math.abs(lean.x - pointer.x) + Math.abs(lean.y - pointer.y) > 0.002
        return lean
      },
    }
  })

  useEffect(() => {
    if (!viewport || disabled) return
    const move = (event: PointerEvent) => {
      const rect = viewport.getBoundingClientRect()
      api.pointer.x = MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1)
      api.pointer.y = MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1)
      invalidate()
    }
    const leave = () => {
      api.pointer.x = 0
      api.pointer.y = 0
      invalidate()
    }
    viewport.addEventListener('pointermove', move)
    viewport.addEventListener('pointerleave', leave)
    viewport.addEventListener('pointercancel', leave)
    return () => {
      viewport.removeEventListener('pointermove', move)
      viewport.removeEventListener('pointerleave', leave)
      viewport.removeEventListener('pointercancel', leave)
      leave()
    }
  }, [viewport, disabled, invalidate, api])

  return api
}
