import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  spark,
}: {
  icon: LucideIcon
  label: string
  value: string
  delta: number
  spark: number[]
}) {
  const up = delta >= 0
  const max = Math.max(...spark)
  const min = Math.min(...spark)
  const range = max - min || 1
  const pts = spark
    .map((v, i) => {
      const x = (i / (spark.length - 1)) * 100
      const y = 28 - ((v - min) / range) * 24 - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="glass-strong p-5">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-moss-500/10 ring-1 ring-moss-400/20">
          <Icon className="h-5 w-5 text-moss-400" />
        </div>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            up
              ? 'bg-moss-500/10 text-moss-300'
              : 'bg-red-500/10 text-red-300'
          }`}
        >
          {up ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(delta)}%
        </span>
      </div>

      <div className="mt-4 text-2xl font-bold tracking-tight text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>

      <svg viewBox="0 0 100 28" className="mt-3 h-8 w-full" preserveAspectRatio="none">
        <polyline
          points={pts}
          fill="none"
          stroke={up ? '#4ade80' : '#f87171'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
