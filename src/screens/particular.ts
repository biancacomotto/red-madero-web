import {
  AirVent,
  BadgeCheck,
  BadgeDollarSign,
  Banknote,
  Bath,
  BedDouble,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  Clock,
  CookingPot,
  Ellipsis,
  Flag,
  Flame,
  House,
  Lightbulb,
  Lock,
  MonitorCog,
  PlugZap,
  Presentation,
  Send,
  Siren,
  Sofa,
  Sparkles,
  Star,
  TreeDeciduous,
  User,
  Wallet,
  Zap,
  type IconNode,
} from 'lucide'
import type { ScreenAssets } from './assets'
import {
  avatar,
  background,
  backNext,
  bubble,
  button,
  card,
  checkDisc,
  chip,
  composer,
  divider,
  heading,
  homeIndicator,
  keyValue,
  labelChip,
  PARTICULAR_TABS,
  profileHeader,
  radio,
  searchBar,
  stars,
  statusBar,
  stepHeader,
  systemPill,
  tabBar,
  topBar,
  typing,
  urgencyChip,
  type Urgency,
} from './common'
import {
  box,
  clip,
  disc,
  gradient,
  icon,
  image,
  measure,
  outline,
  paragraph,
  text,
  withShadow,
  type Ctx,
  H,
  W,
} from './paint'
import { C } from './tokens'

export type Painter = (ctx: Ctx, assets: ScreenAssets) => void

/** The first screen: the beavers over the login glow, the role switch and "Comenzar". */
export const welcome: Painter = (ctx, assets) => {
  background(ctx)
  box(
    ctx,
    0,
    0,
    W,
    600,
    gradient(ctx, 0, 0, 0, 600, [
      [0, '#F2F7FF'],
      [0.45, '#CFE2FB'],
      [1, '#9EC7F5'],
    ]),
  )
  const glow = ctx.createRadialGradient(W * 0.82, 110, 10, W * 0.82, 110, 330)
  glow.addColorStop(0, 'rgb(255 255 255 / 70%)')
  glow.addColorStop(1, 'rgb(255 255 255 / 0%)')
  box(ctx, 0, 0, W, 600, glow)
  statusBar(ctx)
  image(ctx, assets.logo, 24, 84, 342, 86, 'contain')
  image(ctx, assets.castores, 0, 184, W, 392, 'contain')
  box(ctx, 0, 562, W, H - 562, C.white, [48, 48, 0, 0])
  box(ctx, 40, 608, 310, 56, C.track, 28)
  withShadow(ctx, 'rgb(0 0 0 / 10%)', 10, 2, () => box(ctx, 44, 612, 151, 48, C.white, 24))
  icon(ctx, User, 70, 626, 20, C.primary, 2.2)
  text(ctx, 'Particular', 98, 643, 15, C.primary, 700)
  icon(ctx, BriefcaseBusiness, 222, 626, 20, C.inputText, 2)
  text(ctx, 'Profesional', 250, 643, 15, C.subtitle, 500)
  paragraph(
    ctx,
    'Conectamos personas con profesionales confiables para resolver lo que necesitás.',
    W / 2,
    708,
    300,
    15,
    C.subtitle,
    500,
    22,
    'center',
  )
  button(ctx, 'Comenzar', 752)
  homeIndicator(ctx)
}

const CATEGORIES: [string, IconNode][] = [
  ['Electricista', Zap],
  ['Gasista', Flame],
  ['Climatización', AirVent],
  ['Sistemas', MonitorCog],
  ['Electrónica', CircuitBoard],
]

