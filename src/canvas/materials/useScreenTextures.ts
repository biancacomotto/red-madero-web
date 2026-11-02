import { useThree } from '@react-three/fiber'
import { use, useEffect, useMemo } from 'react'
import { CanvasTexture, LinearFilter, LinearMipmapLinearFilter, SRGBColorSpace } from 'three'
import { paintScreen, screensReady, type ScreenAssets, type ScreenId } from '@/screens'

/** Twice the 390 x 844 design, so text stays crisp when a phone fills the stage. */
export const SCREEN_WIDTH = 780
export const SCREEN_HEIGHT = 1688

// Painted once and shared by every phone that shows the same screen.
const cache = new Map<ScreenId, CanvasTexture>()

function paint(id: ScreenId, assets: ScreenAssets, anisotropy: number): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_WIDTH
  canvas.height = SCREEN_HEIGHT
  const context = canvas.getContext('2d')
  if (context) paintScreen(context, id, assets)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  // The shader mirrors the horizontal axis itself; rows stay in canvas order.
  texture.flipY = false
  texture.anisotropy = anisotropy
  texture.minFilter = LinearMipmapLinearFilter
  texture.magFilter = LinearFilter
  return texture
}

/**
 * Display textures for `ids`, in order. Suspends until the screens' pictures and fonts are
 * ready, so a phone never shows a half-painted display. `ids` should be a module constant.
 */
export function useScreenTextures(ids: readonly ScreenId[]): CanvasTexture[] {
  const assets = use(screensReady())
  const gl = useThree((state) => state.gl)
  const invalidate = useThree((state) => state.invalidate)

  const textures = useMemo(() => {
    const anisotropy = Math.max(1, Math.min(8, gl.capabilities.getMaxAnisotropy()))
    return ids.map((id) => {
      const existing = cache.get(id)
      if (existing) return existing
      const texture = paint(id, assets, anisotropy)
      cache.set(id, texture)
      return texture
    })
  }, [ids, assets, gl])

  useEffect(() => {
    invalidate()
  }, [textures, invalidate])
  return textures
}
