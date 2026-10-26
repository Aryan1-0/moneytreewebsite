import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MousePointerClick, Volume2, VolumeX } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { CHAPTERS, LAST_PAGE, SHEETS, type Face } from '../book/bookContent'
import type { Focus } from '../book/Book3D'

// three.js only loads when the book is about to scroll into view.
const Book3D = lazy(() => import('../book/Book3D'))

/** Plain-text version of a page, for screen readers and search engines. */
function FaceText({ face }: { face: Face }) {
  switch (face.kind) {
    case 'cover':
      return (
        <>
          <h3>{face.title}</h3>
          <p>{face.subtitle}</p>
        </>
      )
    case 'back-cover':
      return (
        <>
          <h3>{face.title}</h3>
          <p>{face.body}</p>
        </>
      )
    case 'text':
      return (
        <>
          <h3>{face.title}</h3>
          {face.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {face.bullets && (
            <ul>
              {face.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </>
      )
    case 'image':
      return <p>{face.quote ? `${face.quote}. ${face.caption}` : face.caption}</p>
    case 'step':
      return (
        <>
          <h3>
            {face.eyebrow}: {face.title}
          </h3>
          <p>{face.body}</p>
        </>
      )
  }
}

/** Which chapter a page state belongs to (the last one that starts at or before it). */
const chapterOf = (page: number) =>
  [...CHAPTERS].reverse().find((c) => page >= c.page && page < LAST_PAGE)?.label ?? null

export default function StoryBook() {
  const [page, setPage] = useState(0)
  const [near, setNear] = useState(false) // mount the 3D book once it's close
  const [inView, setInView] = useState(false) // animate only while visible
  const [ready, setReady] = useState(false)
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: '600px 0px',
    })
    const viewIO = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 })
    nearIO.observe(el)
    viewIO.observe(el)
    return () => {
      nearIO.disconnect()
      viewIO.disconnect()
    }
  }, [])

  // Phones read one page at a time: `side` says which page of the open spread
  // is in view. Desktop always shows the whole spread.
  const [narrow, setNarrow] = useState(false)
  const [side, setSide] = useState<'left' | 'right'>('left')
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setNarrow(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const clamp = (p: number) => Math.max(0, Math.min(LAST_PAGE, p))
  /** Jump to a page state (chapter tabs, clicking a page). */
  const go = useCallback(
    (p: number) => {
      const next = clamp(p)
      setSide(next >= page ? 'left' : 'right') // forward → start on the left page
      setPage(next)
    },
    [page],
  )
  /** Chapter tabs: open at the chapter's first (left) page. */
  const jump = (p: number) => {
    setSide('left')
    setPage(clamp(p))
  }
  const step = (dir: 1 | -1) => {
    const open = page > 0 && page < LAST_PAGE
    if (narrow && open && dir === 1 && side === 'left') return setSide('right')
    if (narrow && open && dir === -1 && side === 'right') return setSide('left')
    go(page + dir)
  }
  // Page-flip sound, on by default; the choice is remembered.
  const [sound, setSound] = useState(() => {
    try {
      return localStorage.getItem('gw-book-sound') !== 'off'
    } catch {
      return true
    }
  })
  const toggleSound = () =>
    setSound((on) => {
      try {
        localStorage.setItem('gw-book-sound', on ? 'off' : 'on')
      } catch {
        /* storage unavailable — keep the in-memory choice */
      }
      return !on
    })

  const onReady = useCallback(() => setReady(true), [])
  const active = chapterOf(page)
  const open = page > 0 && page < LAST_PAGE
  const focus: Focus = !narrow ? 'spread' : open ? side : 'single'
  const atStart = page === 0
  const atEnd = page === LAST_PAGE
  const label = atStart
    ? 'Cover'
    : atEnd
      ? 'Back cover'
      : narrow
        ? `Page ${(page - 1) * 2 + (side === 'left' ? 1 : 2)} of ${(LAST_PAGE - 1) * 2}`
        : `Spread ${page} of ${LAST_PAGE - 1}`

  return (
    <section id="story" className="relative overflow-hidden py-24">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-400">
            Our Story
          </div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About Us, Why Us &amp; <span className="text-gradient">How It Works</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Flip through who we are, why it matters, and how to start growing in three simple steps.
          </p>
        </Reveal>

        <motion.div
          className="relative mt-10"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {/* soft glow under the book */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-moss-500/10 blur-[110px]"
            aria-hidden
          />

          <div
            ref={stage}
            className="relative mx-auto h-[480px] w-full max-w-5xl outline-none md:h-[min(72vh,640px)] md:min-h-[420px]"
            tabIndex={0}
            role="group"
            aria-roledescription="book"
            aria-label={`The Green World Story — ${active ?? 'Back cover'}`}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault()
                step(1)
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                step(-1)
              }
            }}
          >
            {near && (
              <Suspense fallback={null}>
                <Book3D page={page} onPageChange={go} active={inView} focus={focus} sound={sound} onReady={onReady} />
              </Suspense>
            )}
            {!ready && (
              <div className="absolute inset-0 grid place-items-center" aria-hidden>
                <div className="h-[62%] w-[34%] min-w-[200px] animate-pulse rounded-2xl border border-moss-400/20 bg-gradient-to-b from-[#0d2e19] to-[#03110a] shadow-[0_0_60px_-10px_rgba(142,230,90,0.35)]" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="relative mt-6 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-1 rounded-2xl border border-white/10 bg-black/30 p-1" role="tablist" aria-label="Chapters">
              {CHAPTERS.map((c) => (
                <button
                  key={c.label}
                  role="tab"
                  aria-selected={active === c.label}
                  onClick={() => jump(c.page)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    active === c.label
                      ? 'bg-moss-400 font-semibold text-night-950 shadow-[0_0_16px_-4px_rgba(142,230,90,0.7)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={atStart}
                aria-label="Previous page"
                className="grid h-11 w-11 place-items-center rounded-full border border-moss-400/50 bg-black/40 text-moss-200 shadow-[0_0_20px_-6px_rgba(142,230,90,0.55)] transition-all hover:border-moss-300 hover:bg-moss-500/20 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="min-w-[9rem] text-center text-sm tabular-nums text-slate-400" aria-live="polite">
                {label}
              </div>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={atEnd}
                aria-label="Next page"
                className="grid h-11 w-11 place-items-center rounded-full border border-moss-400/50 bg-black/40 text-moss-200 shadow-[0_0_20px_-6px_rgba(142,230,90,0.55)] transition-all hover:border-moss-300 hover:bg-moss-500/20 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500">
              <p className="inline-flex items-center gap-1.5">
                <MousePointerClick className="h-3.5 w-3.5" /> Tap or click a page, or use the arrows to turn
              </p>
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={sound}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-slate-400 transition-colors hover:border-moss-400/50 hover:text-moss-300"
              >
                {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                {sound ? 'Sound on' : 'Sound off'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Text version of the book */}
        <div className="sr-only">
          {SHEETS.map((s, i) => (
            <div key={i}>
              <FaceText face={s.front} />
              <FaceText face={s.back} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
