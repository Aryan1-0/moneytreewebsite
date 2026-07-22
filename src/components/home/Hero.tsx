import { motion } from 'framer-motion'
import { Sprout, ArrowRight, Users, Cloud, Globe2, Trees } from 'lucide-react'
import Button from '../ui/Button'
import Fireflies from './Fireflies'
import { useCountUp } from '../../hooks/useCountUp'

const stats = [
  { icon: Trees, value: 12_450, label: 'Trees Planted', suffix: '' },
  { icon: Users, value: 5_230, label: 'Users', suffix: '' },
  { icon: Cloud, value: 2.35, label: 'CO₂ Offset', prefix: '$', suffix: 'M', decimals: 2 },
  { icon: Globe2, value: 18, label: 'Countries', suffix: '' },
]

function Stat({
  icon: Icon,
  value,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  icon: typeof Users
  value: number
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const { value: v, ref } = useCountUp(value)
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/10">
        <Icon className="h-5 w-5 text-moss-400" />
      </div>
      <div>
        <div className="text-lg font-bold text-white">
          <span ref={ref}>
            {prefix}
            {v.toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
          {suffix}
        </div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-[72px]">
      {/* Ambient scene layers */}
      <div className="absolute inset-0 grid-lines opacity-[0.5]" aria-hidden />
      <div
        className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-moss-500/10 blur-[120px]"
        aria-hidden
      />
      <Fireflies />

      <div className="container-page relative grid items-center gap-8 pb-16 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-moss-300">
            <Sprout className="h-3.5 w-3.5" />
            Crypto with real-world impact
          </div>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            Grow a Tree.
            <br />
            Build a <span className="text-gradient">Greener</span>
            <br />
            Future.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
            TreeGrow connects crypto with real-world impact. Plant trees, earn
            rewards, and make a difference that lasts for generations.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              <Sprout className="h-5 w-5" />
              Start Growing
            </Button>
            <Button variant="outline" size="lg">
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </motion.div>

        {/* Blended tree island */}
        <motion.div
          className="relative mx-auto w-full max-w-xl"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
        >
          {/* Warm glow beneath the lantern / island */}
          <div
            className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-[40%] rounded-full bg-moss-500/20 blur-[90px]"
            aria-hidden
          />
          <div className="animate-float">
            <img
              src="/tree.png"
              alt="A flourishing tree on a floating island — the heart of TreeGrow"
              className="tree-blend w-full select-none"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>

      {/* Fade the hero into the next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-night-950"
        aria-hidden
      />
    </section>
  )
}
