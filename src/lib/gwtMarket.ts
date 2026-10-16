/**
 * GWT market model (demo data).
 *
 * The price is one deterministic path through time — a random walk around a
 * slow growth trend since launch, with a rally over the last week. Because
 * every timeframe samples the SAME path, the views agree with each other:
 * the last day of the 7D chart is exactly the 24H
 * chart, the 24h change/high/low match what the chart shows, and the "live"
 * price simply keeps walking forward as time passes.
 */

export const CIRCULATING_SUPPLY = 100_000_000 // GWT
export const LAUNCH = Date.UTC(2025, 3, 1) // 1 Apr 2025

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

// ── deterministic smooth noise ───────────────────────────────────────────
function hash(n: number, seed: number) {
  let x = Math.imul((n | 0) ^ Math.imul(seed, 0x9e3779b1), 0x85ebca6b)
  x ^= x >>> 13
  x = Math.imul(x, 0xc2b2ae35)
  x ^= x >>> 16
  return ((x >>> 0) / 4294967295) * 2 - 1 // [-1, 1]
}
/** Value noise: random knots every `period` ms, smoothly interpolated. */
function noise(t: number, period: number, seed: number) {
  const x = t / period
  const i = Math.floor(x)
  const f = x - i
  const s = f * f * (3 - 2 * f) // smoothstep
  return hash(i, seed) * (1 - s) + hash(i + 1, seed) * s
}

// ── price path: a random walk, refined day → hour → minute ──────────────
//
// Daily closes follow a mean-reverting random walk around the growth trend,
// with volatility that drifts between calm and busy spells and the odd
// larger move. Inside each day an hourly Brownian bridge connects the two
// daily closes, and inside each hour a minute-level bridge connects the two
// hourly values. Zooming in therefore only ADDS detail — every timeframe is
// the same path.

const START_PRICE = 0.012
const TREND_PRICE = 0.068 // where the long-run trend sits ~18 months after launch
const TREND_SPAN = 540 // days
const SIGMA_DAY = 0.026 // typical daily volatility (log)
const REVERSION = 0.035 // per day, pull back toward trend
const RALLY_DAYS = 8 // the recent rally…
const RALLY_PER_DAY = Math.log(1.27) / RALLY_DAYS // …adds ~27% over a week
const LIVE_PRICE = 0.0842 // price at page load

const ANCHOR = Date.now()
const ANCHOR_DAY = Math.floor((ANCHOR - LAUNCH) / DAY)
const N_DAYS = ANCHOR_DAY + 30 // path runs a month past "now" for live updates

let SEED = 1
let SCALE = 1
let dayLog = new Float64Array(0)
const hourCache = new Map<number, Float64Array>()
const minuteCache = new Map<number, Float64Array>()

function rng(seed: number) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function gauss(r: () => number) {
  let u = 0
  while (u === 0) u = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r())
}
const subSeed = (a: number, b: number) => Math.floor((hash(a * 7919 + b, SEED) + 1) * 1e9)

/** Daily volatility — slowly alternates between calm and busy spells. */
const volOn = (day: number) => SIGMA_DAY * Math.exp(0.4 * noise(day, 18, 5))

function target(day: number) {
  const k = 1 - Math.exp(-day / (TREND_SPAN / 2.6))
  const trend = Math.log(START_PRICE) + (Math.log(TREND_PRICE) - Math.log(START_PRICE)) * k
  const rally = RALLY_PER_DAY * Math.max(0, day - (ANCHOR_DAY - RALLY_DAYS + 1))
  return trend + rally
}

function buildDays() {
  const r = rng(SEED)
  dayLog = new Float64Array(N_DAYS + 1)
  dayLog[0] = target(0)
  for (let d = 0; d < N_DAYS; d++) {
    let z = gauss(r)
    if (r() < 0.05) z *= 1.8 // occasional outsized day
    const ramp = Math.min(1, (d + 1) / 20) // calmer right after launch
    dayLog[d + 1] =
      dayLog[d] +
      (target(d + 1) - target(d)) +
      REVERSION * (target(d) - dayLog[d]) +
      volOn(d) * ramp * z
  }
  hourCache.clear()
  minuteCache.clear()
}

