import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Hexagon, Apple, Star, Search, ChevronDown, SearchX } from 'lucide-react'

type Category = 'nft' | 'pass' | 'special'

type Item = {
  id: string
  name: string
  category: Category
  meta: [string, string]
  price: number // SOL
  listed: number // ms — newer = larger
  img: string
  photo?: boolean // full-bleed photo vs. transparent game art
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=480&h=360&q=70`

const DAY = 86_400_000
const BASE = Date.UTC(2026, 9, 15)

// Listed newest → oldest.
const ITEMS: Item[] = [
  { id: 'guardian', name: 'Green Guardian NFT', category: 'nft', meta: ['Rare', '1/1000'], price: 0.45, img: '/market/guardian.webp' },
  { id: 'sprout', name: 'Sprout Companion NFT', category: 'nft', meta: ['Common', '1/5000'], price: 0.12, img: '/market/sprout.webp' },
  { id: 'mango', name: 'Mango Season Pass', category: 'pass', meta: ['3 Months', 'Access + Rewards'], price: 0.35, img: unsplash('photo-1601493700631-2b16ec4b4716'), photo: true },
  { id: 'apple', name: 'Apple Season Pass', category: 'pass', meta: ['3 Months', 'Access + Rewards'], price: 0.35, img: unsplash('photo-1560806887-1e4cd0b6cbd6'), photo: true },
  { id: 'dragonfruit', name: 'Dragonfruit Season Pass', category: 'pass', meta: ['3 Months', 'Access + Rewards'], price: 0.35, img: unsplash('photo-1527325678964-54921661f888'), photo: true },
  { id: 'oak', name: 'Ancient Oak NFT', category: 'nft', meta: ['Epic', '1/250'], price: 0.8, img: '/market/oak.webp' },
  { id: 'sapling', name: 'Sapling Spirit NFT', category: 'nft', meta: ['Uncommon', '1/2500'], price: 0.22, img: '/market/sapling.webp' },
  { id: 'lantern', name: 'Garden Lantern', category: 'special', meta: ['Limited', 'Night Glow Boost'], price: 0.18, img: '/market/lantern.webp' },
  { id: 'watercan', name: 'Aqua Watering Can', category: 'special', meta: ['Utility', '2× Growth Speed'], price: 0.09, img: '/market/watercan.webp' },
  { id: 'land', name: 'Land Plot', category: 'special', meta: ['Land', 'Expand Your Garden'], price: 0.6, img: '/market/land.webp' },
].map((it, i) => ({ ...it, category: it.category as Category, meta: it.meta as [string, string], listed: BASE - i * DAY }))

const BADGE: Record<Category, string> = { nft: 'NFT', pass: 'Fruit Pass', special: 'Special' }

const TABS: { key: 'all' | Category; label: string; icon?: typeof Star }[] = [
  { key: 'all', label: 'All' },
  { key: 'nft', label: 'NFTs', icon: Hexagon },
  { key: 'pass', label: 'Fruit Passes', icon: Apple },
  { key: 'special', label: 'Specials', icon: Star },
]

const SORTS = {
  newest: { label: 'Newest', fn: (a: Item, b: Item) => b.listed - a.listed },
  'price-asc': { label: 'Price: Low to High', fn: (a: Item, b: Item) => a.price - b.price || b.listed - a.listed },
  'price-desc': { label: 'Price: High to Low', fn: (a: Item, b: Item) => b.price - a.price || b.listed - a.listed },
  name: { label: 'Name: A–Z', fn: (a: Item, b: Item) => a.name.localeCompare(b.name) },
}
type SortKey = keyof typeof SORTS

function SolIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0" aria-hidden>
      <defs>
        <linearGradient id="solg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="10" fill="#0b1410" />
      <circle cx="10" cy="10" r="9.25" fill="none" stroke="url(#solg)" strokeWidth="1.5" />
      <g fill="url(#solg)">
        <path d="M6.6 6.2h7.6l-1.3 1.4H5.3z" />
        <path d="M5.3 9.3h7.6l1.3 1.4H6.6z" />
        <path d="M6.6 12.4h7.6l-1.3 1.4H5.3z" />
      </g>
    </svg>
  )
}

export default function MarketItems({ onBuy }: { onBuy: (item: Item) => void }) {
  const [tab, setTab] = useState<'all' | Category>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: ITEMS.length }
    for (const it of ITEMS) c[it.category] = (c[it.category] ?? 0) + 1
    return c
  }, [])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ITEMS.filter((it) => tab === 'all' || it.category === tab)
      .filter(
        (it) =>
          !q ||
          it.name.toLowerCase().includes(q) ||
          BADGE[it.category].toLowerCase().includes(q) ||
          it.meta.some((m) => m.toLowerCase().includes(q)),
      )
      .sort(SORTS[sort].fn)
  }, [tab, query, sort])

  return (
    <section aria-label="NFTs and passes">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div
          className="flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-1"
          role="tablist"
          aria-label="Category"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-moss-400 font-semibold text-night-950 shadow-[0_0_16px_-4px_rgba(142,230,90,0.7)]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {t.icon && <t.icon className="h-4 w-4" />}
              {t.label}
              <span className={`text-xs tabular-nums ${tab === t.key ? 'text-night-950/70' : 'text-slate-500'}`}>
                {counts[t.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:justify-end">
          <label className="flex flex-1 items-center gap-2.5 rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 focus-within:border-moss-400/50 lg:max-w-sm">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              aria-label="Search items"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 py-1 pl-4 pr-1">
            <span className="shrink-0 text-sm text-slate-400">Sort by</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#06120b] py-2 pl-3.5 pr-9 text-sm font-medium text-white focus:border-moss-400/50 focus:outline-none"
                aria-label="Sort items"
              >
                {(Object.keys(SORTS) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {SORTS[k].label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </span>
          </label>
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {shown.map((it) => (
          <motion.article
            key={it.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-moss-400/20 bg-[#040e09]/90 transition-[border-color,box-shadow] duration-300 hover:border-moss-400/50 hover:shadow-[0_0_30px_-10px_rgba(142,230,90,0.5)]"
          >
            <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_50%_60%,rgba(105,194,72,0.28),rgba(4,20,11,0.9)_70%)]">
              {it.photo ? (
                <>
                  <img
                    src={it.img}
                    alt={it.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
                </>
              ) : (
                <img
                  src={it.img}
                  alt={it.name}
                  loading="lazy"
                  className="absolute inset-0 m-auto h-[82%] w-[82%] object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <span className="absolute left-2.5 top-2.5 rounded-full border border-moss-400/60 bg-black/55 px-3 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                {BADGE[it.category]}
              </span>
            </div>

            <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
              <h3 className="text-[15px] font-bold leading-snug text-white">{it.name}</h3>
              <p className="mt-1 text-xs text-slate-400">
                {it.meta[0]} <span className="mx-1 text-slate-600">•</span> {it.meta[1]}
              </p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold tabular-nums text-white">
                  <SolIcon />
                  {it.price.toFixed(2)} SOL
                </span>
                <button
                  onClick={() => onBuy(it)}
                  className="rounded-xl bg-moss-400 px-3.5 py-2 text-xs font-semibold text-night-950 shadow-[0_0_16px_-6px_rgba(142,230,90,0.8)] transition-colors hover:bg-moss-300"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {shown.length === 0 && (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-white/10 py-14 text-center">
          <SearchX className="h-8 w-8 text-slate-500" />
          <p className="mt-3 text-sm text-slate-300">No items match “{query}”.</p>
          <button
            onClick={() => {
              setQuery('')
              setTab('all')
            }}
            className="mt-3 text-sm font-semibold text-moss-400 hover:text-moss-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}
