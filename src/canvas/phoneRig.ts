import { useGLTF } from '@react-three/drei'
import {
  Box3,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  type Object3D,
  type Texture,
} from 'three'
import { PhoneScreenMaterial } from '@/canvas/materials/PhoneScreenMaterial'

export const PHONE_MODEL = '/models/iphone-17-pro.glb'
/** The Draco decoder is served from here, so the model never depends on a third-party CDN. */
export const DRACO_PATH = '/draco/'

useGLTF.preload(PHONE_MODEL, DRACO_PATH)

export interface PhoneDisplay {
  show(texture: Texture): void
  sweep(from: Texture, to: Texture): void
  progress(value: number): void
  tick(time: number): void
}

export interface PhoneRig {
  object: Group
  /** Width in scene units, for the given height. */
  width: number
  /** The display is only touched through this controller. */
  display: PhoneDisplay
  dispose(): void
}

/**
 * Clones the phone, swaps its display for the screen shader showing `texture`, centres it and
 * scales it to `height` scene units, facing +Z.
 */
export function phoneRig(source: Object3D, texture: Texture, height: number): PhoneRig {
  const model = source.clone(true)
  const screen = new PhoneScreenMaterial()
  screen.side = DoubleSide
  screen.uFrom = texture
  screen.uTo = texture
  // The source model has a 78%-opaque black cover over the display.
  const glass = new MeshBasicMaterial({
    color: 'white',
    transparent: true,
    opacity: 0.025,
    depthWrite: false,
    side: DoubleSide,
  })
  model.traverse((object) => {
    if (!(object instanceof Mesh)) return
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    const next = materials.map((material) => {
      if (material.name === 'OLED') return screen
      if (material.name === 'Glass') return glass
      return material
    })
    object.material = next.length === 1 ? next[0] : next
  })
  model.updateMatrixWorld(true)
  const bounds = new Box3().setFromObject(model)
  const size = bounds.getSize(new Vector3())
  model.position.sub(bounds.getCenter(new Vector3()))
  const holder = new Group()
  holder.scale.setScalar(height / size.y)
  // The display faces -Z in the source file.
  holder.rotation.y = Math.PI
  holder.add(model)
  return {
    object: holder,
    width: height * (size.x / size.y),
    display: {
      show(next) {
        screen.uFrom = next
        screen.uTo = next
        screen.uProgress = 0
      },
      sweep(from, to) {
        screen.uFrom = from
        screen.uTo = to
      },
      progress(value) {
        screen.uProgress = value
      },
      tick(time) {
        screen.uTime = time
      },
    },
    dispose() {
      screen.dispose()
      glass.dispose()
    },
  }
}