/** Brownian bridge of `n` steps from `a` to `b`. */
function bridge(a: number, b: number, n: number, sigma: number, seed: number) {
  const r = rng(seed)
  const w = new Float64Array(n + 1)
  for (let i = 1; i <= n; i++) w[i] = w[i - 1] + sigma * gauss(r)
  const out = new Float64Array(n + 1)
  for (let i = 0; i <= n; i++) out[i] = a + w[i] - (i / n) * (w[n] - (b - a))
  return out
}

function hoursOf(day: number) {
  let h = hourCache.get(day)
  if (!h) {
    h = bridge(dayLog[day], dayLog[day + 1], 24, volOn(day) / Math.sqrt(24), subSeed(day, 1))
    hourCache.set(day, h)
  }
  return h
}

function minutesOf(hour: number) {
  let m = minuteCache.get(hour)
  if (!m) {
    const day = Math.floor(hour / 24)
    const hs = hoursOf(day)
    const i = hour - day * 24
    m = bridge(hs[i], hs[i + 1], 60, volOn(day) / Math.sqrt(1440), subSeed(hour, 2))
    minuteCache.set(hour, m)
  }
  return m
}

function logAt(t: number) {
  const x = (t - LAUNCH) / MIN
  if (x <= 0) return dayLog[0]
  const minute = Math.floor(x)
  const f = x - minute
  const hour = Math.floor(minute / 60)
  const day = Math.floor(hour / 24)
  if (day >= N_DAYS) return dayLog[N_DAYS]
  if (f === 0 && minute % 60 === 0) {
    // on an hour (or day) boundary — no need to build the minute path
    return minute % 1440 === 0 ? dayLog[day] : hoursOf(day)[hour - day * 24]
  }
  const ms = minutesOf(hour)
  const i = minute - hour * 60
  return ms[i] + (ms[i + 1] - ms[i]) * f
}

/** GWT price in USD at time `t` (ms). */
export function priceAt(t: number) {
  return Math.exp(logAt(t)) * SCALE
}

/**
 * Pick the path so that, at load and for the next two hours of live updates,
 * every timeframe shows a gain (24h within +4.5…+10%, 7D within +20…+40%).
 * It's still one consistent path — this only chooses which one.
 */
;(function calibrate() {
  const spans = [HOUR, DAY, 7 * DAY, 30 * DAY, 365 * DAY]
  const ok = (now: number, strict: boolean) => {
    const p = logAt(now)
    for (const sp of spans) if (p <= logAt(now - sp)) return false
    if (p <= logAt(LAUNCH)) return false
    if (!strict) return true
    const d = Math.exp(p - logAt(now - DAY)) - 1
    const w = Math.exp(p - logAt(now - 7 * DAY)) - 1
    return d >= 0.045 && d <= 0.1 && w >= 0.2 && w <= 0.4
  }
  for (SEED = 1; SEED < 5000; SEED++) {
    buildDays()
    if (!ok(ANCHOR, true)) continue
    let live = true
    for (let m = 5; m <= 120 && live; m += 5) live = ok(ANCHOR + m * MIN, false)
    if (live) break
  }
  SCALE = LIVE_PRICE / Math.exp(logAt(ANCHOR))
})()

/** Traded volume (USD) in the hour starting at `t`. */
function hourlyVolume(t: number) {
  const h = Math.floor(t / HOUR)
  const base = 26_500 * (1 + 0.35 * noise(t, 3 * DAY, 91))
  return base * (1 + 0.45 * hash(h, 77))
}

// ── timeframes ───────────────────────────────────────────────────────────
export type RangeKey = '1H' | '24H' | '7D' | '1M' | '1Y' | 'ALL'

export const RANGES: { key: RangeKey; span: number | null; step: number }[] = [
  { key: '1H', span: HOUR, step: MIN },
  { key: '24H', span: DAY, step: 5 * MIN },
  { key: '7D', span: 7 * DAY, step: 30 * MIN },
  { key: '1M', span: 30 * DAY, step: 2 * HOUR },
  { key: '1Y', span: 365 * DAY, step: DAY },
  { key: 'ALL', span: null, step: 2 * DAY },
]

export type Point = { t: number; price: number }

