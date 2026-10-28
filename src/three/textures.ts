import type { School } from '../data/schools'

/**
 * Jacket graphics (chenille letters, back arch, sleeve seal, rib stripes) are
 * drawn on <canvas> at runtime. The classic jacket's chest uses the KBTU
 * mark (the building and the letters) instead of a chenille letter.
 */

export const DISPLAY_FONT = '"Graduate", "Arial Black", Impact, sans-serif'
export const SCRIPT_FONT = '"Caveat", "Brush Script MT", cursive'

// Decal footprints in world units; textures are mapped 1:1 onto these.
export const FRONT_DECAL = { w: 1.3, h: 1.45 }
export const BACK_DECAL = { w: 1.2, h: 1.3 }

let fontsPromise: Promise<void> | null = null
let kbtuMark: HTMLImageElement | null = null
let kbtuMarkPromise: Promise<void> | null = null

/** Building + “KBTU” lockup. Never rejects — drawing falls back to the letter. */
export function loadKbtuMark(): Promise<void> {
  if (kbtuMark) return Promise.resolve()
  if (kbtuMarkPromise) return kbtuMarkPromise
  if (typeof Image === 'undefined') return Promise.resolve()
  kbtuMarkPromise = new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      kbtuMark = img
      resolve()
    }
    img.onerror = () => resolve()
    img.src = '/img/kbtu-mark.png'
  })
  return kbtuMarkPromise
}

