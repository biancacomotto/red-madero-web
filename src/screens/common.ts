import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock,
  House,
  MapPin,
  Search,
  Siren,
  Star,
  User,
  X,
  type IconNode,
} from 'lucide'
import { C, type LabelPalette } from './tokens'
import {
  box,
  circleImage,
  disc,
  icon,
  measure,
  outline,
  ring,
  text,
  withShadow,
  wrap,
  type Ctx,
  H,
  W,
} from './paint'

export function background(ctx: Ctx, color: string = C.white): void {
  box(ctx, 0, 0, W, H, color)
}

export function statusBar(ctx: Ctx, color: string = C.title): void {
  text(ctx, '9:41', 38, 58, 15, color, 600)
  ;[0, 1, 2, 3].forEach((i) => box(ctx, 296 + i * 5, 51 - i * 2.5, 3.2, 7 + i * 2.5, color, 1))
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  for (const r of [3.5, 7, 10.5]) {
    ctx.beginPath()
    ctx.arc(331, 59, r, Math.PI * 1.25, Math.PI * 1.75)
    ctx.stroke()
  }
  disc(ctx, 331, 58.5, 1.4, color)
  outline(ctx, 348, 47, 24, 12, color, 3.5, 1.2)
  box(ctx, 350, 49, 17, 8, color, 2)
  box(ctx, 373.5, 50.5, 2, 5, color, 1)
}

export function homeIndicator(ctx: Ctx, color = 'rgb(17 19 24 / 40%)'): void {
  box(ctx, 128, 831, 134, 5, color, 2.5)
}

export function topBar(
  ctx: Ctx,
  title: string,
  options: { back?: boolean; action?: string } = {},
): void {
  if (options.back) icon(ctx, ChevronLeft, 18, 94, 26, C.title, 2)
  text(ctx, title, W / 2, 112, 17, C.title, 600, 'center')
  if (options.action) text(ctx, options.action, W - 24, 111, 13, C.primary, 600, 'right')
}

/** Greeting header of the two homes: avatar, name, a detail line and the bell. */
export function profileHeader(
  ctx: Ctx,
  img: HTMLImageElement,
  greeting: string,
  detail: string,
  detailIcon: IconNode = MapPin,
): void {
  avatar(ctx, img, 46, 112, 22)
  text(ctx, greeting, 80, 108, 18, C.title, 700)
  icon(ctx, detailIcon, 80, 117, 12, C.subtitle, 2)
  text(ctx, detail, 96, 128, 12, C.subtitle, 500)
  disc(ctx, 352, 112, 20, C.white)
  ring(ctx, 352, 112, 20, C.borderSoft, 1)
  icon(ctx, Bell, 342, 102, 20, C.title, 1.8)
  disc(ctx, 360, 103, 4, C.error)
}

export interface Tab {
  label: string
  icon: IconNode
}

export const PARTICULAR_TABS: Tab[] = [
  { label: 'Home', icon: House },
  { label: 'Trabajos', icon: BriefcaseBusiness },
  { label: 'Perfil', icon: User },
]

export const PRO_TABS: Tab[] = [
  { label: 'Home', icon: House },
  { label: 'Agenda', icon: CalendarDays },
  { label: 'Perfil', icon: User },
]

/** The floating bottom bar: the active tab shows its label inside a pale blue pill. */
export function tabBar(ctx: Ctx, tabs: Tab[], active: number): void {
  const x = 16
  const y = 750
  const w = W - 32
  const h = 60
  withShadow(ctx, 'rgb(17 19 24 / 10%)', 20, 6, () => box(ctx, x, y, w, h, C.white, 30))
  outline(ctx, x, y, w, h, C.borderSoft, 30, 1)
  const slot = w / tabs.length
  tabs.forEach((tab, index) => {
    const cx = x + slot * index + slot / 2
    if (index !== active) {
      icon(ctx, tab.icon, cx - 11, y + 19, 22, C.subtitle, 1.8)
      return
    }
    const width = 48 + measure(ctx, tab.label, 13, 600)
    box(ctx, cx - width / 2, y + 10, width, 40, C.navPill, 20)
    icon(ctx, tab.icon, cx - width / 2 + 14, y + 20, 20, C.navActive, 2)
    text(ctx, tab.label, cx - width / 2 + 40, y + 35, 13, C.navActive, 600)
  })
  homeIndicator(ctx)
}

/** Header of the request wizard: progress segments, a close button, title and hint. */
export function stepHeader(
  ctx: Ctx,
  step: number,
  total: number,
  title: string,
  subtitle: string,
): void {
  const x0 = 44
  const gap = 8
  const width = (W - x0 - 56 - gap * (total - 1)) / total
  for (let index = 0; index < total; index++) {
    box(ctx, x0 + index * (width + gap), 98, width, 5, index < step ? C.primary : C.divider, 2.5)
  }
  icon(ctx, X, W - 46, 89, 22, C.subtitle, 2)
  text(ctx, title, 24, 186, 24, C.title, 700)
  text(ctx, subtitle, 24, 214, 14, C.subtitle, 400)
}

