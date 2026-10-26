import type { Face } from './bookContent'

/**
 * Paints one book face onto a canvas, which then becomes the page texture.
 * Canvas pixels match the page's 1.28 : 1.71 aspect, at a resolution high
 * enough for crisp text.
 */
export const TEX_W = 1024
export const TEX_H = 1368

const C = {
  glow: '#B8FF86',
  primary: '#8EE65A',
  secondary: '#69C248',
  dark: '#2D7A3F',
  text: 'rgba(232, 240, 228, 0.86)',
  muted: 'rgba(214, 228, 208, 0.55)',
  white: '#ffffff',
}
const FONT = 'Inter, system-ui, sans-serif'

const imageCache = new Map<string, Promise<HTMLImageElement>>()
function loadImage(src: string) {
  let p = imageCache.get(src)
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
    imageCache.set(src, p)
  }
  return p
}

let fontsReady: Promise<unknown> | null = null
function ensureFonts() {
  fontsReady ??= Promise.all(
    ['400', '500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px Inter`)),
  ).catch(() => undefined)
  return fontsReady
}

// ── drawing helpers ─────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Word-wraps `text` into `maxW`; draws it from (x, y). Returns the y after it. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
  align: CanvasTextAlign = 'left',
) {
  ctx.textAlign = align
  const words = text.split(/\s+/)
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y)
      y += lineH
      line = w
    } else line = test
  }
  if (line) {
    ctx.fillText(line, x, y)
    y += lineH
  }
  return y
}

