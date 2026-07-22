import { useState } from 'react'
import { ArrowRight, MessageCircle, Twitter, Send, Youtube } from 'lucide-react'
import Logo from './Logo'

const columns = [
  {
    title: 'Quick Links',
    links: ['Home', 'Garden', 'Marketplace', 'Dashboard', 'Documentation'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'FAQs', 'Support', 'Whitepaper', 'Roadmap'],
  },
]

const community = [
  { label: 'Discord', icon: MessageCircle },
  { label: 'Twitter', icon: Twitter },
  { label: 'Telegram', icon: Send },
  { label: 'YouTube', icon: Youtube },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="container-page py-14">
        {/* Newsletter */}
        <div className="glass flex flex-col gap-6 rounded-3xl p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Join the Movement</h3>
            <p className="mt-1 text-slate-400">Together for a Greener Tomorrow</p>
          </div>
          <form
            className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-night-900/60 p-1.5 pl-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (email.includes('@')) setSent(true)
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-moss-500 px-5 py-2.5 text-sm font-semibold text-night-950 transition-colors hover:bg-moss-400"
            >
              {sent ? 'Subscribed' : 'Subscribe'}
              {!sent && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        {/* Link grid */}
        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Planting real trees with real-world impact, powered by a transparent
              on-chain rewards network.
            </p>
            <div className="mt-5 flex gap-3">
              {community.slice(0, 3).map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-moss-400/50 hover:text-moss-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 transition-colors hover:text-moss-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div id="community">
            <h4 className="text-sm font-semibold text-white">Community</h4>
            <ul className="mt-4 space-y-3">
              {community.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-moss-300"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 TreeGrow, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-slate-300">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
