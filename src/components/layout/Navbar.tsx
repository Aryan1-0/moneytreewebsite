import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Wallet } from 'lucide-react'
import Logo from './Logo'
import Button from '../ui/Button'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Garden', href: '#how' },
  { label: 'Marketplace', href: '#tokenomics' },
  { label: 'Token', href: '#tokenomics' },
  { label: 'Community', href: '#community' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/[0.06] bg-night-950/70 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-page flex h-[72px] items-center justify-between">
        <Link to="/" aria-label="TreeGrow home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/admin"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-moss-300"
          >
            Admin
          </Link>
          <Button size="md">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-slate-200 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] bg-night-950/95 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/admin"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-moss-300 hover:bg-white/5"
            >
              Admin Panel
            </Link>
            <Button className="mt-2 w-full">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
