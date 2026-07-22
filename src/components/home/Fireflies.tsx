import { useMemo } from 'react'

/**
 * Soft ambient "firefly" bokeh that matches the golden specks in the tree
 * artwork. Purely decorative — sits behind the hero content and bleeds the
 * image into the page so the island doesn't look like a separate cutout.
 */
export default function Fireflies({ count = 26 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280
        const r = seed / 233280
        const r2 = ((i * 7 + 13) % 100) / 100
        return {
          left: `${r * 100}%`,
          top: `${r2 * 100}%`,
          size: 2 + (r * 4),
          delay: `${r * 6}s`,
          duration: `${5 + r2 * 6}s`,
          gold: i % 3 === 0,
        }
      }),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            animationDuration: d.duration,
            background: d.gold ? '#f5b544' : '#7dd88f',
            boxShadow: d.gold
              ? '0 0 8px 2px rgba(245,181,68,0.55)'
              : '0 0 8px 2px rgba(125,216,143,0.4)',
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  )
}
