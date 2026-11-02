import { useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import { Mesh, Texture, type Material } from 'three'

/**
 * Uploads a scene's textures and compiles its shader programs as soon as it mounts, so its first visible frame
 * is cheap. Without this the work lands on the frame a section scrolls into view, freezing the travel for a
 * quarter of a second. Lives inside a View, so it sees that View's scene and camera.
 */
export function Warmup() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const invalidate = useThree((state) => state.invalidate)

  useLayoutEffect(() => {
    let cancelled = false
    const seen = new Set<Texture>()
    const upload = (value: unknown) => {
      if (value instanceof Texture && !seen.has(value)) {
        seen.add(value)
        gl.initTexture(value)
      }
    }
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return
      const materials: Material[] = Array.isArray(object.material)
        ? object.material
        : [object.material]
      for (const material of materials) {
        Object.values(material).forEach(upload)
        if ('uniforms' in material && material.uniforms) {
          Object.values(material.uniforms as Record<string, { value: unknown }>).forEach(
            (uniform) => upload(uniform.value),
          )
        }
      }
    })
    // Compiles in parallel where the driver allows it (KHR_parallel_shader_compile), synchronously elsewhere.
    void gl.compileAsync(scene, camera).then(() => {
      if (!cancelled) invalidate()
    })
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera, invalidate])

  return null
}