/** The particular's home: search by trade, the assistant banner and nearby professionals. */
export const home: Painter = (ctx, assets) => {
  background(ctx)
  statusBar(ctx)
  profileHeader(ctx, assets.avatar1, 'Hola, Mateo', 'Palermo, CABA')

  card(ctx, 16, 150, W - 32, 108, { border: C.borderSoft, radius: 12 })
  text(ctx, '¿No sabés a quién contratar?', 36, 182, 13, C.primary, 700)
  text(ctx, 'Contanos tu problema', 36, 203, 12, C.subtitle, 500)
  box(ctx, 36, 216, 86, 28, C.primary, 14)
  text(ctx, 'Empezar', 79, 234, 13, C.white, 600, 'center')
  image(ctx, assets.saludando, 196, 150, 165, 108, 'contain')

  clip(ctx, 0, 268, W, 48, 0, () => {
    let x = 16
    CATEGORIES.forEach(([label, node], index) => {
      const selected = index === 0
      x +=
        chip(ctx, label, x, 276, {
          bg: selected ? C.primary : C.white,
          color: selected ? C.white : C.title,
          border: selected ? undefined : C.border,
          icon: node,
          size: 13,
          weight: 600,
          h: 34,
        }) + 8
    })
  })

  searchBar(ctx, 'Buscar profesional o servicio', 330)
  heading(ctx, 'Profesionales cerca tuyo', 414, { action: 'Ver todos' })
  const pros: [HTMLImageElement, string, string, string][] = [
    [assets.avatar3, 'Lucas Ferreyra', 'Electricista de inmuebles', '4,9 (32)'],
    [assets.avatar5, 'Carla Núñez', 'Gasista', '4,8 (21)'],
    [assets.avatar2, 'Martín Sosa', 'Climatización', '5,0 (14)'],
  ]
  pros.forEach(([img, name, trade, rating], index) => {
    const y = 430 + index * 100
    card(ctx, 16, y, W - 32, 88, { border: C.borderSoft, radius: 16 })
    avatar(ctx, img, 56, y + 44, 28)
    text(ctx, name, 98, y + 34, 15, C.title, 600)
    text(ctx, trade, 98, y + 53, 12, C.subtitle, 400)
    icon(ctx, Star, 98, y + 61, 12, C.warning, 2, C.warning)
    text(ctx, rating, 115, y + 72, 12, C.title, 600)
    labelChip(ctx, 'Verificado', 258, y + 14, 'green', { icon: BadgeCheck })
    icon(ctx, ChevronRight, 342, y + 55, 18, C.muted, 2)
  })
  tabBar(ctx, PARTICULAR_TABS, 0)
}

/** The assistant: one question at a time, then a diagnosis with the suggested trade. */
export const chatAi: Painter = (ctx, assets) => {
  background(ctx, C.softBlue)
  statusBar(ctx)
  topBar(ctx, 'Asistente', { back: true, action: 'Nuevo chat' })

  card(ctx, 16, 134, W - 32, 60, { border: C.borderSoft, radius: 16 })
  image(ctx, assets.pensando, 24, 138, 52, 52, 'contain')
  paragraph(
    ctx,
    'Contame qué pasa y te ayudo a elegir el oficio indicado.',
    86,
    159,
    270,
    13,
    C.subtitle,
    500,
    17,
  )

  let y = 210
  y = bubble(ctx, 'Se cortó la luz en una parte de la casa', y, 'out') + 10
  y =
    bubble(
      ctx,
      '¿Saltó la térmica o se cortó sin más? ¿Pasa cuando prendés algún aparato?',
      y,
      'in',
    ) + 10
  y = bubble(ctx, 'Salta la térmica cuando prendo el aire', y, 'out') + 14

  const top = y
  card(ctx, 24, top, W - 48, 244, { border: C.lightest, radius: 18, shadow: true })
  text(ctx, 'DIAGNÓSTICO', 44, top + 28, 11, C.primary, 700, 'left', 1.2)
  const after = paragraph(
    ctx,
    'Probable sobrecarga en el circuito del aire acondicionado. Conviene revisar la térmica y el cableado de ese sector.',
    44,
    top + 52,
    290,
    13,
    C.title,
    500,
    18,
  )
  text(ctx, 'Categoría', 44, after + 20, 12, C.subtitle)
  labelChip(ctx, 'Electricista de inmuebles', 118, after + 4, 'blue')
  text(ctx, 'Urgencia', 44, after + 50, 12, C.subtitle)
  urgencyChip(ctx, 'Media', 118, after + 34)
  button(ctx, 'Crear solicitud', top + 244 - 60, {
    x: 44,
    w: W - 88,
    h: 44,
    bg: C.primary,
    size: 14,
  })

  clip(ctx, 0, top + 252, W, 44, 0, () => {
    let x = 24
    for (const label of ['Hay una pérdida', 'Siento olor a quemado', 'Tengo humedad en la pared']) {
      x +=
        chip(ctx, label, x, top + 258, {
          bg: C.white,
          color: C.title,
          border: C.border,
          size: 12,
          weight: 500,
          h: 32,
        }) + 8
    }
  })
  composer(ctx, 'Escribinos tu problema…', undefined, Send)
}

