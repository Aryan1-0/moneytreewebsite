import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { growth, treeSpecies, acquisition } from '../../lib/mockData'

const axis = { stroke: '#475569', fontSize: 12 }
const grid = 'rgba(255,255,255,0.06)'

function TipBox({
  active,
  payload,
  label,
  fmt,
}: {
  active?: boolean
  payload?: { name: string; value: number; color?: string }[]
  label?: string
  fmt?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-night-800/95 px-3.5 py-2.5 shadow-xl backdrop-blur">
      {label && <div className="mb-1 text-xs font-medium text-slate-400">{label}</div>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color || '#4ade80' }}
          />
          <span className="capitalize text-slate-300">{p.name}:</span>
          <span className="font-semibold text-white">
            {fmt ? fmt(p.value) : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export function UserGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={growth} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gTrees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5b544" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#f5b544" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} width={48} />
        <Tooltip content={<TipBox />} cursor={{ stroke: grid }} />
        <Area
          type="monotone"
          dataKey="trees"
          stroke="#f5b544"
          strokeWidth={2}
          fill="url(#gTrees)"
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke="#22c55e"
          strokeWidth={2.5}
          fill="url(#gUsers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={growth} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#16a34a" stopOpacity={0.35} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={axis} tickLine={false} axisLine={false} />
        <YAxis
          tick={axis}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => `$${v / 1000}k`}
        />
        <Tooltip
          content={<TipBox fmt={(v) => `$${v.toLocaleString()}`} />}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="revenue" fill="url(#gRev)" radius={[6, 6, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function SpeciesChart() {
  const total = treeSpecies.reduce((s, t) => s + t.value, 0)
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={treeSpecies}
            dataKey="value"
            nameKey="name"
            innerRadius={54}
            outerRadius={82}
            paddingAngle={2}
            stroke="none"
          >
            {treeSpecies.map((s) => (
              <Cell key={s.name} fill={s.color} />
            ))}
          </Pie>
          <Tooltip content={<TipBox />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex-1 space-y-2.5">
        {treeSpecies.map((s) => (
          <li key={s.name} className="flex items-center gap-2.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            <span className="flex-1 text-slate-300">{s.name}</span>
            <span className="text-slate-500">
              {Math.round((s.value / total) * 100)}%
            </span>
            <span className="w-14 text-right font-medium text-white">
              {s.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AcquisitionChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={acquisition}
        layout="vertical"
        margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="source"
          tick={axis}
          tickLine={false}
          axisLine={false}
          width={70}
        />
        <Tooltip
          content={<TipBox fmt={(v) => `${v}%`} />}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="value" fill="#22c55e" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {acquisition.map((_, i) => (
            <Cell key={i} fill={`rgba(34,197,94,${1 - i * 0.15})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
