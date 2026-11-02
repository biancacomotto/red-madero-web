import type { ScreenId } from '@/screens/ids'

export const SITE = {
  name: 'Red Madero',
  claim: 'Oficios verificados en tu casa.',
  description:
    'Electricistas, gasistas y técnicos egresados del Centro de Formación Profesional N.° 405, verificados por nuestro equipo. Contá tu problema, recibí un presupuesto y coordiná la visita.',
  tagline: 'Conectamos personas con profesionales confiables para resolver lo que necesitás.',
} as const

/** Sections reachable from the nav pill, in page order. */
export const NAV = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#oficios', label: 'Oficios' },
  { href: '#profesionales', label: 'Profesionales' },
  { href: '#confianza', label: 'Confianza' },
  { href: '#descargar', label: 'Descargar' },
] as const

export interface FlowStep {
  id: string
  /** The screen the phone shows while this step is on screen. */
  screen: ScreenId
  title: string
  text: string
  /** Small mascot illustration next to the text. */
  mascot: { src: string; alt: string }
}

/** What a person who needs a repair does, in order. Each step is one viewport. */
export const STEPS: FlowStep[] = [
  {
    id: 'contar',
    screen: 'chatAi',
    title: 'Contá tu problema',
    text: 'Con tus palabras y con fotos. Si no sabés por dónde empezar, el asistente te hace una pregunta por vez y te sugiere el oficio indicado.',
    mascot: { src: '/mascota/pensando.webp', alt: 'El castor de Red Madero pensando' },
  },
  {
    id: 'zona',
    screen: 'zone',
    title: 'Decinos dónde y qué tan urgente',
    text: 'Marcás la zona de la casa y elegís la urgencia. El profesional llega sabiendo qué esperar.',
    mascot: { src: '/mascota/urgencia.webp', alt: 'El castor sorprendido' },
  },
  {
    id: 'elegir',
    screen: 'profile',
    title: 'Elegí a quién llamar',
    text: 'Perfiles reales: experiencia, fotos de trabajos anteriores, reseñas y disponibilidad. Todos egresados del CFP N.° 405 y verificados.',
    mascot: { src: '/mascota/lupa.webp', alt: 'El castor con una lupa' },
  },
  {
    id: 'presupuesto',
    screen: 'proposal',
    title: 'Recibí un presupuesto detallado',
    text: 'Ítems del trabajo, materiales y horarios posibles para elegir. Lo aceptás o proponés otro horario, sin llamados.',
    mascot: { src: '/mascota/esperando-reloj.webp', alt: 'El castor esperando con un reloj' },
  },
  {
    id: 'coordinar',
    screen: 'chat',
    title: 'Coordiná y seguí el trabajo',
    text: 'Chateás dentro de la app, confirmás la visita y te avisamos en cada paso: aceptado, agendado, en curso, terminado.',
    mascot: { src: '/mascota/trabajo.webp', alt: 'El castor trabajando' },
  },
  {
    id: 'pagar',
    screen: 'payment',
    title: 'Pagá al terminar',
    text: 'Con Mercado Pago o en efectivo, confirmando con el código que te da el profesional. Después calificás cómo te fue.',
    mascot: { src: '/mascota/avion.webp', alt: 'El castor lanzando un avión de papel' },
  },
]

export type Palette = 'blue' | 'orange' | 'sky' | 'purple' | 'yellow' | 'mint' | 'pink'

export interface Trade {
  name: string
  /** The full category name in the app, when the short one differs. */
  full?: string
  icon: 'Zap' | 'Flame' | 'AirVent' | 'MonitorCog' | 'CircuitBoard' | 'Cog' | 'CarFront'
  palette: Palette
}

/** The seven categories the backend seeds, with the short labels the app's home uses. */
export const TRADES: Trade[] = [
  { name: 'Electricista de inmuebles', icon: 'Zap', palette: 'blue' },
  { name: 'Gasista', icon: 'Flame', palette: 'orange' },
  {
    name: 'Climatización',
    full: 'Instalador y reparador de climatización',
    icon: 'AirVent',
    palette: 'sky',
  },
  {
    name: 'Soporte informático',
    full: 'Instalador y soporte de sistemas informáticos',
    icon: 'MonitorCog',
    palette: 'purple',
  },
  { name: 'Electrónica industrial', icon: 'CircuitBoard', palette: 'yellow' },
  { name: 'Tornero', icon: 'Cog', palette: 'mint' },
  {
    name: 'Mecánica automotor',
    full: 'Auxiliar mecánico de automotores',
    icon: 'CarFront',
    palette: 'pink',
  },
]

/** How a professional gets verified before receiving requests. */
export const VERIFICATION = [
  { title: 'Identidad', text: 'DNI y CUIT/CUIL de cada profesional.' },
  { title: 'Título', text: 'Egreso del CFP N.° 405 y año de egreso.' },
  { title: 'Revisión', text: 'Nuestro equipo revisa cada perfil, uno por uno.' },
  { title: 'Habilitado', text: 'Recién entonces puede recibir solicitudes.' },
] as const

export const PRO = {
  title: 'Si sos profesional, el trabajo te encuentra.',
  items: [
    'Recibís solicitudes de personas de tu zona que necesitan tu oficio.',
    'Armás presupuestos con ítems, materiales y horarios disponibles.',
    'Organizás tu agenda y tu disponibilidad semanal.',
    'Mostrás tus trabajos en tu perfil para que te elijan.',
    'Cobrás con Mercado Pago o en efectivo y seguís todo en tu billetera.',
  ],
  /** Pairs of screens for the two phones, left then right. */
  pairs: [
    ['proRequests', 'proQuote'],
    ['proAgenda', 'proWallet'],
  ] as [ScreenId, ScreenId][],
} as const

export interface TrustItem {
  icon: 'BadgeCheck' | 'Flag' | 'Lock' | 'HandCoins'
  title: string
  text: string
}

export const TRUST: TrustItem[] = [
  {
    icon: 'BadgeCheck',
    title: 'Verificados por nuestro equipo',
    text: 'Cada profesional pasa por una verificación de identidad y de su título antes de poder recibir solicitudes.',
  },
  {
    icon: 'Flag',
    title: 'Reportar y bloquear',
    text: 'Podés reportar o bloquear a cualquier usuario desde el chat o desde su perfil.',
  },
  {
    icon: 'Lock',
    title: 'Tus datos, tuyos',
    text: 'Se tratan según nuestra política de privacidad y podés eliminar tu cuenta cuando quieras.',
  },
  {
    icon: 'HandCoins',
    title: 'Pagos claros',
    text: 'Mercado Pago o efectivo con código de confirmación. Pagás al terminar, nunca antes.',
  },
]

export const DOWNLOAD = {
  title: 'Escaneá y empezá.',
  text: 'Apuntá la cámara de tu teléfono al código para descargar Red Madero.',
  mobileTitle: 'Llevate Red Madero.',
  mobileText: 'Descargá la app y contá tu problema en un minuto.',
} as const