export function backNext(ctx: Ctx, back = 'Atrás', next = 'Siguiente'): void {
  text(ctx, back, 246, 797, 16, C.title, 500, 'right')
  box(ctx, 266, 764, 100, 56, C.black, 28)
  text(ctx, next, 316, 797, 15, C.white, 600, 'center')
}

export function button(
  ctx: Ctx,
  label: string,
  y: number,
  options: {
    x?: number
    w?: number
    h?: number
    bg?: string
    color?: string
    border?: string
    size?: number
  } = {},
): void {
  const { x = 24, w = W - 48, h = 56, bg = C.black, color = C.white, border, size = 16 } = options
  box(ctx, x, y, w, h, bg, h / 2)
  if (border) outline(ctx, x, y, w, h, border, h / 2, 1.2)
  text(ctx, label, x + w / 2, y + h / 2 + size * 0.36, size, color, 700, 'center')
}

export interface ChipOptions {
  bg: string
  color: string
  border?: string
  icon?: IconNode
  size?: number
  weight?: number
  h?: number
}

/** A pill with optional icon; returns its width so chips can flow in a row. */
export function chip(ctx: Ctx, label: string, x: number, y: number, options: ChipOptions): number {
  const { size = 12, weight = 600, h = 28 } = options
  const padX = Math.round(h * 0.43)
  const iconSize = Math.round(size * 1.2)
  const iconWidth = options.icon ? iconSize + 6 : 0
  const w = padX * 2 + iconWidth + measure(ctx, label, size, weight)
  box(ctx, x, y, w, h, options.bg, h / 2)
  if (options.border) outline(ctx, x, y, w, h, options.border, h / 2, 1.2)
  if (options.icon)
    icon(ctx, options.icon, x + padX, y + (h - iconSize) / 2, iconSize, options.color, 2.2)
  text(ctx, label, x + padX + iconWidth, y + h / 2 + size * 0.36, size, options.color, weight)
  return w
}

export function labelChip(
  ctx: Ctx,
  label: string,
  x: number,
  y: number,
  palette: LabelPalette,
  options: Partial<ChipOptions> = {},
): number {
  const colors = C.label[palette]
  return chip(ctx, label, x, y, { bg: colors.bg, color: colors.text, size: 11, h: 24, ...options })
}

export type Urgency = 'Alta' | 'Media' | 'Baja'

const URGENCY: Record<Urgency, { palette: LabelPalette; icon: IconNode }> = {
  Alta: { palette: 'red', icon: Siren },
  Media: { palette: 'yellow', icon: Clock },
  Baja: { palette: 'green', icon: CalendarDays },
}

export function urgencyChip(ctx: Ctx, level: Urgency, x: number, y: number): number {
  const { palette, icon: node } = URGENCY[level]
  return labelChip(ctx, level, x, y, palette, { icon: node })
}

export function avatar(
  ctx: Ctx,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  r: number,
  ringColor?: string,
): void {
  if (ringColor) disc(ctx, cx, cy, r + 3, ringColor)
  disc(ctx, cx, cy, r, C.lightest)
  circleImage(ctx, img, cx, cy, r)
}

/** Five stars, the first `filled` ones solid. Returns the row's width. */
export function stars(ctx: Ctx, x: number, y: number, filled: number, size = 12): number {
  for (let index = 0; index < 5; index++) {
    icon(
      ctx,
      Star,
      x + index * (size + 3),
      y,
      size,
      C.warning,
      1.8,
      index < filled ? C.warning : undefined,
    )
  }
  return 5 * (size + 3) - 3
}

export function card(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  options: { bg?: string; border?: string; radius?: number; shadow?: boolean } = {},
): void {
  const { bg = C.white, border, radius = 16, shadow = false } = options
  if (shadow) withShadow(ctx, 'rgb(17 19 24 / 8%)', 24, 8, () => box(ctx, x, y, w, h, bg, radius))
  else box(ctx, x, y, w, h, bg, radius)
  if (border) outline(ctx, x, y, w, h, border, radius, 1)
}

/** A chat bubble; `out` is the person using the phone. Returns the bottom edge. */
export function bubble(
  ctx: Ctx,
  value: string,
  y: number,
  side: 'in' | 'out',
  maxWidth = 250,
): number {
  const size = 14
  const lineHeight = 19
  const padX = 14
  const padY = 11
  const lines = wrap(ctx, value, maxWidth, size, 400)
  const width = Math.max(...lines.map((entry) => measure(ctx, entry, size, 400))) + padX * 2
  const height = lines.length * lineHeight + padY * 2
  const x = side === 'out' ? W - 24 - width : 24
  const bg = side === 'out' ? C.primary : C.grayLight
  const color = side === 'out' ? C.white : C.title
  box(ctx, x, y, width, height, bg, side === 'out' ? [18, 18, 4, 18] : [18, 18, 18, 4])
  lines.forEach((entry, index) =>
    text(ctx, entry, x + padX, y + padY + 14 + index * lineHeight, size, color, 400),
  )
  return y + height
}

