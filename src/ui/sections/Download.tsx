import { Smartphone } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useSectionDock } from '@/hooks/useSectionDock'
import { DOWNLOAD } from '@/lib/content'
import { APP_STORE_URL, downloadUrl, PLAY_STORE_URL, PRIVACY_URL, TERMS_URL } from '@/lib/links'
import { QrCode } from '@/ui/components/QrCode'

interface DownloadProps {
  mobile: boolean
}

/** Read once, not on every render. */
const YEAR = new Date().getFullYear()

const STORES = [
  { label: 'App Store', detail: 'iPhone', url: APP_STORE_URL },
  { label: 'Google Play', detail: 'Android', url: PLAY_STORE_URL },
]

/** The QR to scan at the stand, the store buttons for whoever lands here on a phone, and the footer. */
export function Download({ mobile }: DownloadProps) {
  const section = useRef<HTMLElement>(null)
  const url = useMemo(() => downloadUrl(), [])
  useSectionDock(section)

  return (
    <section
      ref={section}
      id="descargar"
      className="download relative flex flex-col overflow-hidden text-white md:h-svh"
      aria-labelledby="descargar-title"
    >
      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 pt-20 pb-10 md:grid-cols-[1fr_auto] md:gap-16 md:px-14 md:pt-10 lg:px-20">
        <div className="max-w-lg">
          <p className="eyebrow text-primary-sky">Descargar</p>
          <h2
            id="descargar-title"
            className="mt-4 text-[clamp(2.6rem,5.2vw,5rem)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance"
          >
            {mobile ? DOWNLOAD.mobileTitle : DOWNLOAD.title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
            {mobile ? DOWNLOAD.mobileText : DOWNLOAD.text}
          </p>
          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Tiendas">
            {STORES.map((store) =>
              store.url ? (
                <li key={store.label}>
                  <a href={store.url} target="_blank" rel="noreferrer" className="store-button">
                    <Smartphone size={20} aria-hidden="true" />
                    <span>
                      <small>Disponible en</small>
                      <strong>{store.label}</strong>
                    </span>
                  </a>
                </li>
              ) : (
                <li key={store.label}>
                  <span
                    className="store-button store-button-soon"
                    aria-label={`${store.label}: pronto`}
                  >
                    <Smartphone size={20} aria-hidden="true" />
                    <span>
                      <small>Pronto en</small>
                      <strong>{store.label}</strong>
                    </span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="qr-card justify-self-center md:justify-self-end">
          <QrCode value={url} className="qr-code" />
          <p>{mobile ? 'Compartí este código' : 'Apuntá la cámara y tocá el enlace'}</p>
        </div>
      </div>

      <footer className="relative border-t border-white/10 px-6 py-5 text-xs text-white/60 md:px-14 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p>© {YEAR} Red Madero · Instituto Madero</p>
          <ul className="flex flex-wrap gap-5">
            {PRIVACY_URL && (
              <li>
                <a href={PRIVACY_URL} className="hover:text-white">
                  Política de privacidad
                </a>
              </li>
            )}
            {TERMS_URL && (
              <li>
                <a href={TERMS_URL} className="hover:text-white">
                  Términos y condiciones
                </a>
              </li>
            )}
            <li>
              <a href="#top" className="hover:text-white">
                Volver arriba
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </section>
  )
}
