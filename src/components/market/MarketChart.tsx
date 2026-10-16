import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { motion } from 'framer-motion'
import {
  Leaf,
  Database,
  BarChart3,
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
  Triangle,
} from 'lucide-react'
import {
  RANGES,
  CIRCULATING_SUPPLY,
  series,
  stats,
  axisTicks,
  fmtPrice,
  fmtCompact,
  fmtTick,
  fmtWhen,
  type RangeKey,
} from '../../lib/gwtMarket'

const LIVE_TICK = 5_000 // ms between live price updates

/** 4–5 evenly spaced, "nice" y-axis ticks covering [min, max]. */
function niceTicks(min: number, max: number) {
  const raw = (max - min) / 4 || max * 0.01
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!
  const lo = Math.floor(min / step) * step
  const hi = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toFixed(10))
  const decimals = Math.max(2, -Math.floor(Math.log10(step)))
  return { ticks, domain: [lo, hi] as [number, number], decimals }
}

type TipProps = {
  active?: boolean
  payload?: { payload: { t: number; price: number } }[]
  range: RangeKey
}
function ChartTooltip({ active, payload, range }: TipProps) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border border-moss-400/40 bg-[#06140c]/95 px-3 py-2 text-xs shadow-lg shadow-black/40 backdrop-blur">
      <div className="text-slate-400">{fmtWhen(p.t, range)}</div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-white">{fmtPrice(p.price)}</div>
    </div>
  )
}

export default function MarketChart() {
  const [range, setRange] = useState<RangeKey>('7D')
  const [now, setNow] = useState(() => Date.now())

  // Live: the price function keeps walking forward with real time.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), LIVE_TICK)
    return () => clearInterval(id)
  }, [])

  const data = useMemo(() => series(range, now), [range, now])
  const s = useMemo(() => stats(now), [now])
  const y = useMemo(() => {
    let min = Infinity
    let max = -Infinity
    for (const p of data) {
      if (p.price < min) min = p.price
      if (p.price > max) max = p.price
    }
    return niceTicks(min, max)
  }, [data])

  const xTicks = useMemo(
    () => axisTicks(range, data[0].t, data[data.length - 1].t),
    [range, data],
  )

  const rangeChange = data[data.length - 1].price / data[0].price - 1
  const up = s.change24h >= 0

  const tiles = [
    { icon: Database, label: 'Market Cap', value: `$${fmtCompact(s.marketCap)}` },
    { icon: BarChart3, label: '24h Volume', value: `$${fmtCompact(s.volume24h)}` },
    { icon: Package, label: 'Circulating Supply', value: `${fmtCompact(CIRCULATING_SUPPLY).replace('.00', '')} GWT` },
    { icon: ArrowUpCircle, label: '24h High', value: fmtPrice(s.high24h) },
    { icon: ArrowDownCircle, label: '24h Low', value: fmtPrice(s.low24h) },
  ]

  return (
    <motion.section
      className="relative overflow-hidden rounded-3xl border border-moss-400/25 bg-[#030d08]/80 p-5 shadow-[0_0_60px_-20px_rgba(142,230,90,0.35)] sm:p-7"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      aria-label="GWT price chart"
    >
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-moss-400/50 bg-moss-500/10 shadow-[0_0_24px_-6px_rgba(142,230,90,0.6)]">
            <Leaf className="h-6 w-6 text-moss-400" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-lg font-bold tracking-tight text-white">
                GREEN WORLD <span className="font-medium text-slate-400">/ GWT</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 text-xs text-moss-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-moss-400" />
                </span>
                Live market overview
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3">
              <span className="text-4xl font-extrabold tabular-nums tracking-tight text-white">
                {fmtPrice(s.price)}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${
                  up ? 'text-moss-400' : 'text-rose-400'
                }`}
              >
                <Triangle
                  className={`h-3 w-3 fill-current ${up ? '' : 'rotate-180'}`}
                  aria-hidden
                />
                {up ? '+' : ''}
                {(s.change24h * 100).toFixed(2)}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe */}
        <div
          className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-1 md:w-auto"
          role="tablist"
          aria-label="Timeframe"
        >
          {RANGES.map((r) => (
            <button
              key={r.key}
              role="tab"
              aria-selected={range === r.key}
              onClick={() => setRange(r.key)}
              className={`flex-1 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors md:flex-none md:px-4 ${
                range === r.key
                  ? 'bg-moss-400 text-night-950 shadow-[0_0_16px_-4px_rgba(142,230,90,0.7)]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {r.key}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-6 h-[260px] sm:h-[300px]">
        <div className="absolute right-0 top-0 z-10 text-[11px] tabular-nums text-slate-500">
          {range}:{' '}
          <span className={rangeChange >= 0 ? 'text-moss-400' : 'text-rose-400'}>
            {rangeChange >= 0 ? '+' : ''}
            {(rangeChange * 100).toFixed(2)}%
          </span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 22, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gwtFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8EE65A" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#8EE65A" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              ticks={xTicks}
              tickFormatter={(t: number) => fmtTick(t, range)}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickMargin={10}
              minTickGap={24}
            />
            <YAxis
              domain={y.domain}
              ticks={y.ticks}
              tickFormatter={(v: number) => `$${v.toFixed(y.decimals)}`}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={y.decimals > 3 ? 62 : 54}
            />
            <Tooltip
              content={<ChartTooltip range={range} />}
              cursor={{ stroke: '#8EE65A', strokeOpacity: 0.6, strokeDasharray: '4 4' }}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8EE65A"
              strokeWidth={2}
              fill="url(#gwtFill)"
              isAnimationActive={false}
              activeDot={{
                r: 5,
                fill: '#B8FF86',
                stroke: '#030d08',
                strokeWidth: 2,
                style: { filter: 'drop-shadow(0 0 6px rgba(142,230,90,0.9))' },
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stat tiles */}
      <div className="mt-6 grid grid-cols-2 gap-y-5 border-t border-white/[0.07] pt-6 sm:grid-cols-3 xl:grid-cols-5 xl:divide-x xl:divide-white/[0.07]">
        {tiles.map((t) => (
          <div key={t.label} className="flex items-center gap-3 xl:px-5 xl:first:pl-0">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-moss-400/40 text-moss-400">
              <t.icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-xs text-slate-400">{t.label}</div>
              <div className="mt-0.5 text-lg font-bold tabular-nums text-white">{t.value}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
