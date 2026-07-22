import { motion } from 'framer-motion'
import Reveal from '../ui/Reveal'

const allocation = [
  { label: 'Reforestation Fund', pct: 40, color: '#22c55e' },
  { label: 'Community Rewards', pct: 25, color: '#4ade80' },
  { label: 'Team & Advisors', pct: 15, color: '#16a34a' },
  { label: 'Liquidity', pct: 12, color: '#86efac' },
  { label: 'Treasury', pct: 8, color: '#f5b544' },
]

// Build a conic-gradient string from the allocation slices.
const conic = (() => {
  let acc = 0
  const stops = allocation.map((a) => {
    const from = acc
    acc += a.pct
    return `${a.color} ${from}% ${acc}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})()

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="container-page py-24">
      <div className="glass overflow-hidden rounded-3xl">
        <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
          <Reveal>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-400">
              TREE Token
            </div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Transparent tokenomics
            </h2>
            <p className="mt-4 max-w-md text-slate-400">
              A fixed supply of 1,000,000,000 TREE, weighted toward the planet and
              the people growing it. No hidden unlocks — the full schedule is
              on-chain.
            </p>

            <div className="mt-8 space-y-3">
              {allocation.map((a, i) => (
                <Reveal key={a.label} delay={i * 0.06}>
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ background: a.color }}
                    />
                    <span className="flex-1 text-sm text-slate-300">{a.label}</span>
                    <span className="text-sm font-semibold text-white">{a.pct}%</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="flex justify-center">
            <div className="relative">
              <motion.div
                className="h-64 w-64 rounded-full"
                style={{ background: conic }}
                initial={{ rotate: -30, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
              <div className="absolute inset-0 m-auto grid h-36 w-36 place-items-center rounded-full bg-night-900 text-center ring-1 ring-white/10">
                <div>
                  <div className="text-2xl font-bold text-white">1B</div>
                  <div className="text-xs text-slate-400">TREE supply</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