/** Price samples for a range, aligned to the step grid, ending exactly at `now`. */
export function series(range: RangeKey, now: number): Point[] {
  const r = RANGES.find((x) => x.key === range)!
  const from = r.span == null ? LAUNCH : now - r.span
  // start exactly at the window's edge so the range change is exact
  const pts: Point[] = [{ t: from, price: priceAt(from) }]
  const first = Math.floor(from / r.step) * r.step + r.step
  for (let t = first; t < now; t += r.step) pts.push({ t, price: priceAt(t) })
  pts.push({ t: now, price: priceAt(now) })
  return pts
}

export type Stats = {
  price: number
  change24h: number // fraction, e.g. 0.0824
  high24h: number
  low24h: number
  volume24h: number
  marketCap: number
}

/** Headline numbers — all derived from the same price function. */
export function stats(now: number): Stats {
  const price = priceAt(now)
  const day = series('24H', now)
  let high = -Infinity
  let low = Infinity
  for (const p of day) {
    if (p.price > high) high = p.price
    if (p.price < low) low = p.price
  }
  let volume = 0
  const h0 = Math.floor((now - DAY) / HOUR) * HOUR
  for (let t = h0; t < now; t += HOUR) {
    // count only the part of the first/last hour that falls in the window
    const overlap = Math.min(now, t + HOUR) - Math.max(now - DAY, t)
    volume += hourlyVolume(t) * (overlap / HOUR)
  }
  return {
    price,
    change24h: price / priceAt(now - DAY) - 1,
    high24h: high,
    low24h: low,
    volume24h: volume,
    marketCap: price * CIRCULATING_SUPPLY,
  }
}

/** X-axis ticks on round local times (every 10 min, 4 h, day, 5 days, 2 or 3 months). */
export function axisTicks(range: RangeKey, t0: number, t1: number) {
  const ticks: number[] = []
  const d = new Date(t0)
  if (range === '1H' || range === '24H') {
    const stepMin = range === '1H' ? 10 : 240
    d.setSeconds(0, 0)
    const mins = d.getHours() * 60 + d.getMinutes()
    d.setHours(0, Math.ceil(mins / stepMin) * stepMin)
    for (; d.getTime() <= t1; d.setMinutes(d.getMinutes() + stepMin)) ticks.push(d.getTime())
  } else if (range === '7D' || range === '1M') {
    const stepDays = range === '7D' ? 1 : 5
    d.setHours(0, 0, 0, 0)
    if (d.getTime() < t0) d.setDate(d.getDate() + 1)
    if (stepDays > 1) {
      // align to a fixed day grid so ticks don't jump around as time passes
      const dayNo = Math.round(d.getTime() / DAY)
      d.setDate(d.getDate() + ((stepDays - (dayNo % stepDays)) % stepDays))
    }
    for (; d.getTime() <= t1; d.setDate(d.getDate() + stepDays)) ticks.push(d.getTime())
  } else {
    const stepMonths = range === '1Y' ? 2 : 3
    d.setHours(0, 0, 0, 0)
    d.setDate(1)
    if (d.getTime() < t0) d.setMonth(d.getMonth() + 1)
    d.setMonth(d.getMonth() + ((stepMonths - (d.getMonth() % stepMonths)) % stepMonths))
    for (; d.getTime() <= t1; d.setMonth(d.getMonth() + stepMonths)) ticks.push(d.getTime())
  }
  return ticks
}

// ── formatting ───────────────────────────────────────────────────────────
export const fmtPrice = (p: number) => `$${p.toFixed(p < 0.01 ? 5 : 4)}`

export function fmtCompact(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toFixed(0)
}

const mon = (t: number) => new Date(t).toLocaleString('en-US', { month: 'short' })

/** X-axis tick label, by timeframe. */
export function fmtTick(t: number, range: RangeKey) {
  const d = new Date(t)
  if (range === '1H' || range === '24H')
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (range === '7D' || range === '1M') return `${mon(t)} ${d.getDate()}`
  return `${mon(t)} '${String(d.getFullYear()).slice(2)}`
}

/** Tooltip timestamp, by timeframe. */
export function fmtWhen(t: number, range: RangeKey) {
  const d = new Date(t)
  const date = `${mon(t)} ${d.getDate()}, ${d.getFullYear()}`
  if (range === '1Y' || range === 'ALL') return date
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date} · ${time}`
}
