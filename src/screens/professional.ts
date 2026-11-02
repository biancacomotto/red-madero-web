import {
  ArrowDownLeft,
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Percent,
  Wallet,
  type IconNode,
} from 'lucide'
import {
  background,
  button,
  card,
  chip,
  field,
  heading,
  homeIndicator,
  labelChip,
  PRO_TABS,
  profileHeader,
  searchBar,
  segmented,
  statusBar,
  tabBar,
  topBar,
  urgencyChip,
  type Urgency,
} from './common'
import { box, disc, gradient, icon, measure, paragraph, text, withShadow, W } from './paint'
import type { Painter } from './particular'
import { C, type LabelPalette } from './tokens'

const REQUESTS: {
  title: string
  detail: string
  urgency: Urgency
  zone: string
  place: string
  ago: string
}[] = [
  {
    title: 'Salta la térmica con el aire',
    detail: 'Se corta la luz del living cuando prendo el aire acondicionado.',
    urgency: 'Media',
    zone: 'Living',
    place: 'Palermo · 1,2 km',
    ago: 'hace 12 min',
  },
  {
    title: 'Instalar luces en el patio',
    detail: 'Tres artefactos LED en una pared exterior, con cableado nuevo.',
    urgency: 'Baja',
    zone: 'Exterior',
    place: 'Villa Crespo · 3,4 km',
    ago: 'hace 1 h',
  },
  {
    title: 'Tablero sin energía',
    detail: 'Se apagó todo de golpe y hay olor a quemado en el tablero.',
    urgency: 'Alta',
    zone: 'Toda la casa',
    place: 'Colegiales · 2,1 km',
    ago: 'hace 3 h',
  },
]

/** The professional's home: the requests from people nearby, pending ones first. */
export const proRequests: Painter = (ctx, assets) => {
  background(ctx)
  statusBar(ctx)
  profileHeader(ctx, assets.avatar4, 'Hola, Lucas', 'Electricista de inmuebles', BriefcaseBusiness)
  segmented(ctx, ['Pendientes', 'En curso', 'Historial'], 0, 150)
  searchBar(ctx, 'Buscar solicitud...', 204, { h: 44 })
  REQUESTS.forEach((request, index) => {
    const x = 16
    const y = 262 + index * 136
    const w = W - 32
    card(ctx, x, y, w, 124, { border: C.borderSoft, radius: 18 })
    text(ctx, request.title, x + 16, y + 30, 15, C.title, 600)
    text(ctx, request.ago, x + w - 16, y + 29, 11, C.muted, 500, 'right')
    paragraph(ctx, request.detail, x + 16, y + 50, 250, 12, C.subtitle, 400, 16, 'left', 1)
    const used = urgencyChip(ctx, request.urgency, x + 16, y + 64)
    labelChip(ctx, request.zone, x + 16 + used + 8, y + 64, 'blue')
    icon(ctx, MapPin, x + 16, y + 92, 12, C.muted, 2)
    text(ctx, request.place, x + 34, y + 102, 12, C.subtitle, 500)
    box(ctx, x + w - 16 - 64, y + 82, 64, 30, C.primary, 15)
    text(ctx, 'Ver', x + w - 16 - 32, y + 102, 12, C.white, 600, 'center')
  })
  tabBar(ctx, PRO_TABS, 0)
}

function lineItem(ctx: CanvasRenderingContext2D, label: string, value: string, y: number): void {
  text(ctx, label, 32, y + 22, 13, C.title, 500)
  field(ctx, 236, y, 122, 34, value)
}

