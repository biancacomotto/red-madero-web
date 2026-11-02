import QRCode from 'qrcode'
import { useMemo } from 'react'

interface QrCodeProps {
  value: string
  className?: string
  /** Whether the beaver sits in the middle. Needs the high error-correction level, which is always used. */
  mascot?: boolean
}

/** Quiet zone around the code, in modules. */
const MARGIN = 2

/** A QR code drawn as SVG in the brand colour, with the beaver in the middle. */
export function QrCode({ value, className = '', mascot = true }: QrCodeProps) {
  const { size, path } = useMemo(() => {
    const code = QRCode.create(value, { errorCorrectionLevel: 'H' })
    const count = code.modules.size
    const data = code.modules.data
    const parts: string[] = []
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (data[row * count + col]) parts.push(`M${col + MARGIN} ${row + MARGIN}h1v1h-1z`)
      }
    }
    return { size: count + MARGIN * 2, path: parts.join('') }
  }, [value])

  const badge = size * 0.22

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="Código QR para descargar Red Madero"
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="white" />
      <path d={path} fill="currentColor" />
      {mascot && (
        <>
          <rect
            x={(size - badge) / 2}
            y={(size - badge) / 2}
            width={badge}
            height={badge}
            rx={badge * 0.22}
            fill="white"
          />
          <image
            href="/mascota/cara.webp"
            x={(size - badge * 0.84) / 2}
            y={(size - badge * 0.84) / 2}
            width={badge * 0.84}
            height={badge * 0.84}
            preserveAspectRatio="xMidYMid meet"
          />
        </>
      )}
    </svg>
  )
}