/** Three dots: the other person is typing. Returns the bottom edge. */
export function typing(ctx: Ctx, y: number): number {
  box(ctx, 24, y, 64, 38, C.grayLight, [18, 18, 18, 4])
  ;[0, 1, 2].forEach((index) =>
    disc(ctx, 44 + index * 12, y + 19, 3.5, index === 1 ? C.subtitle : C.muted),
  )
  return y + 38
}

export function systemPill(ctx: Ctx, label: string, y: number): number {
  const w = 44 + measure(ctx, label, 12, 500)
  const x = (W - w) / 2
  box(ctx, x, y, w, 26, C.grayLight, 13)
  icon(ctx, Check, x + 12, y + 6, 14, C.successDeep, 2.6)
  text(ctx, label, x + 30, y + 17.5, 12, C.subtitle, 500)
  return y + 26
}

export function keyValue(
  ctx: Ctx,
  label: string,
  value: string,
  y: number,
  options: {
    x?: number
    w?: number
    size?: number
    valueColor?: string
    valueWeight?: number
  } = {},
): void {
  const { x = 32, w = W - 64, size = 13, valueColor = C.title, valueWeight = 600 } = options
  text(ctx, label, x, y, size, C.subtitle, 400)
  text(ctx, value, x + w, y, size, valueColor, valueWeight, 'right')
}

export function divider(
  ctx: Ctx,
  y: number,
  x = 32,
  w = W - 64,
  color: string = C.borderSoft,
): void {
  box(ctx, x, y, w, 1, color)
}

export function heading(
  ctx: Ctx,
  title: string,
  y: number,
  options: { action?: string; size?: number } = {},
): void {
  text(ctx, title, 24, y, options.size ?? 16, C.title, 700)
  if (options.action) text(ctx, options.action, W - 24, y, 13, C.primary, 600, 'right')
}

export function searchBar(
  ctx: Ctx,
  placeholder: string,
  y: number,
  options: { x?: number; w?: number; h?: number } = {},
): void {
  const { x = 16, w = W - 32, h = 48 } = options
  box(ctx, x, y, w, h, C.grayLight, 14)
  icon(ctx, Search, x + 16, y + h / 2 - 9, 18, C.muted, 2)
  text(ctx, placeholder, x + 44, y + h / 2 + 5, 14, C.placeholder, 400)
}

/** A filled form field with its value right-aligned, as in the budget editor. */
export function field(ctx: Ctx, x: number, y: number, w: number, h: number, value: string): void {
  box(ctx, x, y, w, h, C.formField, 10)
  text(ctx, value, x + w - 12, y + h / 2 + 5, 13, C.inputText, 600, 'right')
}

export function radio(
  ctx: Ctx,
  cx: number,
  cy: number,
  selected: boolean,
  color: string = C.primary,
): void {
  ring(ctx, cx, cy, 10, selected ? color : C.border, 1.6)
  if (selected) disc(ctx, cx, cy, 5.5, color)
}

export function checkDisc(
  ctx: Ctx,
  cx: number,
  cy: number,
  r = 11,
  color: string = C.primary,
): void {
  disc(ctx, cx, cy, r, color)
  icon(ctx, Check, cx - r * 0.55, cy - r * 0.55, r * 1.1, C.white, 3)
}

/** The pill-shaped segmented control of the professional's home. */
export function segmented(ctx: Ctx, items: string[], selected: number, y: number): void {
  const x = 16
  const w = W - 32
  const h = 40
  box(ctx, x, y, w, h, C.track, h / 2)
  const slot = (w - 8) / items.length
  withShadow(ctx, 'rgb(0 0 0 / 8%)', 8, 2, () =>
    box(ctx, x + 4 + slot * selected, y + 4, slot, h - 8, C.white, (h - 8) / 2),
  )
  items.forEach((item, index) => {
    const active = index === selected
    text(
      ctx,
      item,
      x + 4 + slot * index + slot / 2,
      y + h / 2 + 5,
      13,
      active ? C.title : C.subtitle,
      active ? 700 : 500,
      'center',
    )
  })
}

/** The message composer at the bottom of a chat. */
export function composer(
  ctx: Ctx,
  placeholder: string,
  leading?: IconNode,
  sendIcon?: IconNode,
): void {
  const x = leading ? 56 : 16
  if (leading) icon(ctx, leading, 20, 766, 24, C.subtitle, 1.8)
  box(ctx, x, 752, 314 - x + 2, 52, C.white, 26)
  outline(ctx, x, 752, 314 - x + 2, 52, C.border, 26, 1)
  text(ctx, placeholder, x + 20, 783, 14, C.placeholder, 400)
  disc(ctx, 346, 778, 24, C.primary)
  if (sendIcon) icon(ctx, sendIcon, 335, 767, 22, C.white, 2)
  homeIndicator(ctx)
}
