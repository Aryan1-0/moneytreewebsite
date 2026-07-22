import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to `end` once the element scrolls into view.
 * Returns the current value plus a ref to attach to the target element.
 */
export function useCountUp(end: number, duration = 1600) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            // easeOutExpo for a snappy, decelerating count
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
            setValue(end * eased)
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return { value, ref }
}
