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
    <div className="text-slate-200">
      <Navbar />

      <main className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[72px]">
        {/* soft ambient glow behind the coin */}
        <div
          className="pointer-events-none absolute right-[8%] top-1/3 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-moss-500/10 blur-[130px]"
          aria-hidden
        />

        <section className="container-page grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1fr_1.12fr]">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Tokenomics
              <br />
              <span className="text-gradient">Coming Soon</span>
            </h1>
            <p className="mt-5 max-w-md text-xl font-semibold text-white/90">
              Building a sustainable economy through a stronger tomorrow.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-400">
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
          </motion.div>

          {/* Coin — blended like the home tree */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
          >
            <img
              src="/token.png"
              alt="TreeGrow token on a floating island"
              className="tree-blend mx-auto w-full max-w-2xl select-none"
              draggable={false}
            />
          </motion.div>
        </section>

        {/* Bottom banner */}
        <motion.div
          className="container-page pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-4 rounded-2xl border border-moss-400/25 bg-moss-500/[0.05] px-6 py-4 text-center shadow-[0_0_50px_-12px_rgba(142,230,90,0.35)]">
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
