import type { IconNode } from 'lucide'

/** Screens are designed at 390 x 844 points and scaled to the canvas. */
export const W = 390
export const H = 844
export const FONT = '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif'

export type Ctx = CanvasRenderingContext2D
export type Radius = number | [number, number, number, number]

export function box(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string | CanvasGradient,
  radius: Radius = 0,
): void {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.fill()
}

export function outline(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  radius: Radius,
  width = 1,
): void {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.stroke()
}

export function disc(ctx: Ctx, cx: number, cy: number, r: number, color: string): void {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
}

export function ring(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  color: string,
  width: number,
): void {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
}

export function line(
  ctx: Ctx,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  width = 1,
): void {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
}

function font(ctx: Ctx, size: number, weight: number): void {
  ctx.font = `${weight} ${size}px ${FONT}`
}

/** Width of `value` at that size and weight, without drawing it. */
export function measure(ctx: Ctx, value: string, size: number, weight = 400): number {
  font(ctx, size, weight)
  return ctx.measureText(value).width
}

/** Draws one line of text at baseline `y` and returns its width. */
export function text(
  ctx: Ctx,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 400,
  align: CanvasTextAlign = 'left',
  spacing = 0,
): number {
  font(ctx, size, weight)
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${spacing}px`
  ctx.fillText(value, x, y)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
  return ctx.measureText(value).width
}

/** Breaks `value` into lines no wider than `maxWidth`. */
export function wrap(
  ctx: Ctx,
  value: string,
  maxWidth: number,
  size: number,
  weight = 400,
): string[] {
  font(ctx, size, weight)
  const lines: string[] = []
  let current = ''
  for (const word of value.split(' ')) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth || !current) current = candidate
    else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Draws wrapped text and returns the baseline of the line after the last one. */
export function paragraph(
  ctx: Ctx,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  size: number,
  color: string,
  weight = 400,
  lineHeight = Math.round(size * 1.45),
  align: CanvasTextAlign = 'left',
  maxLines = Infinity,
): number {
  let lines = wrap(ctx, value, maxWidth, size, weight)
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines)
    let last = lines[maxLines - 1]
    font(ctx, size, weight)
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth)
      last = last.slice(0, -1).trimEnd()
    lines[maxLines - 1] = `${last}…`
  }
  lines.forEach((entry, index) =>
    text(ctx, entry, x, y + index * lineHeight, size, color, weight, align),
  )
  return y + lines.length * lineHeight
}

/** Runs `draw` clipped to a rounded rectangle. */
export function clip(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: Radius,
  draw: () => void,
): void {
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.clip()
  draw()
  ctx.restore()
}

/** Draws `img` inside the box, covering or containing it, optionally through rounded corners. */
export function image(
  ctx: Ctx,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  fit: 'cover' | 'contain' = 'cover',
  radius: Radius = 0,
): void {
  if (!img.naturalWidth) return
  const scale = (fit === 'cover' ? Math.max : Math.min)(w / img.naturalWidth, h / img.naturalHeight)
  const width = img.naturalWidth * scale
  const height = img.naturalHeight * scale
  const dx = x + (w - width) / 2
  const dy = y + (h - height) / 2
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  if (radius === 0 && fit === 'contain') {
    ctx.drawImage(img, dx, dy, width, height)
    return
  }
  clip(ctx, x, y, w, h, radius, () => ctx.drawImage(img, dx, dy, width, height))
}

export function circleImage(
  ctx: Ctx,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  r: number,
): void {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()
  image(ctx, img, cx - r, cy - r, r * 2, r * 2, 'cover')
  ctx.restore()
}

function numberAttribute(attrs: Record<string, string | number | undefined>, key: string): number {
  return Number(attrs[key] ?? 0)
}

/**
 * Draws a lucide icon from its node list, with its top-left corner at (x, y). The icons are
 * designed on a 24-unit grid with a 2-unit stroke; `strokeWidth` is in those units.
 */
export function icon(
  ctx: Ctx,
  node: IconNode,
  x: number,
  y: number,
  size: number,
  color: string,
  strokeWidth = 2,
  fill?: string,
): void {
  const unit = size / 24
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(unit, unit)
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (fill) ctx.fillStyle = fill
  for (const [tag, rawAttrs] of node) {
    const attrs = rawAttrs as Record<string, string | number | undefined>
    const n = (key: string) => numberAttribute(attrs, key)
    ctx.beginPath()
    if (tag === 'path') {
      const path = new Path2D(String(attrs.d ?? ''))
      if (fill) ctx.fill(path)
      ctx.stroke(path)
      continue
    }
    if (tag === 'circle') ctx.arc(n('cx'), n('cy'), n('r'), 0, Math.PI * 2)
    else if (tag === 'ellipse') ctx.ellipse(n('cx'), n('cy'), n('rx'), n('ry'), 0, 0, Math.PI * 2)
    else if (tag === 'rect') ctx.roundRect(n('x'), n('y'), n('width'), n('height'), n('rx'))
    else if (tag === 'line') {
      ctx.moveTo(n('x1'), n('y1'))
      ctx.lineTo(n('x2'), n('y2'))
    } else if (tag === 'polyline' || tag === 'polygon') {
      const points = String(attrs.points ?? '')
        .trim()
        .split(/[\s,]+/)
        .map(Number)
      for (let index = 0; index + 1 < points.length; index += 2) {
        if (index === 0) ctx.moveTo(points[0], points[1])
        else ctx.lineTo(points[index], points[index + 1])
      }
      if (tag === 'polygon') ctx.closePath()
    } else continue
    if (fill) ctx.fill()
    ctx.stroke()
  }
  ctx.restore()
}

/** Runs `draw` with a soft drop shadow. */
export function withShadow(
  ctx: Ctx,
  color: string,
  blur: number,
  offsetY: number,
  draw: () => void,
): void {
  ctx.save()
  ctx.shadowColor = color
  ctx.shadowBlur = blur
  ctx.shadowOffsetY = offsetY
  draw()
  ctx.restore()
}

export function gradient(
  ctx: Ctx,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: [number, string][],
): CanvasGradient {
  const value = ctx.createLinearGradient(x0, y0, x1, y1)
  stops.forEach(([offset, color]) => value.addColorStop(offset, color))
  return value
}

/** Argentine money: thousands separated by dots, no decimals. */
export function money(amount: number): string {
  return `$${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
}
