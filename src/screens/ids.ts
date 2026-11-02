/** Every screen the painters know how to draw. The order is not meaningful. */
export const SCREEN_IDS = [
  'welcome',
  'home',
  'chatAi',
  'zone',
  'urgency',
  'profile',
  'proposal',
  'chat',
  'payment',
  'proRequests',
  'proQuote',
  'proAgenda',
  'proWallet',
] as const

export type ScreenId = (typeof SCREEN_IDS)[number]

/** How each screen is described to assistive technology. */
export const SCREEN_LABELS: Record<ScreenId, string> = {
  welcome: 'la bienvenida, con el castor y el botón Comenzar',
  home: 'el inicio con la búsqueda por oficio',
  chatAi: 'el asistente que ayuda a describir el problema',
  zone: 'el paso "¿Dónde pasa?", con la casa y sus zonas',
  urgency: 'el paso "Urgencia"',
  profile: 'el perfil de un profesional',
  proposal: 'un presupuesto recibido, con ítems y horarios',
  chat: 'el chat con el profesional y la visita agendada',
  payment: 'el resumen de pago, con Mercado Pago y efectivo',
  proRequests: 'las solicitudes que recibe un profesional',
  proQuote: 'el armado de un presupuesto',
  proAgenda: 'la agenda del profesional',
  proWallet: 'la billetera del profesional',
}