const ZONES: [string, IconNode][] = [
  ['Cocina', CookingPot],
  ['Baño', Bath],
  ['Habitación', BedDouble],
  ['Living', Sofa],
  ['Exterior', TreeDeciduous],
  ['Toda la casa', House],
]

/** "¿Dónde pasa?": the cut-away house with the living room picked. */
export const zone: Painter = (ctx, assets) => {
  background(ctx)
  statusBar(ctx)
  stepHeader(ctx, 2, 6, '¿Dónde pasa?', 'Seleccioná la zona afectada.')
  image(ctx, assets.casa, 24, 236, 342, 228, 'contain')
  const hx = 24 + 342 * 0.6
  const hy = 236 + 228 * 0.545
  const hw = 342 * 0.255
  const hh = 228 * 0.34
  withShadow(ctx, 'rgb(59 120 250 / 45%)', 14, 0, () =>
    outline(ctx, hx, hy, hw, hh, C.accent, 8, 2.5),
  )
  box(ctx, hx - 2, hy - 22, 54, 20, C.primary, 6)
  text(ctx, 'Living', hx + 25, hy - 8, 11, C.white, 600, 'center')

  ZONES.forEach(([label, node], index) => {
    const x = 24 + (index % 2) * 176
    const y = 492 + Math.floor(index / 2) * 62
    const selected = label === 'Living'
    box(ctx, x, y, 166, 50, selected ? C.primary : C.white, 14)
    if (!selected) outline(ctx, x, y, 166, 50, C.border, 14, 1.2)
    const color = selected ? C.white : C.primary
    const total = 26 + measure(ctx, label, 14, 600)
    const sx = x + (166 - total) / 2
    icon(ctx, node, sx, y + 16, 18, color, 2)
    text(ctx, label, sx + 26, y + 30, 14, color, 600)
  })
  box(ctx, 24, 678, 342, 50, C.white, 14)
  outline(ctx, 24, 678, 342, 50, C.border, 14, 1.2)
  const otherWidth = 26 + measure(ctx, 'Otra zona', 14, 600)
  icon(ctx, Ellipsis, 195 - otherWidth / 2, 694, 18, C.primary, 2)
  text(ctx, 'Otra zona', 195 - otherWidth / 2 + 26, 708, 14, C.primary, 600)
  backNext(ctx)
  homeIndicator(ctx)
}

const URGENCIES: {
  level: Urgency
  text: string
  icon: IconNode
  bg: string
  color: string
  outline: string
}[] = [
  {
    level: 'Alta',
    text: 'Necesito que se resuelva lo antes posible.',
    icon: Siren,
    bg: C.label.red.bg,
    color: C.error,
    outline: C.error,
  },
  {
    level: 'Media',
    text: 'Me gustaría que se resuelva pronto.',
    icon: Clock,
    bg: C.label.yellow.bg,
    color: '#C99A00',
    outline: '#E0B400',
  },
  {
    level: 'Baja',
    text: 'No es urgente, puedo esperar.',
    icon: CalendarDays,
    bg: C.label.green.bg,
    color: '#3F9C63',
    outline: '#5DB87F',
  },
]

