import { Sprout, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'

export default function CTA() {
  return (
    <section className="container-page py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-moss-400/20 bg-gradient-to-br from-moss-900/40 via-night-800 to-night-900 px-8 py-16 text-center sm:px-16">
          <div
            className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-moss-500/20 blur-[100px]"
            aria-hidden
          />
          <div
            className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-ember/10 blur-[100px]"
            aria-hidden
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Plant your first tree today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-300">
              Join 5,000+ growers turning everyday crypto into a living, breathing
              forest. The best time to start was yesterday. The next best is now.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg">
                <Sprout className="h-5 w-5" />
                Start Growing
              </Button>
              <Button variant="outline" size="lg">
                Read the Whitepaper
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
