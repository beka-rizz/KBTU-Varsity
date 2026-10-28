/**
 * KBTU schools, sourced from https://kbtu.edu.kz/en/schools (11 schools)
 * plus the base "KBTU" jacket every student can wear.
 *
 * Each entry defines the jacket colourway:
 *  - body:    wool body + stripe base colour
 *  - accent:  chenille letter, stripes, patch outline (cream for most, gold for Business)
 *  - sleeve:  leather sleeve colour
 *  - logo:    stroke-based SVG path in a 24x24 viewBox (rendered in the UI and drawn
 *             onto the canvas textures with Path2D, so one source powers both)
 */
export interface School {
  id: string
  /** Full official name */
  name: string
  /** Short display name used in UI chips */
  short: string
  /** Chest letter(s) – 1 to 3 characters */
  mark: string
  /** Big arched word on the back */
  backArc: string
  /** Straight line under the arch */
  backLine: string
  /** Script tagline on the back */
  tagline: string
  body: string
  accent: string
  sleeve: string
  /** Colour used for the text/ink in the UI on top of the body colour */
  onBody: string
  logo: string
  blurb: string
}

export const CREAM = '#F3EEE3'
const GOLD = '#D9B45B'

export const SCHOOLS: School[] = [
  {
    id: 'kbtu',
    name: 'Казахско-Британский технический университет',
    short: 'КБТУ Классика',
    mark: 'K',
    backArc: 'KBTU',
    backLine: 'ALMATY',
    tagline: 'Est. 2001 · Tole bi 59',
    body: '#0B2447',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5',
    blurb: 'Базовая. Тёмно-синяя шерсть, кремовые рукава и буква «К» на груди. Для каждого студента КБТУ.',
  },
  {
    id: 'sepi',
    name: 'Школа энергетики и нефтегазовой индустрии',
    short: 'Энергетика и нефть',
    mark: 'E',
    backArc: 'KBTU',
    backLine: 'ENERGY',
    tagline: 'Powering Kazakhstan since 2001',
    body: '#C2410C',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
    blurb: 'Жжёный оранжевый для тех, на ком держится страна: нефть, газ и энергия завтрашнего дня.',
  },
  {
    id: 'geology',
    name: 'Школа геологии',
    short: 'Геология',
    mark: 'G',
    backArc: 'KBTU',
    backLine: 'GEOLOGY',
    tagline: 'Not a profession — a way of life',
    body: '#7A4A22',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'm8 3 4 8 5-5 5 15H2L8 3z',
    blurb: 'Земляной коричневый для тех, кто читает горы как книги и работает в поле в любую погоду.',
  },
  {
    id: 'site',
    name: 'Школа информационных технологий и инженерии',
    short: 'IT и инженерия',
    mark: 'IT',
    backArc: 'KBTU',
    backLine: 'SITE',
    tagline: 'ship it · since 2001',
    body: '#1D4ED8',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'm16 18 6-6-6-6M8 6l-6 6 6 6M14 4l-4 16',
    blurb: 'Электрик-синий для самой большой семьи кампуса — инженеров, разработчиков и сборщиков ШИТИ.',
  },
  {
    id: 'business',
    name: 'Бизнес-школа КБТУ',
    short: 'Бизнес-школа',
    mark: 'B',
    backArc: 'KBTU',
    backLine: 'BUSINESS',
    tagline: 'CFA · ACCA · Almaty',
    body: '#17171C',
    accent: GOLD,
    sleeve: CREAM,
    onBody: GOLD,
    logo: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z',
    blurb: 'Чёрный оникс и золотая вышивка. Программы на английском, признание CFA и ACCA — и вид соответствующий.',
  },
  {
    id: 'ise',
    name: 'Международная школа экономики',
    short: 'Экономика (МШЭ)',
    mark: 'ISE',
    backArc: 'KBTU',
    backLine: 'ECONOMICS',
    tagline: 'with LSE since 2005',
    body: '#9F1239',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'M22 7l-8.5 8.5-5-5L2 17M16 7h6v6',
    blurb: 'Малиновый — в честь диплома Лондонского университета, который студенты МШЭ получают под руководством LSE.',
  },
  {
    id: 'kma',
    name: 'Казахстанская морская академия',
    short: 'Морская академия',
    mark: 'KMA',
    backArc: 'KBTU',
    backLine: 'MARITIME',
    tagline: 'Caspian standard since 2012',
    body: '#0F6E6A',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'M12 22V8M5 12H2a10 10 0 0 0 20 0h-3M15 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    blurb: 'Морская бирюза и якорь — для единственной морской академии в Казахстане.',
  },
  {
    id: 'math',
    name: 'Школа прикладной математики',
    short: 'Прикладная математика',
    mark: 'M',
    backArc: 'KBTU',
    backLine: 'APPLIED MATH',
    tagline: 'the foundation of everything',
    body: '#5B21B6',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'M18 7V4H6l6 8-6 8h12v-3',
    blurb: 'Фиолетовая шерсть и сигма на рукаве. Математика — основа всего, включая эту куртку.',
  },
  {
    id: 'chem',
    name: 'Школа химической инженерии',
    short: 'Химинженерия',
    mark: 'CE',
    backArc: 'KBTU',
    backLine: 'CHEM ENG',
    tagline: 'reactions, not excuses',
    body: '#047857',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5l-5.1-10.1A2 2 0 0 1 14 9.5V2M8.5 2h7M7 16h10',
    blurb: 'Изумрудный и колба. Для тех, кто знает точную температуру кипения бессонной ночи.',
  },
  {
    id: 'social',
    name: 'Школа естественных и социальных наук',
    short: 'Социальные науки',
    mark: 'S',
    backArc: 'KBTU',
    backLine: 'SOCIAL SCI',
    tagline: 'one reef, one goal',
    body: '#BE185D',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    blurb: 'Розовая шерсть для школы, которая живёт как коралловый риф: много дисциплин, один организм.',
  },
  {
    id: 'materials',
    name: 'Школа материаловедения и зелёных технологий',
    short: 'Материалы и зелёные технологии',
    mark: 'N',
    backArc: 'KBTU',
    backLine: 'MATERIALS',
    tagline: 'nano scale · green future',
    body: '#4D7C0F',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10ZM2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12',
    blurb: 'Оливковый и лист. Материалы, собранные на наноуровне для более зелёной индустрии.',
  },
  {
    id: 'law',
    name: 'Школа права',
    short: 'Право',
    mark: 'L',
    backArc: 'KBTU',
    backLine: 'LAW',
    tagline: 'fiat justitia',
    body: '#A16207',
    accent: CREAM,
    sleeve: CREAM,
    onBody: CREAM,
    logo: 'm16 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1ZM2 16l3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
    blurb: 'Горчичное золото и весы правосудия. Современное юридическое образование, классический крой бомбера.',
  },
]

export const SCHOOL_BY_ID: Record<string, School> = Object.fromEntries(SCHOOLS.map((s) => [s.id, s]))

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type Size = (typeof SIZES)[number]

export const PRICE_KZT = 34_990
export const PERSONALIZATION_KZT = 2_500

export const formatKZT = (n: number) => `${n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')} ₸`