/** "Urgencia": the worried beaver and the three options. */
export const urgency: Painter = (ctx, assets) => {
  background(ctx)
  statusBar(ctx)
  stepHeader(ctx, 4, 6, 'Urgencia', 'Elegí qué tan urgente es tu situación.')
  image(ctx, assets.urgencia, 55, 230, 280, 186, 'contain')
  URGENCIES.forEach((option, index) => {
    const y = 436 + index * 104
    const selected = option.level === 'Media'
    card(ctx, 24, y, 342, 90, { radius: 18 })
    outline(ctx, 24, y, 342, 90, option.outline, 18, selected ? 2 : 1.2)
    disc(ctx, 68, y + 45, 24, option.bg)
    icon(ctx, option.icon, 56, y + 33, 24, option.color, 2)
    text(ctx, option.level, 108, y + 38, 17, C.title, 600)
    paragraph(ctx, option.text, 108, y + 59, 190, 13, C.subtitle, 400, 17)
    radio(ctx, 326, y + 45, selected, option.color)
  })
  backNext(ctx)
  homeIndicator(ctx)
}

const SKILLS: [string, IconNode, 'orange' | 'green' | 'red' | 'purple'][] = [
  ['Puntual', Clock, 'orange'],
  ['Prolijo', Sparkles, 'green'],
  ['Precios claros', BadgeDollarSign, 'green'],
  ['Atiendo urgencias', Siren, 'red'],
  ['Explico lo que hago', Presentation, 'purple'],
]

/** A professional's public profile: trade, rating, skills, past work and availability. */
export const profile: Painter = (ctx, assets) => {
  background(ctx)
  box(
    ctx,
    0,
    0,
    W,
    200,
    gradient(ctx, 0, 0, 0, 200, [
      [0, C.lighter],
      [1, C.white],
    ]),
  )
  statusBar(ctx)
  icon(ctx, ChevronLeft, 18, 94, 26, C.title, 2)
  icon(ctx, Flag, W - 42, 96, 20, C.subtitle, 1.8)

  avatar(ctx, assets.avatar3, 72, 196, 44, C.white)
  checkDisc(ctx, 104, 228, 13, C.accent)
  text(ctx, 'Lucas Ferreyra', 130, 190, 20, C.title, 700)
  text(ctx, 'Electricista de inmuebles', 130, 212, 13, C.subtitle, 500)
  icon(ctx, Star, 130, 234, 14, C.warning, 2, C.warning)
  text(ctx, '4,9', 149, 246, 13, C.title, 700)
  text(ctx, '(32 reseñas)', 174, 246, 12, C.subtitle, 400)
  disc(ctx, 254, 242, 2, C.muted)
  text(ctx, 'Egresado CFP 405', 264, 246, 12, C.subtitle, 500)

  let x = 24
  SKILLS.forEach(([label, node, palette], index) => {
    if (index === 3) x = 24
    const y = index < 3 ? 268 : 304
    x += labelChip(ctx, label, x, y, palette, { icon: node, h: 28, size: 12 }) + 8
  })

  heading(ctx, 'Sobre mí', 366, { size: 15 })
  paragraph(
    ctx,
    'Instalaciones y reparaciones eléctricas en casas y departamentos. Trabajo con materiales certificados y dejo todo prolijo.',
    24,
    388,
    342,
    13,
    C.subtitle,
    400,
    19,
  )
  heading(ctx, 'Trabajos anteriores', 484, { size: 15 })
  const tiles: [string, IconNode, string, string][] = [
    ['Tablero', Zap, C.lighter, C.lightest],
    ['Luminarias', Lightbulb, C.info.sky, '#BFE3F3'],
    ['Tomas', PlugZap, C.info.lilac, '#CFC2F0'],
  ]
  tiles.forEach(([label, node, from, to], index) => {
    const tx = 24 + index * 118
    box(
      ctx,
      tx,
      500,
      106,
      106,
      gradient(ctx, tx, 500, tx + 106, 606, [
        [0, from],
        [1, to],
      ]),
      16,
    )
    icon(ctx, node, tx + 37, 526, 32, C.primary, 1.6)
    text(ctx, label, tx + 53, 588, 11, C.primary, 600, 'center')
  })
  heading(ctx, 'Disponibilidad', 646, { size: 15 })
  ;['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach((day, index) => {
    const cx = 40 + index * 52
    const open = index < 5
    disc(ctx, cx, 678, 16, open ? C.lightest : C.grayLight)
    text(ctx, day, cx, 683, 13, open ? C.primary : C.muted, 700, 'center')
  })
  text(ctx, 'Lunes a viernes · 9 a 18 hs', 24, 716, 12, C.subtitle, 500)
  button(ctx, 'Enviar solicitud', 740)
  homeIndicator(ctx)
}

