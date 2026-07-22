import { Wallet, Sprout, TrendingUp } from 'lucide-react'
import Reveal from '../ui/Reveal'

const steps = [
  {
    icon: Wallet,
    step: '01',
    title: 'Connect & Fund',
    body: 'Link your wallet and get TREE tokens. No paperwork, no middlemen — you are ready in under a minute.',
  },
  {
    icon: Sprout,
    step: '02',
    title: 'Plant Your Garden',
    body: 'Choose a species and region. We plant a real, verified tree for every sapling you grow on-chain.',
  },
  {
    icon: TrendingUp,
    step: '03',
    title: 'Grow & Earn',
    body: 'Stake to earn yield while your forest matures. Track carbon offset and rewards in real time.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-400">
            How it works
          </div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Three steps to your forest
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* connecting line */}
          <div
            className="absolute left-0 right-0 top-[42px] hidden h-px bg-gradient-to-r from-transparent via-moss-500/30 to-transparent md:block"
            aria-hidden
          />
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1} className="relative">
              <div className="glass-strong flex h-full flex-col items-center p-8 text-center">
                <div className="relative grid h-[86px] w-[86px] place-items-center rounded-full bg-night-900 ring-1 ring-moss-400/25">
                  <s.icon className="h-8 w-8 text-moss-400" />
                  <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-moss-500 text-xs font-bold text-night-950">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