/** Building a budget: concepts, materials, available slots and the total. */
export const proQuote: Painter = (ctx) => {
  background(ctx, C.softBlue)
  statusBar(ctx)
  topBar(ctx, 'Armar presupuesto', { back: true })
  text(
    ctx,
    'Salta la térmica con el aire · Mateo · Palermo',
    W / 2,
    140,
    12,
    C.subtitle,
    500,
    'center',
  )

  card(ctx, 16, 156, W - 32, 150, { border: C.borderSoft, radius: 16 })
  text(ctx, 'Detalles de Presupuesto', 32, 184, 14, C.title, 700)
  lineItem(ctx, 'Mano de obra', '$45.000', 200)
  lineItem(ctx, 'Cambio de térmica 25 A', '$18.000', 244)
  text(ctx, '+ Agregar concepto', 32, 296, 13, C.primary, 600)

  card(ctx, 16, 322, W - 32, 150, { border: C.borderSoft, radius: 16 })
  text(ctx, 'Materiales', 32, 350, 14, C.title, 700)
  lineItem(ctx, 'Térmica bipolar 25 A · x1', '$12.500', 366)
  lineItem(ctx, 'Cable 2,5 mm · 10 m', '$8.000', 410)
  text(ctx, '+ Agregar material nuevo', 32, 462, 13, C.primary, 600)

  heading(ctx, 'Horarios disponibles', 508, { size: 15 })
  let x = 24
  for (const [label, selected] of [
    ['Jue 14:00', true],
    ['Vie 10:00', true],
    ['Lun 9:00', true],
    ['+ Agregar', false],
  ] as [string, boolean][]) {
    x +=
      chip(ctx, label, x, 522, {
        bg: selected ? C.primary : C.white,
        color: selected ? C.white : C.primary,
        border: selected ? undefined : C.primary,
        size: 12,
        h: 32,
      }) + 8
  }

  card(ctx, 16, 574, W - 32, 64, { border: C.borderSoft, radius: 16 })
  text(ctx, 'Total Presupuestado', 32, 600, 13, C.subtitle, 400)
  text(ctx, '$83.500', 32, 626, 22, C.title, 800)
  const readyWidth = 24 + measure(ctx, 'Listo para enviar', 11, 600)
  labelChip(ctx, 'Listo para enviar', 358 - readyWidth, 594, 'green')

  card(ctx, 16, 654, W - 32, 62, { border: C.borderSoft, radius: 16 })
  text(ctx, 'Comentario (opcional)', 32, 676, 11, C.subtitle, 500)
  text(ctx, 'Incluye prueba de todo el circuito.', 32, 698, 13, C.title, 500)
  button(ctx, 'Enviar propuesta', 736)
  homeIndicator(ctx)
}

const JOBS: {
  time: string
  title: string
  who: string
  status: string
  palette: keyof typeof C.agenda
  label: LabelPalette
}[] = [
  {
    time: '10:00 – 12:00',
    title: 'Cambio de térmica',
    who: 'Mateo · Palermo',
    status: 'Agendado',
    palette: 'blue',
    label: 'blue',
  },
  {
    time: '14:30 – 16:00',
    title: 'Revisión de tablero',
    who: 'Carla · Belgrano',
    status: 'Visita',
    palette: 'green',
    label: 'green',
  },
  {
    time: '17:00 – 18:30',
    title: 'Instalación de luminarias',
    who: 'Martín · Villa Urquiza',
    status: 'Por confirmar',
    palette: 'pink',
    label: 'orange',
  },
]

/** The agenda: the week, the day's jobs and the weekly availability. */
export const proAgenda: Painter = (ctx) => {
  background(ctx)
  statusBar(ctx)
  text(ctx, 'Agenda', 24, 118, 24, C.title, 700)
  text(ctx, 'Noviembre 2026', 24, 140, 14, C.subtitle, 500)
  disc(ctx, 346, 124, 20, C.lighter)
  icon(ctx, CalendarDays, 336, 114, 20, C.primary, 2)

  ;['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach((day, index) => {
    const cx = 47 + index * 50
    const selected = index === 4
    const weekend = index > 4
    text(ctx, day, cx, 176, 11, C.muted, 600, 'center')
    if (selected) disc(ctx, cx, 208, 17, C.primary)
    text(
      ctx,
      String(9 + index),
      cx,
      213,
      15,
      selected ? C.white : weekend ? C.muted : C.title,
      600,
      'center',
    )
    if (index === 4) disc(ctx, cx, 234, 2.5, C.primary)
    if (index === 2 || index === 3) disc(ctx, cx, 234, 2.5, C.lightest)
  })

  heading(ctx, 'Trabajos del día', 268, { size: 15 })
  text(ctx, 'Viernes 13', W - 24, 268, 13, C.subtitle, 500, 'right')
  JOBS.forEach((job, index) => {
    const y = 284 + index * 100
    const colors = C.agenda[job.palette]
    box(ctx, 16, y, W - 32, 88, colors.bg, 18)
    box(ctx, 16, y, 6, 88, colors.accent, [18, 0, 0, 18])
    text(ctx, job.time, 38, y + 27, 12, C.title, 700)
    const statusWidth = 24 + measure(ctx, job.status, 11, 600)
    labelChip(ctx, job.status, 358 - statusWidth, y + 14, job.label)
    text(ctx, job.title, 38, y + 51, 15, C.title, 600)
    text(ctx, job.who, 38, y + 71, 13, C.subtitle, 400)
  })

  card(ctx, 16, 598, W - 32, 110, { border: C.borderSoft, radius: 18 })
  text(ctx, 'Tu disponibilidad semanal', 32, 626, 14, C.title, 700)
  text(ctx, 'Editar', 358, 626, 13, C.primary, 600, 'right')
  ;['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach((day, index) => {
    const x = 32 + index * 47
    const open = index < 5
    box(ctx, x, 640, 40, 34, open ? C.lightest : C.grayLight, 12)
    text(ctx, day, x + 20, 662, 13, open ? C.primary : C.muted, 700, 'center')
  })
  text(ctx, 'Lunes a viernes · 9 a 18 hs', 32, 696, 12, C.subtitle, 500)
  tabBar(ctx, PRO_TABS, 1)
}