/** The budget a professional sent: items, materials, total and the slots to pick from. */
export const proposal: Painter = (ctx, assets) => {
  background(ctx, C.softBlue)
  statusBar(ctx)
  topBar(ctx, 'Presupuesto', { back: true })

  card(ctx, 16, 136, W - 32, 72, { border: C.borderSoft, radius: 16 })
  avatar(ctx, assets.avatar3, 56, 172, 24)
  text(ctx, 'Lucas Ferreyra', 92, 167, 15, C.title, 600)
  text(ctx, 'Electricista de inmuebles', 92, 186, 12, C.subtitle, 400)
  const chipWidth = 24 + measure(ctx, 'Presupuesto recibido', 11, 600)
  labelChip(ctx, 'Presupuesto recibido', 358 - chipWidth, 160, 'blue')

  card(ctx, 16, 222, W - 32, 232, { border: C.borderSoft, radius: 16 })
  text(ctx, 'Detalles de Presupuesto', 32, 250, 14, C.title, 700)
  keyValue(ctx, 'Mano de obra', '$45.000', 280)
  keyValue(ctx, 'Cambio de térmica 25 A', '$18.000', 306)
  text(ctx, 'Materiales', 32, 340, 13, C.subtitle, 600)
  keyValue(ctx, 'Térmica bipolar 25 A', '$12.500', 366)
  keyValue(ctx, 'Cable 2,5 mm (10 m)', '$8.000', 392)
  divider(ctx, 410)
  text(ctx, 'Total Presupuestado', 32, 439, 14, C.title, 700)
  text(ctx, '$83.500', 358, 440, 18, C.title, 800, 'right')

  heading(ctx, 'Horarios propuestos', 494, { size: 15 })
  const slots: [string, boolean][] = [
    ['Jue 12 nov · 14:00', false],
    ['Vie 13 nov · 10:00', true],
    ['Lun 16 nov · 9:00', false],
  ]
  slots.forEach(([label, selected], index) => {
    const y = 508 + index * 58
    card(ctx, 16, y, W - 32, 50, { border: selected ? C.primary : C.borderSoft, radius: 14 })
    if (selected) outline(ctx, 16, y, W - 32, 50, C.primary, 14, 1.6)
    icon(ctx, CalendarDays, 32, y + 16, 18, C.primary, 2)
    text(ctx, label, 60, y + 31, 14, C.title, 600)
    if (selected) checkDisc(ctx, 344, y + 25, 11)
  })
  text(ctx, 'Incluye prueba de todo el circuito.', 24, 700, 12, C.subtitle, 500)
  button(ctx, 'Rechazar', 724, {
    x: 24,
    w: 160,
    h: 52,
    bg: C.white,
    color: C.title,
    border: C.border,
    size: 15,
  })
  button(ctx, 'Aceptar', 724, { x: 206, w: 160, h: 52, size: 15 })
  homeIndicator(ctx)
}

