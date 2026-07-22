import { Leaf, Coins, ShieldCheck, LineChart, Globe2, Gift } from 'lucide-react'
import Reveal from '../ui/Reveal'

const features = [
  {
    icon: Leaf,
    title: 'Plant Real Trees',
    body: 'Every action mints a verifiable sapling planted by our on-ground partners, geo-tagged and tracked.',
  },
  {
    icon: Coins,
    title: 'Earn TREE Rewards',
    body: 'Stake, grow, and harvest yield. Your environmental impact compounds alongside your holdings.',
  },
  {
    icon: ShieldCheck,
    title: 'On-Chain Proof',
    body: 'Immutable carbon receipts. Every ton of CO₂ offset is auditable and transparent by design.',
  },
  {
    icon: LineChart,
    title: 'Live Impact Metrics',
    body: 'Watch your forest and portfolio evolve in real time from a single, beautiful dashboard.',
  },
  {
    icon: Globe2,
    title: 'Global Network',
    body: 'Reforestation projects across 18 countries and counting — impact where it matters most.',
  },
  {
    icon: Gift,
    title: 'Gift a Forest',
    body: 'Send trees to friends, teams, or causes. Real gifts that keep giving back to the planet.',
  },
]

export default function Features() {
  return (
    <section className="container-page py-24" id="features">
      <Reveal className="mx-auto max-w-2xl text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-400">
          Why TreeGrow
        </div>
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Impact you can hold,
          <br className="hidden sm:block" /> growth you can measure.
        </h2>
        <p className="mt-4 text-slate-400">
          A regenerative-finance platform where doing good and growing wealth are
          the same action.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <div className="group glass h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:border-moss-400/20 hover:bg-white/[0.05]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-moss-500/10 ring-1 ring-moss-400/20 transition-colors group-hover:bg-moss-500/20">
                <f.icon className="h-6 w-6 text-moss-400" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
