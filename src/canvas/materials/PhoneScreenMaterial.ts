import { shaderMaterial } from '@react-three/drei'
import type { ShaderMaterial, Texture } from 'three'
import fragmentShader from '@/canvas/shaders/phoneScreen.frag'
import vertexShader from '@/canvas/shaders/phoneScreen.vert'

const screenUniforms = {
  uFrom: null as Texture | null,
  uTo: null as Texture | null,
  /** 0 shows uFrom, 1 shows uTo; the sweep between them lives in phoneScreen.frag. */
  uProgress: 0,
  uTime: 0,
}

/** Instance type: a ShaderMaterial whose uniforms are exposed as plain properties. */
export type PhoneScreenMaterialImpl = ShaderMaterial & typeof screenUniforms

/** The phone display: blends two screen textures with a liquid sweep. */
export const PhoneScreenMaterial = shaderMaterial(
  screenUniforms,
  vertexShader,
  fragmentShader,
) as unknown as new () => PhoneScreenMaterialImpl