/** The chat with the professional, with the scheduled visit pinned on top. */
export const chat: Painter = (ctx, assets) => {
  background(ctx)
  statusBar(ctx)
  icon(ctx, ChevronLeft, 18, 94, 26, C.title, 2)
  avatar(ctx, assets.avatar3, 74, 108, 18)
  text(ctx, 'Lucas Ferreyra', 100, 104, 15, C.title, 600)
  disc(ctx, 104, 121, 3, C.success)
  text(ctx, 'En línea', 112, 125, 12, C.subtitle, 500)
  icon(ctx, Flag, W - 42, 96, 20, C.subtitle, 1.8)

  card(ctx, 16, 142, W - 32, 80, { bg: C.lighter, radius: 16 })
  disc(ctx, 52, 182, 20, C.white)
  icon(ctx, CalendarDays, 42, 172, 20, C.primary, 2)
  text(ctx, 'Visita agendada', 84, 172, 14, C.title, 700)
  text(ctx, 'Viernes 13 de noviembre · 10:00', 84, 192, 13, C.title, 500)
  text(ctx, 'Palermo, CABA', 84, 210, 12, C.subtitle, 400)
  text(ctx, 'Ver', 350, 186, 13, C.primary, 600, 'right')

  text(ctx, 'Hoy', W / 2, 252, 11, C.muted, 500, 'center')
  let y = 266
  y =
    bubble(ctx, 'Hola Mateo, mañana llego 10 en punto. ¿El tablero está en la cocina?', y, 'in') +
    10
  y = bubble(ctx, 'Sí, al lado de la heladera. Te espero.', y, 'out') + 10
  y = bubble(ctx, 'Perfecto. Llevo la térmica nueva y reviso el cableado del aire.', y, 'in') + 14
  y = systemPill(ctx, 'Lucas confirmó la visita', y) + 14
  y = bubble(ctx, '¡Genial! Gracias', y, 'out') + 10
  typing(ctx, y)
  composer(ctx, 'Escribí un mensaje', Camera, Send)
}

/** The final payment: the summary, Mercado Pago or cash, and the review that follows. */
export const payment: Painter = (ctx) => {
  background(ctx, C.softBlue)
  statusBar(ctx)
  topBar(ctx, 'Resumen de pago', { back: true })

  card(ctx, 16, 136, W - 32, 150, { border: C.borderSoft, radius: 16 })
  keyValue(ctx, 'Trabajo', 'Cambio de térmica', 168)
  keyValue(ctx, 'Profesional', 'Lucas Ferreyra', 196)
  divider(ctx, 214)
  text(ctx, 'Importe final a abonar', 32, 244, 13, C.subtitle, 400)
  text(ctx, '$83.500', 32, 274, 26, C.title, 800)
  const doneWidth = 24 + measure(ctx, 'Trabajo terminado', 11, 600)
  labelChip(ctx, 'Trabajo terminado', 358 - doneWidth, 252, 'green')

  text(ctx, 'Elegí cómo abonar el trabajo terminado.', 24, 322, 14, C.title, 500)
  const options: [string, string, IconNode, string, string, boolean][] = [
    ['Mercado Pago', 'Pagás online con tu cuenta.', Wallet, '#E0F6FF', C.mercadoPago.navy, true],
    [
      'Efectivo',
      'Le pagás directamente al profesional.',
      Banknote,
      C.label.green.bg,
      C.label.green.text,
      false,
    ],
  ]
  options.forEach(([title, detail, node, tileBg, tileColor, selected], index) => {
    const y = 340 + index * 104
    card(ctx, 16, y, W - 32, 92, { border: selected ? C.primary : C.borderSoft, radius: 18 })
    if (selected) outline(ctx, 16, y, W - 32, 92, C.primary, 18, 1.6)
    box(ctx, 32, y + 16, 60, 60, tileBg, 14)
    icon(ctx, node, 48, y + 32, 28, tileColor, 1.8)
    text(ctx, title, 108, y + 40, 15, C.title, 600)
    text(ctx, detail, 108, y + 60, 13, C.subtitle, 400)
    radio(ctx, 340, y + 46, selected)
  })
  icon(ctx, Lock, 24, 552, 14, C.muted, 2)
  text(ctx, 'Pagá de forma segura con tu cuenta.', 44, 563, 12, C.subtitle, 500)

  card(ctx, 16, 586, W - 32, 116, { bg: C.lighter, radius: 18 })
  text(ctx, 'DESPUÉS DEL PAGO', 36, 612, 11, C.primary, 700, 'left', 1.2)
  text(ctx, '¿Cómo te fue con Lucas?', 36, 638, 15, C.title, 700)
  stars(ctx, 36, 650, 4, 22)
  text(ctx, 'Tu reseña ayuda a otros particulares a elegir mejor.', 36, 690, 12, C.subtitle, 500)
  button(ctx, 'Pagar con Mercado Pago', 736)
  homeIndicator(ctx)
}
