import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import { Color, type ShaderMaterial } from 'three'
import fragmentShader from '@/canvas/shaders/hero.frag'
import vertexShader from '@/canvas/shaders/hero.vert'

// Blue, sky and turquoise, as in the app's login glow, with one small pink spot. No violet.
const heroUniforms = {
  uTime: 0,
  /** 0 at the top of the hero track, 1 once the card has fully left. */
  uScroll: 0,
  uAspect: 1,
  uBase: new Color('#ffffff'),
  uCyan: new Color('#6ec1ff'),
  uBlue: new Color('#2f6cf5'),
  uViolet: new Color('#56a8ff'),
  uPink: new Color('#f7c3e2'),
  uCoral: new Color('#4fd1cf'),
  uOrange: new Color('#9fe4ee'),
  uYellow: new Color('#dff1ff'),
  /** Pale blue behind the headline. */
  uCentre: new Color('#e6f0ff'),
}

/** Instance type: a ShaderMaterial whose uniforms are exposed as plain properties. */
export type HeroMaterialImpl = ShaderMaterial & typeof heroUniforms

/** The hero background: a colour mesh bent by slow waves, drawn on a full-canvas quad. */
export const HeroMaterial = shaderMaterial(
  heroUniforms,
  vertexShader,
  fragmentShader,
) as unknown as (new () => HeroMaterialImpl) & {
  key: string
}

extend({ HeroMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    heroMaterial: ThreeElement<typeof HeroMaterial>
  }
}
