import { motion } from 'framer-motion'
import { Sprout, ArrowRight, Users, Cloud, Globe2, Trees } from 'lucide-react'
import Button from '../ui/Button'
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
    <section
      id="home"
      className="relative flex min-h-[calc(100svh)] flex-col justify-center overflow-hidden pt-[72px]"
    >
      {/* No section backdrop — the body's single continuous #02090d canvas
          shows through so the hero flows seamlessly into the sections below.
          The tree PNG's edge colour matches #02090d, so its elliptical
          edge-fade still dissolves cleanly into that shared canvas. */}

      {/* Tree island (desktop) — absolutely positioned on the right so it can
          be large (1.5×) and overlap the copy without disturbing the text
          layout. Vertically centred via flex (not a transform, which would
          clash with Framer's animation). Sits BELOW the copy (z-10); the
          .tree-blend elliptical fade dissolves its rectangle into the backdrop. */}
      <div className="pointer-events-none absolute inset-y-0 right-[-100px] z-10 hidden w-[72vw] max-w-[1380px] items-center lg:flex">
        <motion.img
          src="/tree.png"
          alt=""
          className="tree-blend w-full select-none"
          draggable={false}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
        />
      </div>

      {/* Copy — constrained to the left and layered ABOVE the tree (z-20) so it
          stays fully readable over the image's dark left margin. */}
      <div className="container-page relative z-20 py-10">
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-[3.9rem]">
            Grow a Tree.
            <br />
            <span className="text-gradient">
              Build a Greener
              <br />
              Future.
            </span>
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

          {/* Tree island (mobile) — stacked in flow below the copy. */}
          <div className="mt-10 lg:hidden">
            <img
              src="/tree.png"
              alt="A flourishing tree on a floating island — the heart of TreeGrow"
              className="tree-blend mx-auto w-full max-w-md select-none"
              draggable={false}
            />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