const MOVEMENTS: {
  icon: IconNode
  title: string
  detail: string
  amount: string
  date: string
  positive: boolean
}[] = [
  {
    icon: ArrowDownLeft,
    title: 'Cobro por la app',
    detail: 'Cambio de térmica · Mateo',
    amount: '+$83.500',
    date: '13 nov',
    positive: true,
  },
  {
    icon: Percent,
    title: 'Comisión de la plataforma',
    detail: 'Sobre el cobro anterior',
    amount: '−$8.350',
    date: '13 nov',
    positive: false,
  },
  {
    icon: Banknote,
    title: 'Cobro en efectivo',
    detail: 'Revisión de tablero · Carla',
    amount: '+$45.000',
    date: '11 nov',
    positive: true,
  },
  {
    icon: Percent,
    title: 'Comisión por cobro en efectivo',
    detail: 'Se descuenta del próximo cobro',
    amount: '−$4.500',
    date: '11 nov',
    positive: false,
  },
]

/** The wallet: what the app collected this month, debts and claims, and the movements. */
export const proWallet: Painter = (ctx) => {
  background(ctx, C.softBlue)
  statusBar(ctx)
  text(ctx, 'Billetera', 24, 118, 24, C.title, 700)

  withShadow(ctx, 'rgb(46 74 149 / 35%)', 30, 14, () =>
    box(
      ctx,
      16,
      140,
      W - 32,
      150,
      gradient(ctx, 16, 140, W - 16, 290, [
        [0, C.primary],
        [1, C.accent],
      ]),
      24,
    ),
  )
  text(
    ctx,
    'COBRADO POR LA APP · NOVIEMBRE',
    36,
    172,
    10,
    'rgb(255 255 255 / 72%)',
    700,
    'left',
    1.1,
  )
  text(ctx, '$236.500', 36, 216, 34, C.white, 800, 'left', -1)
  chip(ctx, 'Comisión pendiente: sin deuda', 36, 236, {
    bg: 'rgb(255 255 255 / 18%)',
    color: C.white,
    size: 11,
    h: 26,
    weight: 600,
  })
  disc(ctx, 330, 178, 24, 'rgb(255 255 255 / 18%)')
  icon(ctx, Wallet, 317, 165, 26, C.white, 1.8)
  text(ctx, 'Red Madero', 342, 274, 11, 'rgb(255 255 255 / 72%)', 600, 'right')

  card(ctx, 16, 306, 173, 70, { border: C.borderSoft, radius: 16 })
  text(ctx, '6', 32, 338, 22, C.title, 800)
  text(ctx, 'Trabajos cobrados', 32, 360, 11, C.subtitle, 500)
  card(ctx, 201, 306, 173, 70, { border: C.borderSoft, radius: 16 })
  text(ctx, 'Sin reclamos', 217, 338, 15, C.successDeep, 700)
  text(ctx, 'Reclamos', 217, 360, 11, C.subtitle, 500)

  heading(ctx, 'Movimientos', 416, { size: 15, action: 'Ver todo' })
  MOVEMENTS.forEach((movement, index) => {
    const y = 432 + index * 68
    const w = W - 32
    card(ctx, 16, y, w, 60, { border: C.borderSoft, radius: 16 })
    disc(ctx, 52, y + 30, 20, movement.positive ? C.label.green.bg : C.grayLight)
    icon(ctx, movement.icon, 43, y + 21, 18, movement.positive ? C.label.green.text : C.subtitle, 2)
    text(ctx, movement.title, 84, y + 26, 13, C.title, 600)
    text(ctx, movement.detail, 84, y + 44, 11, C.subtitle, 400)
    text(
      ctx,
      movement.amount,
      16 + w - 16,
      y + 26,
      13,
      movement.positive ? C.successDeep : C.title,
      700,
      'right',
    )
    text(ctx, movement.date, 16 + w - 16, y + 44, 11, C.muted, 500, 'right')
  })
  tabBar(ctx, PRO_TABS, 2)
}