function setFont(ctx: CanvasRenderingContext2D, weight: number, size: number, spacing = 0) {
  ctx.font = `${weight} ${size}px ${FONT}`
  // letterSpacing is supported in Chromium/Firefox; harmless elsewhere
  ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacing}px`
}

/** Fit an image inside a box (contain), centred. */
function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.min(w / img.width, h / img.height)
  const dw = img.width * s
  const dh = img.height * s
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
}

/**
 * Like drawContain, but fades the image's edges out with an elliptical mask —
 * so pictures with an opaque background melt into the page (like .tree-blend).
 */
function drawSoft(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.min(w / img.width, h / img.height)
  const dw = Math.round(img.width * s)
  const dh = Math.round(img.height * s)
  const off = document.createElement('canvas')
  off.width = dw
  off.height = dh
  const o = off.getContext('2d')!
  o.drawImage(img, 0, 0, dw, dh)
  o.globalCompositeOperation = 'destination-in'
  o.translate(dw / 2, dh / 2)
  o.scale(dw / 2, dh / 2) // unit circle → ellipse filling the image
  const g = o.createRadialGradient(0, 0, 0, 0, 0, 1)
  g.addColorStop(0, 'rgba(0,0,0,1)')
  g.addColorStop(0.62, 'rgba(0,0,0,1)')
  g.addColorStop(0.85, 'rgba(0,0,0,0.5)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  o.fillStyle = g
  o.fillRect(-1, -1, 2, 2)
  ctx.drawImage(off, x + (w - dw) / 2, y + (h - dh) / 2)
}

/** Dark-green paper with a soft frame and a shadow toward the spine. */
function paper(ctx: CanvasRenderingContext2D, spine: 'left' | 'right', cover = false) {
  const g = ctx.createLinearGradient(0, 0, 0, TEX_H)
  g.addColorStop(0, cover ? '#0d2e19' : '#0a2014')
  g.addColorStop(1, cover ? '#03110a' : '#04110a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  // ambient glow
  const r = ctx.createRadialGradient(TEX_W * 0.5, TEX_H * 0.32, 40, TEX_W * 0.5, TEX_H * 0.4, TEX_W * 0.85)
  r.addColorStop(0, cover ? 'rgba(105,194,72,0.22)' : 'rgba(105,194,72,0.10)')
  r.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = r
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  // fine paper grain
  ctx.globalAlpha = 0.05
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = i % 2 ? '#ffffff' : '#000000'
    ctx.fillRect(Math.random() * TEX_W, Math.random() * TEX_H, 2, 2)
  }
  ctx.globalAlpha = 1

  // frame
  ctx.strokeStyle = cover ? 'rgba(184,255,134,0.55)' : 'rgba(142,230,90,0.26)'
  ctx.lineWidth = cover ? 4 : 2
  roundRect(ctx, 40, 40, TEX_W - 80, TEX_H - 80, 26)
  ctx.stroke()
  if (cover) {
    ctx.strokeStyle = 'rgba(142,230,90,0.25)'
    ctx.lineWidth = 2
    roundRect(ctx, 62, 62, TEX_W - 124, TEX_H - 124, 18)
    ctx.stroke()
  }

  // spine shadow (the fold of the book)
  const sx = spine === 'left' ? 0 : TEX_W
  const s = ctx.createLinearGradient(sx, 0, spine === 'left' ? 120 : TEX_W - 120, 0)
  s.addColorStop(0, 'rgba(0,0,0,0.55)')
  s.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = s
  ctx.fillRect(spine === 'left' ? 0 : TEX_W - 120, 0, 120, TEX_H)
}

function footer(ctx: CanvasRenderingContext2D, pageNo: number, spine: 'left' | 'right') {
  setFont(ctx, 600, 24, 6)
  ctx.fillStyle = C.muted
  ctx.textAlign = 'center'
  ctx.fillText('GREEN WORLD', TEX_W / 2, TEX_H - 84)
  setFont(ctx, 700, 26)
  ctx.fillStyle = C.primary
  ctx.textAlign = spine === 'left' ? 'right' : 'left'
  ctx.fillText(String(pageNo).padStart(2, '0'), spine === 'left' ? TEX_W - 104 : 104, TEX_H - 84)
}

function leafMark(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color = C.primary) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, 10)
  ctx.bezierCurveTo(-14, -2, -10, -18, 12, -22)
  ctx.bezierCurveTo(14, -2, 8, 8, 0, 10)
  ctx.fill()
  ctx.restore()
}

// ── faces ───────────────────────────────────────────────────────────────
async function paintCover(ctx: CanvasRenderingContext2D, f: Extract<Face, { kind: 'cover' }>) {
  paper(ctx, 'left', true)
  const logo = await loadImage(f.logo).catch(() => null)
  if (logo) {
    ctx.save()
    ctx.shadowColor = 'rgba(142,230,90,0.55)'
    ctx.shadowBlur = 40
    drawContain(ctx, logo, TEX_W / 2 - 300, 170, 600, 400)
    ctx.restore()
  }
  setFont(ctx, 600, 28, 10)
  ctx.fillStyle = C.primary
  ctx.textAlign = 'center'
  ctx.fillText(f.tagline.toUpperCase(), TEX_W / 2, 690)

  // title, with a glow
  setFont(ctx, 800, 96, -1)
  ctx.save()
  ctx.shadowColor = 'rgba(142,230,90,0.45)'
  ctx.shadowBlur = 30
  const tg = ctx.createLinearGradient(0, 760, 0, 1000)
  tg.addColorStop(0, '#ffffff')
  tg.addColorStop(1, C.glow)
  ctx.fillStyle = tg
  wrap(ctx, f.title, TEX_W / 2, 820, TEX_W - 220, 108, 'center')
  ctx.restore()

  // divider + subtitle
  ctx.strokeStyle = 'rgba(142,230,90,0.45)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(TEX_W / 2 - 160, 1080)
  ctx.lineTo(TEX_W / 2 + 160, 1080)
  ctx.stroke()
  leafMark(ctx, TEX_W / 2, 1082, 1.4)
  setFont(ctx, 500, 32, 2)
  ctx.fillStyle = C.text
  ctx.textAlign = 'center'
  ctx.fillText(f.subtitle, TEX_W / 2, 1160)
}

async function paintBackCover(ctx: CanvasRenderingContext2D, f: Extract<Face, { kind: 'back-cover' }>) {
  paper(ctx, 'right', true)
  setFont(ctx, 800, 84, -1)
  ctx.fillStyle = C.white
  wrap(ctx, f.title, TEX_W / 2, 470, TEX_W - 240, 96, 'center')
  setFont(ctx, 400, 36)
  ctx.fillStyle = C.text
  wrap(ctx, f.body, TEX_W / 2, 590, TEX_W - 280, 54, 'center')
  const logo = await loadImage(f.logo).catch(() => null)
  if (logo) {
    ctx.save()
    ctx.shadowColor = 'rgba(142,230,90,0.5)'
    ctx.shadowBlur = 30
    drawContain(ctx, logo, TEX_W / 2 - 220, 800, 440, 300)
    ctx.restore()
  }
}

function paintText(ctx: CanvasRenderingContext2D, f: Extract<Face, { kind: 'text' }>, pageNo: number, spine: 'left' | 'right') {
  paper(ctx, spine)
  const x = 120
  const maxW = TEX_W - 240
  setFont(ctx, 700, 26, 6)
  ctx.fillStyle = C.primary
  ctx.textAlign = 'left'
  ctx.fillText(f.eyebrow.toUpperCase(), x, 190)

  setFont(ctx, 800, 74, -1)
  ctx.fillStyle = C.white
  let y = wrap(ctx, f.title, x, 290, maxW, 86)

  // accent rule
  ctx.fillStyle = C.primary
  roundRect(ctx, x, y - 10, 90, 8, 4)
  ctx.fill()
  y += 70

  setFont(ctx, 400, 36)
  ctx.fillStyle = C.text
  for (const p of f.body) y = wrap(ctx, p, x, y, maxW, 56) + 30

  if (f.bullets?.length) {
    y += 10
    setFont(ctx, 600, 36)
    for (const b of f.bullets) {
      ctx.fillStyle = 'rgba(142,230,90,0.16)'
      ctx.beginPath()
      ctx.arc(x + 20, y - 12, 22, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = C.primary
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(x + 10, y - 12)
      ctx.lineTo(x + 18, y - 3)
      ctx.lineTo(x + 31, y - 21)
      ctx.stroke()
      ctx.fillStyle = C.white
      y = wrap(ctx, b, x + 66, y, maxW - 66, 50) + 26
    }
  }
  footer(ctx, pageNo, spine)
}

async function paintImage(ctx: CanvasRenderingContext2D, f: Extract<Face, { kind: 'image' }>, pageNo: number, spine: 'left' | 'right') {
  paper(ctx, spine)
  const box = { x: 100, y: 130, w: TEX_W - 200, h: 760 }
  ctx.save()
  roundRect(ctx, box.x, box.y, box.w, box.h, 28)
  ctx.clip()
  const bg = ctx.createRadialGradient(TEX_W / 2, box.y + box.h * 0.6, 20, TEX_W / 2, box.y + box.h * 0.55, box.w * 0.75)
  bg.addColorStop(0, 'rgba(105,194,72,0.35)')
  bg.addColorStop(1, '#03100a')
  ctx.fillStyle = bg
  ctx.fillRect(box.x, box.y, box.w, box.h)
  const img = await loadImage(f.img).catch(() => null)
  if (img) drawSoft(ctx, img, box.x + 10, box.y + 10, box.w - 20, box.h - 20)
  ctx.restore()
  ctx.strokeStyle = 'rgba(142,230,90,0.45)'
  ctx.lineWidth = 3
  roundRect(ctx, box.x, box.y, box.w, box.h, 28)
  ctx.stroke()

  let y = box.y + box.h + 100
  if (f.quote) {
    setFont(ctx, 800, 48, -0.5)
    ctx.fillStyle = C.glow
    y = wrap(ctx, `“${f.quote}”`, TEX_W / 2, y, TEX_W - 220, 60, 'center') + 18
  }
  setFont(ctx, 400, 32)
  ctx.fillStyle = C.text
  wrap(ctx, f.caption, TEX_W / 2, y, TEX_W - 260, 48, 'center')
  footer(ctx, pageNo, spine)
}

async function paintStep(ctx: CanvasRenderingContext2D, f: Extract<Face, { kind: 'step' }>, pageNo: number, spine: 'left' | 'right') {
  paper(ctx, spine)
  const x = 120
  // big outlined step number
  setFont(ctx, 800, 220, -6)
  ctx.textAlign = 'left'
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(142,230,90,0.55)'
  ctx.strokeText(f.step, x - 6, 330)
  setFont(ctx, 700, 26, 6)
  ctx.fillStyle = C.primary
  ctx.fillText(f.eyebrow.toUpperCase(), x, 410)
  setFont(ctx, 800, 72, -1)
  ctx.fillStyle = C.white
  let y = wrap(ctx, f.title, x, 500, TEX_W - 240, 84)
  setFont(ctx, 400, 36)
  ctx.fillStyle = C.text
  y = wrap(ctx, f.body, x, y + 24, TEX_W - 240, 56)

  const img = await loadImage(f.img).catch(() => null)
  if (img) {
    const top = Math.max(y + 30, 820)
    const h = TEX_H - 150 - top
    const glow = ctx.createRadialGradient(TEX_W / 2, top + h * 0.6, 10, TEX_W / 2, top + h * 0.6, 360)
    glow.addColorStop(0, 'rgba(105,194,72,0.30)')
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, top, TEX_W, h)
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.6)'
    ctx.shadowBlur = 30
    ctx.shadowOffsetY = 16
    drawSoft(ctx, img, 140, top, TEX_W - 280, h)
    ctx.restore()
  }
  footer(ctx, pageNo, spine)
}

/**
 * @param side 'front' faces are right-hand pages (spine on their left),
 *             'back' faces are left-hand pages (spine on their right).
 */
export async function paintFace(face: Face, pageNo: number, side: 'front' | 'back') {
  await ensureFonts()
  const canvas = document.createElement('canvas')
  canvas.width = TEX_W
  canvas.height = TEX_H
  const ctx = canvas.getContext('2d')!
  ctx.textBaseline = 'alphabetic'
  const spine = side === 'front' ? 'left' : 'right'
  switch (face.kind) {
    case 'cover':
      await paintCover(ctx, face)
      break
    case 'back-cover':
      await paintBackCover(ctx, face)
      break
    case 'text':
      paintText(ctx, face, pageNo, spine)
      break
    case 'image':
      await paintImage(ctx, face, pageNo, spine)
      break
    case 'step':
      await paintStep(ctx, face, pageNo, spine)
      break
  }
  return canvas
}
