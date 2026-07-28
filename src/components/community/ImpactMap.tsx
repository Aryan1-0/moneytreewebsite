import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'

const GEO_URL = '/countries-110m.json'

// A handful of active-hub coordinates [lng, lat] shown as green glowing dots.
const HUBS: [number, number][] = [
  [-74, 40.7], [-122.4, 37.8], [-0.1, 51.5], [13.4, 52.5], [77.6, 13],
  [72.9, 19], [103.8, 1.35], [139.7, 35.7], [151.2, -33.9], [-46.6, -23.5],
  [3.4, 6.5], [55.3, 25.2], [-79.4, 43.7], [36.8, -1.3],
]

export default function ImpactMap({ height = 210 }: { height?: number }) {
  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <ComposableMap
        projection="geoEqualEarth"
        width={560}
        height={height}
        projectionConfig={{ scale: 105, center: [10, 12] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1a2a24"
                stroke="#0c1713"
                strokeWidth={0.4}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {HUBS.map(([lng, lat], i) => (
          <Marker key={i} coordinates={[lng, lat]}>
            <circle r={2.4} fill="#8ee65a" opacity={0.9}>
              <animate
                attributeName="opacity"
                values="0.35;1;0.35"
                dur="2.6s"
                begin={`${(i % 5) * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              r={2.4}
              fill="none"
              stroke="#8ee65a"
              strokeWidth={0.6}
              opacity={0.6}
            >
              <animate attributeName="r" values="2.4;6" dur="2.6s" begin={`${(i % 5) * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur="2.6s" begin={`${(i % 5) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}
