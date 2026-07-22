import { useState } from 'react'
import { project } from '../../lib/projection'
import { geoNodes, type GeoNode } from '../../lib/mockData'

/**
 * Lightweight, dependency-free "live activity" world map.
 *
 * Renders an equirectangular graticule with glowing user-hub markers placed
 * by lat/lng projection, plus animated arcs from a primary hub. No heavy
 * mapping library — the whole thing is SVG + a couple of divs.
 */

// A faint dotted continents layer (rough silhouettes) so the graticule reads
// as a globe rather than empty grid. Each entry is an ellipse in % space.
const landmasses = [
  { cx: 24, cy: 40, rx: 9, ry: 13 }, // N. America
  { cx: 30, cy: 68, rx: 5, ry: 12 }, // S. America
  { cx: 50, cy: 34, rx: 6, ry: 6 }, // Europe
  { cx: 54, cy: 58, rx: 8, ry: 15 }, // Africa
  { cx: 68, cy: 42, rx: 13, ry: 14 }, // Asia
  { cx: 82, cy: 72, rx: 6, ry: 5 }, // Australia
]

const primary = geoNodes[0] // Bengaluru as the network hub

export default function WorldMap({ height = 460 }: { height?: number }) {
  const [hover, setHover] = useState<GeoNode | null>(null)
  const maxUsers = Math.max(...geoNodes.map((n) => n.users))
  const hub = project(primary.lat, primary.lng)

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-night-900/50"
      style={{ height }}
    >
      {/* dotted texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
        aria-hidden
      />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* graticule */}
        {[20, 40, 60, 80].map((y) => (
          <line
            key={`h${y}`}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.15"
          />
        ))}
        {[16, 33, 50, 66, 83].map((x) => (
          <line
            key={`v${x}`}
            x1={x}
            x2={x}
            y1="0"
            y2="100"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.15"
          />
        ))}

        {/* rough continents */}
        {landmasses.map((l, i) => (
          <ellipse
            key={i}
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            fill="rgba(34,197,94,0.05)"
            stroke="rgba(34,197,94,0.12)"
            strokeWidth="0.15"
          />
        ))}

        {/* arcs from the hub to every other node */}
        {geoNodes.slice(1).map((n, i) => {
          const p = project(n.lat, n.lng)
          const midX = (hub.x + p.x) / 2
          const midY = Math.min(hub.y, p.y) - 12
          return (
            <path
              key={i}
              d={`M ${hub.x} ${hub.y} Q ${midX} ${midY} ${p.x} ${p.y}`}
              fill="none"
              stroke="url(#arc)"
              strokeWidth="0.18"
              opacity={0.5}
            />
          )
        })}
        <defs>
          <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#4ade80" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f5b544" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* markers */}
      {geoNodes.map((n) => {
        const p = project(n.lat, n.lng)
        const size = 8 + (n.users / maxUsers) * 16
        const isHub = n === primary
        return (
          <button
            key={n.city}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            aria-label={`${n.city}: ${n.users} users`}
          >
            {/* pulse ring */}
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-moss-400/40 animate-pulse-ring"
              style={{ width: size, height: size }}
            />
            {/* dot */}
            <span
              className="relative block rounded-full ring-2 ring-night-900"
              style={{
                width: size,
                height: size,
                background: isHub ? '#f5b544' : '#4ade80',
                boxShadow: isHub
                  ? '0 0 14px 3px rgba(245,181,68,0.6)'
                  : '0 0 12px 2px rgba(74,222,128,0.55)',
              }}
            />
          </button>
        )
      })}

      {/* tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-white/10 bg-night-800/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
          style={{
            left: `${project(hover.lat, hover.lng).x}%`,
            top: `calc(${project(hover.lat, hover.lng).y}% - 14px)`,
          }}
        >
          <div className="font-semibold text-white">{hover.city}</div>
          <div className="text-slate-400">{hover.country}</div>
          <div className="mt-0.5 font-medium text-moss-300">
            {hover.users.toLocaleString()} users
          </div>
        </div>
      )}

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-4 rounded-lg border border-white/10 bg-night-900/70 px-3 py-1.5 text-[11px] text-slate-400 backdrop-blur">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ember" /> Primary hub
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-moss-400" /> Active region
        </span>
      </div>
    </div>
  )
}
