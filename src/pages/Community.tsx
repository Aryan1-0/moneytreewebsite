import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Leaf,
  Users,
  Cloud,
  Globe2,
  FolderKanban,
  TreePine,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  FileText,
  BarChart3,
  Coins,
  HeartHandshake,
  Calendar,
  Mic,
  MoreHorizontal,
  Wallet,
  Globe,
  MessageSquare,
  Twitter,
  Send,
  Youtube,
} from 'lucide-react'
import Logo from '../components/layout/Logo'
import Button from '../components/ui/Button'
import ImpactMap from '../components/community/ImpactMap'

const card =
  'rounded-2xl border border-white/[0.07] bg-[#0d1712]/70 backdrop-blur-sm'

const EASE = [0.21, 0.47, 0.32, 0.98] as const

const navLinks = ['Garden', 'Dashboard', 'Marketplace', 'Token']

const heroStats = [
  { icon: TreePine, value: '12,450', label: 'Trees Planted' },
  { icon: Users, value: '5,230', label: 'Members' },
  { icon: Leaf, value: '$2.35M', label: 'CO₂ Offset' },
  { icon: Globe2, value: '18', label: 'Countries' },
]

const communityStats = [
  { icon: Users, label: 'Total Members', value: '5,230' },
  { icon: TreePine, label: 'Trees Planted', value: '12,450' },
  { icon: Cloud, label: 'CO₂ Offset (kg)', value: '5,230' },
  { icon: FolderKanban, label: 'Active Projects', value: '18' },
  { icon: Globe2, label: 'Countries Reached', value: '18' },
]

const contributors = [
  { name: 'GreenTrail', trees: 245, img: 12 },
  { name: 'EcoWarrior', trees: 180, img: 45 },
  { name: 'TreeGuardian', trees: 120, img: 32 },
  { name: 'NatureHero', trees: 95, img: 15 },
]

const tabs = ['Overview', 'Discussions', 'Projects', 'Leaderboard', 'Members', 'News']

const movement = [
  { icon: Leaf, title: 'Plant Trees', body: 'Grow a greener tomorrow' },
  { icon: Coins, title: 'Earn Rewards', body: 'Get tokens and make an impact' },
  { icon: HeartHandshake, title: 'Make a Difference', body: 'Track your impact in real time' },
]

const events = [
  { icon: Calendar, title: 'Tree Planting Campaign', date: 'May 25, 2025 · 10:00 AM UTC' },
  { icon: Mic, title: 'Community AMA', date: 'May 28, 2025 · 7:00 PM UTC' },
  { icon: Leaf, title: 'Sustainability Workshop', date: 'May 30, 2025 · 3:00 PM UTC' },
]

const socials = [MessageSquare, Twitter, Send, Youtube]

const postImages = [
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=60',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=400&q=60',
  'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=400&q=60',
]
const newsImages = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=200&q=60',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=200&q=60',
]

function Avatar({ img, size = 40 }: { img: number; size?: number }) {
  return (
    <img
      src={`https://i.pravatar.cc/80?img=${img}`}
      alt=""
      loading="lazy"
      className="shrink-0 rounded-full object-cover ring-1 ring-white/10"
      style={{ width: size, height: size }}
    />
  )
}

function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-[15px] font-semibold text-white">{children}</h3>
      {action}
    </div>
  )
}

