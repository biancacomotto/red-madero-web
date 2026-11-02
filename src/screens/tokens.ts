/** The app's colour tokens (front/lab3-madero/styles/colors.ts), for the painted screens. */
export const C = {
  primary: '#2E4A95',
  accent: '#3B78FA',
  light: '#5D8FCF',
  lighter: '#EAF2FF',
  lightest: '#D9E7F7',
  selectedLight: '#9FBEE8',
  sky: '#6EC1FF',
  turquoise: '#2BC4C4',
  dark: '#003B71',

  white: '#FFFFFF',
  softBlue: '#F8FAFD',
  grayLight: '#F3F2F9',
  border: '#D3DAE6',
  borderSoft: '#E3E6EC',
  divider: '#D9DBE1',
  formField: '#DCE6F5',
  iconBubble: '#E8F1FF',
  selectedSoft: '#E2EBF7',
  track: '#EEEFF2',

  title: '#111318',
  ink: '#12172B',
  subtitle: '#6B7380',
  muted: '#8C8C94',
  placeholder: '#9AA0A6',
  inputText: '#262938',
  black: '#000000',

  success: '#00DC16',
  successDeep: '#1FA34A',
  warning: '#FFBB00',
  error: '#EE2222',

  label: {
    purple: { bg: '#D0A3DD', text: '#6C0A90', outline: '#A158B7' },
    green: { bg: '#DBF5A7', text: '#3A6B12', outline: '#7BBF45' },
    orange: { bg: '#FBEBDA', text: '#C04A10', outline: '#F08040' },
    blue: { bg: '#E7F0FF', text: '#1A4F8A', outline: '#5A96D4' },
    yellow: { bg: '#FDFACC', text: '#7A6800', outline: '#D4B800' },
    pink: { bg: '#FFE2F7', text: '#9C2468', outline: '#EC6DB0' },
    red: { bg: '#FFDDDD', text: '#A02020', outline: '#E85050' },
  },

  info: {
    pink: '#F9D9EC',
    lilac: '#E3DCF8',
    sky: '#D8F0FB',
    mint: '#C9EDDD',
    title: '#262438',
    text: '#595766',
  },

  agenda: {
    pink: { bg: '#FFF3F8', accent: '#F8D7E7' },
    green: { bg: '#F1FAF5', accent: '#D8F0E3' },
    blue: { bg: '#EFFAFF', accent: '#D6EEF8' },
    purple: { bg: '#F6F0FF', accent: '#E4D6F8' },
    yellow: { bg: '#FFFBEA', accent: '#F5E9B9' },
  },

  mercadoPago: { sky: '#00BCFF', navy: '#0A0080' },
  navActive: '#3B6EA8',
  navPill: '#D9E7F7',
} as const

export type LabelPalette = keyof typeof C.label
