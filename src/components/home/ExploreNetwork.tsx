import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Gamepad2,
  Wallet,
  Sprout,
  ShoppingCart,
  Users,
  Gem,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Reveal from '../ui/Reveal'

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=560&h=380&q=70`

type Card = {
  icon: typeof Gamepad2
  eyebrow: string
  title: string
  body: string
  img: string
  art?: boolean // transparent game art (contain) instead of a photo (cover)
  to: string // route, or "#section" on the home page
}

const CARDS: Card[] = [
  {
    icon: Gamepad2,
    eyebrow: 'Play & Earn',
    title: 'Gaming Experience',
    body: 'Dive into exciting challenges, earn rewards and be part of the global competition.',
    img: unsplash('photo-1593508512255-86ab42a8e620'),
    to: '#how',
  },
  {
    icon: Wallet,
    eyebrow: 'Trade & Grow',
    title: 'Web3 Economy',
    body: 'Own, trade and grow your digital assets in a secure and transparent ecosystem.',
    img: unsplash('photo-1621761191319-c6fb62004040'),
    to: '/token',
  },
  {
    icon: Sprout,
    eyebrow: 'Plant Real Trees',
    title: 'Green Impact',
    body: 'Your play fuels real trees. A greener tomorrow, built together — visit them in person.',
    img: unsplash('photo-1502082553048-f009c37129b9'),
    to: '/garden',
  },
  {
    icon: ShoppingCart,
    eyebrow: 'Shop & Redeem',
    title: 'E-Commerce',
    body: 'Use your earned currency to get exclusive products, merchandise and more.',
    img: unsplash('photo-1544816155-12df9643f363'),
    to: '/marketplace',
  },
  {
    icon: Gem,
    eyebrow: 'Collect & Own',
    title: 'NFT Collectibles',
    body: 'Rare trees, companions and season passes — collectibles that grow with you.',
    img: '/market/guardian.webp',
    art: true,
    to: '/marketplace',
  },
  {
    icon: Users,
    eyebrow: 'Grow Together',
    title: 'Community',
    body: 'Join growers worldwide — share progress, join events and plant side by side.',
    img: unsplash('photo-1542601906990-b4d3fb778b09'),
    to: '/community',
  },
]

// Chamfered corners, like the reference cards.
const CUT = 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)'

function NetworkCard({ card, index }: { card: Card; index: number }) {
  const isHash = card.to.startsWith('#')
  const scrollToSection = (e: MouseEvent) => {
    e.preventDefault()
    document.querySelector(card.to)?.scrollIntoView({ behavior: 'smooth' })
  }
  const linkCls =
    'mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-moss-300 transition-colors after:absolute after:inset-0 hover:text-moss-200 focus-visible:outline-none'
  const label = (
    <>
      Learn More
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </>
  )

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: Math.min(index, 3) * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {/* glow + lift live outside the clipped shape (clip-path would cut them off) */}
      <div className="group h-full transition-[filter,transform] duration-300 [filter:drop-shadow(0_0_0_rgba(142,230,90,0))] hover:-translate-y-1.5 hover:[filter:drop-shadow(0_0_16px_rgba(142,230,90,0.35))] has-[a:focus-visible]:[filter:drop-shadow(0_0_16px_rgba(142,230,90,0.55))]">
        {/* Outer layer = the border (gradient), inner layer = the card */}
        <div className="relative h-full p-px" style={{ clipPath: CUT }}>
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#d6e88a]/70 via-moss-400/35 to-moss-700/40 transition-opacity duration-300 group-hover:from-moss-300 group-hover:via-moss-400/60"
            aria-hidden
          />
          <article
            className="relative flex h-full flex-col bg-gradient-to-b from-[#06150c] to-[#030a06] p-2.5"
            style={{ clipPath: CUT }}
          >
            <div
              className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(ellipse_at_50%_65%,rgba(105,194,72,0.35),#04120a_72%)]"
              style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%, 0 12px)' }}
            >
              <img
                src={card.img}
                alt=""
                loading="lazy"
                draggable={false}
                className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.07] ${
                  card.art ? 'object-contain p-3 drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]' : 'object-cover saturate-[1.15]'
                }`}
              />
              {/* green grade so the photos sit in the brand palette, fading into the card */}
              <div className="absolute inset-0 bg-moss-500/15 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06150c] via-transparent via-40% to-transparent" />
              <span className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-xl border border-moss-400/50 bg-black/55 text-moss-300 shadow-[0_0_16px_-4px_rgba(142,230,90,0.6)] backdrop-blur-sm transition-colors duration-300 group-hover:bg-moss-500/25">
                <card.icon className="h-5 w-5" />
              </span>
            </div>
  
            <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss-400">
                {card.eyebrow}
              </div>
              <h3 className="mt-1.5 text-xl font-bold tracking-tight text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.body}</p>
              {isHash ? (
                <a href={card.to} onClick={scrollToSection} className={linkCls} aria-label={`Learn more about ${card.title}`}>
                  {label}
                </a>
              ) : (
                <Link to={card.to} className={linkCls} aria-label={`Learn more about ${card.title}`}>
                  {label}
                </Link>
              )}
            </div>
          </article>
        </div>
      </div>
    </motion.div>
  )
}