export default function Community() {
  const location = useLocation()
  const navigate = useNavigate()
  const cameFromHome = (location.state as { from?: string } | null)?.from === 'home'

  // Enable scroll-snap only while this page is mounted (window is the scroller).
  useEffect(() => {
    document.documentElement.classList.add('snap-y')
    return () => document.documentElement.classList.remove('snap-y')
  }, [])

  // Scroll-triggered slide-in (re-runs every time the card re-enters the frame).
  const slide = (from: 'left' | 'right', delay = 0) => ({
    initial: { opacity: 0, x: from === 'left' ? -60 : 60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { amount: 0.2 as const, once: false },
    transition: { duration: 0.6, delay, ease: EASE },
  })

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { amount: 0.15 as const, once: false },
    transition: { duration: 0.6, delay, ease: EASE },
  })

  // Hero build-in — ONLY plays when navigating in from the home page.
  const heroItem = (offset: Record<string, number>, delay = 0) => ({
    initial: cameFromHome ? { opacity: 0, ...offset } : false,
    animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    transition: { duration: 0.8, delay, ease: EASE },
  })

  // Leaving to home: only ask the home hero to "uncompress" if we're at the top
  // (i.e. the community hero is on screen). Otherwise home appears normally.
  const goHome = () => {
    const atTop = window.scrollY < 80
    navigate('/', { state: { animateHero: atTop } })
  }

  return (
    <div className="text-slate-200">
      {/* ── Top nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#081410]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1480px] items-center justify-between px-6">
          <button onClick={goHome} aria-label="TreeGrow home">
            <Logo />
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            <button
              onClick={goHome}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Home
            </button>
            {navLinks.map((l) => (
              <Link
                key={l}
                to="/"
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {l}
              </Link>
            ))}
            <span className="relative text-sm font-semibold text-moss-400">
              Community
              <span className="absolute -bottom-[26px] left-0 h-0.5 w-full rounded-full bg-moss-400" />
            </span>
          </nav>
          <div className="flex items-center gap-3">
            <Button size="md">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
            <button className="hidden items-center gap-1 rounded-xl border border-white/10 px-2.5 py-2 text-slate-300 transition-colors hover:text-white sm:flex">
              <Globe className="h-4 w-4" />
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero (snap section, 100vh) ───────────────────────── */}
      <section
        className="mx-auto flex min-h-[calc(100svh-68px)] max-w-[1480px] items-center px-6"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.82fr_1fr_370px]">
          {/* Copy */}
          <motion.div {...heroItem({ x: -70 })}>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white">
              Grow Together.
              <br />
              <span className="text-gradient">Create Tomorrow.</span>
            </h1>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-slate-400">
              A community of changemakers building a greener world, one tree at a
              time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg">Join Community</Button>
              <Button variant="outline" size="lg">
                Explore Projects
              </Button>
            </div>
          </motion.div>

          {/* Tree + stats */}
          <motion.div className="relative" {...heroItem({ scale: 0.9, y: 24 }, 0.1)}>
            <img
              src="/tree.png"
              alt="TreeGrow community tree"
              className="tree-blend mx-auto w-full max-w-xl select-none"
              draggable={false}
            />
            <div className="mt-2 grid grid-cols-4 gap-3">
              {heroStats.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/10">
                    <s.icon className="h-4 w-4 text-moss-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{s.value}</div>
                    <div className="text-[11px] text-slate-400">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Community Impact card — slides in from the right */}
          <motion.div className={`${card} p-5`} {...slide('right', 0.1)}>
            <h3 className="text-base font-semibold text-white">Community Impact</h3>
            <p className="mt-0.5 text-xs text-slate-400">Making a Real Difference</p>
            <div className="mt-4 overflow-hidden rounded-xl bg-[#0a1410] ring-1 ring-white/[0.05]">
              <ImpactMap />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: TreePine, value: '12,450', label: 'Trees Planted' },
                { icon: Cloud, value: '5,230', label: 'CO₂ Offset (kg)' },
                { icon: Globe2, value: '18', label: 'Countries' },
              ].map((s) => (
                <div key={s.label}>
                  <s.icon className="mx-auto h-4 w-4 text-moss-400" />
                  <div className="mt-1 text-sm font-bold text-white">{s.value}</div>
                  <div className="text-[10px] leading-tight text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-moss-500 to-moss-400 py-2.5 text-sm font-semibold text-night-950 transition-opacity hover:opacity-90">
              View Impact
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Content (snap section) ───────────────────────────── */}
      <section
        className="mx-auto max-w-[1480px] px-6 pb-10 pt-4"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="grid gap-6 lg:grid-cols-[330px_1fr_370px]">
          {/* Tabs (span left + center) — from left */}
          <motion.div className="lg:col-span-2" {...slide('left')}>
            <nav className="flex items-center gap-7 border-b border-white/[0.07] pb-3 text-sm">
              {tabs.map((t, i) => (
                <button
                  key={t}
                  className={`relative font-medium transition-colors ${
                    i === 0 ? 'text-moss-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                  {i === 0 && (
                    <span className="absolute -bottom-[13px] left-0 h-0.5 w-full rounded-full bg-moss-400" />
                  )}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Right sidebar (spans two rows) — from right, staggered */}
          <div className="space-y-6 lg:row-span-2">
            <motion.div className={`${card} p-5`} {...slide('right', 0.05)}>
              <h3 className="text-base font-semibold text-white">Join the Movement</h3>
              <div className="mt-4 space-y-4">
                {movement.map((m) => (
                  <div key={m.title} className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-moss-500/10 ring-1 ring-moss-400/20">
                      <m.icon className="h-5 w-5 text-moss-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{m.title}</div>
                      <div className="text-xs text-slate-400">{m.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-moss-500 to-moss-400 py-2.5 text-sm font-semibold text-night-950 transition-opacity hover:opacity-90">
                Join Now
              </button>
            </motion.div>

            <motion.div className={`${card} p-5`} {...slide('right', 0.12)}>
              <SectionTitle
                action={<button className="text-xs font-medium text-moss-400 hover:text-moss-300">View All</button>}
              >
                Upcoming Events
              </SectionTitle>
              <div className="space-y-3">
                {events.map((e) => (
                  <div key={e.title} className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] ring-1 ring-white/10">
                      <e.icon className="h-4 w-4 text-moss-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{e.title}</div>
                      <div className="text-xs text-slate-400">{e.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className={`${card} p-5`} {...slide('right', 0.19)}>
              <SectionTitle
                action={<button className="text-xs font-medium text-moss-400 hover:text-moss-300">View All</button>}
              >
                Latest News
              </SectionTitle>
              <div className="flex items-center gap-3">
                <img src={newsImages[0]} alt="" loading="lazy" className="h-14 w-16 shrink-0 rounded-lg object-cover" />
                <div>
                  <div className="text-sm font-medium leading-snug text-white">
                    TreeGrow Partners with Reforestation Network
                  </div>
                  <div className="mt-1 text-xs text-slate-400">2 May, 2025</div>
                </div>
                <img src={newsImages[1]} alt="" loading="lazy" className="h-14 w-16 shrink-0 rounded-lg object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Left sidebar — from left, staggered */}
          <div className="space-y-6">
            <motion.div className={`${card} p-5`} {...slide('left', 0.05)}>
              <SectionTitle>Community Stats</SectionTitle>
              <div className="space-y-3.5">
                {communityStats.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <s.icon className="h-4 w-4 text-moss-400" />
                      <span className="text-sm text-slate-300">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className={`${card} p-5`} {...slide('left', 0.12)}>
              <SectionTitle
                action={
                  <button className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300">
                    This Month <ChevronDown className="h-3 w-3" />
                  </button>
                }
              >
                Top Contributors
              </SectionTitle>
              <div className="space-y-3">
                {contributors.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <Avatar img={c.img} size={36} />
                    <span className="flex-1 text-sm font-medium text-white">{c.name}</span>
                    <span className="text-sm font-bold text-white">
                      {c.trees} <span className="text-xs font-normal text-moss-400">Trees</span>
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-center text-sm font-medium text-moss-400 hover:text-moss-300">
                View Leaderboard
              </button>
            </motion.div>
          </div>

          {/* Center feed — gentle fade so focus stays on the sliding sides */}
          <motion.div className="space-y-6" {...fade(0.1)}>
            {/* Composer */}
            <div className={`${card} p-4`}>
              <div className="flex items-center gap-3">
                <Avatar img={68} size={40} />
                <input
                  placeholder="Share something with the community..."
                  className="h-11 flex-1 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-moss-400/40"
                />
              </div>
              <div className="mt-3 flex items-center gap-6 pl-1 pt-1 text-sm text-slate-400">
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <FileText className="h-4 w-4 text-moss-400" /> Post
                </button>
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <ImageIcon className="h-4 w-4 text-moss-400" /> Photo
                </button>
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <FolderKanban className="h-4 w-4 text-moss-400" /> Project
                </button>
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <BarChart3 className="h-4 w-4 text-moss-400" /> Poll
                </button>
              </div>
            </div>

            {/* Post 1 */}
            <article className={`${card} p-5`}>
              <div className="flex items-start gap-3">
                <Avatar img={12} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">GreenTrail</span>
                    <span className="rounded-full bg-moss-500/15 px-2 py-0.5 text-[10px] font-medium text-moss-300 ring-1 ring-moss-400/20">
                      Top Contributor
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">2h ago</div>
                </div>
                <MoreHorizontal className="h-5 w-5 text-slate-500" />
              </div>

              <h4 className="mt-3 text-sm font-semibold text-white">
                Another Tree, Another Hope 🌱
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Just planted a Mango Tree in the Philippines! Can't wait to see it grow
                into something amazing.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {postImages.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" className="h-32 w-full rounded-xl object-cover" />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-8 border-t border-white/[0.05] pt-3 text-sm text-slate-400">
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <Heart className="h-4 w-4 text-rose-400" fill="currentColor" /> 28
                </button>
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <MessageCircle className="h-4 w-4" /> Comment
                </button>
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <Share2 className="h-4 w-4" /> Share
                </button>
                <MoreHorizontal className="ml-auto h-5 w-5 text-slate-500" />
              </div>
            </article>

            {/* Post 2 */}
            <article className={`${card} p-5`}>
              <div className="flex items-start gap-3">
                <Avatar img={45} />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">EcoWarrior</div>
                  <div className="text-xs text-slate-500">5h ago</div>
                </div>
                <MoreHorizontal className="h-5 w-5 text-slate-500" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                The community is amazing! Together we're creating a greener tomorrow
              </p>
              <div className="mt-4 flex items-center gap-8 border-t border-white/[0.05] pt-3 text-sm text-slate-400">
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <Heart className="h-4 w-4 text-rose-400" fill="currentColor" /> 22
                </button>
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <MessageCircle className="h-4 w-4" /> Comment
                </button>
                <button className="flex items-center gap-2 hover:text-moss-300">
                  <Share2 className="h-4 w-4" /> Share
                </button>
                <MoreHorizontal className="ml-auto h-5 w-5 text-slate-500" />
              </div>
            </article>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/[0.06] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
            <p>© 2025 TreeGrow. All rights reserved.</p>
            <div className="flex gap-6">
              {['About', 'Docs', 'Whitepaper', 'Terms', 'Privacy'].map((l) => (
                <a key={l} href="#" className="transition-colors hover:text-slate-300">
                  {l}
                </a>
              ))}
            </div>
            <div className="flex gap-4">
              {socials.map((Icon, i) => (
                <a key={i} href="#" className="text-slate-500 transition-colors hover:text-moss-300">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}