/** Resolves once the display fonts are usable in canvas (never rejects). */
export function loadJacketFonts(): Promise<void> {
  if (fontsPromise) return fontsPromise
  if (typeof document === 'undefined' || !('fonts' in document)) {
    fontsPromise = Promise.resolve()
    return fontsPromise
  }
  fontsPromise = Promise.all([
    document.fonts.load(`700 100px ${DISPLAY_FONT}`),
    document.fonts.load(`600 100px ${SCRIPT_FONT}`),
  ])
    .then(() => undefined)
    .catch(() => undefined)
  return fontsPromise
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

/** Chenille patch look: wide backing stroke, fill, thin coloured outline. */
function patchText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  outline: string,
) {
  ctx.save()
  ctx.font = `700 ${size}px ${DISPLAY_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  // felt backing
  ctx.lineWidth = size * 0.16
  ctx.strokeStyle = fill
  ctx.strokeText(text, x, y)
  // letter body
  ctx.fillStyle = fill
  ctx.fillText(text, x, y)
  // inner outline
  ctx.lineWidth = Math.max(2, size * 0.035)
  ctx.strokeStyle = outline
  ctx.strokeText(text, x, y)
  ctx.restore()
}

function arcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  size: number,
  fill: string,
  outline: string,
) {
  ctx.save()
  ctx.font = `700 ${size}px ${DISPLAY_FONT}`
  const chars = text.split('')
  const widths = chars.map((ch) => ctx.measureText(ch).width)
  const spacing = size * 0.12
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1)
  const totalAngle = total / radius
  let angle = -totalAngle / 2
  for (let i = 0; i < chars.length; i++) {
    const half = widths[i] / 2 / radius
    angle += half
    ctx.save()
    ctx.translate(cx + Math.sin(angle) * radius, cy - Math.cos(angle) * radius)
    ctx.rotate(angle)
    patchText(ctx, chars[i], 0, 0, size, fill, outline)
    ctx.restore()
    angle += half + spacing / radius
  }
  ctx.restore()
}

/** Recolour the mark, keeping its alpha, so it reads on the wool body. */
function tintedMark(color: string, w: number, h: number): HTMLCanvasElement | null {
  if (!kbtuMark) return null
  const { c, ctx } = makeCanvas(w, h)
  ctx.drawImage(kbtuMark, 0, 0, w, h)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h)
  return c
}

/** Felt edge plus a crisp fill, same idea as the chenille letters. */
function drawChenilleMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
) {
  const tinted = tintedMark(fill, w, h)
  if (!tinted) return
  const spread = Math.max(2, Math.round(h * 0.012))
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    ctx.drawImage(tinted, x + Math.cos(a) * spread, y + Math.sin(a) * spread)
  }
  ctx.drawImage(tinted, x, y)
}

function drawLogo(ctx: CanvasRenderingContext2D, d: string, cx: number, cy: number, size: number, color: string) {
  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  ctx.scale(size / 24, size / 24)
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = color
  ctx.stroke(new Path2D(d))
  ctx.restore()
}

/** Front of the jacket: chest letter (wearer's left) + two slanted welt pockets. */
export function drawFront(school: School): HTMLCanvasElement {
  const S = 1024
  const { c, ctx } = makeCanvas(S, S)
  const toX = (wx: number) => (wx / FRONT_DECAL.w + 0.5) * S
  const toY = (wy: number) => (1 - (wy / FRONT_DECAL.h + 0.5)) * S

  // Classic jacket wears the KBTU mark. Multi-letter marks share one size;
  // a single letter is a bit larger so it has the same presence.
  if (school.id === 'kbtu' && kbtuMark) {
    // Sits on the wearer's left chest, clear of the placket. The cylinder
    // projection pulls wide marks toward the centre, so the anchor is
    // further out than the letter was.
    const h = 200
    const w = Math.round(h * (kbtuMark.width / kbtuMark.height))
    drawChenilleMark(ctx, toX(0.31) - w / 2, toY(0.32) - h / 2, w, h, school.accent)
  } else if (school.id !== 'kbtu') {
    const chestSize = school.mark.length === 1 ? 204 : 168
    patchText(ctx, school.mark, toX(0.3), toY(0.34), chestSize, school.accent, school.body)
  }

  // Pockets: double welt, upper end leaning toward the centre
  const welt = (x: number, y: number, dir: 1 | -1) => {
    const len = 0.32 * (S / FRONT_DECAL.h)
    const ang = (dir * 18 * Math.PI) / 180
    ctx.save()
    ctx.translate(toX(x), toY(y))
    ctx.rotate(ang)
    ctx.lineCap = 'round'
    ctx.strokeStyle = school.accent
    ctx.lineWidth = 22
    ctx.beginPath()
    ctx.moveTo(0, -len / 2)
    ctx.lineTo(0, len / 2)
    ctx.stroke()
    ctx.strokeStyle = school.body
    ctx.lineWidth = 7
    ctx.stroke()
    ctx.restore()
  }
  welt(-0.37, -0.3, 1)
  welt(0.37, -0.3, -1)
  return c
}

/** Back of the jacket: arched school word, straight line, script tagline. */
export function drawBack(school: School): HTMLCanvasElement {
  const S = 1024
  const { c, ctx } = makeCanvas(S, S)
  const cx = S / 2
  // Arch: letters sit on a circle whose top is at ~27% from the top of the patch
  arcText(ctx, school.backArc, cx, S * 0.82, S * 0.55, 210, school.accent, school.body)

  // School name. One size for every school; 92px still fits the longest line.
  patchText(ctx, school.backLine, cx, S * 0.56, 92, school.accent, school.body)

  ctx.save()
  ctx.font = `600 60px ${SCRIPT_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = school.accent
  ctx.fillText(school.tagline, cx, S * 0.71)
  ctx.restore()
  return c
}

/** Round embroidered seal for the sleeve. */
export function drawSeal(school: School): HTMLCanvasElement {
  const S = 512
  const { c, ctx } = makeCanvas(S, S)
  const cx = S / 2
  const r = S * 0.46

  ctx.fillStyle = school.accent
  ctx.beginPath()
  ctx.arc(cx, cx, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = school.body
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(cx, cx, r - 8, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cx, r * 0.68, 0, Math.PI * 2)
  ctx.stroke()

  // Ring text
  ctx.save()
  ctx.font = `700 34px ${DISPLAY_FONT}`
  ctx.fillStyle = school.body
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const text = 'KAZAKH-BRITISH TECHNICAL UNIVERSITY • ALMATY • '
  const ringR = r * 0.83
  const step = (Math.PI * 2) / text.length
  for (let i = 0; i < text.length; i++) {
    const a = i * step - Math.PI / 2
    ctx.save()
    ctx.translate(cx + Math.cos(a) * ringR, cx + Math.sin(a) * ringR)
    ctx.rotate(a + Math.PI / 2)
    ctx.fillText(text[i], 0, 0)
    ctx.restore()
  }
  ctx.restore()

  drawLogo(ctx, school.logo, cx, cx - 10, S * 0.36, school.body)

  ctx.font = `700 40px ${DISPLAY_FONT}`
  ctx.fillStyle = school.body
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('2001', cx, cx + S * 0.2)
  return c
}

/** Vertical rib-knit stripe pattern (two accent stripes on body colour). */
export function drawStripes(school: School): HTMLCanvasElement {
  const { c, ctx } = makeCanvas(16, 256)
  ctx.fillStyle = school.body
  ctx.fillRect(0, 0, 16, 256)
  ctx.fillStyle = school.accent
  ctx.fillRect(0, 256 * 0.3, 16, 256 * 0.12)
  ctx.fillRect(0, 256 * 0.56, 16, 256 * 0.12)
  // faint knit ribs
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  for (let x = 0; x < 16; x += 4) ctx.fillRect(x, 0, 1, 256)
  return c
}
