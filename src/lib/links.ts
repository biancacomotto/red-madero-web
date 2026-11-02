/** External links. Every one is optional and comes from the environment (see `.env.example`). */

const env = (key: string): string | undefined => {
  const value = (import.meta.env as Record<string, string | undefined>)[key]
  return value && value.trim().length > 0 ? value.trim() : undefined
}

export const APP_STORE_URL = env('VITE_APP_STORE_URL')
export const PLAY_STORE_URL = env('VITE_PLAY_STORE_URL')
export const PRIVACY_URL = env('VITE_PRIVACY_URL')
export const TERMS_URL = env('VITE_TERMS_URL')

/**
 * What the QR encodes. Without a configured URL it points back at this site's download
 * section, so a phone that scans it lands on the store buttons.
 */
export function downloadUrl(): string {
  return (
    env('VITE_DOWNLOAD_URL') ?? `${window.location.origin}${window.location.pathname}#descargar`
  )
}
