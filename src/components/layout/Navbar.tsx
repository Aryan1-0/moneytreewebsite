import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Wallet } from 'lucide-react'
import Logo from './Logo'
import Button from '../ui/Button'

type NavLink = { label: string; hash?: string; to?: string }

const links: NavLink[] = [
  { label: 'Home', hash: '#home' },
  { label: 'Garden', hash: '#how' },
  { label: 'Dashboard', hash: '#features' },
  { label: 'Marketplace', hash: '#tokenomics' },
  { label: 'Token', hash: '#tokenomics' },
  { label: 'Community', to: '/community' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (l: NavLink) =>
    (l.to === '/community' && pathname === '/community') || (l.hash === '#home' && onHome)

  // Section anchors scroll on the home page; from any other page they navigate
  // home first, then scroll — so the same nav works everywhere.
  const goToSection = (hash: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    if (onHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 80)
    }
  }

  const cls = (active: boolean, mobile = false) =>
    mobile
      ? `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          active ? 'text-moss-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      : `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          active ? 'text-moss-400' : 'text-slate-300 hover:text-white'
        }`

  const renderLink = (l: NavLink, mobile = false) => {
    const active = isActive(l)
    if (l.to) {
      return (
        <Link
          key={l.label}
          to={l.to}
          onClick={() => setOpen(false)}
          className={cls(active, mobile)}
        >
          {l.label}
        </Link>
      )
    }
    return (
      <a key={l.label} href={l.hash} onClick={goToSection(l.hash!)} className={cls(active, mobile)}>
        {l.label}
      </a>
    )
  }

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
          {links.map((l) => renderLink(l))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
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
            {links.map((l) => renderLink(l, true))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
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