export default function ExploreNetwork() {
  const track = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)

  /** Width of one card + the gap = one carousel step. */
  const step = () => {
    const el = track.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return 0
    return first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
  }

  const sync = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
    const s = step()
    if (s > 0) {
      setPages(Math.round(max / s) + 1)
      setPage(Math.round(el.scrollLeft / s))
    }
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      ro.disconnect()
    }
  }, [sync])

  // glide between cards, unless the visitor prefers reduced motion
  const behavior = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * step(), behavior: behavior() })
  const goTo = (i: number) => track.current?.scrollTo({ left: i * step(), behavior: behavior() })

  const arrow = (dir: 1 | -1, extra = '') => {
    const enabled = dir === 1 ? canNext : canPrev
    const Icon = dir === 1 ? ChevronRight : ChevronLeft
    return (
      <button
        type="button"
        onClick={() => go(dir)}
        disabled={!enabled}
        aria-label={dir === 1 ? 'Next cards' : 'Previous cards'}
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border border-moss-400/50 bg-black/40 text-moss-200 shadow-[0_0_20px_-6px_rgba(142,230,90,0.55)] backdrop-blur-sm transition-all duration-300 hover:border-moss-300 hover:bg-moss-500/20 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30 ${extra}`}
      >
        <Icon className="h-5 w-5" />
      </button>
    )
  }

  return (
    <section id="explore" className="relative overflow-hidden py-24">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-400">
            One Ecosystem
          </div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Explore The <span className="text-gradient">Green World</span> Network
          </h2>
          <p className="mt-4 text-slate-400">
            Play, trade, shop and connect — every move you make grows a real forest.
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* side arrows (wide screens) */}
          <div className="absolute -left-20 top-1/2 hidden -translate-y-1/2 2xl:block">{arrow(-1)}</div>
          <div className="absolute -right-20 top-1/2 hidden -translate-y-1/2 2xl:block">{arrow(1)}</div>

          <div
            ref={track}
            className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-6 pt-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 xl:mx-0 xl:scroll-px-0 xl:px-0 [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-roledescription="carousel"
            aria-label="Green World Network"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault()
                go(1)
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                go(-1)
              }
            }}
          >
            {CARDS.map((c, i) => (
              <div
                key={c.title}
                className="w-[82%] shrink-0 snap-start min-[480px]:w-[60%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
              >
                <NetworkCard card={c} index={i} />
              </div>
            ))}
          </div>

          {/* bottom controls: arrows (below 2xl) + position dots */}
          <div className="mt-6 flex items-center justify-center gap-5">
            <div className="2xl:hidden">{arrow(-1)}</div>
            <div className="flex items-center gap-2" role="tablist" aria-label="Carousel position">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={page === i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    page === i ? 'w-7 bg-moss-400 shadow-[0_0_10px_rgba(142,230,90,0.7)]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <div className="2xl:hidden">{arrow(1)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
