import { motion } from 'framer-motion'
import { Leaf, Users, Database, Globe2, Sprout } from 'lucide-react'
import Navbar from '../components/layout/Navbar'

const features = [
  { icon: Leaf, l1: 'Sustainable', l2: 'Economy' },
  { icon: Users, l1: 'Community', l2: 'Driven' },
  { icon: Database, l1: 'Real Impact', l2: 'Real Value' },
  { icon: Globe2, l1: 'A Greener', l2: 'Tomorrow' },
]

export default function Token() {
  return (
    // Near-black canvas that matches the coin PNG's edges (~rgb 0,3,5) so the
    // image dissolves into the page instead of reading as a rectangle.
    <div className="min-h-screen bg-[#010305] text-slate-200">
      <Navbar />

      <main className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[72px]">
        {/* The coin — absolutely placed on the right so it can be large and
            bleed toward the edge, blended with the elliptical tree-blend. */}
        <div className="pointer-events-none absolute right-[-4%] top-[46%] z-0 hidden w-[58vw] max-w-[960px] -translate-y-1/2 lg:block">
          {/* green glow rising from behind the coin */}
          <div
            className="absolute left-1/2 top-1/2 -z-10 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-moss-500/15 blur-[120px]"
            aria-hidden
          />
          <motion.img
            src="/token.png"
            alt="TreeGrow token on a floating island"
            className="tree-blend w-full select-none"
            draggable={false}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          />
        </div>

        {/* Copy — kept above the coin, constrained to the left */}
        <div className="container-page relative z-10 flex flex-1 items-center">
          <motion.div
            className="max-w-lg py-10"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h1 className="text-6xl font-extrabold leading-[1.02] tracking-tight text-white">
              Tokenomics
              <br />
              <span className="text-gradient">Coming Soon</span>
            </h1>
            <p className="mt-5 max-w-md text-xl font-semibold text-white/90">
              Building a sustainable economy through a stronger tomorrow.
            </p>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-400">
              We're preparing the token details that power our ecosystem and fuel a
              greener future for all.
            </p>

            <div className="mt-9 grid max-w-lg grid-cols-4 gap-4">
              {features.map((f) => (
                <div key={f.l1}>
                  <f.icon className="mb-2 h-6 w-6 text-moss-400" />
                  <div className="text-xs leading-snug text-slate-300">
                    {f.l1}
                    <br />
                    {f.l2}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile coin (stacked, since the desktop one is absolute) */}
            <div className="mt-10 lg:hidden">
              <img
                src="/token.png"
                alt="TreeGrow token"
                className="tree-blend mx-auto w-full max-w-md select-none"
                draggable={false}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom banner */}
        <motion.div
          className="container-page relative z-10 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="mx-auto flex max-w-2xl items-center justify-center gap-4 rounded-2xl border border-moss-400/25 bg-moss-500/[0.05] px-6 py-4 text-center shadow-[0_0_50px_-12px_rgba(142,230,90,0.35)] backdrop-blur-sm">
            <Leaf className="hidden h-6 w-6 shrink-0 text-moss-400 sm:block" />
            <div>
              <div className="text-sm font-semibold text-moss-300">
                A Greener Economy. A Brighter Tomorrow.
              </div>
              <div className="mt-0.5 text-xs text-slate-400">
                Tokenomics coming soon to power real-world change.
              </div>
            </div>
            <Sprout className="hidden h-6 w-6 shrink-0 text-moss-400 sm:block" />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
