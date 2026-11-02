/** Pictures and fonts the painted screens need, loaded once up front. */
const SOURCES = {
  logo: '/brand/logo.webp',
  castores: '/mascota/castores.webp',
  saludando: '/mascota/saludando.webp',
  pensando: '/mascota/pensando.webp',
  urgencia: '/mascota/urgencia.webp',
  trabajo: '/mascota/trabajo.webp',
  casa: '/app/casa-zonas.webp',
  avatar1: '/avatars/1.webp',
  avatar2: '/avatars/2.webp',
  avatar3: '/avatars/3.webp',
  avatar4: '/avatars/4.webp',
  avatar5: '/avatars/5.webp',
  avatar6: '/avatars/6.webp',
} as const

export type AssetKey = keyof typeof SOURCES
export type ScreenAssets = Record<AssetKey, HTMLImageElement>

const WEIGHTS = [400, 500, 600, 700, 800]

let pending: Promise<ScreenAssets> | null = null

async function load(): Promise<ScreenAssets> {
  // A font that fails to load falls back to the system one; the screens still paint.
  const fonts = WEIGHTS.map((weight) =>
    document.fonts.load(`${weight} 16px "Plus Jakarta Sans"`).catch(() => []),
  )
  const entries = await Promise.all(
    Object.entries(SOURCES).map(async ([key, src]) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      try {
        await img.decode()
      } catch {
        // A missing picture leaves a blank spot on one screen, not a broken page.
      }
      return [key, img] as const
    }),
  )
  await Promise.all(fonts)
  return Object.fromEntries(entries) as ScreenAssets
}

/** Resolves once every picture is decoded and every font weight is available. Cached. */
export function screensReady(): Promise<ScreenAssets> {
  pending ??= load()
  return pending
}
