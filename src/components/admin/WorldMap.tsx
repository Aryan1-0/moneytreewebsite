import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps'
import { geoNodes, type GeoNode } from '../../lib/mockData'

/**
 * Live "global activity" world map.
 *
 * Renders a real geographic world map (Natural Earth 110m via world-atlas,
 * served locally from /countries-110m.json) with user hubs plotted at their
 * true lat/lng, connection arcs from the primary hub, pulsing markers and
 * hover tooltips. Uses react-simple-maps / d3-geo for correct projection.
 */

const GEO_URL = '/countries-110m.json'
const MAP_W = 800
const MAP_H = 360
const primary = geoNodes[0] // Bengaluru — the network hub

export default function WorldMap({ height = 460 }: { height?: number }) {
  const [hover, setHover] = useState<GeoNode | null>(null)
  const maxUsers = Math.max(...geoNodes.map((n) => n.users))

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-night-900/60"
      style={{ height }}
    >
      {/* faint dotted texture behind the map */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden
      />

      <ComposableMap
        projection="geoEqualEarth"
        width={MAP_W}
        height={MAP_H}
        projectionConfig={{ scale: 150, center: [0, 8] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(34,197,94,0.07)"
                stroke="rgba(74,222,128,0.22)"
                strokeWidth={0.4}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: 'rgba(34,197,94,0.14)' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* arcs from the hub to every region */}
        {geoNodes.slice(1).map((n, i) => (
          <Line
            key={i}
            from={[primary.lng, primary.lat]}
            to={[n.lng, n.lat]}
            stroke="rgba(74,222,128,0.28)"
            strokeWidth={0.6}
            strokeLinecap="round"
          />
        ))}

        {/* markers */}
        {geoNodes.map((n) => {
          const size = 3.5 + (n.users / maxUsers) * 5
          const isHub = n === primary
          const color = isHub ? '#f5b544' : '#4ade80'
          return (
            <Marker
              key={n.city}
              coordinates={[n.lng, n.lat]}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              style={{ default: { cursor: 'pointer' } }}
            >
              {/* pulse ring */}
              <circle r={size} fill="none" stroke={color} strokeWidth={1.2} opacity={0.7}>
                <animate
                  attributeName="r"
                  from={size}
                  to={size + 9}
                  dur="2.4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.7"
                  to="0"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* dot */}
              <circle
                r={size}
                fill={color}
                stroke="#08130f"
                strokeWidth={1}
                style={{
                  filter: isHub
                    ? 'drop-shadow(0 0 6px rgba(245,181,68,0.9))'
                    : 'drop-shadow(0 0 5px rgba(74,222,128,0.8))',
                }}
              />

              {/* tooltip */}
              {hover === n && (
                <g transform={`translate(0 ${-size - 6})`} style={{ pointerEvents: 'none' }}>
                  <rect
                    x={-44}
                    y={-32}
                    width={88}
                    height={28}
                    rx={6}
                    fill="rgba(8,19,15,0.96)"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={0.5}
                  />
                  <text textAnchor="middle" y={-19} fill="#ffffff" fontSize={8.5} fontWeight={700}>
                    {n.city}
                  </text>
                  <text textAnchor="middle" y={-9} fill="#4ade80" fontSize={7.5}>
                    {n.users.toLocaleString()} users
                  </text>
                </g>
              )}
            </Marker>
          )
        })}
      </ComposableMap>

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
